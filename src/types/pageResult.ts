import type { PageNumberPosition } from "./pagenumberPosition";

export interface PageResult {
  name: string;
  blob: Blob;
  url: string;
  pages: number;
  rotation: number;
  fileName: string;
}

export interface PageNumberOptions {
  position: PageNumberPosition;
  startFrom?: number;
  range?: {
    from: number;
    to: number;
  };
  fileName?: string;
  text?: string;
}
