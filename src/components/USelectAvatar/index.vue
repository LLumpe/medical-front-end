<!--
 * @Author: LLumpe LLumpe@163.com
 * @Date: 2024-09-26 13:57:51
 * @LastEditors: LLumpe LLumpe@163.com
 * @LastEditTime: 2024-09-26 16:55:07
 * @FilePath: \medical-front-end\src\components\USelectAvatar\index.vue
 * @Description: 
 * 
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved. 
-->
<template>
  <view class="sl">
    <ULoadMore
      v-if="isLoading"
      status="loading"
      iconSize="26"
      color="#333"
      :contentText="{
        contentdown: '上拉显示更多',
        contentrefresh: '正在生成虚拟形象',
        contentnomore: '没有更多数据了',
      }"
    />
    <view v-if="!isLoading" class="sl-container fade-in">
      <view
        class="sl-container-avatar"
        v-for="(item, index) in imageUrl"
        :key="index"
        @click="handleSelectAvatar(index)"
      >
        <image
          :src="item"
          class="sl-container-avatar-image"
          :class="{
            'sl-container-avatar-image-selected': selectedIndex == index,
          }"
        ></image>
      </view>
    </view>
  </view>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from "vue";
import ULoadMore from "@/components/ULoadMore/index.vue";
import { showToast } from "@/utils/helper";
const imageUrl = [
  "../../static/register/image1.jpg",
  "../../static/register/image2.jpg",
  "../../static/register/image3.jpg",
  "../../static/register/image4.jpg",
];
export default defineComponent({
  name: "USelectAvatar",
  components: { ULoadMore },
  props: {},
  setup(props, { emit }) {
    const isLoading = ref(true); //是否在加载
    const selectedIndex = ref(-1); //当前选中的图片
    const useDouBao = () => {
      const initAvatar = () => {
        setTimeout(() => {
          console.log("这里模拟生成虚拟形象");
          showToast("生成成功");
          isLoading.value = false;
        }, 3000);
        return {};
      };
      const handleSelectAvatar = (index: number) => {
        console.log("index", index);
        selectedIndex.value = index;
      };
      return {
        ...initAvatar(),
        handleSelectAvatar,
      };
    };
    return { isLoading, ...useDouBao(), imageUrl, selectedIndex };
  },
  onLoad() {},
});
</script>

<style lang="scss" scoped>
.sl {
  width: 100%;

  &-container {
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: center;
    flex-wrap: wrap;

    &-avatar {
      width: 280rpx;
      height: 280rpx;
      margin: 10rpx;
      border-radius: 10rpx;
      box-shadow: rgba(0, 0, 0, 0.05) 0px 0px 0px 1px;
      border: 0.5rpx solid #fff;
      &-image {
        width: 100%;
        height: 100%;
        border-radius: 10rpx;
        object-fit: contain;
        box-shadow: rgba(0, 0, 0, 0.05) 0px 0px 0px 1px;
        transition: all 0.5s;
        &-selected {
          border: 1rpx solid $uni-color-primary;
          box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
        }
      }
    }
  }
}
</style>
