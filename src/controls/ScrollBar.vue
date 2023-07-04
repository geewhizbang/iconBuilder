<template v-if="state.ready">
  <div ref="element" :class="isVert ? 'scrollBarVert' : 'scrollBarHorz'">
    <div class="relative">
      <div class="scrollArea">
        <div class="relative">
          <button
            class="scrollBarButton"
            :style="getButtonStyle"
            v-on:mousedown="mouseDown"
            v-on:mouseup="mouseUp"
            ref="button"
          />
        </div>
      </div>
      <div class="upButton" ref="upButton" v-if="!hideUp" v-on:click="scrollClick(true)">
        <IconArrow :rotation="buttonTopDir" :disabled="false"></IconArrow>
      </div>
      <div
        class="downButton"
        ref="downButton"
        v-if="!hideDown"
        v-on:click="scrollClick(false)"
      >
        <IconArrow :rotation="buttonBottomDir" :disabled="false"></IconArrow>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { ScrollData } from "@/types/global";
import IconArrow from "../icons/IconArrow.vue";
import { StyleValue, defineComponent, inject, ref } from "vue";

export default defineComponent({
  name: "ScrollBar",
  components: {
    IconArrow,
  },
  setup(props) {
    return {
      state: ref({
        startY: -1,
        startX: -1,
        inDrag: false,
        maxPosition: 0,
        clickedPosition: 0,
        newPosition: 0,
        time: -1,
        timer: -1,
        hideUp: false,
        hideDown: false,
        upButtonRect: new DOMRect(),
        downButtonRect: new DOMRect(),
      }),
      scrollData: ref<ScrollData>(inject(props.scrollDataInject) as ScrollData),
    };
  },
  props: {
    isVert: {
      type: Boolean,
      default: false,
    },
    scrollDataInject: {
      type: String,
      default: "scrollData",
    },
    debounceTime: {
      type: Number,
      default: 50,
    },
  },
  mounted() {
    this.state.hideUp = false;
    this.state.hideDown = false;
    this.state.inDrag = false;

    this.state.upButtonRect = this.getRect("upButton");
    this.state.downButtonRect = this.getRect("downButton");
    this.state.maxPosition = this.getScrollLength();
  },
  computed: {
    buttonTopDir(): string {
      return this.isVert ? "up" : "left";
    },
    buttonBottomDir(): string {
      return this.isVert ? "down" : "right";
    },
    hideUp() {
      return this.state.inDrag || this.state.hideUp;
    },
    hideDown() {
      return this.state.inDrag || this.state.hideDown;
    },
    getButtonStyle(): StyleValue {
      let buttonStyle = {};
      if (this.isVert) {
        buttonStyle = {
          top: this.scrollData.scrollY * this.scrollData.scale + "px",
          height: this.scrollData.drawingPane.height * this.scrollData.scale + "px",
        };
      } else {
        buttonStyle = {
          left: this.scrollData.scrollX * this.scrollData.scale + "px",
          width: this.scrollData.drawingPane.width * this.scrollData.scale + "px",
        };
      }

      return buttonStyle as StyleValue;
    },
  },
  methods: {
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
    mouseDown(): Boolean {
      this.state.inDrag = true;
      window.addEventListener("mousemove", this.mouseMove);
      window.addEventListener("mouseup", this.mouseUp);
      window.addEventListener("blur", this.mouseUp);
      return false;
    },
    scrollClick(up: Boolean) {
      if (this.isVert) {
        this.scrollData.scrollY += up ? -1 : 1;
      } else {
        this.scrollData.scrollX += up ? -1 : 1;
      }
      this.moveMouse();
    },
    getScrollLength(): number {
      return this.isVert
        ? this.scrollData.scrollArea.height
        : this.scrollData.scrollArea.width;
    },
    moveMouse(): void {
      this.state.time = new Date().getTime();
      if (this.state.timer > 0) {
        window.clearTimeout(this.state.timer);
        this.state.timer = -1;
      }
      if (this.isVert) {
        this.scrollData.scrollY = this.state.newPosition;
      } else {
        this.scrollData.scrollX = this.state.newPosition;
      }

      let buttonHeight = this.getHeight(this.state.upButtonRect) + 6;
      this.state.hideUp = this.state.newPosition < buttonHeight;
      this.state.hideDown =
        this.state.newPosition > this.state.maxPosition - buttonHeight;
    },
    mouseMove(event: MouseEvent) {
      if (this.state.startY == -1) {
        this.state.startY = this.getClientY(event);
        this.state.startX = this.getClientX(event);
        this.state.clickedPosition = this.isVert
          ? this.scrollData.scrollY
          : this.scrollData.scrollX;
        this.state.newPosition = this.state.clickedPosition;
        this.state.maxPosition =
          this.getHeight(this.getRect("element")) -
          this.getHeight(this.getRect("button"));
      } else {
        let buttonPosition =
          this.state.clickedPosition + this.getClientY(event) - this.state.startY;

        buttonPosition = Math.max(buttonPosition, 0);
        buttonPosition = Math.min(this.state.maxPosition, buttonPosition);
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
