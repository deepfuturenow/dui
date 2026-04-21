import { LitElement, html, css } from "lit";
import { blockBase, gridOverlay } from "./block-base.ts";
import { customElement, state } from "lit/decorators.js";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { GTAOPass } from "three/examples/jsm/postprocessing/GTAOPass.js";
import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass.js";


const MODEL_URL =
  "https://threejs.org/examples/models/gltf/DamagedHelmet/glTF/DamagedHelmet.gltf";

@customElement("block-3d-scene")
export class Block3dScene extends LitElement {
  static override styles = [gridOverlay, blockBase, css`
    :host {
      position: relative;
      overflow: hidden;
      padding: 0;
      aspect-ratio: 4 / 3;
    }

    canvas {
      display: block;
      width: 100%;
      height: 100%;
    }

    /* --- Menubar (top-left) --- */
    .menubar {
      position: absolute;
      top: var(--space-2);
      left: var(--space-2);
      z-index: 1;
    }

    /* --- Bottom bar --- */
    .bottom-bar {
      position: absolute;
      bottom: var(--space-2);
      left: var(--space-2);
      right: var(--space-2);
      z-index: 1;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    /* Frosted overlay controls */
    .bottom-bar dui-button,
    .bottom-bar dui-toggle {
      background: color-mix(in srgb, var(--surface-1) 70%, transparent);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      border-radius: var(--radius-md);
    }

    .toggle-buttons {
      display: flex;
      gap: var(--space-1);
    }
  `];

  @state() accessor #wireframe = false;
  @state() accessor #showGrid = true;

  #renderer?: THREE.WebGLRenderer;
  #scene?: THREE.Scene;
  #camera?: THREE.PerspectiveCamera;
  #controls?: OrbitControls;
  #grid?: THREE.GridHelper;
  #meshes: THREE.Mesh[] = [];
  #composer?: EffectComposer;
  #animationId = 0;
  #resizeObserver?: ResizeObserver;
  #lastBg = "";
  #lastGridColor = "";
  #bgProbe?: HTMLElement;
  #gridProbe?: HTMLElement;
  #colorCtx?: CanvasRenderingContext2D;

