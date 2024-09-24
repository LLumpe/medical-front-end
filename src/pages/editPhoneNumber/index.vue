<template>
  <view class="page">
    <view class="title"> 绑定新手机号 </view>
    <sms-verify
      :phone="smsForm.phone"
      :code="smsForm.code"
      sms-api="family/getUpdateCode"
      @phoneChange="handlePhoneChange"
      @codeChange="handleCodeChange"
    />
    <view style="margin-top: 50rpx">
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
    <view class="actions">
      <u-button
        type="primary"
        shape="circle"
        shadow
        :loading="isLoading"
        :disabled="!isAllowSubmit"
        @click="handleSubmit"
      >
        确认提交
      </u-button>
    </view>
  </view>
</template>

<script lang="ts">
import UButton from "@/components/UButton/index.vue";
import SmsVerify from "@/components/SmsVerify/index.vue";
import { requestBindPhone } from "@/api/user";
import authService from "@/service/authService";
import {
  hideLoading,
  navigateBack,
  navigateTo,
  showLoading,
  showToast,
} from "@/utils/helper";
import { computed, defineComponent, onUnmounted, reactive, ref } from "vue";

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

  const submit = async () => {
    await requestBindPhone({
      phone: smsForm.phone,
      code: smsForm.code,
    });
  };

  return {
    smsForm,
    handlePhoneChange,
    handleCodeChange,
    submit,
    handleAgreeChange,
  };
};

export default defineComponent({
  components: { UButton, SmsVerify },
  setup() {
    const smsVerify = useSmsVerify();
    const isLoading = ref(false);
    const timeout = ref();
    const handleSubmit = async () => {
      showLoading("请稍候");
      try {
        if (!smsVerify.smsForm.agree) {
          showToast("绑定失败，您尚未同意用户服务协议和隐私政策");
        } else {
          await smsVerify.submit();
          await authService.getUserInfo();
          showToast("修改成功", "success");
          timeout.value = setTimeout(() => {
            navigateBack();
          }, 600);
        }
      } catch (e) {
        console.log(e);
        hideLoading();
      }
    };

    const isAllowSubmit = computed(() => {
      return (
        smsVerify.smsForm.phone.length === 11 &&
        smsVerify.smsForm.code.length === 6
      );
    });
    const handlePrivacypolicy = () => {
      navigateTo("/pages/privacyPolicy/index");
    };
    onUnmounted(() => {
      clearTimeout(timeout.value);
    });
    return {
      handlePrivacypolicy,
      ...smsVerify,
      isLoading,
      handleSubmit,
      isAllowSubmit,
    };
  },
});
</script>

<style lang="scss" scoped>
.page {
  padding: 72rpx;
}

.title {
  font-size: $uni-font-size-xxl;
  margin-bottom: 50rpx;
}

.actions {
  margin-top: 350rpx;
  text-align: center;
}
</style>
