<!--
 * @Author: LLumpe LLumpe@163.com
 * @Date: 2024-09-23 22:43:09
 * @LastEditors: LLumpe LLumpe@163.com
 * @LastEditTime: 2024-11-28 09:26:19
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
            <text :decode="true">{{ item.value }}</text>
          </view>
        </view>
      </view>
      <view class="chatDetail-content-more">
        <span class="chatDetail-content-more-text">聊聊新话题</span>
      </view>
    </view>
    <view class="chatDetail-bottom">
      <view v-if="isRecording" class="chatDetail-bottom-recording">
        <URecording />
      </view>
      <view class="chatDetail-bottom-content">
        <input
          v-if="!isTalk"
          v-model="inputRef"
          class="chatDetail-bottom-input"
          placeholder="发消息..."
          @confirm="sendMessage"
          @input="handleInput"
        />
        <view class="chatDetail-bottom-talk" v-if="isTalk">
          <UAudio
            @recognize="handleTalkRecognize"
            @start="handleTalkStart"
            @end="handleTalkEnd"
            @cancel="handleTalkEnd"
          />
        </view>
        <view class="chatDetail-bottom-options">
          <image
            :src="
              !isTalk
                ? '../../static/images/detail/speak.png'
                : isRecognizing
                ? '../../static/images/detail/type-disabled.png'
                : '../../static/images/detail/type.png'
            "
            @click="handleTalkChange"
          />
          <image src="../../static/images/detail/add.png" />
        </view>
      </view>
    </view>
  </view>
</template>

<script lang="ts">
import { showToast } from "@/utils/helper";
import {
  computed,
  defineComponent,
  getCurrentInstance,
  onMounted,
  ref,
} from "vue";
import UAudio from "@/components/UAudio/index.vue";
import URecording from "@/components/URecording/index.vue";
import { requestGetMessageByGPT } from "@/api/detail";
type contentType = {
  label: string; //user或者是assistant,分为用户询问和助手回答
  value: string; //会话内容
};

export default defineComponent({
  name: "ChatDetail",
  components: { UAudio, URecording },
  props: {
    chatDetail: {
      type: String,
      default: null,
    },
  },
  setup(props) {
    const mute = ref(false); //是否静音，默认不静音
    const isTalk = ref(false); //是否为说话状态，默认为打字
    const isRecording = ref(false); //是否为录音状态，默认为false
    const isRecognizing = ref(false); //是否在识别状态，默认为false
    console.log("props", JSON.parse(decodeURIComponent(props.chatDetail)));

    //会话信息
    const chatInfo = computed(() => {
      return JSON.parse(decodeURIComponent(props.chatDetail));
    });

    /* 语言模型相关状态方法 */
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

      //处理语音录音开始回调
      const handleTalkStart = (res: any) => {
        console.log("handleTalkStart", res);
        //处理开始录制回调，如果开始录制，则将正在录制状态修改为true
        if (res) {
          isRecording.value = true;
          isRecognizing.value = true;
        }
      };

      //处理语音录音结束回调
      const handleTalkEnd = (res: any) => {
        console.log("handleTalkEnd", res);
        //处理开始录制回调，如果开始录制，则将正在录制状态修改为true
        if (res) {
          isRecording.value = false;
        }
      };

      //处理语音识别结束回调
      const handleTalkRecognize = (res: any) => {
        console.log("handleTalkRecognize", res);
        if (res && res.success) {
          addMessage("user", res.message);
        } else if (res && !res.success) {
          if (res.message === "query response empty result") {
            showToast("未识别到文字");
          } else if (res.message === "internal voice data failed") {
            showToast("识别间隙太短，请多说两句");
          } else {
            showToast(res.message);
          }
        }
        isRecognizing.value = false;
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
      //是否静音
      const handleMute = () => {
        mute.value = !mute.value;
      };
      //切换输入模式，是打字还是语音
      const handleTalkChange = () => {
        //如果不是正在识别的状态，则可以切换，如果不是，则不可以取消
        if (!isRecognizing.value) {
          isTalk.value = !isTalk.value;
        } else {
          return;
        }
      };
      return {
        messageArray,
        addMessage,
        sendMessage,
        inputRef,
        handleInput,
        getChatClass,
        isTalk,
        handleMute,
        handleTalkChange,
        handleTalkRecognize,
        handleTalkStart,
        handleTalkEnd,
      };
    };

    const chatList = {
      id: 0,
      avatar: "../../static/register/image1.jpg",
      name: "张医生",
      text: "您需要一个怎样的诊断...",
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
      chatStack,
      ...useGPT(),
      isRecording,
      isRecognizing,
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
      box-sizing: border-box;
      padding: 20px 0;
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

    &-more {
      position: relative;
      text-align: center;
      margin: 20px 0;

      &::before {
        content: "";
        position: absolute;
        top: 50%;
        left: 0;
        right: 0;
        height: 1px;
        background-color: #ddd;
        z-index: -1;
      }

      &-text {
        z-index: 1;
        font-size: 14px;
        letter-spacing: 1px;
        color: gray;
        background-color: $uni-bg-color;
        padding: 0 10px;
      }
    }
  }

  &-bottom {
    width: 100%;
    height: 170rpx;
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
    box-shadow: rgba(0, 0, 0, 0.3) 0px 19px 38px,
      rgba(0, 0, 0, 0.22) 0px 15px 12px;

    &-recording {
      width: 100%;
      position: absolute;
      bottom: 100%;
    }

    &-content {
      width: 100%;
      display: flex;
      flex-direction: row;
      align-items: center;
      border-radius: 30rpx;
      background-color: #fff;
      box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;
    }
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

    &-talk {
      width: 100%;
      height: 50px;
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
