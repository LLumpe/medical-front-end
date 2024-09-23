<template>
  <view class="page">
    <view v-if="step === 1" class="step">
      <view class="title"> 绑定手机号 </view>
      <sms-verify
        v-if="step === 1"
        :phone="smsForm.phone"
        :code="smsForm.code"
        sms-api="family/getBindCode"
        @phoneChange="handlePhoneChange"
        @codeChange="handleCodeChange"
      />
    </view>
    <view v-if="step === 1" style="margin-top: 50rpx">
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

    <view class="actions">
      <u-button
        type="primary"
        shape="circle"
        shadow
        :disabled="!isAllowNextStep"
        :loading="isLoading"
        open-type="getUserInfo"
        @getuserinfo="handleNextStep"
      >
        确认提交
      </u-button>
    </view>
  </view>
</template>

<script lang="ts">
import authService from "@/service/authService";
import { computed, defineComponent, reactive, ref } from "vue";
import UInput from "@/components/UInput/index.vue";
import UButton from "@/components/UButton/index.vue";
import SmsVerify from "@/components/SmsVerify/index.vue";
import {
  requestBindPhone,
  requestBindVolunteerInformation,
  requestUpdateWechatUserInfo,
} from "@/api/user";
import { navigateBack, navigateTo, showToast } from "@/utils/helper";
import store from "@/store";

const step = ref(1);

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
  components: { UButton, SmsVerify },
  setup() {
    const smsVerify = useSmsVerify();
    const profileVerify = useProfileVerify();
    const isLoading = ref(false);
    const handleNextStep = async (userInfoRes: any) => {
      const userInfo: UniApp.GetUserInfoRes = userInfoRes.detail;

      isLoading.value = true;
      if (step.value === 1) {
        try {
          if (!smsVerify.smsForm.agree) {
            showToast("绑定失败，您尚未同意用户服务协议和隐私政策");
          } else {
            await smsVerify.verifyPhone();
          }
        } catch (e) {
          console.log(e);
        }
      }
      // else if (step.value === 2) {
      //   try {
      //     await profileVerify.verifyProfile(userInfo);
      //     showToast("验证成功", "success");
      //     await authService.getUserInfo();
      //     navigateBack();
      //   } catch (e) {
      //     console.log(e);
      //   }
      // }
      isLoading.value = false;
    };
    const handlePrivacypolicy = () => {
      navigateTo("/pages/privacyPolicy/index");
    };
    const isAllowNextStep = computed(() => {
      if (step.value === 1) {
        return (
          smsVerify.smsForm.phone.length === 11 &&
          smsVerify.smsForm.code.length === 6
        );
      } else if (step.value === 2) {
        return (
          profileVerify.profileForm.name.length >= 2 &&
          profileVerify.profileForm.IDCard.length === 18
        );
      }
    });
    return {
      handlePrivacypolicy,
      step,
      isAllowNextStep,
      handleNextStep,
      isLoading,
      ...smsVerify,
      ...profileVerify,
    };
  },
  onLoad(query) {
    if (query && query.step === "2") {
      step.value = 1;
    } else {
      step.value = 1;
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
  height: 900rpx;
  margin: auto;
  margin-top: 180rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 20rpx;
  border: 2rpx solid $uni-border-color;
  box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 4px;
}

.title {
  font-size: $uni-font-size-xxl;
  margin-bottom: 50rpx;
}

.actions {
  // position: absolute;
  // top: 750rpx;
  // left: 0;
  box-sizing: border-box;
  width: 100vw;
  text-align: center;
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
</style>
