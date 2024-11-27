<!--
 * @Author: LLumpe LLumpe@163.com
 * @Date: 2024-11-26 15:47:33
 * @LastEditors: LLumpe LLumpe@163.com
 * @LastEditTime: 2024-11-27 18:32:35
 * @FilePath: \medical-front-end\src\components\URecording\index.vue
 * @Description: 
 * 
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved. 
-->
<template>
  <view class="URecording">
    <view
      v-for="(height, index) in waveformData"
      :key="index"
      class="URecording-bar"
      :style="{ animationDelay: (index % 4) * 0.2 + 's' }"
    />
  </view>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  getCurrentInstance,
  onMounted,
  ref,
} from "vue";
export default defineComponent({
  name: "URecording",
  components: {},
  props: {
    waveNumber: {
      type: Number,
      default: 30,
    },
  },
  emits: [],
  setup(props, { emit }) {
    //初始柱体波形数据
    const waveformData = ref<Array<number>>(new Array(30).fill(50));
    //是否是录音状态，默认为false
    const isRecording = ref<boolean>(false);
    //启动波动效果
    const startWaveAnimation = () => {};

    onMounted(() => {
      console.log("mounted");
      // 初始化canvas并启动动画
      // startWaveAnimation();
    });

    return { startWaveAnimation, waveformData };
  },
});
</script>

<style lang="scss" scoped>
.URecording {
  gap: 3px;
  width: 100%;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: transparent;
  border-radius: 30rpx;

  &-bar {
    width: 4px;
    height: 8px;
    border-radius: 15px;
    background-color: $u-type-func;
    animation: wave 0.5s infinite ease-in-out;
  }
}

@keyframes wave {
  0% {
    height: 8px; /* 最小高度 */
  }
  50% {
    height: 20px; /* 最大高度 */
  }
  100% {
    height: 8px; /* 最小高度 */
  }
}
</style>
