<template>
  <div class="svgScaler">
    <div>
      <svg width="400px" height="400px" viewBox="0 0 400 400">
        <path fill="black" stroke="none" :d="data.dOut"></path>
      </svg>
    </div>
    <button v-on:click="scale()">Rescale</button>
    <textarea class="debug" v-model="data.dOut"></textarea>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";

export type svgXYKeys = "x" | "y" | "before" | "after" | "between";
export type svgXY = {
  [key in svgXYKeys]: string;
};

export default defineComponent({
  name: "SvgScaler",
  setup() {
    const data = {
      scale: 400 / 317.78,
      dIn:
        "M0 0l317.78 0 0 317.78 -317.78 0 0 -317.78zm158.89 5.896c84.652,0 152.995,68.343 152.995,152.994 0,84.652 -68.343,152.995 -152.995,152.995 -84.651,0 -152.994,-68.343 -152.994,-152.995 0,-84.651 68.343,-152.994 152.994,-152.994zm0 33.331c65.775,0 119.663,53.096 119.663,119.663 0,65.775 -53.095,119.663 -119.663,119.663 -65.775,0 -119.663,-53.095 -119.663,-119.663 0,-65.775 53.096,-119.663 119.663,-119.663z",
      dOut:
        "M0 0l317.78 0 0 317.78 -317.78 0 0 -317.78zm158.89 5.896c84.652,0 152.995,68.343 152.995,152.994 0,84.652 -68.343,152.995 -152.995,152.995 -84.651,0 -152.994,-68.343 -152.994,-152.995 0,-84.651 68.343,-152.994 152.994,-152.994zm0 33.331c65.775,0 119.663,53.096 119.663,119.663 0,65.775 -53.095,119.663 -119.663,119.663 -65.775,0 -119.663,-53.095 -119.663,-119.663 0,-65.775 53.096,-119.663 119.663,-119.663z",
    };

    return {
      data: ref(data),
    };
  },
  methods: {
    scale(): void {
      const result: Array<string> = [];

      let mode = "init";
      const svgPairs: Array<svgXY> = [];
      let svgPair = { before: "", x: "", between: "", y: "", after: "" } as svgXY;
      let x = this.data.dIn;
      for (let i = 0; i < x.length; i++) {
        console.log("mode:" + mode);
        let char = x.substring(i, i + 1);
        if ("0123456789.".indexOf(char) > -1) {
          if (mode !== "x" && mode !== "y") {
            switch (mode) {
              case "b4":
                svgPair.x = char;
                mode = "x";
                break;
              case "between":
                svgPair.y = char;
                mode = "y";
                break;
              case "after":
                svgPair = { before: "", x: char, between: "", y: "", after: "" } as svgXY;
                svgPairs.push(svgPair);
                mode = "x";
                break;
              default:
                console.log("Unexpected mode A:" + mode);
                break;
            }
          } else {
            switch (mode) {
              case "x":
                svgPair.x += char;
                break;
              case "y":
                svgPair.y += char;
                break;
              default:
                console.log("Unexpected mode B:" + mode);
                break;
            }
          }
        } else {
          if (mode !== "x" && mode !== "y") {
            switch (mode) {
              case "b4":
                svgPair.before += char;
                break;
              case "after":
                svgPair.after += char;
                break;
              case "between":
                svgPair.between += char;
                break;
              case "init":
                svgPair = { before: char, x: "", between: "", y: "", after: "" } as svgXY;
                svgPairs.push(svgPair);
                mode = "b4";
                break;
              default:
                console.log("Unexpected mode C:" + mode);
                break;
            }
          } else {
            switch (mode) {
              case "y":
                svgPair.after = char;
                mode = "after";
                break;
              case "x":
                svgPair.between = char;
                mode = "between";
                break;
              default:
                console.log("Unexpected mode D:" + mode);
                break;
            }
          }
        }
        console.log(JSON.stringify(svgPair, null, "  "));
      }

      let scale = this.data.scale;
      svgPairs.forEach((pair) => {
        result.push(pair.before);
        result.push(Math.round((parseFloat(pair.x) * scale * 100) / 100).toString());
        result.push(pair.between);
        result.push(Math.round((parseFloat(pair.y) * scale * 100) / 100).toString());
        result.push(pair.after);
      });
      this.data.dOut = result.join("");
    },
  },
});
</script>

<style lang="scss" scoped>
.svgScaler {
  width: 400px;
  height: 400px;
  background: pink;
}
</style>
