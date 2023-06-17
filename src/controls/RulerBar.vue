<template>
  <div class="rulerBar" :class="{ vert: isVert }">
    <div class="ruler" :style="getStyle">
      <template v-for="n in getCount" :key="n">
        <div :style="getTickStyle(n)" class="major">
          <div class="relative">
            <span :class="{ 'hideLabel': hideLabel(n) }">{{ getText(n)}}</span>
            <template v-if="scrollData.hatches == 4">
              <div class="h4">
                <span></span>
                <span></span>
                <span class="m"></span>
                <span></span>
              </div>
            </template>
            <template v-if="scrollData.hatches == 5">
              <div class="h5">
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
              </div>
            </template>
            <template v-if="scrollData.hatches == 10">
              <div class="h10">
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span class="m"></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
              </div>
            </template>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>
 
<script lang="ts">
import { ScrollData, ScrollRuler } from "@/global";
import { defineComponent, ref, type StyleValue, inject } from 'vue';

export default defineComponent({
  name: 'RulerBar',
  setup(props) {
    const data = {
      actualStart: -100,
      count: 0,
    }

    return {
      data: ref(data),
      scrollData: ref<ScrollData>(inject(props.scrollDataInject) as ScrollData),
    }
  },
  props: {
    isVert: {
      type: Boolean,
      default: false
    },
    scrollDataInject: {
      type: String,
      default: "scrollData"
    }
  },
  mounted() {
    this.init()    
  },
  methods: {
    init() {
      setTimeout(() => {
        let start = this.getRulerProps().start; 
        let actualStart = 
          Math.floor(Math.abs(start) / this.scrollData.majorTickWidth) *
          this.scrollData.majorTickWidth * (start < 0 ? -1 : 1);
        this.data.actualStart = actualStart;

        this.data.count = this.getCount;
      }, 100);
      
    },
    
    getRect(refName: string): DOMRect {
      
      try {
        return (this.$refs[refName] as HTMLElement).getBoundingClientRect();
      } catch (e) {
        console.log('badRefName: ' + refName);
        return new DOMRect();
      }
    },
    getText(n: number): string {
      return (this.scrollData.majorTickWidth * n + this.data.actualStart).toString();
    },
    getHeight(x: DOMRect): number {
      return this.isVert ? x.height : x.width;
    },
    getScrollLength(): number {
      return this.isVert ? this.scrollData.scrollArea.height : this.scrollData.scrollArea.width;
    },
    getTickStyle(n: number): StyleValue {
      let pos = this.scrollData.majorTickWidth * n * this.scrollData.scale + 'px';
      let size = this.scrollData.majorTickWidth * this.scrollData.scale + 'px'
    
      return this.isVert
        ? { height: size, top: pos } as StyleValue
        : { width: size, left: pos } as StyleValue;
    },
    hideLabel(n : number) : boolean {
      let pos = this.scrollData.majorTickWidth * n * this.scrollData.scale;      
      let scroll = this.getScroll();
      return pos + this.data.actualStart + scroll < 20;
    },
    getRulerProps(): ScrollRuler {
      return this.isVert ? this.scrollData.rulerVert : this.scrollData.rulerHorz;
    },
    getScroll() : number {
      return this.isVert ? this.scrollData.scrollY : this.scrollData.scrollX;
    },
  },
  computed: {
    getCount() : number {
      let rulerProps = this.getRulerProps();
      let count = Math.floor((rulerProps.end - rulerProps.start) / this.scrollData.majorTickWidth);
      return count;
    },
    getStyle(): StyleValue {
      let pos = (this.getScroll() + this.data.actualStart) * this.scrollData.scale + 'px';
      let size = this.getScrollLength() + 'px';
      
      return this.isVert ? {height: size, top: pos} as StyleValue : { width: size, left: pos} as StyleValue;
    },
  }
})
</script>

<style lang="scss" scoped>
@import '../styles/variables.scss';

.rulerBar {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;

  .ruler {
    position: absolute;
    height: $sizeRulerBarWidth;
    top: 0;
    left: 0;
    right: 0;
    width: 3000;

    > .major {
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 100%;
      overflow: visible;

      > .relative {
        > span {
          width: 30px;
          height: 12px;
          left: -15px;
          font-size: $sizeRulerFont;
          position: absolute;
          top: 0;
          left: -15px;
          text-align: center;
          transition: opacity 0.2s ease-in-out;

          &.hideLabel {
            opacity: 0;
          }
        }

        .h4, .h5, .h10 {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 40%;
          display: flex;

          > span {
            flex: 1;
            display: block;
            height: 100%;
            width: 0;
            box-sizing: border-box;
            position: relative;
            overflow: visible;

            &::before {
              content: '';
              position: absolute;
              top: 50%;
              left: 0;
              height: 50%;
              width: 1.2px;
              display: block;
              background: $colorRulerTick;
            }

            &:first-child::before {
              top: 0;
              width: 1.2px;
              height: 100%;
            }
          }
        }

        > .h4 > span.m::before {
          height: 100%;
        }
      }

      > .h10 > span:m::before {
        height: 100%;
      }
    }
  }
}

.rulerBar.vert {
  .ruler {
    width: $sizeRulerBarWidth;
    height: 0;
    top: 0;
    left: 0;

    > .major {
      top: 50px;
      left: 0;
      right: 0;
      bottom: auto;
      height: 50px;
      width: 100%;

      > .relative {
        > span {
          top: -5px;
          left: -10px;
          transform: rotate(-90deg);
        }

        .h4, .h5, .h10 {
          bottom: 0;
          left: auto;
          right: 0;
          top: 0;
          width: 40%;
          height: auto;
          flex-direction: column;

          > span {
            width: 100%;
            height: auto;
            &::before {
              height: 1.2px;
              width: 50%;
              right: 0;
              bottom: auto;
              top: 0;
              left: auto;
            }
            
            &:first-child::before {
              width: 100%;
            }
          }
        }
        > .h4 > span.m::before {
          width: 100%;
        }
        > .h10 > span.m::before {
          width: 100%;
        }
      }
    }
  }
}
</style>
