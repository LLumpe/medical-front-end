<!--
 * @Author: LLumpe LLumpe@163.com
 * @Date: 2024-09-23 22:43:09
 * @LastEditors: LLumpe LLumpe@163.com
 * @LastEditTime: 2024-09-24 16:39:37
 * @FilePath: \medical-front-end\src\pages\index\index.vue
 * @Description: 
 * 
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved. 
-->
<template>
  <view> </view>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  components: {},
});
</script>

<style lang="scss" scoped>
.content {
  text-align: center;
  height: 400upx;
}

.logo {
  height: 200upx;
  width: 200upx;
  margin-top: 200upx;
}

.title {
  font-size: 36upx;
  color: #8f8f94;
}

.body {
  margin-top: 64rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  &-leaderBoard {
    width: 100%;
    display: flex;
    flex-direction: row;
    padding: 0 40rpx 0 40rpx;
    box-sizing: border-box;
    justify-content: space-between;
  }
}
</style>
