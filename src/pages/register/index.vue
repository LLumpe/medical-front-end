<template>
  <view class="page">
    <!-- 第一步 欢迎 -->
    <view v-if="step === 0" class="step fade-in">
      <view class="title"> 欢迎使用医疗智能聊天助手 </view>
      <Welcome />
    </view>

    <!-- 第二步 绑定手机号码 -->
    <view v-if="step === 1" class="step fade-in">
      <view class="title"> 输入手机号验证码 </view>
      <sms-verify
        v-if="step === 1"
        :phone="smsForm.phone"
        :code="smsForm.code"
        sms-api="family/getBindCode"
        @phoneChange="handlePhoneChange"
        @codeChange="handleCodeChange"
      />
    </view>
    <view v-if="step === 1" style="margin-bottom: 30rpx">
      <checkbox-group @change="handleAgreeChange">
        <checkbox value="agree" color="#09C46E" style="transform: scale(0.7)" />
        <span style="font-size: 24rpx">
          我已阅读并同意
          <a
            @click="handlePrivacypolicy"
            style="display: inline-block; margin: 0 5rpx; color: #09c46e"
            >《用户服务协议》</a
          >
          和
          <a
            @click="handlePrivacypolicy"
            style="display: inline-block; margin: 0 5rpx; color: #09c46e"
            >《隐私政策》</a
          ></span
        >
      </checkbox-group>
    </view>

    <!-- 第三步  输入头像-->
    <view v-if="step === 2" class="step fade-in">
      <view class="title"> 上传医生肖像 </view>
      <UUploader
        v-modal="formData.avatarUrl"
        :image-styles="imageStyles"
        @select="handleImageSelect"
        @delete="handleDelete"
        limit="1"
        title="选择一张医生肖像"
      />
    </view>
    <!-- <view v-if="step === 2" class="step">
      <view class="title"> 绑定个人身份信息 </view>
      <u-input
        v-if="step === 2"
        v-model="profileForm.name"
        placeholder="请输入姓名"
        label="姓名"
        label-width="180"
      />
      <u-input
        v-if="step === 2"
        v-model="profileForm.IDCard"
        placeholder="请输入身份证号"
        type="idcard"
        description="姓名和身份证号确认后不可更改，请仔细核对"
        maxlength="18"
        label="身份证号"
        label-width="180"
      />
    </view> -->
    <!-- 第四步  获取3D图像-->
    <view v-if="step === 3" class="step fade-in">
      <view class="title"> 请选择数字人虚拟形象 </view>
      <USelectAvatar></USelectAvatar>
    </view>
    <view class="actions">
      <!-- <u-button
        class="actions-item"
        :disabled="!isAllowNextStep"
        :loading="isLoading"
        open-type="getUserInfo"
        @getuserinfo="handleNextStep"
      >
        取消
      </u-button>
      <u-button
        class="actions-item"
        :disabled="!isAllowNextStep"
        :loading="isLoading"
        open-type="getUserInfo"
        @getuserinfo="handleNextStep"
      >
        下一步
      </u-button> -->
      <button
        class="actions-item"
        @click="handleNextStep"
        :disabled="!isAllowNextStep"
      >
        {{ step === 3 ? "完成注册" : "下一步" }}
      </button>
      <button class="actions-item" @click="handleCancelStep">取消</button>
    </view>
    <UBottomLight :steps="4" :current-step="step" />
  </view>
</template>

<script lang="ts">
import authService from "@/service/authService";
import { computed, defineComponent, reactive, ref } from "vue";
import Welcome from "@/components/Welcome/index.vue";
import UUploader from "@/components/UUploader/index.vue";
import UButton from "@/components/UButton/index.vue";
import SmsVerify from "@/components/SmsVerify/index.vue";
import UBottomLight from "@/components/UBottomLight/index.vue";
import USelectAvatar from "@/components/USelectAvatar/index.vue";
import {
  requestBindPhone,
  requestBindVolunteerInformation,
  requestUpdateWechatUserInfo,
} from "@/api/user";
import {
  hideLoading,
  navigateBack,
  navigateTo,
  showLoading,
  showModalError,
  showToast,
  switchTab,
} from "@/utils/helper";
import store from "@/store";
export interface formType {
  id: string;
  avatarUrl: Array<string>;
}
const step = ref(0);

const useSmsVerify = () => {
  const smsForm = reactive({
    phone: "",
    code: "",
    agree: false,
  });

  const handlePhoneChange = (val: string) => {
    smsForm.phone = val;
  };

  const handleCodeChange = (val: string) => {
    smsForm.code = val;
  };

  const handleAgreeChange = (e: any) => {
    console.log("e", e);
    smsForm.agree = e.detail.value.includes("agree") ? true : false;
  };

  const verifyPhone = async () => {
    await requestBindPhone({
      phone: smsForm.phone,
      code: smsForm.code,
    });
  };
  return {
    smsForm,
    handlePhoneChange,
    handleCodeChange,
    verifyPhone,
    handleAgreeChange,
  };
};
// const initCanvas = () => {
//   wx.createSelectorQuery()
//     .select("#wc-canvas")
//     .fields({
//       node: true,
//       size: true,
//     })
//     .exec((res: any) => {
//       const canvas = res[0].node;
//       const ctx = canvas.getContext("2d");
//       const dpr = wx.getSystemInfoSync().pixelRatio;
//       canvas.width = res[0].width * dpr;
//       canvas.height = res[0].height * dpr;
//       ctx.scale(dpr, dpr);
//       lottie.setup(canvas);
//       lottie.loadAnimation({
//         loop: true,
//         autoplay: true,
//         // animationData: "../../static/register/welcome.json",
//         path: "../../static/register/welcome.json",
//         rendererSettings: {
//           context: ctx,
//         },
//       });
//     });
// };
const useProfileVerify = () => {
  const profileForm = reactive({
    name: "",
    IDCard: "",
  });
  const verifyProfile = async (userInfo: UniApp.GetUserInfoRes) => {
    await requestBindVolunteerInformation({
      name: profileForm.name,
      IDCard: profileForm.IDCard,
    });
    await requestUpdateWechatUserInfo({
      encryptedData: userInfo.encryptedData,
      iv: userInfo.iv,
    });
  };

  return { profileForm, verifyProfile };
};

