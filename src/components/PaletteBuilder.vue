<template>
  <div class="paletteBuilder">
    <div class="templateColors">
      <div v-for="(color, key) in colors" :key="key" class="colorGroup">
        <div class="parent">
          <div class="colorSwatch" v-on:click="editColor(key.toString())">
            <div :style="{ background: color.color }">
              <label class="label" :class="{ white: color.hslColor.l < 0.45 }">{{
                color.name
              }}</label>
            </div>
          </div>
        </div>
        <div class="children">
          <div class="row">
            <div
              v-for="(childColor, index) in color.sChildren"
              :key="key + '.' + childColor.name"
            >
              <div
                :class="{
                  selected: key + '.' + childColor.name == state.currentColorKey,
                }"
                class="colorSwatch"
                v-on:click="editColor(key + '.' + index)"
              >
                <div :style="{ background: childColor.color }">
                  <label class="label">{{ childColor.name }}</label>
                </div>
              </div>
            </div>
          </div>
          <div class="row">
            <div
              v-for="(childColor, index) in color.lChildren"
              :key="key + '.' + childColor.name"
            >
              <div
                :class="{
                  selected: key + '.' + childColor.name == state.currentColorKey,
                }"
                class="colorSwatch"
                v-on:click="editColor(key + '.' + index)"
              >
                <div :style="{ background: childColor.color }">
                  <label class="label">{{ childColor.name }}</label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="sidePanel useVw">
      <AccordionControl
        :config="{
          colorWheel: { open: true, disabled: false },
          colorMixer: { open: false, disabled: false },
          colorSelector: { open: false, disabled: true },
        }"
      >
        <AccordionPane panelName="colorWheel">
          <template v-slot:header>
            <h2>Create Color Scheme</h2>
          </template>
          <template v-slot:content>
            <div class="accordionContents">
              <label>Click wheel to select Base Color</label>
              <div class="wheelContainer">
                <div class="wheelInterface">
                  <canvas
                    :width="wheel.size"
                    :height="wheel.size"
                    ref="canvasElement"
                  ></canvas>
                </div>
                <div class="wheelInterface">
                  <svg ref="wheelInterface" viewBox="0 0 400 400">
                    <path
                      class="overlay"
                      d="M0 0l400 0 0 400 -400 0 0 -400zm200 7c107,0 193,86 193,193 0,107 -86,193 -193,193 -107,0 -193,-86 -193,-193 0,-107 86,-193 193,-193zm0 42c83,0 151,67 151,151 0,83 -67,151 -151,151 -83,0 -151,-67 -151,-151 0,-83 67,-151 151,-151z"
                    ></path>
                    <circle
                      class="center"
                      :cx="wheel.center.x"
                      :cy="wheel.center.y"
                      r="11"
                    />
                    <circle
                      class="outerCircle"
                      :cx="wheel.base.x"
                      :cy="wheel.base.y"
                      r="23"
                    />
                    <circle class="ab" :cx="wheel.a.x" :cy="wheel.a.y" r="14" />
                    <circle class="ab" :cx="wheel.b.x" :cy="wheel.b.y" r="14" />
                    <circle class="ab" :cx="wheel.baseA.x" :cy="wheel.baseA.y" r="14" />
                    <circle class="ab" :cx="wheel.baseB.x" :cy="wheel.baseB.y" r="14" />
                    <circle
                      class="outerCircle"
                      :cx="wheel.comp.x"
                      :cy="wheel.comp.y"
                      r="14"
                    />
                    <line
                      class="lineBase"
                      :x1="wheel.center.x"
                      :y1="wheel.center.y"
                      :x2="wheel.base.x"
                      :y2="wheel.base.y"
                    />
                    <line
                      class="lineBase"
                      :x1="wheel.center.x"
                      :y1="wheel.center.y"
                      :x2="wheel.comp.x"
                      :y2="wheel.comp.y"
                    />
                    <line
                      class="lineAB"
                      :x1="wheel.center.x"
                      :y1="wheel.center.y"
                      :x2="wheel.a.x"
                      :y2="wheel.a.y"
                    />
                    <line
                      class="lineAB"
                      :x1="wheel.center.x"
                      :y1="wheel.center.y"
                      :x2="wheel.b.x"
                      :y2="wheel.b.y"
                    />
                    <line
                      class="lineAB"
                      :x1="wheel.center.x"
                      :y1="wheel.center.y"
                      :x2="wheel.baseA.x"
                      :y2="wheel.baseA.y"
                    />
                    <line
                      class="lineAB"
                      :x1="wheel.center.x"
                      :y1="wheel.center.y"
                      :x2="wheel.baseB.x"
                      :y2="wheel.baseB.y"
                    />
                    <circle
                      :cx="wheel.base.x"
                      :cy="wheel.base.y"
                      class="angle"
                      r="19"
                      :style="{ fill: colors.base.color }"
                      v-on:mouseenter="mouseEnter('base')"
                      v-on:mousedown="mouseDown"
                      v-on:mouseup="mouseUp"
                    />
                    <circle
                      :cx="wheel.a.x"
                      :cy="wheel.a.y"
                      class="angle"
                      r="11"
                      :style="{ fill: colors.compA.color }"
                      v-on:mouseenter="mouseEnter('compA')"
                      v-on:mousedown="mouseDown"
                      v-on:mouseup="mouseUp"
                    />
                    <circle
                      :cx="wheel.b.x"
                      :cy="wheel.b.y"
                      class="angle"
                      r="11"
                      :style="{ fill: colors.compB.color }"
                      v-on:mouseenter="mouseEnter('compB')"
                      v-on:mousedown="mouseDown"
                      v-on:mouseup="mouseUp"
                    />
                    <circle
                      class="angle"
                      :cx="wheel.baseA.x"
                      :cy="wheel.baseA.y"
                      :style="{ fill: colors.baseA.color }"
                      r="11"
                      v-on:mouseenter="mouseEnter('baseA')"
                      v-on:mousedown="mouseDown"
                      v-on:mouseup="mouseUp"
                    />
                    <circle
                      :cx="wheel.baseB.x"
                      :cy="wheel.baseB.y"
                      class="angle"
                      r="11"
                      :style="{ fill: colors.baseB.color }"
                      v-on:mouseenter="mouseEnter('baseB')"
                      v-on:mousedown="mouseDown"
                      v-on:mouseup="mouseUp"
                    />
                    <circle
                      :cx="wheel.comp.x"
                      :cy="wheel.comp.y"
                      r="11"
                      :style="{ fill: colors.comp.color }"
                    />
                    <circle
                      class="centerTop"
                      :cx="wheel.center.x"
                      :cy="wheel.center.y"
                      r="7"
                    />
                  </svg>
                </div>
              </div>
            </div>
            <div class="wheelAdjust">
              <ValueScroller
                :model-value="wheel.s"
                :minValue="0.2"
                :maxValue="0.95"
                label="Wheel Saturation"
                v-on:change="change"
                name="wheelS"
                :showValue="true"
                :useVw="true"
              />
              <ValueScroller
                :model-value="wheel.l"
                :minValue="0.2"
                :maxValue="0.85"
                label="Wheel Lightness"
                v-on:change="change"
                name="wheelL"
                :showValue="true"
                :useVw="true"
              />
              <ValueScroller
                :model-value="wheel.splitAngle"
                :minValue="wheel.minSplit"
                :maxValue="wheel.maxSplit"
                label="Split Angle"
                v-on:change="change"
                name="wheelSplitAngle"
                :showValue="true"
                :useVw="true"
              />
            </div>
          </template>
        </AccordionPane>
        <AccordionPane panelName="colorMixer">
          <template v-slot:header>
            <h2>Color Mixer</h2>
          </template>
          <template v-slot:content>
            <div class="accordionContents">
              <label>Drag Colors from right screen</label>
              <div></div>
            </div>
          </template>
        </AccordionPane>
        <AccordionPane panelName="colorSelector">
          <template v-slot:header>
            <h2>Assign / Select colors</h2>
          </template>
          <template v-slot:content>
            <h1>Stuff here</h1>
          </template>
        </AccordionPane>
      </AccordionControl>
    </div>
  </div>
  <!-- <textarea class="debug" v-model="getDebug"></textarea> -->
