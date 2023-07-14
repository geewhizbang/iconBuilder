<template>
  <div :class="controlClass">
    <label v-if="label != ''">{{ label }}</label>
    <div class="selectorButtons">
      <button
        v-for="(button, key) in state.states"
        :key="key"
        v-on:click="click(key.toString())"
        :class="getClass(button, key.toString())"
      >
        <span>{{ button.label }}</span>
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, inject } from "vue";

export interface SelectorButton {
  label: string;
  disabled?: boolean;
  visible?: boolean;
}

export interface StateSelectorData {
  disabled: boolean;
  states: { [key: string]: SelectorButton };
}

export interface ModeChange {
  value: string;
}

export default defineComponent({
  name: "StateSelector",
  emits: ["change"],
  setup(props) {
    return {
      state: ref<StateSelectorData>(
        inject(props.stateSelectorInject) as StateSelectorData
      ),
      activeKey: props.activeState,
    };
  },
  props: {
    stateSelectorInject: {
      type: String,
      required: true,
    },
    controlClass: {
      type: String,
      default: "stateSelector",
    },
    label: {
      type: String,
      default: "",
    },
    buttonClass: {
      type: String,
      default: "button",
    },
    activeState: {
      type: String,
      required: true,
    },
  },
  methods: {
    click(key: string): void {
      if (this.activeState != key) {
        this.$emit("change", { value: key } as ModeChange);
      }
    },
    getClass(button: SelectorButton, key: string): string {
      let result = [this.buttonClass];
      if (key == this.activeState) {
        result.push("selected");
      }
      if (button.disabled || this.state.disabled) {
        result.push("disabled");
      }
      return result.join(" ");
    },
  },
  watch: {
    activeState: function (newVal: string, oldVal: string) {
      if (newVal != oldVal) {
        this.activeKey = newVal;
      }
    },
  },
});
</script>
