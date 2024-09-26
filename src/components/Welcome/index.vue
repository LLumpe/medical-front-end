<!--
 * @Author: LLumpe LLumpe@163.com
 * @Date: 2024-09-26 13:57:51
 * @LastEditors: LLumpe LLumpe@163.com
 * @LastEditTime: 2024-09-26 15:13:36
 * @FilePath: \medical-front-end\src\components\Welcome\index.vue
 * @Description: 
 * 
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved. 
-->
<template>
  <view class="wc">
    <span class="wc-content">
      欢迎使用我们的医疗智能助手！我们致力于为您提供准确的信息和专业的建议，无论是健康咨询、症状分析，还是药物信息，您都可以随时与我们交流。您的健康是我们的首要任务，让我们一起呵护您的健康！
    </span>
  </view>
</template>

<script lang="ts">
import { computed, defineComponent } from "vue";
export default defineComponent({
  name: "Welcome",
  components: {},
  props: {},
  setup(props, { emit }) {
    return {};
  },
  onLoad() {
    /* uniapp接入lottie动画 */
  },
});
</script>

<style lang="scss" scoped>
.wc {
  width: 100%;
  &-content {
    width: 100%;
    height: 100%;
    font-size: $uni-font-size-base;
    letter-spacing: 0.5rpx;
  }
}
</style>
