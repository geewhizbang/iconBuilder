<template>
  <div class="icon iconBg" :class="{ disabled: disabled }">
    <svg width="100px" height="100px" viewBox="0 0 21.235 21.235">
      <g :class="rotation">
        <rect x="3.728" width="13.779" height="21.235" />
        <polygon class="iconBaseColor" points="5.031,6.666 16.204,6.666 10.617,15.418 " />
      </g>
    </svg>
  </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "IconArrow",
  props: {
    rotation: {
      type: String,
      required: true,
    },
    disabled: {
      type: Boolean,
      required: true,
    },
  },
});
</script>
