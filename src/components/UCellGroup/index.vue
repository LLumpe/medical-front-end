<!--
 * @Author: LLumpe LLumpe@163.com
 * @Date: 2024-09-23 22:43:09
 * @LastEditors: LLumpe LLumpe@163.com
 * @LastEditTime: 2024-09-24 18:37:16
 * @FilePath: \medical-front-end\src\components\UCellGroup\index.vue
 * @Description: 
 * 
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved. 
-->
<template>
  <view class="u-cell-box">
    <view v-if="title" class="u-cell-title" :style="[titleStyle]">
      {{ title }}
    </view>
    <view
      class="u-cell-item-box"
      :class="{ 'u-border-bottom u-border-top': border }"
    >
      <slot />
    </view>
  </view>
</template>

<script>
/**
 * cellGroup 单元格父组件Group
 * @description cell单元格一般用于一组列表的情况，比如个人中心页，设置页等。搭配u-cell-item
 * @tutorial https://www.uviewui.com/components/cell.html
 * @property {String} title 分组标题
 * @property {Boolean} border 是否显示外边框（默认true）
 * @property {Object} title-style 分组标题的的样式，对象形式，如{'font-size': '24rpx'} 或 {'fontSize': '24rpx'}
 * @example <u-cell-group title="设置喜好">
 */
export default {
  name: "UCellGroup",
  props: {
    // 分组标题
    title: {
      type: String,
      default: "",
    },
    // 是否显示分组list上下边框
    border: {
      type: Boolean,
      default: true,
    },
    // 分组标题的样式，对象形式，注意驼峰属性写法
    // 类似 {'font-size': '24rpx'} 和 {'fontSize': '24rpx'}
    titleStyle: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  data() {
    return {
      index: 0,
    };
  },
};
</script>

<style lang="scss" scoped>
.u-cell-box {
  width: 100vw;
}
.u-cell-title {
  padding: 30rpx 32rpx 10rpx 32rpx;
  font-size: 30rpx;
  text-align: left;
  color: $u-tips-color;
}
.u-cell-item-box {
  background-color: #ffffff;
  flex-direction: row;
}
</style>
