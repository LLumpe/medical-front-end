<!--
 * @Author: LLumpe LLumpe@163.com
 * @Date: 2024-09-23 22:43:09
 * @LastEditors: LLumpe LLumpe@163.com
 * @LastEditTime: 2024-09-24 16:56:23
 * @FilePath: \medical-front-end\src\pages\remind\index.vue
 * @Description: 
 * 
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved. 
-->
<template>
  <view class="body">
    <Empty message="暂未收到通知" />
  </view>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Empty from "@/components/Empty/index.vue";
export default defineComponent({
  components: { Empty },
});
</script>

<style lang="scss" scoped>
.body {
  margin-top: 64rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
</style>
