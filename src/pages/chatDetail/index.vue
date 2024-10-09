<!--
 * @Author: LLumpe LLumpe@163.com
 * @Date: 2024-09-23 22:43:09
 * @LastEditors: LLumpe LLumpe@163.com
 * @LastEditTime: 2024-10-09 17:31:26
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
          <span>
            嗨，我是你的医疗智能助手张医生！初次见面很开心。我可以回答你的健康问题，为你提供医疗建议，还能随时陪你聊天。你有什么想问的呢？
          </span>
        </view>
      </view>
      <view class="chatDetail-content-chatting">
        <view
          class="chatDetail-content-chatting-container"
          v-for="(item, index) in messageArray"
          :key="index"
        >
          <view
            class="chatDetail-content-chatting-container-item"
            :style="{
              alignSelf: item.label === 'user' ? 'flex-end' : 'flex-start',
              backgroundColor: item.label === 'user' ? '#4CC6FF' : '#ebebeb',
              color: item.label === 'user' ? '#fff' : 'black',
            }"
          >
            <span>{{ item.value }}</span>
          </view>
        </view>
      </view>
    </view>
    <view class="chatDetail-bottom">
      <input
        v-model="inputRef"
        class="chatDetail-bottom-input"
        placeholder="发消息..."
        @confirm="sendMessage"
        @input="handleInput"
      />
      <view class="chatDetail-bottom-options">
        <image src="../../static/images/detail/speak.png" />
        <image src="../../static/images/detail/add.png" />
      </view>
    </view>
  </view>
</template>

<script lang="ts">
import { showToast } from "@/utils/helper";
import { computed, defineComponent, reactive, ref } from "vue";
type contentType = {
  label: string; //user或者是assistant,分为用户询问和助手回答
  value: string; //会话内容
};
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
    //会话数组

    console.log("props", JSON.parse(decodeURIComponent(props.chatDetail)));
    const chatInfo = computed(() => {
      return JSON.parse(decodeURIComponent(props.chatDetail));
    });
    const useGPT = () => {
      //输入框ref
      const inputRef = ref("");
      //会话数组ref
      const messageArray = ref<Array<contentType>>([]);
      //给消息数组发送消息
      const addMessage = (role: string, message: string) => {
        console.log("messageArray", messageArray);
        messageArray.value.push({ label: role, value: message });
        console.log("messageArray", messageArray.value);
        inputRef.value = "";
      };
      //用户发送消息
      const sendMessage = (mes: { detail: { value: string } }) => {
        if (mes.detail.value === "") {
          showToast("请输入您想问的消息");
          return;
        }
        console.log("mes", mes.detail.value);
        addMessage("user", mes.detail.value);
        console.log("inputRef", inputRef);
        setTimeout(() => {
          addMessage("assistant", "这是测试回答");
        }, 2000);
      };
      //监听输入值
      const handleInput = () => {
        // 获取当前输入的值
        console.log("当前输入值:", inputRef.value);
      };
      //应用不同的样式
      const getChatClass = (label: string) => {
        switch (label) {
          case "user":
            return "chatDetail-content-chatting-user";
          case "assistant":
            return "chatDetail-content-chatting-assistant";
        }
      };
      return {
        messageArray,
        addMessage,
        sendMessage,
        inputRef,
        handleInput,
        getChatClass,
      };
    };
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

    return {
      mute,
      chatInfo,
      chatList,
      handleMute,
      chatStack,
      ...useGPT(),
    };
  },
  onPullDownRefresh() {
    console.log("refresh");
    setTimeout(function () {
      uni.stopPullDownRefresh();
    }, 1000);
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
    position: fixed;
    top: 0;
    left: 0;
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
    margin-top: 80rpx;
    padding: 0 30rpx 170rpx 30rpx;
    box-sizing: border-box;
    &-begin {
      width: 100%;
      display: flex;
      align-items: center;
      flex-direction: column;
      image {
        width: 240rpx;
        height: 240rpx;
        border-radius: 50%;
      }
      &-message {
        box-sizing: border-box;
        margin-top: 20rpx;
        padding: 30rpx;
        width: 100%;
        background-color: $uni-bg-color-grey;
        border-radius: 20rpx;
        font-size: $uni-font-size-lg;
        letter-spacing: 0.5rpx;
      }
    }
    &-chatting {
      width: 100%;
      height: fit-content;
      &-container {
        width: 100%;
        margin-top: 30rpx;
        display: flex;
        flex-direction: column;
        &-item {
          width: fit-content;
          border-radius: 20rpx;
          padding: 20rpx;
          span {
            display: inline-block; /* 使 span 成为块级元素，便于控制宽度 */
            overflow-wrap: break-word; /* 自动换行 */
            word-wrap: break-word; /* 兼容旧版浏览器 */
            hyphens: auto; /* 可选，添加连字符 */
            max-width: 700rpx; /* 限制最大宽度为父容器的 100% */
            font-size: $uni-font-size-base;
          }
        }
      }
    }
  }
  &-bottom {
    width: 100%;
    height: 150rpx;
    position: fixed;
    bottom: 0;
    z-index: 2;
    box-sizing: border-box;
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 10rpx;
    backdrop-filter: blur(10px); /* 毛玻璃效果 */
    background-color: rgba(255, 255, 255, 1); /* 半透明背景 */
    border-top: 1px solid #ccc; /* 分隔线 */
    &-input {
      box-sizing: border-box;
      background-color: #fff;
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
        margin-right: 20rpx;
      }
    }
  }
}
</style>
