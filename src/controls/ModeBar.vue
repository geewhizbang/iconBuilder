<template>
  <div class="modeBar">
    <IconPick/>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import IconPick from "../icons/IconPick.vue";

export default defineComponent({
  name: "ModeBar",
  components: { IconPick },
});
</script>