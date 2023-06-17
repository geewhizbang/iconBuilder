<template>
  <div class="drawing">
    <svg viewBox="0 0 400 400">
      <g id="id_drawing">
        <rect
          stroke="black"
          fill="#FAFAFA"
          style="opacity: 0.5"
          x="116.43835616438356"
          y="250"
          width="169.86301369863014"
          height="219.17808219178085"
          id="id_00000"
        ></rect>
        <rect
          stroke="black"
          fill="#FAFAFA"
          style="opacity: 0.5"
          x="10.4109589041096"
          y="113.013698630137"
          width="132.87671232876716"
          height="178.08219178082186"
          id="id_00001"
        ></rect>
        <rect
          stroke="black"
          fill="#FAFAFA"
          style="opacity: 0.5"
          x="0"
          y="0"
          width="200"
          height="200"
          id="id_00000"
        ></rect>
        <rect
          stroke="black"
          fill="#FAFAFA"
          style="opacity: 0.5"
          x="49.09090909090907"
          y="69.99999999999994"
          width="14.545454545454561"
          height="50.909090909090935"
          id="id_00001"
        ></rect>

        <ellipse
          stroke="black"
          fill="#FAFAFA"
          style="opacity: 0.5"
          cx="74.5454545454545"
          cy="87.27272727272725"
          rx="50.90909090909088"
          ry="33.636363636363626"
          id="id_00006"
        ></ellipse>
        <ellipse
          stroke="black"
          fill="#FAFAFA"
          style="opacity: 0.5"
          cx="02.5"
          cy="02.40234375"
          rx="0"
          ry="0.625"
          id="id_00006"
        ></ellipse>
      </g>
    </svg>
  </div>
</template>

<script lang="ts">
import {} from '@/global'
import { defineComponent, ref } from 'vue'

export default defineComponent({
  name: 'DrawPane',
  setup() {
    const data = {
      actualStart: -100,
      count: 0
    }

    return {
      data: ref(data)
    }
  },
  // props: {

  // },
  // mounted() {
  //   this.init()
  // },
  methods: {}
})
</script>

<style lang="scss" scoped>
.drawing {
  width: 100%;
  height: 100%;
  overflow: visible;

  > svg {
    width: 100%;
    height: 100%;
    overflow: visible;
  }
}
</style>
