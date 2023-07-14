<template>
  <div class="paletteBuilder">
    <div class="templateColors" role="list">
      <div class="templateGroup">
        <h2>Template Colors</h2>
        <div v-for="(color, key) in colors" :key="key" class="colorGroup">
          <div class="parent">
            <div
              class="colorSwatch"
              role="button"
              aria-label="Edit Color"
              :class="{ selected: 'template.' + key == state.selectedColorPath }"
              v-on:click="selectColor(['template', key])"
            >
              <div
                :style="{ background: color.color }"
                class="centerLabel"
                :class="{ white: isDark(color) }"
              >
                <label class="label"> {{ color.name }}<br /> </label>
                <label class="hoverLabel">
                  {{ color.label }}
                </label>
              </div>
            </div>
          </div>
          <div class="children">
            <div class="row">
              <div
                v-for="(childColor, childIndex) in color.sChildren"
                :key="key + '.' + childColor.name"
                class="childSwatch"
              >
                <div
                  :class="{
                    selected: key + '.sColor.' + childIndex == state.selectedColorPath,
                  }"
                  v-on:click="selectColor([key, 'sColor', childIndex])"
                  class="colorSwatch"
                  role="button"
                  aria-label="Edit Color"
                >
                  <div :style="{ background: childColor.color }">
                    <label class="hoverLabel">{{ childColor.name }}</label>
                  </div>
                </div>
              </div>
            </div>
            <div class="row">
              <div
                v-for="(childColor, childIndex) in color.lvChildren"
                :key="key + '.' + childColor.name"
                class="childSwatch"
              >
                <div
                  class="colorSwatch"
                  :class="{
                    selected: key + '.lColor.' + childIndex == state.selectedColorPath,
                  }"
                  v-on:click="selectColor([key, 'lColor', childIndex])"
                  role="button"
                  aria-label="Edit Color"
                >
                  <div :style="{ background: childColor.color }">
                    <label class="hoverLabel">{{ childColor.name }}</label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="templateGroup">
        <h2>Alternate Colors</h2>
        <div v-for="(color, key) in altColors" :key="key" class="altColors">
          <div class="parent">
            <div
              class="colorSwatch"
              role="button"
              aria-label="Edit Color"
              :style="{ background: color.color }"
              :class="{ selected: 'altColor.' + key == state.selectedColorPath }"
              v-on:click="selectColor(['altColor', key])"
            >
              <div class="centerLabel">
                <label class="label" :class="{ white: color.hslColor.l < 0.45 }">
                  {{ color.name }}<br />
                </label>
                <label class="hoverLabel">
                  Hue: {{ Math.round(color.hslColor.h * 100) / 100 }}
                </label>
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
        <AccordionPane panelName="colorWheel" aria-label="Create Color Scheme">
          <template v-slot:header>
            <h2>Create Color Scheme</h2>
          </template>
          <template v-slot:content>
            <div class="accordionContents">
              <label>
                <template v-if="wheel.templateMode"
                  >Drag handles to select colors</template
                >
                <template v-if="!wheel.templateMode"
                  >Drag to select Alternate Color hues</template
                >
              </label>
              <div class="wheelContainer">
                <div class="wheelInterface">
                  <canvas
                    :width="wheel.size"
                    :height="wheel.size"
                    ref="canvasElement"
                    aria-label="Color Wheel"
                    role="img"
                  ></canvas>
                </div>
                <div class="wheelInterface">
                  <svg
                    ref="wheelInterface"
                    viewBox="0 0 400 400"
                    aria-label="Color Wheel SVG"
                    role="img"
                  >
                    <path
                      class="overlay"
                      d="M0 0l400 0 0 400 -400 0 0 -400zm200 7c107,0 193,86 193,193 0,107 -86,193 -193,193 -107,0 -193,-86 -193,-193 0,-107 86,-193 193,-193zm0 42c83,0 151,67 151,151 0,83 -67,151 -151,151 -83,0 -151,-67 -151,-151 0,-83 67,-151 151,-151z"
                    ></path>
                    <g v-if="wheel.templateMode">
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
                      <circle class="ab" :cx="wheel.sideA.x" :cy="wheel.sideA.y" r="14" />
                      <circle class="ab" :cx="wheel.sideB.x" :cy="wheel.sideB.y" r="14" />
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
                      <line
                        class="lineAB"
                        :x1="wheel.sideA.x"
                        :y1="wheel.sideA.y"
                        :x2="wheel.sideB.x"
                        :y2="wheel.sideB.y"
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
                        :cx="wheel.sideA.x"
                        :cy="wheel.sideA.y"
                        r="11"
                        :style="{ fill: colors.sideA.color }"
                      />
                      <circle
                        :cx="wheel.sideB.x"
                        :cy="wheel.sideB.y"
                        r="11"
                        :style="{ fill: colors.sideB.color }"
                      />
                      <circle
                        class="centerTop"
                        :cx="wheel.center.x"
                        :cy="wheel.center.y"
                        r="7"
                      />
                    </g>
                    <g v-if="!wheel.templateMode">
                      <circle
                        class="center"
                        :cx="wheel.center.x"
                        :cy="wheel.center.y"
                        r="11"
                      />
                      <template v-for="(color, key) in altWheel" :key="key">
                        <line
                          class="lineBase"
                          :x1="wheel.center.x"
                          :y1="wheel.center.y"
                          :x2="color.x"
                          :y2="color.y"
                        />
                        <circle
                          class="ab"
                          :cx="color.x"
                          :cy="color.y"
                          r="15"
                          :style="{ fill: altColors[key].color }"
                          v-on:mouseenter="altMouseEnter('')"
                          v-on:mousedown="mouseDown"
                          v-on:mouseup="mouseUp"
                        />
                      </template>
                    </g>
                  </svg>
                </div>
              </div>
            </div>
            <div class="wheelAdjust" v-if="wheel.templateMode">
              <template v-if="state.hslMode">
                <ValueScroller
                  :model-value="wheel.hsl.s"
                  :minValue="0.2"
                  :maxValue="0.95"
                  label="Saturation"
                  v-on:change="change"
                  name="wheelS"
                  :showValue="true"
                  :useVw="true"
                  aria-label="Saturation"
                />
                <ValueScroller
                  :model-value="wheel.hsl.l"
                  :minValue="0.2"
                  :maxValue="0.85"
                  label="Lightness"
                  v-on:change="change"
                  name="wheelL"
                  :showValue="true"
                  :useVw="true"
                  aria-label="Lightness"
                />
              </template>
              <template v-else>
                <ValueScroller
                  :model-value="wheel.hsv.s"
                  :minValue="0"
                  :maxValue="1"
                  label="Saturation"
                  v-on:change="change"
                  name="wheelS"
                  :showValue="true"
                  :useVw="true"
                  aria-label="Saturation"
                />
                <ValueScroller
                  :model-value="wheel.hsv.v"
                  :minValue="0"
                  :maxValue="1"
                  label="Value"
                  v-on:change="change"
                  name="wheelV"
                  :showValue="true"
                  :useVw="true"
                  aria-label="Value"
                />
              </template>
              <ValueScroller
                :model-value="wheel.splitAngle"
                :minValue="wheel.minSplit"
                :maxValue="wheel.maxSplit"
                label="Split Angle"
                v-on:change="change"
                name="wheelSplitAngle"
                :showValue="true"
                :useVw="true"
                aria-label="Split Angle"
              />
            </div>
            <div class="wheelAdjust" v-if="!wheel.templateMode">
              <template v-if="state.hslMode">
                <ValueScroller
                  :model-value="altColors[state.selectedAltColor].hslColor.s"
                  :minValue="0.2"
                  :maxValue="0.95"
                  label="Saturation"
                  v-on:change="changeAlt"
                  name="altS"
                  :showValue="true"
                  :useVw="true"
                  aria-label="Saturation"
                />
                <ValueScroller
                  :model-value="altColors[state.selectedAltColor].hslColor.l"
                  :minValue="0.2"
                  :maxValue="0.85"
                  label="Lightness"
                  v-on:change="changeAlt"
                  name="altL"
                  :showValue="true"
                  :useVw="true"
                  aria-label="Lightness"
                />
              </template>
              <template v-else>
                <ValueScroller
                  :model-value="altColors[state.selectedAltColor].hsvColor.s"
                  :minValue="0"
                  :maxValue="1"
                  label="Saturation"
                  v-on:change="changeAlt"
                  name="altS"
                  :showValue="true"
                  :useVw="true"
                  aria-label="Saturation"
                />
                <ValueScroller
                  :model-value="altColors[state.selectedAltColor].hsvColor.v"
                  :minValue="0"
                  :maxValue="1"
                  label="Value"
                  v-on:change="changeAlt"
                  name="altV"
                  :showValue="true"
                  :useVw="true"
                  aria-label="Value"
                />
              </template>
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
    <HeaderControl>
      <template v-slot:onLeft>
        <p>{{ colors.base.hsvColor }}</p>
        <p>{{ colors.base.hslColor }}</p>
      </template>
      <template v-slot:onRight>
        <div class="stateButtons">
          <StateSelector
            state-selector-inject="editMode"
            label="Color Edit Mode"
            :active-state="wheel.templateMode ? 'template' : 'alt'"
            v-on:change="editModeChange"
          />
          <StateSelector
            state-selector-inject="colorState"
            label="Color Mode"
            :active-state="state.hslMode ? 'hslMode' : 'hsvMode'"
            v-on:change="modeChange"
          />
        </div>
      </template>
    </HeaderControl>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, provide} from 'vue';
