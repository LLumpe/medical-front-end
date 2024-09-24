<!--
 * @Author: LLumpe LLumpe@163.com
 * @Date: 2024-09-23 22:43:09
 * @LastEditors: LLumpe LLumpe@163.com
 * @LastEditTime: 2024-09-24 22:32:20
 * @FilePath: \medical-front-end\src\pages\setting\index.vue
 * @Description: 
 * 
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved. 
-->
<template>
  <view class="body">
    <UCellGroup title=" ">
      <UCellItem title="账号设置" hover-class="none" icon="setting-fill" />
      <UCellItem
        title="退出登录"
        :arrow="false"
        hover-class="none"
        icon="setting-fill"
      />
    </UCellGroup>
    <view class="version">Version 1.0.0</view>
  </view>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import UCellItem from "@/components/UCellItem/index.vue";
import UCellGroup from "@/components/UCellGroup/index.vue";
export default defineComponent({
  name: "Setting",
  components: { UCellItem, UCellGroup },
  props: {},
  setup(props) {},
});
</script>

<style lang="scss" scoped>
.body {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  .version {
    width: 100%;
    margin-top: 20rpx;
    text-align: center;
    font-size: $uni-font-size-sm;
    color: $uni-text-color-grey;
  }
}
</style>
