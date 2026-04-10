var Ns=Object.create;var ee=Object.defineProperty;var Os=Object.getOwnPropertyDescriptor;var po=(s,t)=>(t=Symbol[s])?t:Symbol.for("Symbol."+s),it=s=>{throw TypeError(s)};var uo=(s,t,e)=>t in s?ee(s,t,{enumerable:!0,configurable:!0,writable:!0,value:e}):s[t]=e;var co=(s,t)=>ee(s,"name",{value:t,configurable:!0});var z=s=>[,,,Ns(s?.[po("metadata")]??null)],ho=["class","method","getter","setter","accessor","field","value","get","set"],ft=s=>s!==void 0&&typeof s!="function"?it("Function expected"):s,Us=(s,t,e,o,n)=>({kind:ho[s],name:t,metadata:o,addInitializer:r=>e._?it("Already initialized"):n.push(ft(r||null))}),zs=(s,t)=>uo(t,po("metadata"),s[3]),m=(s,t,e,o)=>{for(var n=0,r=s[t>>1],i=r&&r.length;n<i;n++)t&1?r[n].call(e):o=r[n].call(e,o);return o},v=(s,t,e,o,n,r)=>{var i,a,c,l,x,h=t&7,_=!!(t&8),S=!!(t&16),K=h>3?s.length+1:h?_?1:2:0,ao=ho[h+5],lo=h>3&&(s[K-1]=[]),Hs=s[K]||(s[K]=[]),N=h&&(!S&&!_&&(n=n.prototype),h<5&&(h>3||!S)&&Os(h<4?n:{get[e](){return p(this,r)},set[e](M){return f(this,r,M)}},e));h?S&&h<4&&co(r,(h>2?"set ":h>1?"get ":"")+e):co(n,e);for(var Xt=o.length-1;Xt>=0;Xt--)l=Us(h,e,c={},s[3],Hs),h&&(l.static=_,l.private=S,x=l.access={has:S?M=>Is(n,M):M=>e in M},h^3&&(x.get=S?M=>(h^1?p:w)(M,n,h^4?r:N.get):M=>M[e]),h>2&&(x.set=S?(M,te)=>f(M,n,te,h^4?r:N.set):(M,te)=>M[e]=te)),a=(0,o[Xt])(h?h<4?S?r:N[ao]:h>4?void 0:{get:N.get,set:N.set}:n,l),c._=1,h^4||a===void 0?ft(a)&&(h>4?lo.unshift(a):h?S?r=a:N[ao]=a:n=a):typeof a!="object"||a===null?it("Object expected"):(ft(i=a.get)&&(N.get=i),ft(i=a.set)&&(N.set=i),ft(i=a.init)&&lo.unshift(i));return h||zs(s,n),N&&ee(n,e,N),S?h^4?r:N:n},I=(s,t,e)=>uo(s,typeof t!="symbol"?t+"":t,e),oe=(s,t,e)=>t.has(s)||it("Cannot "+e),Is=(s,t)=>Object(t)!==t?it('Cannot use the "in" operator on this value'):s.has(t),p=(s,t,e)=>(oe(s,t,"read from private field"),e?e.call(s):t.get(s)),b=(s,t,e)=>t.has(s)?it("Cannot add the same private member more than once"):t instanceof WeakSet?t.add(s):t.set(s,e),f=(s,t,e,o)=>(oe(s,t,"write to private field"),o?o.call(s,e):t.set(s,e),e),w=(s,t,e)=>(oe(s,t,"access private method"),e);var mo=["base-reset","component","theme-base","theme-component"];function js(s){let t=new Set;try{for(let e of s.cssRules)if(e instanceof CSSStyleRule)for(let o=0;o<e.style.length;o++)t.add(e.style[o])}catch{}return[...t].sort()}function fo(s){let t=s.shadowRoot;return t?t.adoptedStyleSheets.map((o,n)=>({layer:n<mo.length?mo[n]:`layer-${n}`,properties:js(o)})):[]}var Ds=1;function j(s){let t=s.getAttribute("data-dui-id");if(t)return`[data-dui-id="${t}"]`;let e=String(Ds++);return s.setAttribute("data-dui-id",e),`[data-dui-id="${e}"]`}function go(s){if(s.id)return`#${s.id}`;let t=[],e=s;for(;e&&e!==document.body&&e!==document.documentElement;){let o=e.tagName.toLowerCase();if(e.id){t.unshift(`#${CSS.escape(e.id)}`);break}let n=e.parentElement;if(n){let r=n.querySelectorAll(`:scope > ${o}`);if(r.length>1){let i=Array.from(r).indexOf(e)+1;t.unshift(`${o}:nth-of-type(${i})`)}else t.unshift(o)}else{let r=e.getRootNode();if(r instanceof ShadowRoot&&r.host){t.unshift(o),e=r.host;continue}t.unshift(o)}if(e=n,t.length>6)break}return t.join(" > ")}function se(){let s=[];function t(e){for(let o of e.querySelectorAll("*"))o.tagName.toLowerCase().startsWith("dui-")&&o.shadowRoot&&s.push(o),o.shadowRoot&&t(o.shadowRoot)}return t(document),s}function qs(s){let t=s.match(/rgba?\(\s*(\d+),\s*(\d+),\s*(\d+)/);if(t){let[,e,o,n]=t;return`#${[e,o,n].map(i=>Number(i).toString(16).padStart(2,"0")).join("")}`}if(/^#[0-9a-f]{3,8}$/i.test(s.trim()))return s.trim()}function Ws(s){let t=Object.getPrototypeOf(s);for(;t&&t!==HTMLElement.prototype;){if(t.constructor.name&&t.constructor.name!=="")return t.constructor.name;t=Object.getPrototypeOf(t)}return"Unknown"}function Bs(s){let e=s.constructor.elementProperties;if(!e)return[];let o=[];for(let[n,r]of e){if(typeof n=="symbol")continue;let i=s[n],a=r.type?.name??typeof i,c=r.reflect??!1,l=r.attribute!==void 0?r.attribute:c?n:!1;o.push({name:n,value:i,type:a,reflect:c,attribute:l})}return o}function Vs(s){let t=s.shadowRoot;if(!t)return[];let e=new Set;for(let r of t.adoptedStyleSheets)try{for(let i of r.cssRules)if(i instanceof CSSStyleRule){let c=i.cssText.matchAll(/var\(\s*(--[\w-]+)/g);for(let l of c)e.add(l[1])}}catch{}let o=getComputedStyle(s),n=[];for(let r of[...e].sort()){let i=o.getPropertyValue(r).trim();if(!i)continue;let a={name:r,specified:r,computed:i},c=qs(i);c&&(a.hex=c),n.push(a)}return n}function Ks(s){let t=[],e=new Set;for(let r of s.attributes)if(r.name.startsWith("on")){let i=r.name.slice(2);e.has(i)||(e.add(i),t.push({name:i,source:"attribute"}))}let o=window.getEventListeners;if(typeof o=="function")try{let r=o(s);for(let i of Object.keys(r))e.has(i)||(e.add(i),t.push({name:i,source:"addEventListener"}))}catch{}let n=Object.getPrototypeOf(s);for(;n&&n!==HTMLElement.prototype;){let r=Object.getOwnPropertyDescriptors(n);for(let[,i]of Object.entries(r))if(typeof i.value=="function"){let c=i.value.toString().matchAll(/new\s+CustomEvent\(["']([\w-]+)["']/g);for(let l of c)e.has(l[1])||(e.add(l[1]),t.push({name:l[1],source:"dispatches"}))}n=Object.getPrototypeOf(n)}return t.sort((r,i)=>r.name.localeCompare(i.name))}function Fs(s){let t=s.shadowRoot;if(!t)return[];let e=t.querySelectorAll("slot");return Array.from(e).map(o=>({name:o.name||"(default)",assignedNodes:o.assignedNodes({flatten:!0}).length}))}function Js(s){let t=s.shadowRoot;if(!t)return[];let e=t.querySelectorAll("[part]"),o=[];for(let n of e){let r=n.getAttribute("part");if(r)for(let i of r.split(/\s+/))o.push({name:i,tagName:n.tagName.toLowerCase()})}return o}function Qs(s){let t=s.shadowRoot;if(!t)return"(no shadow root)";let e=t.children.length,o=t.querySelectorAll("slot").length,n=t.querySelectorAll("[part]").length;return`${e} children, ${o} slots, ${n} parts`}function q(s){return{tagName:s.tagName.toLowerCase(),className:Ws(s),selector:j(s),path:go(s),events:Ks(s),properties:Bs(s),tokens:Vs(s),styleLayers:fo(s),slots:Fs(s),parts:Js(s),shadowSummary:Qs(s)}}function bo(){let s=[],t=new Set,e=se();for(let n of e)t.add(n.tagName.toLowerCase());let o=["accordion","accordion-item","alert-dialog","alert-dialog-popup","avatar","badge","breadcrumb","breadcrumb-item","breadcrumb-link","breadcrumb-page","breadcrumb-separator","breadcrumb-ellipsis","button","calendar","center","checkbox","checkbox-group","collapsible","combobox","command","command-input","command-item","command-list","command-group","command-empty","command-separator","command-shortcut","data-table","dialog","dialog-popup","dropzone","field","hstack","icon","input","link","menu","menu-item","menubar","number-field","page-inset","popover","popover-popup","portal","preview-card","preview-card-popup","progress","radio","radio-group","scroll-area","select","separator","sidebar","sidebar-content","sidebar-footer","sidebar-group","sidebar-group-label","sidebar-header","sidebar-inset","sidebar-menu","sidebar-menu-button","sidebar-menu-item","sidebar-provider","sidebar-separator","sidebar-trigger","slider","spinner","switch","tab","tabs","tabs-indicator","tabs-list","tabs-panel","textarea","toggle","toggle-group","toolbar","tooltip","tooltip-popup","trunc","vstack"];for(let n of o){let r=`dui-${n}`;customElements.get(r)&&t.add(r)}for(let n of[...t].sort()){let r=customElements.get(n);if(!r)continue;let i={tagName:n,properties:[],slots:[],parts:[]},a=r.elementProperties;if(a)for(let[c,l]of a)typeof c!="symbol"&&i.properties.push({name:c,type:l.type?.name??"unknown",default:void 0,reflect:l.reflect??!1,attribute:l.attribute!==void 0?l.attribute:l.reflect?c:!1});try{let c=document.createElement(n);if(document.createDocumentFragment().appendChild(c),c.shadowRoot){let x=c.shadowRoot.querySelectorAll("slot");i.slots=Array.from(x).map(_=>_.name||"(default)");let h=c.shadowRoot.querySelectorAll("[part]");for(let _ of h){let S=_.getAttribute("part");S&&i.parts.push(...S.split(/\s+/))}}}catch{}s.push(i)}return s}function yo(){let s=se();return{timestamp:new Date().toISOString(),themeMode:document.documentElement.dataset.theme??"unknown",componentCount:s.length,components:s.map(q),catalog:bo()}}function Pt(s){let t=document.querySelector(s);return t||vo(document,s)}function vo(s,t){for(let e of s.querySelectorAll("*"))if(e.shadowRoot){let o=e.shadowRoot.querySelector(t);if(o)return o;let n=vo(e.shadowRoot,t);if(n)return n}return null}var ne=class{#t=[];#o=1;#e=new Set;add(t,e,o,n){let r={id:this.#o++,timestamp:new Date().toISOString(),action:t,target:e,params:o,undoable:!!n,_undo:n};return this.#t.push(r),this.#s(r),r}entries(){return this.#t.map(({_undo:t,...e})=>e)}undo(){for(let t=this.#t.length-1;t>=0;t--){let e=this.#t[t];if(e.undoable&&e._undo)return e._undo(),this.#t.splice(t,1),!0}return!1}get count(){return this.#t.length}clear(){this.#t=[]}subscribe(t){this.#e.add(t)}unsubscribe(t){this.#e.delete(t)}#s(t){let e={...t};delete e._undo;for(let o of this.#e)try{o(e)}catch{}}},$=new ne;function G(s){let t=Pt(s);return t||{ok:!1,error:`Element not found: "${s}"`,selector:s,inspection:null}}function xo(s){return s.tagName.toLowerCase().startsWith("dui-")?s.shadowRoot?null:`No shadow root on <${s.tagName.toLowerCase()}>`:`Not a DUI component: <${s.tagName.toLowerCase()}>`}function at(s){return{ok:!0,selector:j(s),inspection:q(s)}}function Y(s,t){return{ok:!1,error:t,selector:s,inspection:null}}function $o(s,t,e){let o=G(s);if(!(o instanceof HTMLElement))return o;let n=xo(o);if(n)return Y(s,n);let i=o.constructor.elementProperties;if(!i||!i.has(t)){let c=i?[...i.keys()].filter(l=>typeof l=="string").join(", "):"none";return Y(s,`Unknown property "${t}" on <${o.tagName.toLowerCase()}>. Available: ${c}`)}let a=o[t];return o[t]=e,$.add("setProp",j(o),{prop:t,value:e,oldValue:a},()=>{o[t]=a}),at(o)}function Ht(s,t){if(!s.startsWith("--"))return Y(":root",`Token name must start with "--": "${s}"`);let e=document.documentElement.style.getPropertyValue(s);return document.documentElement.style.setProperty(s,t),$.add("setToken",s,{value:t,oldValue:e},()=>{e?document.documentElement.style.setProperty(s,e):document.documentElement.style.removeProperty(s)}),{ok:!0,selector:":root",inspection:null}}function Nt(s,t,e){let o=G(s);if(!(o instanceof HTMLElement))return o;if(!t.startsWith("--"))return Y(s,`Token name must start with "--": "${t}"`);let n=o.style.getPropertyValue(t);return o.style.setProperty(t,e),$.add("setComponentToken",j(o),{name:t,value:e,oldValue:n},()=>{n?o.style.setProperty(t,n):o.style.removeProperty(t)}),at(o)}function So(s,t,e){let o=G(s);if(!(o instanceof HTMLElement))return o;let n=xo(o);if(n)return Y(s,n);let r=t===""||t==="(default)",i=[];if(r){for(let l of Array.from(o.childNodes))l instanceof HTMLElement&&l.getAttribute("slot")||i.push(l.cloneNode(!0));for(let l of Array.from(o.childNodes))l instanceof HTMLElement&&l.getAttribute("slot")||l.remove()}else for(let l of Array.from(o.children))l.getAttribute("slot")===t&&(i.push(l.cloneNode(!0)),l.remove());let a=document.createElement("template");a.innerHTML=e;let c=Array.from(a.content.childNodes);if(!r)for(let l of c)l instanceof HTMLElement&&l.setAttribute("slot",t);return o.append(...c),$.add("setSlotContent",j(o),{slotName:t,html:e},()=>{if(r)for(let l of Array.from(o.childNodes))l instanceof HTMLElement&&l.getAttribute("slot")||l.remove();else for(let l of Array.from(o.children))l.getAttribute("slot")===t&&l.remove();o.append(...i)}),at(o)}function wo(s,t,e,o,n){let r=G(s);if(!(r instanceof HTMLElement))return r;if(!customElements.get(e))return Y(s,`"${e}" is not a registered custom element. Did you register it with applyTheme()?`);let i=document.createElement(e);if(o){let l=i.constructor.elementProperties;for(let[x,h]of Object.entries(o)){if(l&&!l.has(x)){let _=[...l.keys()].filter(S=>typeof S=="string").join(", ");return Y(s,`Unknown property "${x}" on <${e}>. Available: ${_}`)}i[x]=h}}n&&(i.innerHTML=n),r.insertAdjacentElement(t,i);let a=j(i);return $.add("insertComponent",a,{parentSelector:s,position:t,tag:e,props:o,slotContent:n},()=>{i.remove()}),at(i)}function Eo(s){let t=G(s);if(!(t instanceof HTMLElement))return t;let e=t.parentElement,o=t.nextSibling,n=t.outerHTML;return t.remove(),$.add("removeComponent",s,{removedHtml:n},()=>{let r=document.createElement("template");r.innerHTML=n;let i=r.content.firstElementChild;i&&e&&e.insertBefore(i,o)}),e&&e.tagName.toLowerCase().startsWith("dui-")?at(e):{ok:!0,selector:e?j(e):s,inspection:null}}function ko(s,t,e){let o=G(s);if(!(o instanceof HTMLElement))return o;let n=G(t);if(!(n instanceof HTMLElement))return n;let r=o.parentElement,i=o.nextSibling;return n.insertAdjacentElement(e,o),$.add("moveComponent",j(o),{from:s,to:t,position:e},()=>{r&&r.insertBefore(o,i)}),at(o)}var O={};function Ot(){let s=$.entries(),t=[];for(let e of s)switch(e.action){case"setToken":{let o=O.tokens??"(unknown tokens file)";t.push({file:o,changeType:"token",description:`Change ${e.target} to ${e.params.value}`,tokenName:e.target,tokenValue:e.params.value});break}case"setComponentToken":{let o=_o(e.target),n=o&&O.themeStyles?.[o]?O.themeStyles[o]:O.page??"(unknown page file)";t.push({file:n,changeType:"token",description:`Set ${e.params.name} = ${e.params.value} on ${e.target}`,tokenName:e.params.name,tokenValue:e.params.value,selector:e.target});break}case"setProp":{let o=O.page??"(unknown page file)";t.push({file:o,changeType:"prop",description:`Set ${e.params.prop} = ${JSON.stringify(e.params.value)} on ${e.target}`,selector:e.target,propName:e.params.prop,propValue:e.params.value});break}case"insertComponent":{let o=O.page??"(unknown page file)",n=e.params.tag,r=e.params.props,i=e.params.slotContent,a=`<${n}`;if(r)for(let[c,l]of Object.entries(r))typeof l=="boolean"&&l?a+=` ${c}`:typeof l=="string"?a+=` ${c}="${l}"`:a+=` .${c}=\${${JSON.stringify(l)}}`;i?a+=`>${i}</${n}>`:a+=`></${n}>`,t.push({file:o,changeType:"template",description:`Insert <${n}> ${e.params.position} ${e.params.parentSelector}`,html:a,selector:e.params.parentSelector});break}case"removeComponent":{let o=O.page??"(unknown page file)";t.push({file:o,changeType:"template",description:`Remove element at ${e.target}`,selector:e.target});break}case"moveComponent":{let o=O.page??"(unknown page file)";t.push({file:o,changeType:"template",description:`Move ${e.target} to ${e.params.position} ${e.params.to}`,selector:e.target});break}case"setSlotContent":{let o=O.page??"(unknown page file)";t.push({file:o,changeType:"template",description:`Replace slot "${e.params.slotName}" content on ${e.target}`,html:e.params.html,selector:e.target});break}case"editThemeCSS":{let o=_o(e.target),n=o&&O.themeStyles?.[o]?O.themeStyles[o]:"(unknown theme style file)";t.push({file:n,changeType:"theme-style",description:`Edit theme CSS for ${e.target}`,selector:e.target});break}}return t}function _o(s){let t=s.match(/\b(dui-[\w-]+)/);return t?t[1]:null}window.__dui_inspect=s=>{if(s){let t=Pt(s);return t?t.shadowRoot?q(t):{error:`No shadow root on: "${s}"`}:{error:`Element not found: "${s}"`}}return yo()};window.__dui_mutate={setProp:$o,setToken:Ht,setComponentToken:Nt,setSlotContent:So,insertComponent:wo,removeComponent:Eo,moveComponent:ko};window.__dui_changelog={entries:()=>$.entries(),undo:()=>$.undo(),clear:()=>$.clear(),count:()=>$.count};window.__dui_export=()=>Ot();window.__dui_observe=s=>($.subscribe(s),()=>$.unsubscribe(s));var Ut=globalThis,zt=Ut.ShadowRoot&&(Ut.ShadyCSS===void 0||Ut.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,re=Symbol(),Co=new WeakMap,gt=class{constructor(t,e,o){if(this._$cssResult$=!0,o!==re)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o,e=this.t;if(zt&&t===void 0){let o=e!==void 0&&e.length===1;o&&(t=Co.get(e)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),o&&Co.set(e,t))}return t}toString(){return this.cssText}},Ao=s=>new gt(typeof s=="string"?s:s+"",void 0,re),U=(s,...t)=>{let e=s.length===1?s[0]:t.reduce((o,n,r)=>o+(i=>{if(i._$cssResult$===!0)return i.cssText;if(typeof i=="number")return i;throw Error("Value passed to 'css' function must be a 'css' function result: "+i+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(n)+s[r+1],s[0]);return new gt(e,s,re)},To=(s,t)=>{if(zt)s.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(let e of t){let o=document.createElement("style"),n=Ut.litNonce;n!==void 0&&o.setAttribute("nonce",n),o.textContent=e.cssText,s.appendChild(o)}},ie=zt?s=>s:s=>s instanceof CSSStyleSheet?(t=>{let e="";for(let o of t.cssRules)e+=o.cssText;return Ao(e)})(s):s;var{is:Gs,defineProperty:Ys,getOwnPropertyDescriptor:Zs,getOwnPropertyNames:Xs,getOwnPropertySymbols:tn,getPrototypeOf:en}=Object,It=globalThis,Mo=It.trustedTypes,on=Mo?Mo.emptyScript:"",sn=It.reactiveElementPolyfillSupport,bt=(s,t)=>s,yt={toAttribute(s,t){switch(t){case Boolean:s=s?on:null;break;case Object:case Array:s=s==null?s:JSON.stringify(s)}return s},fromAttribute(s,t){let e=s;switch(t){case Boolean:e=s!==null;break;case Number:e=s===null?null:Number(s);break;case Object:case Array:try{e=JSON.parse(s)}catch{e=null}}return e}},jt=(s,t)=>!Gs(s,t),Lo={attribute:!0,type:String,converter:yt,reflect:!1,useDefault:!1,hasChanged:jt};Symbol.metadata??=Symbol("metadata"),It.litPropertyMetadata??=new WeakMap;var W=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=Lo){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){let o=Symbol(),n=this.getPropertyDescriptor(t,o,e);n!==void 0&&Ys(this.prototype,t,n)}}static getPropertyDescriptor(t,e,o){let{get:n,set:r}=Zs(this.prototype,t)??{get(){return this[e]},set(i){this[e]=i}};return{get:n,set(i){let a=n?.call(this);r?.call(this,i),this.requestUpdate(t,a,o)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??Lo}static _$Ei(){if(this.hasOwnProperty(bt("elementProperties")))return;let t=en(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(bt("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(bt("properties"))){let e=this.properties,o=[...Xs(e),...tn(e)];for(let n of o)this.createProperty(n,e[n])}let t=this[Symbol.metadata];if(t!==null){let e=litPropertyMetadata.get(t);if(e!==void 0)for(let[o,n]of e)this.elementProperties.set(o,n)}this._$Eh=new Map;for(let[e,o]of this.elementProperties){let n=this._$Eu(e,o);n!==void 0&&this._$Eh.set(n,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){let e=[];if(Array.isArray(t)){let o=new Set(t.flat(1/0).reverse());for(let n of o)e.unshift(ie(n))}else t!==void 0&&e.push(ie(t));return e}static _$Eu(t,e){let o=e.attribute;return o===!1?void 0:typeof o=="string"?o:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),this.renderRoot!==void 0&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){let t=new Map,e=this.constructor.elementProperties;for(let o of e.keys())this.hasOwnProperty(o)&&(t.set(o,this[o]),delete this[o]);t.size>0&&(this._$Ep=t)}createRenderRoot(){let t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return To(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,o){this._$AK(t,o)}_$ET(t,e){let o=this.constructor.elementProperties.get(t),n=this.constructor._$Eu(t,o);if(n!==void 0&&o.reflect===!0){let r=(o.converter?.toAttribute!==void 0?o.converter:yt).toAttribute(e,o.type);this._$Em=t,r==null?this.removeAttribute(n):this.setAttribute(n,r),this._$Em=null}}_$AK(t,e){let o=this.constructor,n=o._$Eh.get(t);if(n!==void 0&&this._$Em!==n){let r=o.getPropertyOptions(n),i=typeof r.converter=="function"?{fromAttribute:r.converter}:r.converter?.fromAttribute!==void 0?r.converter:yt;this._$Em=n;let a=i.fromAttribute(e,r.type);this[n]=a??this._$Ej?.get(n)??a,this._$Em=null}}requestUpdate(t,e,o,n=!1,r){if(t!==void 0){let i=this.constructor;if(n===!1&&(r=this[t]),o??=i.getPropertyOptions(t),!((o.hasChanged??jt)(r,e)||o.useDefault&&o.reflect&&r===this._$Ej?.get(t)&&!this.hasAttribute(i._$Eu(t,o))))return;this.C(t,e,o)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(t,e,{useDefault:o,reflect:n,wrapped:r},i){o&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,i??e??this[t]),r!==!0||i!==void 0)||(this._$AL.has(t)||(this.hasUpdated||o||(e=void 0),this._$AL.set(t,e)),n===!0&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}let t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[n,r]of this._$Ep)this[n]=r;this._$Ep=void 0}let o=this.constructor.elementProperties;if(o.size>0)for(let[n,r]of o){let{wrapped:i}=r,a=this[n];i!==!0||this._$AL.has(n)||a===void 0||this.C(n,void 0,r,a)}}let t=!1,e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(o=>o.hostUpdate?.()),this.update(e)):this._$EM()}catch(o){throw t=!1,this._$EM(),o}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(e=>this._$ET(e,this[e])),this._$EM()}updated(t){}firstUpdated(t){}};W.elementStyles=[],W.shadowRootOptions={mode:"open"},W[bt("elementProperties")]=new Map,W[bt("finalized")]=new Map,sn?.({ReactiveElement:W}),(It.reactiveElementVersions??=[]).push("2.1.2");var he=globalThis,Ro=s=>s,Dt=he.trustedTypes,Po=Dt?Dt.createPolicy("lit-html",{createHTML:s=>s}):void 0,Io="$lit$",F=`lit$${Math.random().toFixed(9).slice(2)}$`,jo="?"+F,nn=`<${jo}>`,tt=document,xt=()=>tt.createComment(""),$t=s=>s===null||typeof s!="object"&&typeof s!="function",me=Array.isArray,rn=s=>me(s)||typeof s?.[Symbol.iterator]=="function",ae=`[ 	
\f\r]`,vt=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,Ho=/-->/g,No=/>/g,Z=RegExp(`>|${ae}(?:([^\\s"'>=/]+)(${ae}*=${ae}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),Oo=/'/g,Uo=/"/g,Do=/^(?:script|style|textarea|title)$/i,fe=s=>(t,...e)=>({_$litType$:s,strings:t,values:e}),u=fe(1),Dn=fe(2),qn=fe(3),et=Symbol.for("lit-noChange"),y=Symbol.for("lit-nothing"),zo=new WeakMap,X=tt.createTreeWalker(tt,129);function qo(s,t){if(!me(s)||!s.hasOwnProperty("raw"))throw Error("invalid template strings array");return Po!==void 0?Po.createHTML(t):t}var an=(s,t)=>{let e=s.length-1,o=[],n,r=t===2?"<svg>":t===3?"<math>":"",i=vt;for(let a=0;a<e;a++){let c=s[a],l,x,h=-1,_=0;for(;_<c.length&&(i.lastIndex=_,x=i.exec(c),x!==null);)_=i.lastIndex,i===vt?x[1]==="!--"?i=Ho:x[1]!==void 0?i=No:x[2]!==void 0?(Do.test(x[2])&&(n=RegExp("</"+x[2],"g")),i=Z):x[3]!==void 0&&(i=Z):i===Z?x[0]===">"?(i=n??vt,h=-1):x[1]===void 0?h=-2:(h=i.lastIndex-x[2].length,l=x[1],i=x[3]===void 0?Z:x[3]==='"'?Uo:Oo):i===Uo||i===Oo?i=Z:i===Ho||i===No?i=vt:(i=Z,n=void 0);let S=i===Z&&s[a+1].startsWith("/>")?" ":"";r+=i===vt?c+nn:h>=0?(o.push(l),c.slice(0,h)+Io+c.slice(h)+F+S):c+F+(h===-2?a:S)}return[qo(s,r+(s[e]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),o]},St=class s{constructor({strings:t,_$litType$:e},o){let n;this.parts=[];let r=0,i=0,a=t.length-1,c=this.parts,[l,x]=an(t,e);if(this.el=s.createElement(l,o),X.currentNode=this.el.content,e===2||e===3){let h=this.el.content.firstChild;h.replaceWith(...h.childNodes)}for(;(n=X.nextNode())!==null&&c.length<a;){if(n.nodeType===1){if(n.hasAttributes())for(let h of n.getAttributeNames())if(h.endsWith(Io)){let _=x[i++],S=n.getAttribute(h).split(F),K=/([.?@])?(.*)/.exec(_);c.push({type:1,index:r,name:K[2],strings:S,ctor:K[1]==="."?ce:K[1]==="?"?pe:K[1]==="@"?de:ct}),n.removeAttribute(h)}else h.startsWith(F)&&(c.push({type:6,index:r}),n.removeAttribute(h));if(Do.test(n.tagName)){let h=n.textContent.split(F),_=h.length-1;if(_>0){n.textContent=Dt?Dt.emptyScript:"";for(let S=0;S<_;S++)n.append(h[S],xt()),X.nextNode(),c.push({type:2,index:++r});n.append(h[_],xt())}}}else if(n.nodeType===8)if(n.data===jo)c.push({type:2,index:r});else{let h=-1;for(;(h=n.data.indexOf(F,h+1))!==-1;)c.push({type:7,index:r}),h+=F.length-1}r++}}static createElement(t,e){let o=tt.createElement("template");return o.innerHTML=t,o}};function lt(s,t,e=s,o){if(t===et)return t;let n=o!==void 0?e._$Co?.[o]:e._$Cl,r=$t(t)?void 0:t._$litDirective$;return n?.constructor!==r&&(n?._$AO?.(!1),r===void 0?n=void 0:(n=new r(s),n._$AT(s,e,o)),o!==void 0?(e._$Co??=[])[o]=n:e._$Cl=n),n!==void 0&&(t=lt(s,n._$AS(s,t.values),n,o)),t}var le=class{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){let{el:{content:e},parts:o}=this._$AD,n=(t?.creationScope??tt).importNode(e,!0);X.currentNode=n;let r=X.nextNode(),i=0,a=0,c=o[0];for(;c!==void 0;){if(i===c.index){let l;c.type===2?l=new wt(r,r.nextSibling,this,t):c.type===1?l=new c.ctor(r,c.name,c.strings,this,t):c.type===6&&(l=new ue(r,this,t)),this._$AV.push(l),c=o[++a]}i!==c?.index&&(r=X.nextNode(),i++)}return X.currentNode=tt,n}p(t){let e=0;for(let o of this._$AV)o!==void 0&&(o.strings!==void 0?(o._$AI(t,o,e),e+=o.strings.length-2):o._$AI(t[e])),e++}},wt=class s{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,o,n){this.type=2,this._$AH=y,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=o,this.options=n,this._$Cv=n?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode,e=this._$AM;return e!==void 0&&t?.nodeType===11&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=lt(this,t,e),$t(t)?t===y||t==null||t===""?(this._$AH!==y&&this._$AR(),this._$AH=y):t!==this._$AH&&t!==et&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):rn(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==y&&$t(this._$AH)?this._$AA.nextSibling.data=t:this.T(tt.createTextNode(t)),this._$AH=t}$(t){let{values:e,_$litType$:o}=t,n=typeof o=="number"?this._$AC(t):(o.el===void 0&&(o.el=St.createElement(qo(o.h,o.h[0]),this.options)),o);if(this._$AH?._$AD===n)this._$AH.p(e);else{let r=new le(n,this),i=r.u(this.options);r.p(e),this.T(i),this._$AH=r}}_$AC(t){let e=zo.get(t.strings);return e===void 0&&zo.set(t.strings,e=new St(t)),e}k(t){me(this._$AH)||(this._$AH=[],this._$AR());let e=this._$AH,o,n=0;for(let r of t)n===e.length?e.push(o=new s(this.O(xt()),this.O(xt()),this,this.options)):o=e[n],o._$AI(r),n++;n<e.length&&(this._$AR(o&&o._$AB.nextSibling,n),e.length=n)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){let o=Ro(t).nextSibling;Ro(t).remove(),t=o}}setConnected(t){this._$AM===void 0&&(this._$Cv=t,this._$AP?.(t))}},ct=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,o,n,r){this.type=1,this._$AH=y,this._$AN=void 0,this.element=t,this.name=e,this._$AM=n,this.options=r,o.length>2||o[0]!==""||o[1]!==""?(this._$AH=Array(o.length-1).fill(new String),this.strings=o):this._$AH=y}_$AI(t,e=this,o,n){let r=this.strings,i=!1;if(r===void 0)t=lt(this,t,e,0),i=!$t(t)||t!==this._$AH&&t!==et,i&&(this._$AH=t);else{let a=t,c,l;for(t=r[0],c=0;c<r.length-1;c++)l=lt(this,a[o+c],e,c),l===et&&(l=this._$AH[c]),i||=!$t(l)||l!==this._$AH[c],l===y?t=y:t!==y&&(t+=(l??"")+r[c+1]),this._$AH[c]=l}i&&!n&&this.j(t)}j(t){t===y?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}},ce=class extends ct{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===y?void 0:t}},pe=class extends ct{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==y)}},de=class extends ct{constructor(t,e,o,n,r){super(t,e,o,n,r),this.type=5}_$AI(t,e=this){if((t=lt(this,t,e,0)??y)===et)return;let o=this._$AH,n=t===y&&o!==y||t.capture!==o.capture||t.once!==o.once||t.passive!==o.passive,r=t!==y&&(o===y||n);n&&this.element.removeEventListener(this.name,this,o),r&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}},ue=class{constructor(t,e,o){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=o}get _$AU(){return this._$AM._$AU}_$AI(t){lt(this,t)}};var ln=he.litHtmlPolyfillSupport;ln?.(St,wt),(he.litHtmlVersions??=[]).push("3.3.2");var Wo=(s,t,e)=>{let o=e?.renderBefore??t,n=o._$litPart$;if(n===void 0){let r=e?.renderBefore??null;o._$litPart$=n=new wt(t.insertBefore(xt(),r),r,void 0,e??{})}return n._$AI(s),n};var ge=globalThis,T=class extends W{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){let e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=Wo(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return et}};T._$litElement$=!0,T.finalized=!0,ge.litElementHydrateSupport?.({LitElement:T});var cn=ge.litElementPolyfillSupport;cn?.({LitElement:T});(ge.litElementVersions??=[]).push("4.2.2");var D=s=>(t,e)=>{e!==void 0?e.addInitializer(()=>{customElements.define(s,t)}):customElements.define(s,t)};var pn={attribute:!0,type:String,converter:yt,reflect:!1,hasChanged:jt},dn=(s=pn,t,e)=>{let{kind:o,metadata:n}=e,r=globalThis.litPropertyMetadata.get(n);if(r===void 0&&globalThis.litPropertyMetadata.set(n,r=new Map),o==="setter"&&((s=Object.create(s)).wrapped=!0),r.set(e.name,s),o==="accessor"){let{name:i}=e;return{set(a){let c=t.get.call(this);t.set.call(this,a),this.requestUpdate(i,c,s,!0,a)},init(a){return a!==void 0&&this.C(i,void 0,s,a),a}}}if(o==="setter"){let{name:i}=e;return function(a){let c=this[i];t.call(this,a),this.requestUpdate(i,c,s,!0,a)}}throw Error("Unsupported decorator location: "+o)};function L(s){return(t,e)=>typeof e=="object"?dn(s,t,e):((o,n,r)=>{let i=n.hasOwnProperty(r);return n.constructor.createProperty(r,o),i?Object.getOwnPropertyDescriptor(n,r):void 0})(s,t,e)}function C(s){return L({...s,state:!0,attribute:!1})}var Bo,Vo,Ko,Fo,Jo,R,be,ye,ve,Se,we,P,xe,$e,Qo,Go;Jo=[D("dui-inspector-overlay")];var ot=class extends(Fo=T,Ko=[L({type:Boolean,reflect:!0})],Vo=[C()],Bo=[C()],Fo){constructor(){super(...arguments);b(this,P);b(this,be,m(R,8,this,!1)),m(R,11,this);b(this,ye,m(R,12,this,null)),m(R,15,this);b(this,xe,m(R,16,this,"")),m(R,19,this)}highlight(e){f(this,P,e.getBoundingClientRect(),we),f(this,P,e.tagName.toLowerCase(),Go),this.visible=!0}hide(){this.visible=!1,f(this,P,null,we)}render(){if(!p(this,P,Se))return u`${y}`;let{top:e,left:o,width:n,height:r}=p(this,P,Se);return u`
      <div
        class="border"
        style="top:${e}px;left:${o}px;width:${n}px;height:${r}px"
      >
        <span class="label">${p(this,P,Qo)}</span>
      </div>
    `}};R=z(Fo),be=new WeakMap,ye=new WeakMap,P=new WeakSet,xe=new WeakMap,v(R,4,"visible",Ko,ot,be),ve=v(R,20,"#rect",Vo,P,ye),Se=ve.get,we=ve.set,$e=v(R,20,"#tagName",Bo,P,xe),Qo=$e.get,Go=$e.set,ot=v(R,0,"InspectorOverlayElement",Jo,ot),I(ot,"styles",U`
    :host {
      position: fixed;
      pointer-events: none;
      z-index: 99998;
      display: none;
    }

    :host([visible]) {
      display: block;
    }

    .border {
      position: fixed;
      border: 2px solid oklch(0.65 0.2 250);
      border-radius: 4px;
      background: oklch(0.65 0.2 250 / 0.08);
    }

    .label {
      position: absolute;
      top: -22px;
      left: -2px;
      background: oklch(0.65 0.2 250);
      color: white;
      font-family: ui-monospace, monospace;
      font-size: 11px;
      font-weight: 600;
      padding: 2px 6px;
      border-radius: 3px 3px 0 0;
      white-space: nowrap;
      line-height: 16px;
    }
  `),m(R,1,ot);var Yo,Zo,Xo,pt,Ee,Wt,ts;Xo=[D("dui-inspector-panel")];var st=class extends(Zo=T,Yo=[L({attribute:!1})],Zo){constructor(){super(...arguments);b(this,Wt);b(this,Ee,m(pt,8,this,null)),m(pt,11,this)}render(){if(!this.data)return u`${y}`;let e=this.data;return u`
      <div class="body">
        <!-- Path & Selector -->
        <div class="selector-row">
          Path: <code>${e.path}</code>
        </div>
        <div class="selector-row">
          Selector: <code>${e.selector}</code>
        </div>

        <!-- Properties -->
        <details open>
          <summary>Properties <span class="count">${e.properties.length}</span></summary>
          ${e.properties.length?u`<div class="section-content">
                ${e.properties.map(o=>u`
                    <div class="row">
                      <span class="row-name">${o.name}</span>
                      <span class="row-value">${w(this,Wt,ts).call(this,o.value)}</span>
                      <span class="row-type">${o.type}</span>
                    </div>
                  `)}
              </div>`:u`<div class="empty">No properties</div>`}
        </details>

        <!-- CSS Parts -->
        <details open>
          <summary>CSS Parts <span class="count">${e.parts.length}</span></summary>
          ${e.parts.length?u`<div class="section-content">
                ${e.parts.map(o=>u`
                    <div class="row">
                      <span class="row-name">::part(${o.name})</span>
                      <span class="row-meta">&lt;${o.tagName}&gt;</span>
                    </div>
                  `)}
              </div>`:u`<div class="empty">No parts</div>`}
        </details>

        <!-- Slots -->
        <details>
          <summary>Slots <span class="count">${e.slots.length}</span></summary>
          ${e.slots.length?u`<div class="section-content">
                ${e.slots.map(o=>u`
                    <div class="row">
                      <span class="row-name">${o.name}</span>
                      <span class="row-meta">${o.assignedNodes} nodes</span>
                    </div>
                  `)}
              </div>`:u`<div class="empty">No slots</div>`}
        </details>

        <!-- Shadow Summary -->
        <div class="shadow-summary">${e.shadowSummary}</div>
      </div>
    `}};pt=z(Zo),Ee=new WeakMap,Wt=new WeakSet,ts=function(e){return e===void 0?"undefined":e===null?"null":typeof e=="string"?`"${e}"`:String(e)},v(pt,4,"data",Yo,st,Ee),st=v(pt,0,"InspectorPanelElement",Xo,st),I(st,"styles",U`
    :host {
      display: flex;
      flex-direction: column;
      height: 100%;
      overflow: hidden;
    }

    .body {
      flex: 1;
      overflow-y: auto;
      padding: 0;
    }

    /* Sections */
    details {
      border-bottom: 1px solid #313244;
    }

    summary {
      display: flex;
      align-items: center;
      cursor: pointer;
      padding: 8px 14px;
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      color: #a6adc8;
      list-style: none;
      user-select: none;
    }

    summary::-webkit-details-marker {
      display: none;
    }

    summary::before {
      content: "▸";
      margin-right: 6px;
      font-size: 10px;
      transition: transform 0.15s ease;
    }

    details[open] > summary::before {
      transform: rotate(90deg);
    }

    summary .count {
      margin-left: auto;
      color: #585b70;
      font-weight: 400;
    }

    .section-content {
      padding: 4px 14px 10px;
    }

    /* Table rows */
    .row {
      display: flex;
      padding: 3px 0;
      gap: 8px;
      align-items: baseline;
    }

    .row-name {
      color: #cba6f7;
      flex-shrink: 0;
      min-width: 0;
    }

    .row-value {
      color: #a6e3a1;
      word-break: break-all;
      min-width: 0;
    }

    .row-type {
      color: #585b70;
      font-size: 10px;
      margin-left: auto;
      flex-shrink: 0;
    }

    .row-meta {
      color: #585b70;
      font-size: 10px;
      flex-shrink: 0;
    }

    .empty {
      color: #585b70;
      font-style: italic;
      padding: 4px 14px 10px;
    }

    .shadow-summary {
      padding: 4px 14px 10px;
      color: #6c7086;
    }

    .selector-row {
      padding: 4px 14px 8px;
      color: #585b70;
      font-size: 11px;
      border-bottom: 1px solid #313244;
      word-break: break-all;
    }

    .selector-row code {
      color: #89b4fa;
    }

    /* Event source badge */
    .event-source {
      font-size: 9px;
      color: #585b70;
      background: #313244;
      padding: 1px 4px;
      border-radius: 2px;
      flex-shrink: 0;
    }
  `),m(pt,1,st);var es,os,ss,ns,rs,H,ke,_e,Ce,Ae,Bt,Te,A,is,as,Vt;rs=[D("dui-inspector-token-editor")];var J=class extends(ns=T,ss=[L({attribute:!1})],os=[L({type:String})],es=[C()],ns){constructor(){super(...arguments);b(this,A);b(this,ke,m(H,8,this,null)),m(H,11,this);b(this,_e,m(H,12,this,"")),m(H,15,this);b(this,Ce,m(H,16,this,"global")),m(H,19,this)}render(){if(!this.data)return u`<div class="empty">Select a component</div>`;let e=this.data.tokens;if(e.length===0)return u`<div class="empty">No tokens</div>`;let o=e.filter(r=>r.hex),n=e.filter(r=>!r.hex);return u`
      <div class="scope-toggle">
        <button
          class="scope-btn"
          ?data-active=${p(this,A,Bt)==="global"}
          @click=${()=>f(this,A,"global",Te)}
        >Global</button>
        <button
          class="scope-btn"
          ?data-active=${p(this,A,Bt)==="instance"}
          @click=${()=>f(this,A,"instance",Te)}
        >This instance</button>
      </div>

      <div class="body">
        ${o.length>0?u`
              <div class="section-label">Colors</div>
              ${o.map(r=>w(this,A,is).call(this,r))}
            `:y}

        ${n.length>0?u`
              <div class="section-label">Other</div>
              ${n.map(r=>w(this,A,as).call(this,r))}
            `:y}
      </div>
    `}};H=z(ns),ke=new WeakMap,_e=new WeakMap,Ce=new WeakMap,A=new WeakSet,is=function(e){return u`
      <div class="token-row">
        <span class="swatch" style="background:${e.hex}"></span>
        <span class="token-name">${e.name}</span>
        <input
          type="color"
          class="color-input"
          .value=${e.hex??"#000000"}
          @change=${o=>w(this,A,Vt).call(this,e.name,o.target.value)}
        />
        <input
          type="text"
          class="token-input"
          .value=${e.computed}
          @change=${o=>w(this,A,Vt).call(this,e.name,o.target.value)}
        />
      </div>
    `},as=function(e){return u`
      <div class="token-row">
        <span class="token-name">${e.name}</span>
        <input
          type="text"
          class="token-input"
          .value=${e.computed}
          @change=${o=>w(this,A,Vt).call(this,e.name,o.target.value)}
        />
      </div>
    `},Vt=function(e,o){p(this,A,Bt)==="global"?Ht(e,o):Nt(this.selector,e,o),this.dispatchEvent(new CustomEvent("token-changed",{bubbles:!0,composed:!0}))},v(H,4,"data",ss,J,ke),v(H,4,"selector",os,J,_e),Ae=v(H,20,"#scope",es,A,Ce),Bt=Ae.get,Te=Ae.set,J=v(H,0,"TokenEditorPanelElement",rs,J),I(J,"styles",U`
    :host {
      display: flex;
      flex-direction: column;
      height: 100%;
      overflow: hidden;
    }

    .body {
      flex: 1;
      overflow-y: auto;
      padding: 0;
    }

    .scope-toggle {
      display: flex;
      padding: 8px 14px;
      gap: 8px;
      border-bottom: 1px solid #313244;
    }

    .scope-btn {
      background: none;
      border: 1px solid #45475a;
      color: #a6adc8;
      font-family: ui-monospace, monospace;
      font-size: 11px;
      padding: 3px 10px;
      border-radius: 4px;
      cursor: pointer;
    }

    .scope-btn[data-active] {
      background: oklch(0.65 0.2 250);
      border-color: oklch(0.65 0.2 250);
      color: white;
    }

    .token-row {
      display: flex;
      align-items: center;
      padding: 6px 14px;
      gap: 8px;
      border-bottom: 1px solid #313244 / 0.5;
    }

    .token-row:hover {
      background: #181825;
    }

    .token-name {
      color: #cba6f7;
      font-size: 11px;
      flex: 1;
      min-width: 0;
      word-break: break-all;
    }

    .token-input {
      background: #181825;
      border: 1px solid #45475a;
      color: #cdd6f4;
      font-family: ui-monospace, monospace;
      font-size: 11px;
      padding: 2px 6px;
      border-radius: 3px;
      width: 120px;
      flex-shrink: 0;
    }

    .token-input:focus {
      outline: none;
      border-color: oklch(0.65 0.2 250);
    }

    .color-input {
      width: 24px;
      height: 24px;
      padding: 0;
      border: 1px solid #45475a;
      border-radius: 3px;
      cursor: pointer;
      flex-shrink: 0;
      background: none;
    }

    .color-input::-webkit-color-swatch-wrapper {
      padding: 2px;
    }

    .color-input::-webkit-color-swatch {
      border: none;
      border-radius: 2px;
    }

    .swatch {
      display: inline-block;
      width: 14px;
      height: 14px;
      border-radius: 2px;
      border: 1px solid #45475a;
      flex-shrink: 0;
    }

    .empty {
      color: #585b70;
      font-style: italic;
      padding: 12px 14px;
    }

    .section-label {
      padding: 8px 14px 4px;
      font-size: 10px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      color: #585b70;
      border-bottom: 1px solid #313244;
    }
  `),m(H,1,J);function bs(s){let t=[],e=s.split(/(?<=\})\s*/);for(let o of e){let n=o.trim();if(!n)continue;let r=n.match(/^([^{]+)\{([^}]*)\}$/s);if(r){let i=r[1].trim(),a=r[2].trim();t.push(`${i} {`);let c=a.split(";").filter(l=>l.trim());for(let l of c)t.push(`  ${l.trim()};`);t.push("}"),t.push("")}else t.push(n)}return t.join(`
`).trim()}function ls(s){let e=bs(s).split(`
`),o=[];for(let n of e)o.push(u`<div class="code-line">${un(n)}</div>`);return o}function un(s){let t=s.trim();if(!t)return u`<br>`;if(t==="}")return u`<span class="hl-brace">${s}</span>`;if(t.endsWith("{")){let o=s.match(/^\s*/)?.[0]??"",n=t.slice(0,-1).trim();return u`${o}<span class="hl-selector">${n}</span> <span class="hl-brace">{</span>`}let e=t.match(/^([\w-]+)\s*:\s*(.+)$/);if(e){let o=s.match(/^\s*/)?.[0]??"",n=e[1],r=e[2],i=r.endsWith(";");i&&(r=r.slice(0,-1));let a=n.startsWith("--"),c=hn(r);return u`${o}<span class="${a?"hl-custom-prop":"hl-property"}">${n}</span><span class="hl-punctuation">: </span>${c}${i?u`<span class="hl-punctuation">;</span>`:y}`}return u`${s}`}function hn(s){let t=[],e=s;for(;e;){let o=e.indexOf("var(");if(o===-1){t.push(u`<span class="hl-value">${e}</span>`);break}o>0&&t.push(u`<span class="hl-value">${e.slice(0,o)}</span>`);let n=0,r=o+4;for(;r<e.length;r++)if(e[r]==="("&&n++,e[r]===")"){if(n===0){r++;break}n--}let i=e.slice(o,r);t.push(u`<span class="hl-var">${i}</span>`),e=e.slice(r)}return u`${t}`}var cs,ps,ds,us,hs,ms,fs,gs,E,Me,Le,Re,Pe,Kt,je,g,He,Ne,De,ys,Oe,Ue,qe,Et,ze,Ie,We,B,kt,Be,vs,xs,$s;gs=[D("dui-inspector-style-editor")];var Q=class extends(fs=T,ms=[L({attribute:!1})],hs=[L({attribute:!1})],us=[C()],ds=[C()],ps=[C()],cs=[C()],fs){constructor(){super(...arguments);b(this,g);b(this,Me,m(E,8,this,null)),m(E,11,this);b(this,Le,m(E,12,this,null)),m(E,15,this);b(this,Re,m(E,16,this,"")),m(E,19,this);b(this,He,m(E,20,this,!1)),m(E,23,this);b(this,Oe,m(E,24,this,"")),m(E,27,this);b(this,ze,m(E,28,this,null)),m(E,31,this);b(this,kt,e=>{if(e.key==="Tab"){e.preventDefault();let o=e.target,n=o.selectionStart,r=o.selectionEnd;o.value=o.value.substring(0,n)+"  "+o.value.substring(r),o.selectionStart=o.selectionEnd=n+2}})}render(){if(!this.data||!this.targetElement)return u`<div class="empty">Select a component</div>`;let e=this.data.styleLayers;return u`
      <div class="body">
        ${e.map((o,n)=>{let r=o.layer==="theme-component",i=r,a=w(this,g,Be).call(this,n);return u`
            <details class="layer" ?open=${i}>
              <summary>
                ${o.layer}
                ${r?u`<span class="editable-badge">editable</span>`:u`<span class="readonly-badge">read-only</span>`}
              </summary>
              ${p(this,g,We)===n?u`<textarea
                    class="css-editor"
                    .value=${bs(a)}
                    @change=${c=>w(this,g,vs).call(this,n,c.target.value)}
                    @blur=${()=>{f(this,g,null,B)}}
                    @keydown=${p(this,kt)}
                    spellcheck="false"
                  ></textarea>`:a?u`<div
                      class="code-block ${r?"editable-code resizable":""}"
                      @dblclick=${r?()=>{f(this,g,n,B)}:y}
                    >${ls(a)}${r?u`<button class="edit-btn" @click=${()=>{f(this,g,n,B)}}>Edit</button>`:y}</div>`:r?u`<div class="code-block editable-code resizable" @dblclick=${()=>{f(this,g,n,B)}}><span class="code-empty">(empty)</span><button class="edit-btn" @click=${()=>{f(this,g,n,B)}}>Edit</button></div>`:u`<div class="code-block"><span class="code-empty">(empty)</span></div>`}
            </details>
          `})}

        <!-- User overrides layer -->
        <details class="layer" open>
          <summary>
            user overrides
            <span class="editable-badge">editable</span>
          </summary>
          ${p(this,g,De)&&p(this,g,We)==="user"?u`<textarea
                class="css-editor"
                .value=${p(this,g,Kt)}
                @change=${o=>w(this,g,$s).call(this,o.target.value)}
                @blur=${()=>{f(this,g,null,B)}}
                @keydown=${p(this,kt)}
                spellcheck="false"
              ></textarea>`:p(this,g,De)?u`<div class="code-block editable-code" @dblclick=${()=>{f(this,g,"user",B)}}>
                ${p(this,g,Kt).trim()?ls(p(this,g,Kt)):u`<span class="code-empty">(empty)</span>`}
                <button class="edit-btn" @click=${()=>{f(this,g,"user",B)}}>Edit</button>
              </div>`:u`<button class="add-override-btn" @click=${w(this,g,xs)}>
                + Add custom CSS override
              </button>`}
        </details>

        ${p(this,g,qe)?u`<div class="error-msg">${p(this,g,qe)}</div>`:y}
      </div>
    `}};E=z(fs),Me=new WeakMap,Le=new WeakMap,Re=new WeakMap,g=new WeakSet,He=new WeakMap,Oe=new WeakMap,ze=new WeakMap,kt=new WeakMap,Be=function(e){let o=this.targetElement?.shadowRoot;if(!o)return"";let n=o.adoptedStyleSheets[e];if(!n)return"";try{return Array.from(n.cssRules).map(r=>r.cssText).join(`
`)}catch{return"(cross-origin \u2014 cannot read)"}},vs=function(e,o){let n=this.targetElement?.shadowRoot;if(!n)return;let r=n.adoptedStyleSheets[e],i=w(this,g,Be).call(this,e);try{let a=new CSSStyleSheet;a.replaceSync(o);let c=[...n.adoptedStyleSheets];c[e]=a,n.adoptedStyleSheets=c,f(this,g,"",Et),$.add("editThemeCSS",this.data?.selector??"",{layerIndex:e,oldCSS:i,newCSS:o},()=>{let l=[...n.adoptedStyleSheets];l[e]=r,n.adoptedStyleSheets=l}),this.dispatchEvent(new CustomEvent("style-changed",{bubbles:!0,composed:!0}))}catch(a){f(this,g,`CSS parse error: ${a.message}`,Et)}},xs=function(){f(this,g,!0,ys),f(this,g,`:host {
  
}`,je)},$s=function(e){let o=this.targetElement?.shadowRoot;if(o){f(this,g,e,je);try{let n=new CSSStyleSheet;n.replaceSync(e);let r=this.data?.styleLayers.length??0,i=[...o.adoptedStyleSheets];i.length>r?i[i.length-1]=n:i.push(n),o.adoptedStyleSheets=i,f(this,g,"",Et),$.add("editUserOverride",this.data?.selector??"",{css:e}),this.dispatchEvent(new CustomEvent("style-changed",{bubbles:!0,composed:!0}))}catch(n){f(this,g,`CSS parse error: ${n.message}`,Et)}}},v(E,4,"data",ms,Q,Me),v(E,4,"targetElement",hs,Q,Le),Pe=v(E,20,"#userOverrideCSS",us,g,Re),Kt=Pe.get,je=Pe.set,Ne=v(E,20,"#hasUserOverride",ds,g,He),De=Ne.get,ys=Ne.set,Ue=v(E,20,"#errorMessage",ps,g,Oe),qe=Ue.get,Et=Ue.set,Ie=v(E,20,"#editingLayer",cs,g,ze),We=Ie.get,B=Ie.set,Q=v(E,0,"StyleEditorPanelElement",gs,Q),I(Q,"styles",U`
    :host {
      display: flex;
      flex-direction: column;
      height: 100%;
      overflow: hidden;
    }

    .body {
      flex: 1;
      overflow-y: auto;
      padding: 0;
    }

    /* Collapsible layer sections */
    details.layer {
      border-bottom: 1px solid #313244;
    }

    details.layer > summary {
      display: flex;
      align-items: center;
      padding: 8px 14px;
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      color: #a6adc8;
      gap: 8px;
      cursor: pointer;
      user-select: none;
      list-style: none;
    }

    details.layer > summary::-webkit-details-marker {
      display: none;
    }

    details.layer > summary::before {
      content: "▸";
      font-size: 10px;
      margin-right: 4px;
      transition: transform 0.15s ease;
      flex-shrink: 0;
    }

    details.layer[open] > summary::before {
      transform: rotate(90deg);
    }

    details.layer > summary .editable-badge {
      font-size: 9px;
      font-weight: 400;
      text-transform: none;
      letter-spacing: 0;
      color: #a6e3a1;
      background: oklch(0.4 0.1 140 / 0.2);
      padding: 1px 5px;
      border-radius: 3px;
    }

    details.layer > summary .readonly-badge {
      font-size: 9px;
      font-weight: 400;
      text-transform: none;
      letter-spacing: 0;
      color: #585b70;
      padding: 1px 5px;
    }

    /* Syntax-highlighted code block */
    .code-block {
      background: #11111b;
      font-family: ui-monospace, "SF Mono", "Cascadia Code", Menlo, monospace;
      font-size: 11px;
      line-height: 1.6;
      padding: 8px 14px;
      border-top: 1px solid #313244;
      overflow-x: auto;
      max-height: 200px;
      overflow-y: auto;
    }

    .code-block.resizable {
      resize: vertical;
      max-height: none;
      height: 600px;
    }

    .code-line {
      white-space: pre;
    }

    /* Syntax highlighting colors (Catppuccin Mocha) */
    .hl-selector {
      color: #89b4fa; /* blue */
    }

    .hl-property {
      color: #89dceb; /* sky */
    }

    .hl-custom-prop {
      color: #cba6f7; /* mauve */
    }

    .hl-value {
      color: #a6e3a1; /* green */
    }

    .hl-var {
      color: #f9e2af; /* yellow */
    }

    .hl-punctuation {
      color: #6c7086; /* overlay0 */
    }

    .hl-brace {
      color: #6c7086; /* overlay0 */
    }

    .code-empty {
      color: #585b70;
      font-style: italic;
    }

    .editable-code {
      position: relative;
      cursor: text;
    }

    .editable-code:hover {
      background: #181825;
    }

    .edit-btn {
      position: absolute;
      top: 6px;
      right: 6px;
      background: #313244;
      border: none;
      color: #a6adc8;
      font-family: ui-monospace, monospace;
      font-size: 10px;
      padding: 2px 8px;
      border-radius: 3px;
      cursor: pointer;
      opacity: 0;
      transition: opacity 0.1s ease;
    }

    .editable-code:hover .edit-btn {
      opacity: 1;
    }

    .edit-btn:hover {
      background: oklch(0.65 0.2 250);
      color: white;
    }

    /* Editable textarea */
    .css-editor {
      background: #11111b;
      color: #cdd6f4;
      font-family: ui-monospace, "SF Mono", "Cascadia Code", Menlo, monospace;
      font-size: 11px;
      line-height: 1.6;
      padding: 8px 14px;
      border: none;
      border-top: 1px solid #313244;
      width: 100%;
      min-height: 100px;
      resize: vertical;
      box-sizing: border-box;
      tab-size: 2;
    }

    .css-editor:focus {
      outline: none;
      background: #181825;
    }

    .empty {
      color: #585b70;
      font-style: italic;
      padding: 12px 14px;
    }

    .add-override-btn {
      display: block;
      margin: 8px 14px;
      background: none;
      border: 1px dashed #45475a;
      color: #a6adc8;
      font-family: ui-monospace, monospace;
      font-size: 11px;
      padding: 6px 12px;
      border-radius: 4px;
      cursor: pointer;
      width: calc(100% - 28px);
      text-align: center;
    }

    .add-override-btn:hover {
      border-color: oklch(0.65 0.2 250);
      color: oklch(0.65 0.2 250);
    }

    .error-msg {
      color: #f38ba8;
      font-size: 10px;
      padding: 4px 14px;
    }
  `),m(E,1,Q);function Ve(s){for(;s;){if(s instanceof HTMLElement&&s.tagName.toLowerCase().startsWith("dui-")&&!s.tagName.toLowerCase().startsWith("dui-inspector")&&s.shadowRoot)return s;if(s.parentElement)s=s.parentElement;else if(s.getRootNode().host)s=s.getRootNode().host;else break}return null}var Ss,ws,Es,ks,_s,Cs,As,Ts,k,Ke,Fe,Ft,no,d,Je,Qe,_t,ut,Ge,Ye,Ct,nt,Ze,Xe,rt,Ms,to,eo,ht,ro,oo,so,Ls,io,V,At,Tt,Rs,Jt,Mt,Lt,Rt,Gt,Qt,mt,Yt,Zt,Ps;Ts=[D("dui-inspector")];var dt=class extends(As=T,Cs=[C()],_s=[C()],ks=[C()],Es=[C()],ws=[C()],Ss=[C()],As){constructor(){super(...arguments);b(this,d);b(this,Ke,m(k,8,this,!1)),m(k,11,this);b(this,Je,m(k,12,this,null)),m(k,15,this);b(this,Ge,m(k,16,this,null)),m(k,19,this);b(this,Ze,m(k,20,this,"inspect")),m(k,23,this);b(this,to,m(k,24,this,0)),m(k,27,this);b(this,oo,m(k,28,this,!1)),m(k,31,this);b(this,V,null);b(this,At,()=>{f(this,d,$.count,ro)});b(this,Tt,e=>{if(e.shiftKey&&e.ctrlKey&&!e.metaKey&&e.key==="I"){e.preventDefault(),p(this,d,Ft)?w(this,d,Jt).call(this):w(this,d,Rs).call(this);return}e.key==="Escape"&&p(this,d,Ft)&&(e.preventDefault(),p(this,d,Ct)?(f(this,d,null,nt),f(this,d,null,ut)):w(this,d,Jt).call(this))});b(this,Mt,e=>{let o=e.composedPath()[0],n=Ve(o);n&&n!==p(this,d,_t)?p(this,V)?.highlight(n):n||p(this,V)?.hide()});b(this,Lt,e=>{let o=e.composedPath()[0],n=Ve(o);n&&(e.preventDefault(),e.stopPropagation(),f(this,d,n,ut),f(this,d,q(n),nt),p(this,V)?.highlight(n))});b(this,Rt,e=>{let o=e.composedPath()[0],n=Ve(o);n&&(f(this,d,n,ut),f(this,d,q(n),nt),p(this,V)?.highlight(n))});b(this,Gt,()=>{f(this,d,null,nt),f(this,d,null,ut)});b(this,mt,()=>{p(this,d,_t)&&f(this,d,q(p(this,d,_t)),nt)});b(this,Yt,()=>{$.undo(),f(this,d,$.count,ro),p(this,mt).call(this)});b(this,Zt,async()=>{let e=Ot(),o=JSON.stringify(e,null,2);try{await navigator.clipboard.writeText(o),f(this,d,!0,io),setTimeout(()=>{f(this,d,!1,io)},2e3)}catch(n){console.error("Failed to copy to clipboard:",n)}})}connectedCallback(){super.connectedCallback(),document.addEventListener("keydown",p(this,Tt)),$.subscribe(p(this,At))}disconnectedCallback(){super.disconnectedCallback(),document.removeEventListener("keydown",p(this,Tt)),$.unsubscribe(p(this,At)),w(this,d,Jt).call(this)}firstUpdated(){f(this,V,this.renderRoot.querySelector("dui-inspector-overlay"))}render(){return u`
      <dui-inspector-overlay></dui-inspector-overlay>

      ${p(this,d,Ct)?w(this,d,Ps).call(this):y}

      ${p(this,d,Ft)&&!p(this,d,Ct)?u`<div class="activation-badge">Inspector Active — click a DUI component</div>`:y}

      ${p(this,d,Ls)?u`<div class="copied-toast">Changeset copied ✓</div>`:y}
    `}};k=z(As),Ke=new WeakMap,d=new WeakSet,Je=new WeakMap,Ge=new WeakMap,Ze=new WeakMap,to=new WeakMap,oo=new WeakMap,V=new WeakMap,At=new WeakMap,Tt=new WeakMap,Rs=function(){f(this,d,!0,no),document.addEventListener("mousemove",p(this,Mt),!0),document.addEventListener("pointerdown",p(this,Lt),!0),document.addEventListener("focusin",p(this,Rt),!0)},Jt=function(){f(this,d,!1,no),f(this,d,null,nt),f(this,d,null,ut),p(this,V)?.hide(),document.removeEventListener("mousemove",p(this,Mt),!0),document.removeEventListener("pointerdown",p(this,Lt),!0),document.removeEventListener("focusin",p(this,Rt),!0)},Mt=new WeakMap,Lt=new WeakMap,Rt=new WeakMap,Gt=new WeakMap,Qt=function(e){f(this,d,e,Ms)},mt=new WeakMap,Yt=new WeakMap,Zt=new WeakMap,Ps=function(){let e=p(this,d,Ct);return u`
      <div class="panel-shell">
        <!-- Header -->
        <div class="header">
          <div class="header-info">
            <span class="tag-name">&lt;${e.tagName}&gt;</span>
            <span class="class-name">${e.className}</span>
          </div>
          <button class="close-btn" @click=${p(this,Gt)}>&times;</button>
        </div>

        <!-- Tab bar -->
        <div class="tab-bar">
          <button
            class="tab-btn"
            ?data-active=${p(this,d,rt)==="inspect"}
            @click=${()=>w(this,d,Qt).call(this,"inspect")}
          >Inspect</button>
          <button
            class="tab-btn"
            ?data-active=${p(this,d,rt)==="tokens"}
            @click=${()=>w(this,d,Qt).call(this,"tokens")}
          >Tokens</button>
          <button
            class="tab-btn"
            ?data-active=${p(this,d,rt)==="styles"}
            @click=${()=>w(this,d,Qt).call(this,"styles")}
          >Styles</button>
        </div>

        <!-- Tab content -->
        <div class="tab-content">
          ${p(this,d,rt)==="inspect"?u`<dui-inspector-panel .data=${e}></dui-inspector-panel>`:y}
          ${p(this,d,rt)==="tokens"?u`<dui-inspector-token-editor
                .data=${e}
                .selector=${e.selector}
                @token-changed=${p(this,mt)}
              ></dui-inspector-token-editor>`:y}
          ${p(this,d,rt)==="styles"?u`<dui-inspector-style-editor
                .data=${e}
                .targetElement=${p(this,d,_t)}
                @style-changed=${p(this,mt)}
              ></dui-inspector-style-editor>`:y}
        </div>

        <!-- Toolbar -->
        <div class="toolbar">
          <button
            class="toolbar-btn"
            @click=${p(this,Zt)}
            ?disabled=${p(this,d,ht)===0}
          >Copy changes</button>
          <button
            class="toolbar-btn"
            @click=${p(this,Yt)}
            ?disabled=${p(this,d,ht)===0}
          >Undo</button>
          <span
            class="change-count"
            ?data-has-changes=${p(this,d,ht)>0}
          >${p(this,d,ht)} change${p(this,d,ht)!==1?"s":""}</span>
        </div>
      </div>
    `},Fe=v(k,20,"#active",Cs,d,Ke),Ft=Fe.get,no=Fe.set,Qe=v(k,20,"#selectedElement",_s,d,Je),_t=Qe.get,ut=Qe.set,Ye=v(k,20,"#inspectionData",ks,d,Ge),Ct=Ye.get,nt=Ye.set,Xe=v(k,20,"#activeTab",Es,d,Ze),rt=Xe.get,Ms=Xe.set,eo=v(k,20,"#changeCount",ws,d,to),ht=eo.get,ro=eo.set,so=v(k,20,"#showCopiedToast",Ss,d,oo),Ls=so.get,io=so.set,dt=v(k,0,"InspectorViewElement",Ts,dt),I(dt,"styles",U`
    :host {
      display: contents;
    }

    .panel-shell {
      position: fixed;
      top: 0;
      right: 0;
      width: 360px;
      height: 100dvh;
      background: #1e1e2e;
      color: #cdd6f4;
      font-family: ui-monospace, monospace;
      font-size: 12px;
      z-index: 99999;
      display: flex;
      flex-direction: column;
      box-shadow: -4px 0 24px rgba(0, 0, 0, 0.3);
    }

    .header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 10px 14px;
      background: #181825;
      border-bottom: 1px solid #313244;
      flex-shrink: 0;
    }

    .header-info {
      display: flex;
      flex-direction: column;
      gap: 2px;
      min-width: 0;
    }

    .tag-name {
      font-size: 14px;
      font-weight: 700;
      color: #89b4fa;
    }

    .class-name {
      font-size: 11px;
      color: #6c7086;
    }

    .close-btn {
      background: none;
      border: none;
      color: #6c7086;
      cursor: pointer;
      font-size: 18px;
      padding: 4px;
      line-height: 1;
    }

    .close-btn:hover {
      color: #cdd6f4;
    }

    /* Tabs */
    .tab-bar {
      display: flex;
      background: #181825;
      border-bottom: 1px solid #313244;
      flex-shrink: 0;
    }

    .tab-btn {
      flex: 1;
      background: none;
      border: none;
      border-bottom: 2px solid transparent;
      color: #6c7086;
      font-family: ui-monospace, monospace;
      font-size: 11px;
      font-weight: 600;
      padding: 8px 12px;
      cursor: pointer;
      text-transform: uppercase;
      letter-spacing: 0.04em;
    }

    .tab-btn:hover {
      color: #a6adc8;
    }

    .tab-btn[data-active] {
      color: #89b4fa;
      border-bottom-color: #89b4fa;
    }

    /* Tab content */
    .tab-content {
      flex: 1;
      overflow: hidden;
      display: flex;
      flex-direction: column;
    }

    /* Toolbar */
    .toolbar {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 6px 14px;
      background: #181825;
      border-top: 1px solid #313244;
      flex-shrink: 0;
    }

    .toolbar-btn {
      background: none;
      border: 1px solid #45475a;
      color: #a6adc8;
      font-family: ui-monospace, monospace;
      font-size: 10px;
      padding: 3px 8px;
      border-radius: 4px;
      cursor: pointer;
    }

    .toolbar-btn:hover {
      border-color: oklch(0.65 0.2 250);
      color: oklch(0.65 0.2 250);
    }

    .toolbar-btn:disabled {
      opacity: 0.4;
      cursor: default;
    }

    .change-count {
      margin-left: auto;
      font-size: 10px;
      color: #585b70;
    }

    .change-count[data-has-changes] {
      color: #f9e2af;
    }

    .activation-badge {
      position: fixed;
      bottom: 12px;
      left: 12px;
      background: oklch(0.65 0.2 250);
      color: white;
      font-family: system-ui, sans-serif;
      font-size: 12px;
      font-weight: 600;
      padding: 6px 12px;
      border-radius: 6px;
      z-index: 99997;
      pointer-events: none;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
    }

    .copied-toast {
      position: fixed;
      bottom: 12px;
      right: 380px;
      background: #a6e3a1;
      color: #1e1e2e;
      font-family: system-ui, sans-serif;
      font-size: 12px;
      font-weight: 600;
      padding: 6px 12px;
      border-radius: 6px;
      z-index: 99997;
      pointer-events: none;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
    }
  `),m(k,1,dt);var mn=document.createElement("dui-inspector");document.body.appendChild(mn);
/*! Bundled license information:

@lit/reactive-element/css-tag.js:
  (**
   * @license
   * Copyright 2019 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/reactive-element.js:
lit-html/lit-html.js:
lit-element/lit-element.js:
@lit/reactive-element/decorators/custom-element.js:
@lit/reactive-element/decorators/property.js:
@lit/reactive-element/decorators/state.js:
@lit/reactive-element/decorators/event-options.js:
@lit/reactive-element/decorators/base.js:
@lit/reactive-element/decorators/query.js:
@lit/reactive-element/decorators/query-all.js:
@lit/reactive-element/decorators/query-async.js:
@lit/reactive-element/decorators/query-assigned-nodes.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

lit-html/is-server.js:
  (**
   * @license
   * Copyright 2022 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/decorators/query-assigned-elements.js:
  (**
   * @license
   * Copyright 2021 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)
*/
