<template>
  <div class="accordionControl" ref="panel">
    <slot></slot>
  </div>
</template>

<script lang="ts">

import type {AccordionState, AccordionData} from '@/types/global';
import { defineComponent, type PropType, ref } from 'vue';
import { AccordionService } from '../services/AccordionService';

export default defineComponent({
  name: "AccordionControl",
  setup(props) {

    let data: AccordionData = {
      state: props.state,
      height: 0,
      headerHeight: 0,
    }

    return {
      data: ref(data),
      id: "",
    };

  },
  mounted() {
    setTimeout(() => {
      this.getHeight();
      this.id = AccordionService.registerParent(this.data, this.isVert, this.allOpen);
    }, 1);

    window.addEventListener("resize", this.setHeight);
  },
  unmounted() {
    window.removeEventListener("resize", this.setHeight);
  },
  methods: {
    getHeight() {
      const rect = (this.$refs["panel"] as HTMLDivElement).getBoundingClientRect();
      console.log("getHeight: " + rect.height);
      this.data.height = rect.height;
    },
    setHeight() : void {
      this.getHeight();
      AccordionService.setHeight(this.id, this.data.height);
      console.log("set height: " + this.data.height);
    }
  },
  props: {
    state: {
      type: Object as PropType<AccordionState>,
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
