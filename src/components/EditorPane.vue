<template>
  <div class="editorPane">
    <div class="relative">
      <ModeBar />
      <div class="rulerCorner"></div>
      <div class="rulerHorz" ref="rulerHorz">
        <RulerBar />
      </div>
      <div class="rulerVert" ref="rulerVert">
        <RulerBar :isVert="true" />
      </div>
      <div class="scrollPane" ref="scrollPane">
        <div class="relative">
          <div class="drawingPane">
            <div
              class="scrollContainer"
              :style="{
                width: toPx(scrollData.scrollArea.width),
                height: toPx(scrollData.scrollArea.height),
              }"
            >
              <div
                class="drawingPage"
                :style="{
                  width: toPx(scrollData.drawingPane.width),
                  height: toPx(scrollData.drawingPane.height),
                  top: toPx(scrollData.scrollY),
                  left: toPx(scrollData.scrollX),
                }"
              >
                <DrawPane></DrawPane>
              </div>
            </div>
          </div>
          <ScrollBar :isVert="true" contentRef="content" rulerRef="rulerVert" />
          <ScrollBar
            :isVert="false"
            scrollPane="scrollPane"
            contentRef="content"
            rulerRef="rulerHorz"
          />
        </div>
      </div>
    </div>
  </div>

  <!-- <textarea v-model="getState" class="debug"></textarea> -->
</template>

<script lang="ts">
import { defineComponent, provide, ref } from "vue";
import ModeBar from "../controls/ModeBar.vue";
import RulerBar from "../controls/RulerBar.vue";
import ScrollBar from "../controls/ScrollBar.vue";
import DrawPane from "../controls/DrawPane.vue";
import { ScrollData } from "@/types/global";

export default defineComponent({
  name: "EditorView",
  components: {
    ModeBar,
    RulerBar,
    ScrollBar,
    DrawPane,
  },
  setup() {
    const scrollData = ref<ScrollData>({
      scrollArea: {
        width: 5000,
        height: 5000,
      },
      drawingPane: {
        width: 400,
        height: 400,
      },
      rulerHorz: {
        start: -100,
        end: 400,
      },
      rulerVert: {
        start: -100,
        end: 400,
      },
      majorTickWidth: 50,
      scale: 1,
      hatches: 10,
      scrollX: 400,
      scrollY: 400,
      debug: "nothing",
    } as ScrollData);

    provide("scrollData", scrollData);

    return {
      scrollData: scrollData,
    };
  },
  computed: {
    getState(): string {
      return JSON.stringify(this.scrollData, null, "  ");
    },
  },
  mounted() {
    this.resizeDrawing();
    window.addEventListener("resize", this.resizeDrawing);
  },
  onUnmounted() {
    window.removeEventListener("resize", this.resizeDrawing);
  },
  methods: {
    toPx(n: number): string {
      return n + "px";
    },
    getRect(refName: string): DOMRect {
      try {
        return (this.$refs[refName] as HTMLElement).getBoundingClientRect();
      } catch (e) {
        console.log("getRect could not find:" + refName);
        return {} as DOMRect;
      }
    },
    resizeDrawing(): void {
      let scrollPaneRect = this.getRect("scrollPane");
      let scrollPaneWidth = scrollPaneRect.width;
      let scrollPaneHeight = scrollPaneRect.height;
      let scrollDim = Math.max(scrollPaneWidth, scrollPaneHeight);

      let start = -scrollDim + this.scrollData.drawingPane.width - 200;
      let end = scrollDim + 200;
      this.scrollData.rulerHorz.start = start * this.scrollData.scale;
      this.scrollData.rulerHorz.end = end * this.scrollData.scale;
      this.scrollData.rulerVert.start = this.scrollData.rulerHorz.start;
      this.scrollData.rulerVert.end = this.scrollData.rulerHorz.end;

      this.scrollData.scrollArea.width = end - start;
      this.scrollData.scrollArea.height = end - start;

      let c = (scrollPaneWidth / 15) * this.scrollData.scale;
      let majorTickWidth = 200;
      let hatches = 4;
      if (c >= 100 && c < 200) {
        majorTickWidth = 100;
        hatches = 10;
      } else if (c >= 50) {
        majorTickWidth = 50;
        hatches = 5;
      } else if (c >= 20) {
        majorTickWidth = 20;
        hatches = 4;
      } else {
        majorTickWidth = 10;
        hatches = 10;
      }

      this.scrollData.majorTickWidth = majorTickWidth;
      this.scrollData.hatches = hatches;
    },
    round(x: number): number {
      let xAbs = Math.floor(Math.abs(x));
      return xAbs * (x < 9 ? -1 : 1);
    },
  },
});
</script>

<style lang="scss" scoped>
@import "../styles/_variables.scss";

.editorPane {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;

  .rulerHorz {
    position: absolute;
    top: 0;
    right: 0;
    left: $sizeRulerBarWidth + $sizeModeBarWidth + 2 * $sizeC;
    height: $sizeRulerBarWidth;
  }

  .rulerVert {
    position: absolute;
    top: $sizeRulerBarWidth;
    left: $sizeModeBarWidth + 2 * $sizeC;
    bottom: 0;
    width: $sizeRulerBarWidth;
  }

  .rulerCorner {
    position: absolute;
    top: 0;
    left: $sizeModeBarWidth + 2 * $sizeC;
    width: $sizeRulerBarWidth;
    height: $sizeRulerBarWidth;
    background: $colorRulerBg;
  }

  .scrollPane {
    position: absolute;
    top: $sizeRulerBarWidth;
    left: $sizeModeBarWidth + 2 * $sizeC + $sizeRulerBarWidth;
    bottom: 0;
    right: 0;
    overflow: hidden;

    .scrollContainer {
      width: 100%;
      height: 100%;
      position: relative;

      > .drawingPage {
        background: white;
        position: absolute;
      }
    }
  }

  .drawingPane {
    background-color: $colorDrawingBgA;
    background-image: radial-gradient($colorDrawingBgB, $colorDrawingBgA);
    left: 0;
    right: $sizeScrollBarWidth;
    bottom: $sizeScrollBarWidth;
    top: 0;
    position: absolute;
  }
}
</style>