</template>

<script lang="ts">
import { defineComponent, ref} from 'vue';
import { ColorConverter } from '../services/ColorConverter';
import { CanvasTool } from '../services/CanvasTool';
import ValueScroller from '../controls/ValueScroller.vue';
import AccordionControl from '../controls/AccordionControl.vue';
import AccordionPane from '../controls/AccordionPane.vue';

import { ChangeValue, type HslColor, type RgbColor } from '../types/global'

// import axios from "axios";

interface TemplateColor {
  name: string
  color: string
  hslColor: HslColor
}

interface XY {
  x: number
  y: number
}

interface Wheel {
  center: XY
  comp: XY;
  base: XY;
  a: XY;
  b: XY;
  baseA: XY;
  baseB: XY;
  splitAngle: number;
  hueAngle: number;
  l: number,
  s: number,
  size: number,
  innerRadius: number,
  outerRadius: number,
  tileSize: number,
  timeout: NodeJS.Timeout | null,
  minSplit: number,
  maxSplit: number,
}

interface TemplateColorParent extends TemplateColor {
  sChildren: Array<TemplateColor>;
  lChildren: Array<TemplateColor>;
}

interface TemplateColors {
  [key: string]: TemplateColorParent;
}

export default defineComponent({
  name: 'PaletteBuilder',
  components: {
    ValueScroller,
    AccordionControl,
    AccordionPane,
  },

  setup() {

    const baseColorHSL = ColorConverter.RgbToHSL({ r: 71, g: 212, b: 235 } as RgbColor);

    const colors: TemplateColors = {
      baseA: {
        name: 'Split A',
        hslColor: { h: 0, s: 0, l: 1 },
        color: '',
        sChildren: [],
        lChildren: [],
      },
      base: {
        name: 'Base Color',
        hslColor: baseColorHSL,
        color: '',
        sChildren: [],
        lChildren: [],
      },
      baseB: {
        name: 'Split B',
        hslColor: { h: 0, s: 0, l: 1 },
        color: '',
        sChildren: [],
        lChildren: [],
      },
      compA: {
        name: 'Comp Split A',
        hslColor: { h: 0, s: 0, l: 1 },
        color: '',
        sChildren: [],
        lChildren: [],
      },
      comp: {
        name: 'Complimentary',
        hslColor: { h: 50, s: 0, l: 1 },
        color: '',
        sChildren: [],
        lChildren: [],
      },
      compB: {
        name: 'Comp Split B',
        hslColor: { h: 0, s: 0, l: 1 },
        color: '',
        sChildren: [],
        lChildren: [],
      },
    }

    const wheel: Wheel = {
      center: {
        x: 200,
        y: 200,
      },
      comp: {
        x: 140,
        y: 340
      },
      base: {
        x: 255,
        y: 33
      },
      a: {
        x: 40,
        y: 270
      },
      b: {
        x: 240,
        y: 370
      },
      baseA: {
        x: 40,
        y: 270
      },
      baseB: {
        x: 240,
        y: 370
      },
      size: 400,
      timeout: null,
      splitAngle: 20,
      hueAngle: baseColorHSL.h * 360,
      l: baseColorHSL.l,
      s: baseColorHSL.s,
      innerRadius: 0.73,
      outerRadius: 1,
      tileSize: 20,
      minSplit: 10,
      maxSplit: 60,
    }

    const wheelDrag = {
      timer: -1,
      time: -1,
      colorTime: -1,
      inDrag: false,
      debounce: 10,
      colorDebounce: 500,
      splitAngle: -1,
      hueAngle: -1,
      colorName: "",
    };

    let definedColors: { [key: string]: boolean } = {}
    Object.keys(colors).forEach((key: string) => {
      definedColors[key] = false;
    })

    return {
      state: ref({
        currentColorKey: 'base',
        currentColor: { h: 0.5, s: 0.95, l: 0.5 } as HslColor,
        definedColors: definedColors,
        tempColor: ColorConverter.HslToRgb(ColorConverter.HexToHSL('#CCCCFF')),
        lightDark: 1,
      }),
      wheelDrag: wheelDrag,
      colors: ref(colors),
      wheel: ref(wheel),
    }
  },
  computed: {
    getState(): string {
      return (
        'state = ' +
        JSON.stringify(this.state, null, '  ') +
        '\n\ncolors = ' +
        JSON.stringify(this.colors, null, '  ') +
        '\n\nprops = ' +
        JSON.stringify(this.$props, null, '  ') +
        '\n\nwheel = ' +
        JSON.stringify(this.wheel, null, '  ') +
        '\n\nCanvasToolData = ' + CanvasTool.getData()
      );
    },
  },
  props: {
    template: {
      type: String,
      default: 'rgb'
    }
  },
  mounted() {
    this.buildColors();
    this.initCanvas();
    this.calculateWheel();
    window.addEventListener("resize", this.initCanvas);
  },
  onUnmounted() {
    window.removeEventListener("resize", this.initCanvas);
  },
  methods: {
    mouseDown(): Boolean {
      this.wheelDrag.inDrag = true;
      this.wheelDrag.time = new Date().getTime();
      this.wheelDrag.colorTime = this.wheelDrag.time;
      this.wheelDrag.splitAngle = this.wheel.splitAngle;
      this.wheelDrag.hueAngle = this.wheel.hueAngle;
      window.addEventListener("mousemove", this.mouseMove);
      window.addEventListener("mouseup", this.mouseUp);
      window.addEventListener("blur", this.mouseUp);
      return false;
    },
    modalAngle(x: number) {
      while (x < 0) {
        x+= 360;
      }
      return x % 360;
    },
    calculateAngle(xD: number, yD: number): number {
      let angle = (Math.abs(xD) < 0.000000001 ? 0 : Math.atan(xD / yD));
      if (yD >= 0) {
        angle += Math.PI;
      }
      return angle / Math.PI * 180;
    },
    mouseMove(event: MouseEvent) {

      const wheelRect = (this.$refs['canvasElement'] as HTMLCanvasElement).getBoundingClientRect();
      const xCenter = wheelRect.left + wheelRect.width / 2;
      const yCenter = wheelRect.top + wheelRect.height / 2;
      const xD = event.clientX - xCenter;
      const yD = event.clientY - yCenter;

      const newAngle = this.calculateAngle(xD, yD);
      console.log(JSON.stringify({ xC: xCenter, yC: yCenter, xD: xD, yD: yD, newAngle: newAngle}, null, '  '));

      switch (this.wheelDrag.colorName) {

        case "compA":
        case "compB":
          this.setWheelDragSplitAngle(this.modalAngle( Math.abs((this.wheel.hueAngle - 180) - newAngle)));
          break;

        case "baseA":
        case "baseB":
          this.setWheelDragSplitAngle(this.modalAngle(Math.abs(this.wheel.hueAngle - newAngle)));
          break;

        case "base":
          this.wheelDrag.hueAngle = newAngle;
          break;
      }

      let time = new Date().getTime();
      if (time > this.wheelDrag.time + this.wheelDrag.debounce) {
        this.moveMouse();
      } else {
        this.wheelDrag.timer = window.setTimeout(() => {
          this.moveMouse();
        }, this.wheelDrag.debounce);
      }

      if (time > this.wheelDrag.colorTime + this.wheelDrag.colorDebounce) {
        this.colors.base.hslColor.h = this.wheel.hueAngle / 360;
        this.buildColors();
      }

      return false;
    },
    setWheelDragSplitAngle(newAngle : number) {
      this.wheelDrag.splitAngle = Math.max(this.wheel.minSplit, Math.min(this.wheel.maxSplit, newAngle));
    },
    mouseEnter(colorName: string) : void {
      if (!this.wheelDrag.inDrag) {
        this.wheelDrag.colorName = colorName;
      }
    },
    mouseUp() {
      this.moveMouse();
      window.removeEventListener("mousemove", this.mouseMove);
      window.removeEventListener("mouseup", this.mouseUp);
      setTimeout(() =>{
        this.wheelDrag.inDrag = false;
        this.buildColors();
      }, 200);
    },
    moveMouse(): void {
      this.wheelDrag.time = new Date().getTime();
      if (this.wheelDrag.timer > 0) {
        window.clearTimeout(this.wheelDrag.timer);
        this.wheelDrag.timer = -1;
      }
      this.wheel.splitAngle = this.wheelDrag.splitAngle;
      this.wheel.hueAngle = this.wheelDrag.hueAngle;
      this.calculateWheel();
    },
    clearWheelTimeout() {
      if (this.wheel.timeout != null) {
        clearTimeout(this.wheel.timeout);
        this.wheel.timeout = null;
      }
    },
    initCanvas() {
      this.clearWheelTimeout();
      this.wheel.timeout = setTimeout(() => {
        const canvasRect = (this.$refs["wheelInterface"] as HTMLElement).getBoundingClientRect();
        this.wheel.size = Math.floor(canvasRect.width);
        CanvasTool.init(this.$refs["canvasElement"] as HTMLCanvasElement, this.wheel.innerRadius, this.wheel.outerRadius, this.wheel.tileSize);
        CanvasTool.drawImages(this.wheel.l, this.wheel.s);
        this.clearWheelTimeout();
      }, 100);
    },
    calculateWheel(): void {
      const angle = this.wheel.hueAngle;
      this.wheel.base = this.getWheelPos((angle + 180) % 360, true);
      const splitAngle = angle % 360;
      this.wheel.comp = this.getWheelPos(splitAngle, false);
      const angleA = splitAngle + this.wheel.splitAngle;
      const angleB = splitAngle - this.wheel.splitAngle;
      this.wheel.a = this.getWheelPos(angleA, false);
      this.wheel.b = this.getWheelPos(angleB, false);
      this.wheel.baseA = this.getWheelPos((angleA + 180) % 360, false);
      this.wheel.baseB = this.getWheelPos((angleB + 180) % 360, false);
    },
    buildColors(): void {
      const hslColor = this.colors.base.hslColor;
      this.colors.base.color = ColorConverter.RGBtoString(ColorConverter.HslToRgb(hslColor))
      this.colors.comp.hslColor = ColorConverter.GetHslOffsetColor(hslColor, 180)
      this.colors.comp.color = ColorConverter.RGBtoString(
        ColorConverter.HslToRgb(this.colors.comp.hslColor)
      );
      this.colors.compA.hslColor = ColorConverter.GetHslOffsetColor(
        this.colors.comp.hslColor,
        this.wheel.splitAngle
      );
      this.colors.compA.color = ColorConverter.RGBtoString(
        ColorConverter.HslToRgb(this.colors.compA.hslColor)
      );
      this.colors.baseA.hslColor = ColorConverter.GetHslOffsetColor(this.colors.compA.hslColor, 180);
      this.colors.baseA.color = ColorConverter.RGBtoString(
        ColorConverter.HslToRgb(this.colors.baseA.hslColor)
      );

      this.colors.compB.hslColor = ColorConverter.GetHslOffsetColor(
        this.colors.comp.hslColor,
        -this.wheel.splitAngle
      );
      this.colors.compB.color = ColorConverter.RGBtoString(
        ColorConverter.HslToRgb(this.colors.compB.hslColor)
      );

      this.colors.baseB.hslColor = ColorConverter.GetHslOffsetColor(this.colors.compB.hslColor, 180);
      this.colors.baseB.color = ColorConverter.RGBtoString(
        ColorConverter.HslToRgb(this.colors.baseB.hslColor)
      );

      this.wheel.hueAngle = this.colors.base.hslColor.h * 360;
      this.calculateWheel();
      Object.keys(this.colors).forEach(color => {
        let satChildren: Array<TemplateColor> = [];
        let lightChildren: Array<TemplateColor> = [];

        const satValues = [1, 0.84, 0.7, 0.63, 0.57, 0.5, 0.45, 0.37, 0.31, 0.22, 0.16, 0.1];
        const lValues = [0.92, 0.85, 0.78, 0.69, 0.64, 0.56, 0.48, 0.43, 0.35, 0.28, 0.18, 0.1];

        satValues.forEach(sat => {
          const childColor = this.colors[color].hslColor;
          const hslColor = { h: childColor.h, s: sat, l: Math.min(0.6, Math.max(0.4, childColor.l)) };
          const child = {
            name: "Saturation: " + Math.round(sat * 100) / 100,
            color: ColorConverter.RGBtoString(ColorConverter.HslToRgb(hslColor)),
            hslColor: hslColor,
          } as TemplateColor;
          satChildren.push(child);
        });

        lValues.forEach(lightness => {
          const childColor = this.colors[color].hslColor;
          const hslColor = { h: childColor.h, s: childColor.s, l: lightness };

          const child = {
            name: "Lightness: " + Math.round(lightness * 100) / 100,
            color: ColorConverter.RGBtoString(ColorConverter.HslToRgb(hslColor)),
            hslColor: hslColor,
          } as TemplateColor;
          lightChildren.push(child);
        });

        this.colors[color].lChildren = lightChildren;
        this.colors[color].sChildren = satChildren;

      });
    },
    getWheelPos(angle: number, isBase: boolean): XY {
      const radians = (angle / 180) * Math.PI
      const radius = this.wheel.center.y * (isBase ? 0.97 : 0.75);
      return {
        x: Math.sin(radians) * radius + this.wheel.center.x,
        y: Math.cos(radians) * radius + this.wheel.center.y
      } as XY
    },
    hasColor(colorKey: string) {
      return this.state.definedColors[colorKey]
    },
    change(a: ChangeValue) {
      switch (a.name) {
        case 'h':
          this.state.currentColor.h = a.value;
          break;
        case 's':
          this.state.currentColor.s = a.value;
          break;
        case 'l':
          this.state.currentColor.l = a.value;
          break;
        case 'wheelL':
          this.wheel.l = a.value;
          CanvasTool.drawImages(this.wheel.l, this.wheel.s);
          break;
        case 'wheelS':
          this.wheel.s = a.value;
          CanvasTool.drawImages(this.wheel.l, this.wheel.s);
          break;
        case 'wheelSplitAngle': {
          this.wheel.splitAngle = a.value;
          break;
        }
      }

      this.state.definedColors[this.state.currentColorKey] = true
      this.colors.base.hslColor = { h: this.wheel.hueAngle / 360, s: this.wheel.s, l: this.wheel.l } as HslColor;
      this.buildColors();
    },
    editColor(key: string) {
      this.state.currentColorKey = key
      this.state.currentColor = this.colors[key].hslColor
    },
    // blockWheelClick(blocked: boolean): void {
    //   this.wheel.blockClick = this.wheelDrag.inDrag || blocked;
    // }

  }
})
</script>
<style lang="scss" scoped>
@import "../styles/_variables.scss";

