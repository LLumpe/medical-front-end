<!--
 * @Author: LLumpe LLumpe@163.com
 * @Date: 2024-09-23 22:43:09
 * @LastEditors: LLumpe LLumpe@163.com
 * @LastEditTime: 2024-09-26 18:19:58
 * @FilePath: \medical-front-end\src\pages\chatDetail\index.vue
 * @Description: a
 * 
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved. 
-->
<template>
  <view class="chatDetail">
    <view class="chatDetail-head">
      <view class="chatDetail-head-info">
        <image :src="chatList.avatar" class="chatDetail-head-info-image" />
        <view class="chatDetail-head-info-text">
          <span>{{ chatList.name }}</span>
        </view>
      </view>
      <view class="chatDetail-head-options">
        <image
          @click="handleMute"
          :src="
            !mute
              ? '../../static/images/detail/volume.png'
              : '../../static/images/detail/mute.png'
          "
        />
        <image src="../../static/images/detail/more.png" />
      </view>
    </view>
    <view class="chatDetail-content">
      <view class="chatDetail-content-begin">
        <image :src="chatList.avatar" />
        <view class="chatDetail-content-begin-message">
          <span
            >嗨，我是你的医疗智能助手张医生！初次见面很开心。我可以回答你的健康问题，为你提供医疗建议，还能随时陪你聊天。你有什么想问的呢？</span
          >
        </view>
      </view>
    </view>
    <view class="chatDetail-bottom">
      <input class="chatDetail-bottom-input" focus placeholder="发消息..." />
      <view class="chatDetail-bottom-options">
        <image src="../../static/images/detail/speak.png" />
        <image src="../../static/images/detail/add.png" />
      </view>
    </view>
  </view>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from "vue";
export default defineComponent({
  name: "ChatDetail",
  components: {},
  props: {
    chatDetail: {
      type: String,
      default: null,
    },
  },
  setup(props) {
    const mute = ref(false); //是否静音，默认不静音
    console.log("props", JSON.parse(decodeURIComponent(props.chatDetail)));
    const chatInfo = computed(() => {
      return JSON.parse(decodeURIComponent(props.chatDetail));
    });
    const chatList = {
      id: 0,
      avatar: "../../static/register/image1.jpg",
      name: "张医生",
      text: "您需要一个怎样的诊断...",
    };
    const handleMute = () => {
      mute.value = !mute.value;
    };
    const chatStack = [
      {
        id: 0,
        message: "你好",
      },
      {
        id: 1,
        message: "你好",
      },
    ];
    return { mute, chatInfo, chatList, handleMute, chatStack };
  },
});
</script>

<style lang="scss" scoped>
.chatDetail {
  width: 100%;
  &-head {
    width: 100%;
    height: 80rpx;
    background-color: #fff;
    display: flex;
    flex-direction: row;
    align-items: center;
    &-info {
      width: 550rpx;
      height: 100%;
      display: flex;
      flex-direction: row;
      align-items: center;
      &-image {
        width: 60rpx;
        height: 60rpx;
        border-radius: 50%;
        margin-left: 40rpx;
      }
      &-text {
        margin-left: 20rpx;
        display: flex;
        flex-direction: column;
        font-size: $uni-font-size-xl;
        font-weight: $uni-font-weight-bolder;
      }
    }
    &-options {
      display: flex;
      flex: 1;
      align-items: center;
      height: 100%;
      image {
        width: 40rpx;
        height: 40rpx;
        margin-left: 40rpx;
      }
    }
  }
  &-content {
    width: 100%;
    height: 1000rpx;
    &-begin {
      width: 100%;
      box-sizing: border-box;
      padding: 40rpx;
      display: flex;
      align-items: center;
      flex-direction: column;
      image {
        width: 240rpx;
        height: 240rpx;
        border-radius: 50%;
      }
      &-message {
        margin-top: 20rpx;
        padding: 30rpx;
        width: 100%;
        background-color: $uni-bg-color-grey;
        border-radius: 20rpx;
        font-size: $uni-font-size-lg;
        letter-spacing: 0.5rpx;
      }
    }
  }
  &-bottom {
    width: 100%;
    height: 150rpx;
    position: absolute;
    bottom: 0;
    z-index: 1;
    box-sizing: border-box;
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 10rpx;
    &-input {
      box-sizing: border-box;
      width: 100%;
      height: 100rpx;
      padding: 0 0 0 30rpx;
      border-top-left-radius: 30rpx;
      border-bottom-left-radius: 30rpx;
      box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;
    }
    &-options {
      display: flex;
      flex-direction: row;
      flex: 1;
      width: 150rpx;
      height: 100rpx;
      align-items: center;
      background-color: #fff;
      border-top-right-radius: 30rpx;
      border-bottom-right-radius: 30rpx;
      image {
        width: 50rpx;
        height: 50rpx;
      }
    }
  }
}
</style>
