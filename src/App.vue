<script lang="ts">
import { ref } from "vue";
import { useRoute, RouterView } from "vue-router";

export default {
  name: "App",
  title: "IconBuilder",
  components: {
    RouterView,
  },

  setup() {
    let route = useRoute();

    const data = ref({
      route: route,
    });

    return {
      data,
    };
  },
};
</script>

<template>
  <header>
    <div class="appMenu" id="appMenu"></div>
  </header>
  <RouterView />
  <div class="footer"></div>
</template>

<style lang="scss">
@import "./styles/_global.scss";
</style>
