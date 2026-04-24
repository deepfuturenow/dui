import "./dropzone.ts";

export { DuiDropzone } from "./dropzone.ts";

export type {
  DropzoneErrorCode,
  DropzoneRejectionCode,
  FileRejectionError,
  RejectedFile,
  DropzoneDropDetail,
  DropzoneAcceptedDetail,
  DropzoneRejectedDetail,
  DropzoneErrorDetail,
} from "@dui/primitives/dropzone";
export { dropzoneDropEvent, dropAcceptedEvent, dropRejectedEvent, dropzoneErrorEvent } from "@dui/primitives/dropzone";