  override firstUpdated() {
    const canvas = this.renderRoot.querySelector("canvas") as HTMLCanvasElement;
    if (!canvas) return;

    // --- Renderer ---
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    renderer.setPixelRatio(Math.min(globalThis.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.0;
    this.#renderer = renderer;

    // --- Scene ---
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf0f0f0);
    this.#scene = scene;

    // --- Camera (long lens, pulled back for flattened perspective) ---
    const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 1000);
    camera.position.set(2.5, 2, 2.5);
    camera.lookAt(0, 0, 0);
    this.#camera = camera;

    // --- Controls ---
    const controls = new OrbitControls(camera, canvas);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.target.set(0, 0.8, 0);
    this.#controls = controls;

    // --- Grid ---
    const grid = new THREE.GridHelper(20, 20, 0xaaaaaa, 0xcccccc);
    scene.add(grid);
    this.#grid = grid;

    // --- Lights (soft clay lighting) ---
    scene.add(new THREE.AmbientLight(0xffffff, 0.6));
    const key = new THREE.DirectionalLight(0xffffff, 1.0);
    key.position.set(5, 5, 5);
    scene.add(key);
    const fill = new THREE.DirectionalLight(0xffffff, 0.4);
    fill.position.set(-3, 2, -3);
    scene.add(fill);
    const rim = new THREE.DirectionalLight(0xffffff, 0.3);
    rim.position.set(0, 5, -5);
    scene.add(rim);

    // --- Load model ---
    this.#loadModel(scene);

    // --- SSAO Post-processing ---
    const initRect = this.getBoundingClientRect();
    const composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));
    const gtaoPass = new GTAOPass(scene, camera, initRect.width, initRect.height);
    gtaoPass.output = GTAOPass.OUTPUT.Default;
    gtaoPass.blendIntensity = 1;
    gtaoPass.updateGtaoMaterial({
      radius: 1,
      distanceExponent: 2,
      thickness: 5,
      scale: 2,
      samples: 16,
      screenSpaceRadius: false,
    });
    composer.addPass(gtaoPass);
    composer.addPass(new OutputPass());
    this.#composer = composer;

    // --- Sizing ---
    this.#handleResize();
    this.#resizeObserver = new ResizeObserver(() => this.#handleResize());
    this.#resizeObserver.observe(this);

    // --- Render loop ---
    const tick = () => {
      this.#animationId = requestAnimationFrame(tick);
      controls.update();
      this.#syncThemeColors(scene);
      composer.render();
    };
    tick();
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    cancelAnimationFrame(this.#animationId);
    this.#resizeObserver?.disconnect();
    this.#composer?.dispose();
    this.#renderer?.dispose();
  }

  #loadModel(scene: THREE.Scene) {
    const loader = new GLTFLoader();
    const draco = new DRACOLoader();
    draco.setDecoderPath("https://www.gstatic.com/draco/versioned/decoders/1.5.7/");
    loader.setDRACOLoader(draco);

    loader.load(MODEL_URL, (gltf) => {
      const model = gltf.scene;
      // Sit the helmet on the grid — its center is at origin, radius ~1
      model.position.set(0, 1.0, 0);
      model.scale.setScalar(1.0);

      // Replace textures with clay material
      const clayMaterial = new THREE.MeshStandardMaterial({
        color: 0xc8c8c8,
        roughness: 0.9,
        metalness: 0.0,
        flatShading: false,
      });

      model.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
          const mesh = child as THREE.Mesh;
          if (Array.isArray(mesh.material)) {
            mesh.material.forEach((m) => m.dispose());
          } else {
            (mesh.material as THREE.Material).dispose();
          }
          mesh.material = clayMaterial;
          this.#meshes.push(mesh);
        }
      });

      scene.add(model);
    });
  }

  /** Sync scene background and grid with CSS design tokens each frame. */
  #syncThemeColors(scene: THREE.Scene) {
    if (!this.#bgProbe) {
      this.#bgProbe = document.createElement("div");
      this.#bgProbe.style.cssText = "display:none;color:var(--surface-1)";
      this.#gridProbe = document.createElement("div");
      this.#gridProbe.style.cssText = "display:none;color:var(--border)";
      this.renderRoot.append(this.#bgProbe, this.#gridProbe);
      const c = document.createElement("canvas");
      c.width = c.height = 1;
      this.#colorCtx = c.getContext("2d", { willReadFrequently: true })!;
    }
    const resolveCss = (raw: string) => {
      const ctx = this.#colorCtx!;
      ctx.clearRect(0, 0, 1, 1);
      ctx.fillStyle = raw;
      ctx.fillRect(0, 0, 1, 1);
      const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
      return new THREE.Color().setRGB(r / 255, g / 255, b / 255, THREE.SRGBColorSpace);
    };
    const bgRaw = getComputedStyle(this.#bgProbe!).color;
    if (bgRaw && bgRaw !== this.#lastBg) {
      this.#lastBg = bgRaw;
      scene.background = resolveCss(bgRaw);
    }
    const gridRaw = getComputedStyle(this.#gridProbe!).color;
    if (gridRaw && gridRaw !== this.#lastGridColor) {
      this.#lastGridColor = gridRaw;
      const gc = resolveCss(gridRaw);
      const gridMat = (this.#grid!.material as THREE.Material[]);
      if (Array.isArray(gridMat)) {
        (gridMat[0] as THREE.LineBasicMaterial).color.copy(gc);
        (gridMat[1] as THREE.LineBasicMaterial).color.copy(gc);
      }
    }
  }

  #handleResize() {
    const rect = this.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    this.#renderer!.setSize(rect.width, rect.height, false);
    this.#composer?.setSize(rect.width, rect.height);
    this.#camera!.aspect = rect.width / rect.height;
    this.#camera!.updateProjectionMatrix();
  }

  // --- Camera presets ---
  #setCameraFrameAll() {
    this.#camera!.position.set(2.5, 2, 2.5);
    this.#controls!.target.set(0, 0.8, 0);
  }

  // --- Toggles ---
  #toggleWireframe() {
    this.#wireframe = !this.#wireframe;
    for (const mesh of this.#meshes) {
      const mat = mesh.material;
      if (Array.isArray(mat)) {
        mat.forEach((m) => (m.wireframe = this.#wireframe));
      } else {
        (mat as THREE.Material).wireframe = this.#wireframe;
      }
    }
  }

  #toggleGrid() {
    this.#showGrid = !this.#showGrid;
    if (this.#grid) this.#grid.visible = this.#showGrid;
  }

  /* grid icon (# shape) */
  #gridIcon = html`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M3 9h18"/><path d="M3 15h18"/><path d="M9 3v18"/><path d="M15 3v18"/></svg>`;

  /* wireframe icon (box outline) */
  #wireframeIcon = html`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>`;

  override render() {
    return html`
      <canvas></canvas>

      <!-- Menubar — top-left -->
      <div class="menubar">
        <dui-menubar>
          <dui-menu>
            <dui-button slot="trigger" appearance="ghost" size="sm">File</dui-button>
            <dui-menu-item>New</dui-menu-item>
            <dui-menu-item>Open</dui-menu-item>
            <dui-menu-item>Save</dui-menu-item>
            <dui-menu-item>Import</dui-menu-item>
            <dui-menu-item>Export</dui-menu-item>
          </dui-menu>
          <dui-menu>
            <dui-button slot="trigger" appearance="ghost" size="sm">Edit</dui-button>
            <dui-menu-item>Undo</dui-menu-item>
            <dui-menu-item>Redo</dui-menu-item>
            <dui-menu-item>Cut</dui-menu-item>
            <dui-menu-item>Copy</dui-menu-item>
            <dui-menu-item>Paste</dui-menu-item>
          </dui-menu>
          <dui-menu>
            <dui-button slot="trigger" appearance="ghost" size="sm">Add</dui-button>
            <dui-menu-item>Box</dui-menu-item>
            <dui-menu-item>Sphere</dui-menu-item>
            <dui-menu-item>Cylinder</dui-menu-item>
            <dui-menu-item>Plane</dui-menu-item>
            <dui-menu-item>Light</dui-menu-item>
          </dui-menu>
          <dui-menu>
            <dui-button slot="trigger" appearance="ghost" size="sm">View</dui-button>
            <dui-menu-item>Fullscreen</dui-menu-item>
            <dui-menu-item>Show Grid</dui-menu-item>
            <dui-menu-item>Show Wireframe</dui-menu-item>
            <dui-menu-item>Reset Camera</dui-menu-item>
          </dui-menu>
          <dui-menu>
            <dui-button slot="trigger" appearance="ghost" size="sm">Render</dui-button>
            <dui-menu-item>Render Image</dui-menu-item>
            <dui-menu-item>Render Animation</dui-menu-item>
            <dui-menu-item>Settings</dui-menu-item>
          </dui-menu>
        </dui-menubar>
      </div>

      <!-- Bottom bar -->
      <div class="bottom-bar">
        <dui-button appearance="ghost" size="sm" @click=${this.#setCameraFrameAll}>Frame All</dui-button>
        <div class="toggle-buttons">
        <dui-toggle
          size="sm"
          .pressed=${this.#wireframe}
          @pressed-change=${this.#toggleWireframe}
        >
          <dui-icon slot="icon">${this.#wireframeIcon}</dui-icon>
          Wire
        </dui-toggle>
        <dui-toggle
          size="sm"
          .pressed=${this.#showGrid}
          @pressed-change=${this.#toggleGrid}
        >
          <dui-icon slot="icon">${this.#gridIcon}</dui-icon>
          Grid
        </dui-toggle>
        </div>
      </div>
    `;
  }
}
