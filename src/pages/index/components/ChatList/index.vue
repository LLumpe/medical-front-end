<!--
 * @Author: LLumpe LLumpe@163.com
 * @Date: 2024-09-23 22:43:09
 * @LastEditors: LLumpe LLumpe@163.com
 * @LastEditTime: 2024-09-26 17:35:52
 * @FilePath: \medical-front-end\src\pages\index\components\chatList\index.vue
 * @Description: a
 * 
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved. 
-->
<template>
  <view>
    <view
      v-for="(item, index) in chatList"
      :key="index"
      class="chatList"
      @click="handleDetail(item)"
    >
      <view class="chatList-item">
        <view class="chatList-item-avatar">
          <image :src="item.avatar" />
        </view>
        <view class="chatList-item-info">
          <view class="chatList-item-info-name">{{ item.name }}</view>
          <view class="chatList-item-info-text">{{ item.text }}</view>
        </view>
      </view>
    </view>
  </view>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { navigateTo } from "../../../../utils/helper";
export default defineComponent({
  components: {},
  name: "ChatList",
  setup(props) {
    const chatList = [
      {
        id: 0,
        avatar: "../../../../static/register/image1.jpg",
        name: "张医生",
        text: "您需要一个怎样的诊断...",
      },
      {
        id: 1,
        avatar: "../../../../static/register/image2.jpg",
        name: "陈医生",
        text: "您好，今天你按时吃药了吗？...",
      },
    ];
    const handleDetail = (item: any) => {
      uni.navigateTo({
        url:
          "/pages/chatDetail/index?chatDetail=" +
          encodeURIComponent(JSON.stringify(item)),
      });
    };
    return {
      chatList,
      handleDetail,
    };
  },
});
</script>

<style lang="scss" scoped>
.chatList {
  width: 100vw;
  background-color: #fff;
  &-item {
    width: 100%;
    height: 140rpx;
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-bottom: 10rpx;
    &:active {
      background-color: $uni-bg-color-grey;
    }
    &-avatar {
      width: 120rpx;
      height: 120rpx;
      margin-left: 30rpx;
      image {
        width: 100%;
        height: 100%;
        border-radius: 50%;
      }
    }
    &-info {
      display: flex;
      flex-direction: column;
      justify-content: center;
      width: 100%;
      height: 100%;
      margin-left: 20rpx;
      flex: 1;
      &-name {
        font-size: $uni-font-size-xl;
        font-weight: $uni-font-weight-bolder;
      }
      &-text {
        font-size: $uni-font-size-base;
        color: $uni-text-color-grey;
      }
    }
  }
}
</style>
