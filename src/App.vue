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
    <div class="appMenu">I wuz here</div>
  </header>
  <RouterView />
</template>

<style lang="scss">
@import "./styles/_global.scss";
</style>