import { ColorConverter } from '../services/ColorConverter';
import { CanvasTool } from '../services/CanvasTool';
import ValueScroller from '../controls/ValueScroller.vue';
import AccordionControl from '../controls/AccordionControl.vue';
import AccordionPane from '../controls/AccordionPane.vue';
import HeaderControl from '../controls/HeaderControl.vue';
import StateSelector, { type ModeChange, type StateSelectorData } from '../controls/StateSelector.vue';

import { ChangeValue, type HslColor, type HsvColor, type RgbColor } from '../types/global';

// import axios from "axios";

interface TemplateColor {
  name: string,
  label: string,
  color: string
  hslColor: HslColor,
  hsvColor: HsvColor,
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
  sideA: XY;
  sideB: XY;
  splitAngle: number;
  hueAngleHsv: number;
  hueAngleHsl: number;
  hsl: {
    l: number,
    s: number,
  },
  hsv: {
    v: number,
    s: number,
  },
  size: number,
  innerRadius: number,
  outerRadius: number,
  tileSize: number,
  timeout: NodeJS.Timeout | null,
  minSplit: number,
  maxSplit: number,
  templateMode: boolean,
}

interface AltWheel {
  [key: string] : XY;
}

interface TemplateColorParent extends TemplateColor {
  sChildren: Array<TemplateColor>;
  lvChildren: Array<TemplateColor>;
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
    HeaderControl,
    StateSelector
  },

  setup() {

    const baseColorHsl = ColorConverter.RgbToHsl({ r: 33, g: 212, b: 235 } as RgbColor);
    const baseColorHsv = ColorConverter.RgbToHsv({ r: 33, g: 212, b: 235 } as RgbColor);

    const red = { r: 255, g: 0, b: 0 };

    const altColors: {[key: string]: TemplateColor } = {
      red: {
        name: 'Warning Color',
        label: "",
        hslColor: ColorConverter.RgbToHsl(red),
        hsvColor: ColorConverter.RgbToHsv(red),
        color: ColorConverter.RGBtoString(red),
      },
    }

    const colors: TemplateColors = {};

    const colorsMap: {[key: string] : string} = {
      baseA: 'Split A',
      base: 'Base Color',
      baseB:'Split B',
      compA: 'Comp Split A',
      comp: 'Complimentary',
      compB: 'Comp Split B',
      sideA: 'Side A',
      sideB: 'Side B'
    };

    Object.keys(colorsMap).forEach(key => {
      colors[key] = {
        name: colorsMap[key],
        label: "",
        hslColor: { h: 0.5, s: 0.5, l: 0.5 },
        hsvColor: { h: 30, s: 0.5, v: 0.9},
        color: '',
        sChildren: [],
        lvChildren: [],
      };
    });

    colors.base.hsvColor = baseColorHsv;
    colors.base.hslColor = baseColorHsl;

    const altWheel: AltWheel = {};

    let wheel: Wheel = {
      templateMode: true,
      size: 400,
      timeout: null,
      splitAngle: 20,
      hueAngleHsl: baseColorHsl.h * 360,
      hueAngleHsv: baseColorHsv.h,
      hsl: {
        l: baseColorHsl.l,
        s: baseColorHsl.s,
      },
      hsv: {
        v: baseColorHsv.v,
        s: baseColorHsv.s,
      },
      innerRadius: 0.748,
      outerRadius: 0.975,
      tileSize: 20,
      minSplit: 10,
      maxSplit: 36,
      center: {x: 200, y:200},
      comp: {x: 0, y:0},
      base: {x: 0, y:0},
      a: {x: 0, y:0},
      b: {x: 0, y:0},
      baseA: {x: 0, y:0},
      baseB: {x: 0, y:0},
      sideA: {x: 0, y:0},
      sideB: {x: 0, y:0},
    };

    const wheelDrag = {
      timer: -1,
      time: -1,
      colorTime: -1,
      inDrag: false,
      debounce: 5,
      colorDebounce: 300,
      splitAngle: -1,
      hueAngle: -1,
      colorName: "",
      newAngle: -1,
      altKey: '',
    };

    const colorState: StateSelectorData = {
      disabled: false,
      states: {
        hslMode: {
          label: "HSL Mode",
        },
        hsvMode: {
          label: "HSV Mode",
        }
      }
    }

    provide("colorState", colorState);

    const editMode: StateSelectorData = {
      disabled: false,
      states: {
        template: {
          label: "Template",
        },
        alt: {
          label: "Alternate",
        }
      }
    }

    provide("editMode", editMode);

    return {
      state: ref({
        selectedColorPath: '',
        selectedAltColor: '',
        hslMode: true,
      }),
      wheelDrag: ref(wheelDrag),
      colors: ref(colors),
      colorState: ref(colorState),
      editMode: ref(editMode),
      altColors: ref(altColors),
      wheel: ref(wheel),
      altWheel: ref(altWheel),
    }
  },
  props: {
    template: {
      type: String,
      default: 'rgb'
    }
  },
  mounted() {
    this.wheel.hueAngleHsl = this.colors.base.hslColor.h * 360
    this.wheel.hueAngleHsv = this.colors.base.hsvColor.h
    this.buildColors();
    this.calculateWheel();

    this.buildAltWheel();
    this.initCanvas();
    window.addEventListener("resize", this.initCanvas);
  },
  onUnmounted() {
    window.removeEventListener("resize", this.initCanvas);
  },
  methods: {
    modeChange(value: ModeChange) {
      let newValue = (value.value == 'hslMode');
      if (newValue !== this.state.hslMode) {
        this.state.hslMode = newValue;
        this.wheel.hueAngleHsl = this.colors.base.hslColor.h * 360
        this.wheel.hueAngleHsv = this.colors.base.hsvColor.h
        this.buildColors();
      }
    },
    editModeChange(value: ModeChange) {
      this.wheel.templateMode = (value.value == 'template');
    },
    mouseDown(): Boolean {
      this.wheelDrag.inDrag = true;
      this.wheelDrag.time = new Date().getTime();
      this.wheelDrag.colorTime = this.wheelDrag.time;
      this.wheelDrag.splitAngle = this.wheel.splitAngle;
      this.wheelDrag.hueAngle = this.state.hslMode ? this.wheel.hueAngleHsl : this.wheel.hueAngleHsv;
      window.addEventListener("mousemove", this.mouseMove);
      window.addEventListener("mouseup", this.mouseUp);
      window.addEventListener("blur", this.mouseUp);
      return false;
    },
    modalAngle(x: number) {
      while (x < 0) {
        x+= 360;
      }
      return Math.round(x % 360);
    },
    calculateAngle(xD: number, yD: number): number {
      let angle = Math.atan2(yD, xD);
      return this.modalAngle(angle / Math.PI * 180);
    },
    mouseMove(event: MouseEvent) {

      const wheelRect = (this.$refs['canvasElement'] as HTMLCanvasElement).getBoundingClientRect();
      const xCenter = wheelRect.left + wheelRect.width / 2;
      const yCenter = wheelRect.top + wheelRect.height / 2;
      const xD = event.clientX - xCenter;
      const yD = event.clientY - yCenter;

      const newAngle = this.calculateAngle(xD, yD);
      this.wheelDrag.newAngle = newAngle;
      const hueAngle = this.state.hslMode ? this.wheel.hueAngleHsl : this.wheel.hueAngleHsv;

      switch (this.wheelDrag.colorName) {

        case "compA":
          this.setWheelDragSplitAngle(this.modalAngle( newAngle - (hueAngle + 180)));
          break;
        case "compB":
          this.setWheelDragSplitAngle(this.modalAngle( hueAngle + 180 - newAngle));
          break;
        case "baseA":
          this.setWheelDragSplitAngle(this.modalAngle(newAngle - hueAngle));
          break;
        case "baseB":
          this.setWheelDragSplitAngle(this.modalAngle(hueAngle - newAngle));
          break;
        case "base":
          this.wheelDrag.hueAngle = newAngle;
          break;
        case "alt":
          this.altColors[this.state.selectedAltColor].hslColor.h = newAngle/360;
          this.altColors[this.state.selectedAltColor].color = ColorConverter.RGBtoString(
            ColorConverter.HslToRgb(this.altColors[this.state.selectedAltColor].hslColor)
          );
          this.altWheel[this.state.selectedAltColor] = this.getWheelPos(newAngle, 0.75);
          break;
      }

      let time = new Date().getTime();
      if (time > this.wheelDrag.time + this.wheelDrag.debounce) {
        this.moveMouse();
      }

      if (time > this.wheelDrag.colorTime + this.wheelDrag.colorDebounce) {
        this.colors.base.hslColor.h = this.wheel.hueAngleHsl / 360;
        this.colors.base.hsvColor.h = this.wheel.hueAngleHsv;
        this.buildColors();
      }
      return false;
    },
    setWheelDragSplitAngle(newAngle : number) {
      let angle = Math.max(this.wheel.minSplit, Math.min(this.wheel.maxSplit, newAngle));
      this.wheelDrag.splitAngle = angle;
    },
    mouseEnter(colorName: string) : void {
      if (!this.wheelDrag.inDrag) {
        this.wheelDrag.colorName = colorName;
      }
    },
    altMouseEnter(altKey: string) : void {
      if (!this.wheelDrag.inDrag) {
        this.wheelDrag.colorName = "alt";
        this.state.selectedAltColor = altKey;
        this.state.selectedColorPath = "alt." + altKey;
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
      if (this.state.hslMode) {
        this.wheel.hueAngleHsl = this.wheelDrag.hueAngle;
      }
      else {
        this.wheel.hueAngleHsv = this.wheelDrag.hueAngle;
      }
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
        CanvasTool.drawImages(
          (this.state.hslMode ? this.wheel.hsl.l : this.wheel.hsv.v),
          (this.state.hslMode ? this.wheel.hsl.s : this.wheel.hsv.s),
          this.state.hslMode
        );
        this.clearWheelTimeout();
      }, 100);
    },
    calculateWheel(): void {
      const angle = this.state.hslMode ? this.wheel.hueAngleHsl : this.wheel.hueAngleHsv;
      console.log(angle)
      this.wheel.base = this.getWheelPos(angle, 0.97);
      this.wheel.comp = this.getWheelPos((angle + 180) % 360, 0.75);
      this.wheel.baseA = this.getWheelPos((angle + this.wheel.splitAngle) % 360, 0.75);
      this.wheel.baseB = this.getWheelPos((angle + 360 - this.wheel.splitAngle) % 360, 0.75);
      this.wheel.sideA = this.getWheelPos((angle + 90) % 360, 0.75);
      this.wheel.sideB = this.getWheelPos((angle + 360 - 90) % 360, 0.75);
      this.wheel.a = this.getWheelPos((angle + this.wheel.splitAngle + 180) % 360, 0.75);
      this.wheel.b = this.getWheelPos((angle - this.wheel.splitAngle + 180) % 360, 0.75);
      console.log(JSON.stringify(this.wheel.base, null, '  '));
    },
    buildAltWheel(): void {
      Object.keys(this.altColors).forEach((key) => {
        this.altWheel[key] = this.getWheelPos(this.altColors[key].hslColor.h * 360, 0.75);
        this.altColors[key].color = ColorConverter.RGBtoString(
          ColorConverter.HslToRgb(this.altColors[key].hslColor)
        );
      })
    },
    buildColors(): void {

      const colorProps = [
        { prop: 'base', offset: 0 },
        { prop: 'baseA', offset: this.wheel.splitAngle },
        { prop: 'baseB', offset: -this.wheel.splitAngle },
        { prop: 'comp', offset: 180 },
        { prop: 'compA', offset: this.wheel.splitAngle + 180},
        { prop: 'compB', offset: -this.wheel.splitAngle + 180},
        { prop: 'sideA', offset: 90 },
        { prop: 'sideB', offset: 180 + 90 }
      ];

      const hslColor = this.colors.base.hslColor;
      for (const colorProp of colorProps) {
        this.colors[colorProp.prop].hslColor = ColorConverter.GetHslOffsetColor(hslColor, (360 + colorProp.offset) % 360);
        if (this.state.hslMode) {
          this.colors[colorProp.prop].color = ColorConverter.RGBtoString(
            ColorConverter.HslToRgb(this.colors[colorProp.prop].hslColor)
          );
          this.colors[colorProp.prop].label = "h:" + hslColor.h + " s:" + hslColor.s + " l:" + hslColor.l;
        }
      }

      const hsvColor = this.colors.base.hsvColor;
      for (const colorProp of colorProps) {
        this.colors[colorProp.prop].hsvColor = ColorConverter.GetHsvOffsetColor(
        hsvColor, (360 + colorProp.offset) % 360);
        if (!this.state.hslMode) {
          this.colors[colorProp.prop].color = ColorConverter.RGBtoString(
            ColorConverter.HsvToRgb(this.colors[colorProp.prop].hsvColor)
          );
          this.colors[colorProp.prop].label =
            "h:" + Math.round(hsvColor.h) +
            " s:" + (Math.round(hsvColor.s * 100) / 100) +
            " v:" + (Math.round(hsvColor.v * 100) / 100);
        }
      }

      this.wheel.hueAngleHsl = this.colors.base.hslColor.h * 360;
      this.wheel.hueAngleHsv = this.colors.base.hslColor.h;
      this.calculateWheel();
      Object.keys(this.colors).forEach(color => {
        let satChildren: Array<TemplateColor> = [];
        let lightChildren: Array<TemplateColor> = [];

        const satValues = [1, 0.84, 0.7, 0.63, 0.57, 0.5, 0.45, 0.37, 0.31, 0.22, 0.16, 0.1];
        const lValues = [0.92, 0.85, 0.78, 0.69, 0.64, 0.56, 0.48, 0.43, 0.35, 0.28, 0.18, 0.1];
        const vValues = [1, 0.85, 0.78, 0.69, 0.64, 0.56, 0.48, 0.43, 0.35, 0.28, 0.18, 0.01];

        satValues.forEach(sat => {
          const childColorHsl = this.colors[color].hslColor;
          const childColorHsv = this.colors[color].hsvColor;
          const hslColor = { h: childColorHsl.h, s: sat, l: childColorHsl.l };
          const hsvColor = { h: childColorHsl.h, s: sat, v: childColorHsv.v };
          const child = {
            name: "Saturation: " + Math.round(sat * 100) / 100,
            color: ColorConverter.RGBtoString(ColorConverter.HslToRgb(hslColor)),
            hslColor: hslColor,
            hsvColor: hsvColor,
          } as TemplateColor;
          satChildren.push(child);
        });

        lValues.forEach((lightness, index) => {
          const value = vValues[index];
          const childColorHsl = this.colors[color].hslColor;
          const childColorHsv = this.colors[color].hsvColor;
          const hslColor = { h: childColorHsl.h, s: childColorHsl.s, l: lightness };
          const hsvColor = { h: childColorHsv.h, s: childColorHsv.s, v: value };
          const rgbColor = (this.state.hslMode ?
            ColorConverter.RGBtoString(ColorConverter.HslToRgb(hslColor)) :
            ColorConverter.RGBtoString(ColorConverter.HsvToRgb(hsvColor))
          ) as string;

          const label = (this.state.hslMode ?
            "Lightness: " + Math.round(lightness * 100) / 100 :
            "Value: " + Math.round(value * 100) / 100
          ) as string;

          const child = {
            name: label,
            color: rgbColor,
            hslColor: hslColor,
            hsvColor: hsvColor,
          } as TemplateColor;
          lightChildren.push(child);
        });

        this.colors[color].lvChildren = lightChildren;
        this.colors[color].sChildren = satChildren;

      });

    },
    getWheelPos(angle: number, length: number): XY {
      const radians = (angle / 180) * Math.PI;
      const radius = this.wheel.center.y * length;
      return {
        x: Math.cos(radians) * radius + this.wheel.center.x,
        y: Math.sin(radians) * radius + this.wheel.center.y
      } as XY
    },
    changeAlt(a: ChangeValue) {
      const altColor = this.altColors[this.state.selectedAltColor].hslColor;
      switch (a.name) {
        case 'altL':
          altColor.l = a.value;
          break;
        case 'altS':
          altColor.s = a.value;
          break;
      }
      this.altColors[this.state.selectedAltColor].color = ColorConverter.RGBtoString(
        ColorConverter.HslToRgb(this.altColors[this.state.selectedAltColor].hslColor)
      );
      CanvasTool.drawImages(altColor.l, altColor.s, this.state.hslMode);
    },
    change(a: ChangeValue) {
      switch (a.name) {
        case 'wheelL':
          this.wheel.hsl.l = a.value;
          CanvasTool.drawImages(this.wheel.hsl.l, this.wheel.hsl.s, this.state.hslMode);
          break;
        case 'wheelV':
          this.wheel.hsv.v = a.value;
          CanvasTool.drawImages(this.wheel.hsv.v, this.wheel.hsv.s, false);
          break;
        case 'wheelS':
          this.wheel[this.state.hslMode ? 'hsl' : 'hsv'].s = a.value;
          CanvasTool.drawImages(
            (this.state.hslMode ? this.wheel.hsl.l : this.wheel.hsv.v),
            (this.state.hslMode ? this.wheel.hsl : this.wheel.hsv).s,
            this.state.hslMode
          );
          break;
        case 'wheelSplitAngle': {
          this.wheel.splitAngle = a.value;
          break;
        }
      }

      this.colors.base.hslColor = { h: this.wheel.hueAngleHsl / 360, s: this.wheel.hsl.s, l: this.wheel.hsl.l } as HslColor;
      this.colors.base.hsvColor = { h: this.wheel.hueAngleHsv, s: this.wheel.hsv.s, v: this.wheel.hsv.v } as HsvColor;

      this.buildColors();
    },
    selectColor(path: Array<string | number>) {
      this.state.selectedColorPath = path.join('.');
      const templateMode = path[0] != 'altColor';
      if (templateMode) {
        CanvasTool.drawImages(
          this.state.hslMode ? this.wheel.hsl.l : this.wheel.hsv.v,
          (this.state.hslMode ? this.wheel.hsl : this.wheel.hsv).s,
          this.state.hslMode
        )
      } else {
        this.state.selectedAltColor = path[1].toString();
        const color = this.altColors[this.state.selectedAltColor];
        CanvasTool.drawImages(
          this.state.hslMode ? color.hslColor.l : color.hsvColor.v,
          (this.state.hslMode ? color.hslColor : color.hsvColor).s,
          this.state.hslMode);
      }
      this.wheel.templateMode = templateMode;
    },
    isDark(color: TemplateColor) : boolean {
      if (this.state.hslMode) {
        return color.hslColor.l < 0.45
      }
      return color.hsvColor.v < 20;
    }
  }
})
</script>
<style lang="scss" scoped>
@import "../styles/_variables.scss";