$boxSize: 5.95vw;
$panelWidth: 21vw;
$sizeLeftPanel: 18vw;
$smallPad: 0.2vw;
$largePad: 1vw;
$rowMargin: $smallPad;
$medPad: $largePad * 0.66;
$horzSpacing: math.div($largePad, 3);
$wheelPad: 1.4vw;

.hslPicker {
  position: absolute;
  right: 0;
  top: 0;
  height: auto;
  overflow: hidden;
  width: $panelWidth + 2 * $wheelPad;
}

.paletteBuilder {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;

  .templateColors {
    right: 0;
    top: 0;
    bottom: 0;
    left: $panelWidth;
    padding: $largePad;
    position: absolute;
    width: auto;

    &::before {
      content: "";
      display: block;
      position: absolute;
      width: 3px;
      left: 0;
      top: 0;
      bottom: 0;
      background: $gradientVerticalFadeDown;
    }

    .colorGroup {
      width: calc(100% - $medPad);
      padding: 0;
      height: $boxSize + $rowMargin;
      display: flex;
      flex-direction: row;

      * {
        border: 1$medPad solid magenta;
      }

      .parent {
        width: $boxSize + $horzSpacing;
        height: auto;
      }

      .colorSwatch {
        width: $boxSize;
        height: $boxSize;
        border-radius: $vwFontBase * 0.9;
        padding: $smallPad;
        border: 1px solid transparent;

        &.selected {
          border: 1px solid $colorGray;
        }

        &:hover {
          border: 1px solid $colorGrayLight;
        }

        > div {
          width: 100%;
          height: 100%;
          border-radius: $vwFontBase * 0.7;
          display: flex;
          justify-content: center;
          align-items: center;

          .label {
            display: block;
            box-sizing: border-box;
            height: $medPad;
            line-height: $vwFontBase;
            font-size: 0.86 * $vwFontBase;
            text-align: center;
            font-weight: 700;

            &.white {
              color: white;
            }
          }
        }
      }

      > .children {
        width: calc(100% - $boxSize);
        height: 100%;
        display: flex;
        flex-direction: column;

        > .row {
          height: $boxSize * 0.5;
          width: 100%;
          display: flex;
          flex-direction: row;

          > div {
            height: 100%;
            position: relative;
            overflow: visible;

            > .colorSwatch {
              height: 100%;

              &::before {
                content: "";
                display: block;
                position: absolute;
                left: calc(50% - 0.2vw);
                width: 0.4vw;
                height: 0.4vw;
                top: -0.2vw;
                background: $colorGrayDark;
                transform: rotate(45deg);
                opacity: 0;
                transition: all 0.5s;
              }

              label {
                position: absolute;
                top: -0.9vw;
                height: 0.95vw;
                border-radius: 0.2vw;
                line-height: 0.3 * $vwFontBase;
                padding: 0.35vw 0.5vw;
                background: $colorGrayDark;
                color: white;
                opacity: 0;
                transition: all 0.5s;
              }

              &:hover {
                &::before {
                  opacity: 1;
                }

                label {
                  opacity: 1;
                }
              }
            }
          }
        }
      }
    }
  }

  .sidePanel {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    width: $panelWidth;
    overflow-y: auto;
  }

  .accordionContents {
    width: $sizeLeftPanel;
    margin-left: calc((100% - $sizeLeftPanel) / 2);
    height: $sizeLeftPanel;
    padding-top: 1vw;
    margin-bottom: 50px;

    > label {
      text-align: center;
      display: block;
      width: 100%;
      margin-bottom: 1vw;
      font-size: $vwFontBase * 1.4;
    }

    > .wheelContainer {
      position: relative;
      width: 100%;
      overflow: visible;
      height: auto;
    }

    .wheelInterface {
      width: $sizeLeftPanel;
      height: $sizeLeftPanel;
      position: absolute;
      top: 0;
      left: 0;
      overflow: visible;

      > canvas {
        width: 100%;
        height: 100%;
      }

      > svg {
        width: 100%;
        height: 100%;
        overflow: visible;
        user-select: none;

        * {
          stroke: none;
        }

        .overlay {
          stroke: none;
          fill: white;
        }

        .lineAB {
          stroke-width: 3px;
          stroke: $colorGray;
        }

        .lineBase {
          stroke-width: 5px;
          stroke: $colorGrayMedium;
        }

        .center {
          fill: $colorGrayMedium;
        }

        .centerTop {
          fill: $colorGray;
        }

        .outerCircle {
          fill: $colorGrayMedium;
          stroke-width: 1px;
          stroke: white;
        }

        .angle:hover {
          cursor: pointer;
        }

        .ab {
          stroke: none;
          fill: $colorGray;
          stroke-width: 1px;
          stroke: white;
        }

        .mainComp {
          stroke: $colorBase;
          stroke-width: 4px;
        }
      }
    }
  }

  .wheelAdjust {
    width: 100%;
    padding: 2vw 3vw 0.7vw 3vw;
    height: auto;
  }
}
</style>
