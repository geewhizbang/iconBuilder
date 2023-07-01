<script lang="ts">

import { defineComponent } from 'vue';

export default defineComponent({
  name: "ToggleButton",
  emits: ['changeToggle'],
  setup() {

    return {
      id: "",
    };

  },
  props: {
    modelValue: {
      type: Boolean,
      required: true,
    },
    label: {
      type: String,
      default: "",
    },
    buttonClass: {
      type: String,
      default: ""
    }
  },
  computed: {
    getClass(): string {
      let result: Array<string> = [];
      if (this.modelValue) {
        result.push("on");
      }
      if (this.buttonClass.length > 0) {
        result.push(this.buttonClass);
      }
      return result.join(' ');
    }
  }
});

</script>

<template>
  <div class="toggleButton" :class="getClass">
    <label v-if="label.length > 0">{{ label }}</label>
    <div>
      <span></span>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import "../styles/_variables.scss";
  
  .toggleButton {
    width: $sizeToggleButtonWidth;
    height: auto;
    display: block;
    overflow: hidden;

    > div {
      width: 100%;
      height: $sizeToggleButtonHeight;
      background: $colorToggleButtonOffBg;
      border-radius: $sizeToggleButtonHeight * 0.5;
      padding: 3px;

      > span {
        display: block;
      }
    }
  }
</style>