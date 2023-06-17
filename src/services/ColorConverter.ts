import type { RgbColor, HslColor } from '@/types/global'

class ColorConverterService {
  HexToHSL(hex: string): HslColor {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)

    if (!result) {
      throw new Error('Could not parse Hex Color');
    }

    const rHex = parseInt(result[1], 16);
    const gHex = parseInt(result[2], 16);
    const bHex = parseInt(result[3], 16);

    const r = rHex / 255;
    const g = gHex / 255;
    const b = bHex / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
		const maxMin2 = (max + min) / 2;
    let h = maxMin2;
    let s = maxMin2;
    let l = maxMin2;

    if (max === min) {
      // Achromatic
      return { h: 0, s: 0, l }
    }

    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0)
        break
      case g:
        h = (b - r) / d + 2
        break
      case b:
        h = (r - g) / d + 4
        break
    }
    h /= 6

    s = s * 100;
    s = Math.round(s);
    l = l * 100;
    l = Math.round(l);
    h = Math.round(360 * h);
		
		const hsl = { h: h / 360, s: s / 100, l: l / 100 };
    return hsl;
  }

  #HueToRgb(p: number, q: number, t: number): number {
    if (t < 0) t += 1
    if (t > 1) t -= 1
    if (t < 1 / 6) return p + (q - p) * 6 * t
    if (t < 1 / 2) return q
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6
    return p
  }

  RgbToHSL(color: RgbColor): HslColor {
    const r = color.r /= 255;
    const g = color.g /= 255;
    const b = color.b /= 255;
    
    const l = Math.max(r, g, b);
    const s = l - Math.min(r, g, b);
    const h = s
      ? l === r
        ? (g - b) / s
        : l === g
        ? 2 + (b - r) / s
        : 4 + (r - g) / s
      : 0;
    return {
      h: (60 * h < 0 ? 60 * h + 360 : 60 * h) / 360,
      s: (s ? (l <= 0.5 ? s / (2 * l - s) : s / (2 - (2 * l - s))) : 0),
      l: (2 * l - s) / 2,
    };
  };

  HslToRgb(hsl: HslColor): RgbColor {
    let r: number
    let g: number
    let b: number

    const h = hsl.h
    const s = hsl.s
    const l = hsl.l

    if (s == 0) {
      r = g = b = l // achromatic
    } else {
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s
      const p = 2 * l - q
      r = this.#HueToRgb(p, q, h + 1 / 3)
      g = this.#HueToRgb(p, q, h)
      b = this.#HueToRgb(p, q, h - 1 / 3)
    }

    return { r: Math.round(r * 255), g: Math.round(g * 255), b: Math.round(b * 255) }
  }

  #ToRgbParam(x: number): string {
    const result = Math.round(x).toString(16).split('.')[0]
    return (result.length == 1 ? '0' : '') + result
  }

  RGBtoString(rgb: RgbColor): string {
    const result: Array<string> = ['#']
    result.push(this.#ToRgbParam(rgb.r))
    result.push(this.#ToRgbParam(rgb.g))
    result.push(this.#ToRgbParam(rgb.b))

    return result.join('')
  }

  GetHslOffsetColor(color: HslColor, degrees: number): HslColor {
    let h = ((color.h * 360 + degrees) % 360);
    if (h < 0) {
      h = 360 + h;
    }
    const value = h / 360;
    return {h: value, s: color.s, l: color.l } as HslColor
  }
}

const ColorConverter = new ColorConverterService()

export { ColorConverter }
