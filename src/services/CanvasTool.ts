import type { HslColor } from "@/types/global";
import { ColorConverter } from "./ColorConverter";

interface CanvasToolImage {
  image: ImageData,
  x: number,
  y: number,
}

interface CanvasData {
	ctx: CanvasRenderingContext2D | null;
  canvasEl: HTMLCanvasElement | null;
  width: number;
	height: number;
	images: Array<CanvasToolImage>;
  tileSize: number,
  innerRadius: number,
  outerRadius: number,
  l: number,
  s: number,
  centerX: number,
  centerY: number,
  rendering: Boolean,
  timeout: NodeJS.Timeout | null,
  renderTimeout: NodeJS.Timeout | null,
}

class CanvasToolService {
  #data: CanvasData = {
    ctx: null,
    canvasEl: null,
    width: 400,
    height: 400,
    images: [],
    tileSize: 50,
    innerRadius: 140,
    outerRadius: 199,
    l: 0.6,
    s: 0.7,
    centerX: 200,
    centerY: 200,
    rendering: false,
    timeout: null,
    renderTimeout: null,
  } as CanvasData

  constructor() {}

	init (canvasEl: HTMLCanvasElement, innerRadius: number, outerRadius: number, tileSize: number) {
		
    const canvasRect: DOMRect = canvasEl.getBoundingClientRect();
		this.#data.canvasEl = canvasEl;
    this.#data.ctx = (this.#data.canvasEl as HTMLCanvasElement).getContext("2d") as CanvasRenderingContext2D;
    this.#data.centerX = Math.floor(canvasRect.width / 2);
    this.#data.centerY = Math.floor(canvasRect.height / 2);
    this.#data.innerRadius = Math.floor(innerRadius * canvasRect.height / 2);
    this.#data.outerRadius = Math.floor(outerRadius * canvasRect.height / 2);
    this.#data.tileSize = tileSize;
		this.#data.width = canvasRect.width;
		this.#data.height = canvasRect.height;
	}

  getData() {
    return JSON.stringify(this.#data, null, '  ');
  }

	#getCtx(): CanvasRenderingContext2D {
		if (typeof this.#data.ctx !== "undefined") {
			return this.#data.ctx as CanvasRenderingContext2D;
		} else {
			this.#data.ctx = (this.#data.canvasEl as HTMLCanvasElement).getContext("2d") as CanvasRenderingContext2D;
			return this.#data.ctx;
		}
	}

  #isValid(x: number, y: number) : boolean {
    const xD = x * this.#data.tileSize - this.#data.centerX;
    const yD = y * this.#data.tileSize - this.#data.centerY;
    const radius = Math.sqrt((xD * xD) + (yD * yD));
    return (radius < this.#data.outerRadius && radius > this.#data.innerRadius);
  }

  #buildImages() {

    try {
      const tileCountX = Math.ceil(this.#data.width / this.#data.tileSize);
      const tileCountY = Math.ceil(this.#data.height / this.#data.tileSize);

      for (let x = 0; x < tileCountX; x++) {
        for (let y = 0; y < tileCountY; y++) {

          if (this.#isValid(x,y) || this.#isValid(x + 1, y) || this.#isValid(x, y + 1) || this.#isValid(x + 1, y + 1)) {

            const xD = x * this.#data.tileSize;
            const yD = y * this.#data.tileSize;

            const image = this.#getCtx().createImageData(this.#data.tileSize, this.#data.tileSize);
            this.#data.images.push({image: image, x:xD, y: yD } as CanvasToolImage);
          }
        } 
      }
    } catch(e: any) {
      let message = "";
      if (typeof e === "string") {
        message = e.toString();
      } else if (e instanceof Error) {
        message = e.message
      }
      console.log(message);
    }
  }

	drawImages(l: number, s: number) : void {

    if (this.#data.rendering) {
      if (this.#data.renderTimeout != null) {
        clearTimeout(this.#data.renderTimeout);
        this.#data.renderTimeout = setTimeout(() => {
          this.drawImages(l,s);
        }, 2000);
      }
      return;
    }
    
    this.#data.rendering = true;
    this.#data.timeout = setTimeout(() => {

      this.#clearImages();
      this.#buildImages();
      
      this.#data.s = s;
      this.#data.l = l;

      for (let q = 0; q < this.#data.images.length; q++) {
      
        const image = this.#data.images[q];

        for (let x = 0; x < this.#data.tileSize; x++) {
          for (let y = 0; y < this.#data.tileSize; y++) {
            const xD = image.x + x - this.#data.centerX;
            const yD = image.y + y - this.#data.centerY;
            
            const radius = Math.sqrt((xD * xD) + (yD * yD));
            if (radius < this.#data.outerRadius && radius > this.#data.innerRadius) {
              const angle = Math.atan2(yD, xD);
            
              const hslColor = { h: angle / Math.PI / 2, s: this.#data.s, l: this.#data.l } as HslColor
              const color = ColorConverter.HslToRgb(hslColor);
              const index = y * 4 * this.#data.tileSize + x * 4;
              const imageData = image.image;
              imageData.data[index] = color.r;
              imageData.data[index + 1] = color.g;
              imageData.data[index + 2] = color.b;
              imageData.data[index + 3] = 255;
            }
          }
        }

        this.#getCtx().putImageData(image.image, image.x, image.y);

      }
      this.#data.rendering = false;
      if (this.#data.timeout != null) {
        clearTimeout(this.#data.timeout);
        this.#data.timeout = null;
      }
      
    },10);
	}

  #clearImages() : void {
    if (this.#data.images.length > 0) {
      const images = this.#data.images as Array<CanvasToolImage>;
      while (images.length > 0) {
        this.#clearImage(images.pop() as CanvasToolImage)
      }
    }
  }

	#clearImage(image: CanvasToolImage) : void {
    const ctx = this.#getCtx();
    ctx.clearRect(image.x, image.y, this.#data.tileSize, this.#data.tileSize);
	}
	
}
export const CanvasTool = new CanvasToolService();
