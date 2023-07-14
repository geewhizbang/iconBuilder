<template>
  <div
    class="accordionHeader"
    ref="headerElement"
    v-on:click="click()"
    :class="{ disabled: isDisabled, open: state.open }"
  >
    <slot name="header"></slot>
    <IconArrow :rotation="getIconRotation" :disabled="isDisabled" />
  </div>
  <div class="accordionPane" ref="content" :style="{ height: state.height }">
    <slot name="content"></slot>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import IconArrow from "../icons/IconArrow.vue";
import { AccordionService } from "../services/AccordionService";

export default defineComponent({
  name: "AccordionPane",
  components: {
    IconArrow,
  },
  setup() {
    const state = {
      isReady: false,
      open: false,
      disabled: false,
      height: "0",
    };

    return {
      state: ref(state),
    };
  },
  mounted() {
    setTimeout(() => {
      const parentKey = AccordionService.registerChild(
        this.panelName,
        this.change,
        this.$refs["headerElement"] as HTMLElement
      );
      if (parentKey == "") {
        console.log("AccordionPane could not find parent for " + this.panelName);
      } else {
        this.state.isReady = true;
      }
    }, 50);
  },
  methods: {
    click(): void {
      if (this.state.disabled) {
        return;
      }
      const props = AccordionService.getParentProps(this.panelName);
      let newConfig = !this.state.open;
      if ((!this.state.disabled && props.allOpen) || !this.state.open) {
        AccordionService.changeChildConfig(this.panelName, "open", newConfig);
      }
    },
    change(open: boolean, disabled: boolean, height: string): boolean {
      this.state.open = open;
      this.state.disabled = disabled;
      this.state.height = height;
      return true;
    },
  },
  props: {
    panelName: {
      type: String,
      required: true,
    },
  },
  computed: {
    isDisabled(): boolean {
      if (this.state.isReady) {
        return this.state.disabled;
      }
      return true;
    },
    getIconRotation(): string {
      if (this.state.isReady) {
        const props = AccordionService.getParentProps(this.panelName);
        return props.isVert
          ? this.state.open
            ? "left"
            : "right"
          : this.state.open
          ? "up"
          : "down";
      }
      return "up";
    },
  },
});
</script>