export default defineComponent({
  components: { SmsVerify, UBottomLight, Welcome, UUploader, USelectAvatar },
  setup() {
    const smsVerify = useSmsVerify();
    const profileVerify = useProfileVerify();
    const isLoading = ref(false);
    const handleNextStep = async (userInfoRes: any) => {
      // const userInfo: UniApp.GetUserInfoRes = userInfoRes.detail;
      // isLoading.value = true;
      // if (step.value === 1) {
      //   try {
      //     if (!smsVerify.smsForm.agree) {
      //       showToast("绑定失败，您尚未同意用户服务协议和隐私政策");
      //     } else {
      //       await smsVerify.verifyPhone();
      //     }
      //   } catch (e) {
      //     console.log(e);
      //   }
      // }
      // // else if (step.value === 2) {
      // //   try {
      // //     await profileVerify.verifyProfile(userInfo);
      // //     showToast("验证成功", "success");
      // //     await authService.getUserInfo();
      // //     navigateBack();
      // //   } catch (e) {
      // //     console.log(e);
      // //   }
      // // }
      // isLoading.value = false;
      if (step.value !== 3) {
        step.value = step.value + 1;
      } else {
        uni.switchTab({
          url: "/pages/index/index",
        });
      }
    };
    const formData = reactive<formType>({
      id: "",
      avatarUrl: [],
    });
    //选择图片
    const handleImageSelect = async (e: any) => {
      showLoading();
      try {
        const tempFilePath = e.tempFilePaths;
        for (let i = 0; i < tempFilePath.length; i++) {
          setTimeout(() => {
            console.log("这里模拟网络请求，获取线上地址");
          }, 1000);
          // const imageUrl = await requestUploadImage(tempFilePath[i]);
          formData.avatarUrl.push(tempFilePath as string);
        }
        showToast("上传成功", "success");
        hideLoading();
      } catch (error) {
        console.log(error);
        hideLoading();
        showModalError("上传图片失败");
      }
    };

    //删除照片
    const handleDelete = (e: any) => {
      formData.avatarUrl.splice(e.index, 1);
    };
    const handleCancelStep = () => {
      navigateBack();
    };
    const handlePrivacypolicy = () => {
      navigateTo("/pages/privacyPolicy/index");
    };
    const isAllowNextStep = computed(() => {
      if (step.value === 0) {
        return true;
      }
      if (step.value === 1) {
        return (
          smsVerify.smsForm.phone.length === 11 &&
          smsVerify.smsForm.code.length === 6
        );
      } else {
        return true;
      }
      // } else if (step.value === 2) {
      //   return (
      //     profileVerify.profileForm.name.length >= 2 &&
      //     profileVerify.profileForm.IDCard.length === 18
      //   );
      // }
    });
    return {
      handlePrivacypolicy,
      step,
      isAllowNextStep,
      handleNextStep,
      handleCancelStep,
      isLoading,
      handleImageSelect,
      ...smsVerify,
      ...profileVerify,
    };
  },
  onLoad(query) {
    if (query && query.step === "2") {
      step.value = 1;
    } else {
      step.value = 0;
    }
  },
  onUnload() {
    if (!store.getters.hasVolunteerInfo) {
      authService.logout();
    }
  },
});
</script>

<style lang="scss" scoped>
.page {
  // position: relative;
  width: 700rpx;
  margin: auto;
  margin-top: 180rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 20rpx;
  border: 2rpx solid $uni-border-color;
  box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 4px;
  transition: all 1s;
}

.title {
  font-size: $uni-font-size-xxl;
  margin-bottom: 50rpx;
  font-weight: $uni-font-weight-bolder;
}

.actions {
  // position: absolute;
  // top: 750rpx;
  // left: 0;
  width: 100vw;
  padding: 0 72rpx;
  box-sizing: border-box;
  &-item {
    float: right;
    width: 180rpx;
    margin-left: 40rpx;
    padding: 0 30rpx;
    border-radius: 10rpx;
    font-size: $uni-font-size-base;
  }
}

.step {
  transition: all 0.2s linear;
  padding: 72rpx;
  // position: absolute;
  // top: 0;
  // left: 0;
  box-sizing: border-box;
  width: 100vw;
}
.fade-in {
  animation: fadeIn 2s ease forwards; /* 动画持续时间为2秒 */
}
@keyframes fadeIn {
  0% {
    opacity: 0; /* 初始透明度 */
  }
  100% {
    opacity: 1; /* 完全不透明 */
  }
}
</style>
