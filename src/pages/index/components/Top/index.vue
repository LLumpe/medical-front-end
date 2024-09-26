<!--
 * @Author: LLumpe LLumpe@163.com
 * @Date: 2024-09-23 22:43:09
 * @LastEditors: LLumpe LLumpe@163.com
 * @LastEditTime: 2024-09-26 16:54:35
 * @FilePath: \medical-front-end\src\pages\index\components\Top\index.vue
 * @Description: 
 * 
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved. 
-->
<template>
  <view class="top">
    <view class="top-content">
      <span>对话</span>
      <image src="../../../../static/images/index/add.png"></image>
    </view>
  </view>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  components: {},
});
</script>

<style lang="scss" scoped>
.top {
  width: 100vw;
  z-index: 1;
  &-content {
    width: 100%;
    height: 60rpx;
    margin-top: 180rpx;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    span {
      letter-spacing: 0.5rpx;
      font-size: $uni-font-size-lg;
      font-weight: $uni-font-weight-bolder;
    }
    image {
      position: absolute;
      right: 20rpx;
      width: 40rpx;
      height: 40rpx;
    }
  }
}
</style>