$boxWidth: 5.95vw;
$boxHeight: 4vw;
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

  .templateGroup {
    height: auto;
    width: 100%;

    h2 {
      padding: 0 0 0.3 * $vwFontBase 0;
      margin: 0;
      font-size: 1.4 * $vwFontBase;
      line-height: 1.6 * $vwFontBase;
    }

    + .templateGroup {
      margin-top: $medPad;
    }
  }

  .centerLabel {
    width: 100%;
    height: 100%;
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

    .colorSwatch {
      width: $boxWidth;
      height: $boxHeight;
      position: relative;

      &::before {
        content: "";
        display: block;
        position: absolute;
        left: calc(50% - 0.2vw);
        width: 0.4vw;
        height: 0.4vw;
        top: -0.3vw;
        background: $colorGrayDark;
        transform: rotate(45deg);
        opacity: 0;
        transition: all 0.5s;
      }

      .hoverLabel {
        position: absolute;
        top: -1vw;
        height: auto;
        border-radius: 0.2vw;
        line-height: 0.3 * $vwFontBase;
        padding: 0.35vw 0.5vw;
        background: $colorGrayDark;
        color: white;
        opacity: 0;
        transition: all 0.5s;
        font-size: 0.85 * $vwFontBase;
        display: block;
      }

      &:hover {
        &::before {
          opacity: 1;
        }

        .hoverLabel {
          opacity: 1;
        }
      }

      &.selected {
        border: 1px solid $colorGrayDark;
      }

      &:hover {
        border: 2px solid $colorGrayMedDark;
      }
    }

    .colorGroup {
      width: calc(100% - $medPad);
      padding: 0;
      height: $boxHeight;
      display: flex;
      flex-direction: row;
      align-items: stretch;

      .parent {
        width: $boxWidth;
        height: auto;
        flex-grow: 1;
      }

      > .children {
        width: calc(100% - $boxWidth);
        height: 100%;
        display: flex;
        flex-direction: column;
        flex-grow: 12;
        align-items: stretch;

        > .row {
          height: $boxHeight * 0.5;
          width: 100%;
          display: flex;
          flex-direction: row;

          > .childSwatch {
            width: $boxWidth;
            height: 100%;
            position: relative;
            overflow: visible;
            display: block;
            flex-grow: 1;

            > .colorSwatch {
              height: 100%;
              flex-grow: 1;

              > div {
                width: 100%;
                height: 100%;
              }

              &::before {
                content: "";
                display: block;
                position: absolute;
                left: calc(50% - 0.2vw);
                width: 0.4vw;
                height: 0.4vw;
                top: -0.4vw;
                background: $colorGrayDark;
                transform: rotate(45deg);
                opacity: 0;
                transition: all 0.5s;
              }

              .hoverLabel {
                position: absolute;
                top: -1.1vw;
                height: auto;
                border-radius: 0.2vw;
                line-height: 0.3 * $vwFontBase;
                padding: 0.35vw 0.5vw;
                background: $colorGrayDark;
                color: white;
                opacity: 0;
                transition: all 0.5s;
                font-size: 0.85 * $vwFontBase;
                display: block;
              }

              &:hover {
                &::before {
                  opacity: 1;
                }

                .hoverLabel {
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

.stateButtons {
  width: 400px;
  height: 100%;
  display: flex;
  justify-content: space-between;
}
</style>
