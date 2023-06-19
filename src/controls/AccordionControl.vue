<template>
  <div class="accordionControl" ref="panel">
    <slot></slot>
  </div>
</template>

<script lang="ts">

import type {AccordionConfig } from '@/types/global';
import { defineComponent, type PropType } from 'vue';
import { AccordionService } from '../services/AccordionService';

export default defineComponent({
  name: "AccordionControl",
  setup() {

    return {
      id: "",
    };

  },
  mounted() {
    setTimeout(() => {
      this.id = AccordionService.registerParent(
        this.config, this.isVert, this.allOpen, this.$refs["panel"] as HTMLElement);
      window.addEventListener("resize", this.resize);
    }, 1);

  },
  unmounted() {
    window.removeEventListener("resize", this.resize);
    AccordionService.clear(this.id);
  },
  methods: {
    resize() : void {
      AccordionService.resize(this.id);
    }
  },
  props: {
    config: {
      type: Object as PropType<AccordionConfig>,
      required: true,
    },
    isVert: {
      type: Boolean,
      default: false,
    },
    allOpen: {
      type: Boolean,
      default: false,
    }
  },
});
</script>
