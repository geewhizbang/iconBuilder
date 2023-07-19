<template v-if="state.ready">
  <div class="valueScroller" :class="{ isVert: isVert, useVw: useVw }">
    <label v-if="label != ''"
      >{{ label }}
      <span v-if="showValue"> [ {{ getValue() }} ]</span>
    </label>
    <div class="scrollBarContainer">
      <div
        v-if="hasUpDownButtons"
        class="upButton"
        ref="upButton"
        v-on:click="scrollClick(true)"
      ></div>
      <div class="scrollArea">
        <div class="relative" ref="element">
          <button
            class="scrollBarButton"
            v-on:mousedown="mouseDown"
            v-on:mouseup="mouseUp"
            ref="button"
            :style="getButtonStyle"
          />
        </div>
      </div>
      <div
        v-if="hasUpDownButtons"
        class="downButton"
        ref="downButton"
        v-on:click="scrollClick(false)"
      ></div>
    </div>
  </div>
</template>

<script lang="ts">
import { StyleValue, defineComponent, ref } from "vue";

export default defineComponent({
  name: "ScrollBar",
  emits: ["change"],
  setup(props) {
    const state = ref({
      currentValue: props.modelValue,
      startY: -1,
      startX: -1,
      inDrag: false,
      minPosition: 0,
      maxPosition: 100,
      clickedPosition: 0,
      newPosition: 0,
      time: -1,
      timer: -1,
      elementRect: new DOMRect(),
      upButtonRect: new DOMRect(),
      downButtonRect: new DOMRect(),
      buttonRect: new DOMRect(),
      min: props.minMax.min,
      max: props.minMax.max,
    });
    return {
      state: state,
    };
  },
  props: {
    isVert: {
      type: Boolean,
      default: false,
    },
    hasUpDownButtons: {
      type: Boolean,
      default: false,
    },
    modelValue: {
      type: Number,
      required: true,
    },
    minMax: {
      type: Object,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    debounceTime: {
      type: Number,
      default: 50,
    },
    showValue: {
      type: Boolean,
      default: false,
    },
    label: {
      type: String,
      default: "",
    },
    useVw: {
      type: Boolean,
      default: false,
    },
  },
  watch: {
    minMax(newVal) {
      this.state.min = newVal.min;
      this.state.max = newVal.max;
      this.init();
    },
    modelValue(newVal) {
      this.state.currentValue = newVal;
      this.init();
    },
  },
  mounted(): void {
    this.init();
  },
  computed: {
    getButtonStyle(): StyleValue {
      const value = this.getScrollPosition() + "px";
      return this.isVert
        ? {
            top: value,
          }
        : ({
            left: value,
          } as StyleValue);
    },
  },
  methods: {
    init(): void {
      this.state.inDrag = false;
      if (this.hasUpDownButtons) {
        this.state.upButtonRect = this.getRect("upButton");
        this.state.downButtonRect = this.getRect("downButton");
      }
      this.state.elementRect = this.getRect("element");
      this.state.buttonRect = this.getRect("button");
      this.state.maxPosition =
        this.getHeight(this.getRect("element")) - this.getHeight(this.state.buttonRect);
      this.state.minPosition = 0;
    },
    getHeight(x: DOMRect): number {
      return this.isVert ? x.height : x.width;
    },
    getBottom(x: DOMRect): number {
      return this.isVert ? x.bottom : x.right;
    },
    getClientY(event: MouseEvent): number {
      return this.isVert ? event.clientY : event.clientX;
    },
    getClientX(event: MouseEvent): number {
      return this.isVert ? event.clientX : event.clientY;
    },
    getTop(x: DOMRect): number {
      return this.isVert ? x.top : x.left;
    },
    getLeft(x: DOMRect): number {
      return this.isVert ? x.left : x.top;
    },
    getRect(refName: string): DOMRect {
      try {
        return (this.$refs[refName] as HTMLElement).getBoundingClientRect();
      } catch (e) {
        console.log("badRefName: " + refName);
        return new DOMRect();
      }
    },
    getValue(): number {
      const round = this.state.max < 100 ? 10 : 1;
      return Math.round(this.modelValue * round) / round;
    },
    mouseDown(): Boolean {
      this.state.inDrag = true;
      window.addEventListener("mousemove", this.mouseMove);
      window.addEventListener("mouseup", this.mouseUp);
      window.addEventListener("blur", this.mouseUp);
      return false;
    },
    scrollClick(up: Boolean) {
      this.state.newPosition += ((up ? 1 : -1) * (this.state.max - this.state.min)) / 100;
      this.moveMouse();
    },
    getScrollLength(): number {
      return this.isVert ? this.state.elementRect.height : this.state.elementRect.width;
    },
    getScrollPosition(): number {
      return (
        ((this.state.currentValue - this.state.min) / (this.state.max - this.state.min)) *
        (this.state.maxPosition - this.state.minPosition)
      );
    },
    moveMouse(): void {
      this.state.time = new Date().getTime();
      if (this.state.timer > 0) {
        window.clearTimeout(this.state.timer);
        this.state.timer = -1;
      }

      let newValue =
        ((this.state.newPosition - this.state.minPosition) /
          (this.state.maxPosition - this.state.minPosition)) *
          (this.state.max - this.state.min) +
        this.state.min;

      newValue = Math.min(this.state.max, Math.max(newValue, this.state.min));

      if (newValue != this.state.currentValue) {
        this.$emit("change", { value: newValue, name: this.name });
        this.state.currentValue = newValue;
      }
    },
    mouseMove(event: MouseEvent) {
      if (this.state.startY == -1) {
        this.state.startY = this.getClientY(event);
        this.state.startX = this.getClientX(event);
        this.state.clickedPosition = this.getScrollPosition();
        this.state.newPosition = this.state.clickedPosition;
      } else {
        let buttonPosition =
          this.state.clickedPosition + this.getClientY(event) - this.state.startY;

        buttonPosition = Math.min(
          this.state.maxPosition,
          Math.max(buttonPosition, this.state.minPosition)
        );
        this.state.newPosition = buttonPosition;
      }

      let time = new Date().getTime();
      if (time > this.state.time + this.debounceTime && this.state.timer > 0) {
        this.moveMouse();
      } else {
        this.state.timer = window.setTimeout(() => {
          this.moveMouse();
        }, this.debounceTime);
      }

      return false;
    },
    mouseUp() {
      this.state.inDrag = false;
      this.moveMouse();
      this.state.startX = -1;
      this.state.startY = -1;
      window.removeEventListener("mousemove", this.mouseMove);
      window.removeEventListener("mouseup", this.mouseUp);
    },
  },
});
</script>
