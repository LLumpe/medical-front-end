<!--
 * @Author: LLumpe LLumpe@163.com
 * @Date: 2024-09-26 13:57:51
 * @LastEditors: LLumpe LLumpe@163.com
 * @LastEditTime: 2024-09-26 14:22:24
 * @FilePath: \medical-front-end\src\components\UBottomLight\index.vue
 * @Description: 
 * 
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved. 
-->
<template>
  <view class="bl">
    <view
      v-for="index in steps"
      :key="index"
      class="bl-item"
      :style="{ backgroundColor: currentStep === index ? color : '#fff' }"
    />
  </view>
</template>

<script lang="ts">
import { computed, defineComponent, ref, watch } from "vue";
import { showToast } from "@/utils/helper";
export default defineComponent({
  name: "UBottomLight",
  components: {},
  props: {
    color: {
      type: String,
      default: "#333",
    },
    steps: {
      type: Number,
      default: 4,
    },
    currentStep: {
      type: Number,
      default: 0,
    },
  },
  setup(props, { emit }) {
    return {};
  },
});
</script>

<style lang="scss" scoped>
.bl {
  width: 100vw;
  height: 60rpx;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  &-item {
    width: 20rpx;
    height: 10rpx;
    margin: 0 10rpx;
    border: 0.5rpx solid gray;
    border-radius: 10rpx;
  }
}
</style>
