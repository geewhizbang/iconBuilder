<template>
  <teleport to="#header">
    <div class="headerControl">
      <div class="left">
        <slot name="onLeft"></slot>
      </div>
      <div class="right">
        <slot name="onRight"></slot>
      </div>
    </div>
  </teleport>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "HeaderControl",
});
</script>

<style lang="scss">
@import "../styles/_variables.scss";
.headerControl {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;

  .left {
    height: 100%;
    padding: $sizeC;
  }

  .right {
    height: 100%;
    padding: $sizeC;
  }
}
</style>
