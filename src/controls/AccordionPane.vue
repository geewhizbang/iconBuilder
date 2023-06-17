<template>
  <div
    class="accordionHeader"
    ref="headerElement"
    v-on:click="click()"
    :class="{ disabled: disabled, open: open }"
  >
    <slot name="header"></slot>
    <IconArrow :rotation="getIconRotation" :state="disabled" />
  </div>
  <div class="accordionPane" ref="content" :style="{ height: height }">
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
    };

    return {
      state: ref(state),
      height: "0",
    };
  },
  mounted() {
    setTimeout(() => {
      console.log("registered child: " + this.panelName);
      const headerHeight = (this.$refs[
        "headerElement"
      ] as HTMLDivElement).getBoundingClientRect().height;
      const parentKey = AccordionService.registerChild(
        this.panelName,
        this.change,
        headerHeight
      );
      if (parentKey == "") {
        console.log("AccordionPane could not find parent for " + this.panelName);
      } else {
        this.state.isReady = true;
        this.setHeight();
      }
    }, 10);
  },
  methods: {
    setHeight() {
      this.height = AccordionService.getPanelHeight(this.panelName);
      console.log("height:" + this.height);
    },
    click(): void {
      if (this.disabled) {
        return;
      }
      const state = AccordionService.getChildState(this.panelName);
      const props = AccordionService.getChildProps(this.panelName);
      let newState = !state.open;
      if ((!state.disabled && props.allOpen) || !state.open) {
        AccordionService.changeChildState(this.panelName, "open", newState);
      }
    },
    change(open: boolean, disabled: boolean): boolean {
      this.state.open = open;
      this.state.disabled = disabled;
      this.setHeight();
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
    open(): boolean {
      if (this.state.isReady) {
        const state = AccordionService.getChildState(this.panelName);
        return state.open;
      }
      return false;
    },
    disabled(): boolean {
      if (this.state.isReady) {
        const state = AccordionService.getChildState(this.panelName);
        return state.disabled;
      }
      return true;
    },
    getIconRotation(): string {
      if (this.state.isReady) {
        const state = AccordionService.getChildState(this.panelName);
        const props = AccordionService.getChildProps(this.panelName);
        return props.isVert
          ? state.open
            ? "left"
            : "right"
          : state.open
          ? "up"
          : "down";
      }
      return "up";
    },
  },
});
</script>
