<template>
  <div class="colorPicker">
    
  </div>
</template>

<script lang="ts">
import { defineComponent, type StyleValue, ref } from 'vue';
import ScrollBar from "./ScrollBar.vue";
export default defineComponent ({
  name: "ColorPicker",
  components: { 
    ScrollBar,
  },
  created() {},
  data() {
    return {
      colors: {
        primary: [],
        complimentary: []
      }
    };
  },
  props: {},
  methods: {},
});
</script>

<style lang="scss" scoped>

</style>