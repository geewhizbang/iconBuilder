import type { RgbColor, HslColor, HsvColor, ModelColor } from '@/types/global'

class ColorConverterService {
  HexToRgb(hex: string): RgbColor {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)

    if (!result) {
      throw new Error('Could not parse Hex Color')
    }

    return {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16),
    }
  }

  luminance(rgb: RgbColor) : number {

    const RsRGB = rgb.r / 255;
    const GsRGB = rgb.g / 255;
    const  BsRGB = rgb.b / 255;

    const R = (RsRGB <= 0.03928) ? RsRGB/12.92 : Math.pow((RsRGB+0.055)/1.055, 2.4);
    const G = (GsRGB <= 0.03928) ? GsRGB/12.92 : Math.pow((GsRGB+0.055)/1.055, 2.4);
    const B = (BsRGB <= 0.03928) ? BsRGB/12.92 : Math.pow((BsRGB+0.055)/1.055, 2.4);

    const L = 0.2126 * R + 0.7152 * G + 0.0722 * B;
    return L;
  }

  #HueToRgb(p: number, q: number, t: number): number {
    if (t < 0) t += 1
    if (t > 1) t -= 1
    if (t < 1 / 6) return p + (q - p) * 6 * t
    if (t < 1 / 2) return q
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6
    return p
  }

  RgbToHsl(color: RgbColor): HslColor {
    const r = (color.r /= 255)
    const g = (color.g /= 255)
    const b = (color.b /= 255)

    const l = Math.max(r, g, b)
    const s = l - Math.min(r, g, b)
    const h = s ? (l === r ? (g - b) / s : l === g ? 2 + (b - r) / s : 4 + (r - g) / s) : 0
    return {
      h: (60 * h < 0 ? 60 * h + 360 : 60 * h) / 360,
      s: s ? (l <= 0.5 ? s / (2 * l - s) : s / (2 - (2 * l - s))) : 0,
      l: (2 * l - s) / 2
    }
  }

  HsvToRgb(hsv: HsvColor) : RgbColor {
    const h = hsv.h;
    const s = hsv.s;
    const v = hsv.v;

    let r = 0;
    let g = 0;
    let b = 0;
    
    const i = Math.floor(h * 6);
    const f = h * 6 - i;
    const p = v * (1 - s);
    const q = v * (1 - f * s);
    const t = v * (1 - (1 - f) * s);

    switch (i % 6) {
      case 0: r = v; g = t; b = p; break;
      case 1: r = q; g = v; b = p; break;
      case 2: r = p; g = v; b = t; break;
      case 3: r = p; g = q; b = v; break;
      case 4: r = t; g = p; b = v; break;
      case 5: r = v; g = p; b = q; break;
    }
    const result = {r: Math.round(r * 255), g: Math.round(g * 255), b: Math.round(b * 255)};
    return result;
  }

  HslToRgb(hsl: HslColor): RgbColor {
    let r: number;
    let g: number;
    let b: number;

    const h = hsl.h;
    const s = hsl.s;
    const l = hsl.l;

    if (s == 0) {
      r = g = b = l // achromatic
    } else {
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      r = this.#HueToRgb(p, q, h + 1 / 3);
      g = this.#HueToRgb(p, q, h);
      b = this.#HueToRgb(p, q, h - 1 / 3);
     }

     return { r: Math.round(r * 255), g: Math.round(g * 255), b: Math.round(b * 255) };
  }

  RgbToHsv(rgb: RgbColor) : HsvColor {
    const r = rgb.r / 255;
    const g = rgb.g / 255;
    const b = rgb.b / 255;
  
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0;
    let s = 0;
    const v = max;
  
    const d = max - min;
    s = max == 0 ? 0 : d / max;
  
    if (max == min) {
      h = 0; // achromatic
    } else {
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }
  
    const hsv = { h: h, s: s, v: v };
    return hsv;
  }  

  RgbToModel(rgb: RgbColor, hslMode: boolean) : ModelColor {
    if (hslMode) {
      const hsl = this.RgbToHsl(rgb);
      return {h: hsl.h, s: hsl.s, lOrV: hsl.l };
    } 
    const hsv = this.RgbToHsv(rgb);
    return {h: hsv.h, s: hsv.s, lOrV: hsv.v };
  }

  #ToRgbParam(x: number): string {
    const result = Math.round(x).toString(16).split('.')[0];
    return (result.length == 1 ? '0' : '') + result;
  }

  RGBtoString(rgb: RgbColor): string {
    const result: Array<string> = ['#'];
    result.push(this.#ToRgbParam(rgb.r));
    result.push(this.#ToRgbParam(rgb.g));
    result.push(this.#ToRgbParam(rgb.b));

    return result.join('');
  }

  ModelToRgb( color: ModelColor, isHsl: boolean) : RgbColor {
    return isHsl ? 
      this.HslToRgb( {h: color.h, s: color.s, l: color.lOrV }) :
      this.HsvToRgb( {h: color.h, s: color.s, v: color.lOrV })
  }
}

const ColorConverter = new ColorConverterService()

export { ColorConverter }
