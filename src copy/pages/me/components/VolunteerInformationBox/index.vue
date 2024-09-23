<!--
 * @Author: LLumpe LLumpe@163.com
 * @Date: 2024-07-09 03:18:08
 * @LastEditors: LLumpe LLumpe@163.com
 * @LastEditTime: 2024-09-23 22:13:15
 * @FilePath: \medical-front-end\src\pages\me\components\VolunteerInformationBox\index.vue
 * @Description: 
 * 
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved. 
-->
<template>
  <view class="information">
    <view class="userBox" @click="handleJump">
      <view
        class="avatar"
        :class="{ 'avatar--nologin': status === 'unlogin' || !avatarUrl }"
        :style="{
          backgroundImage:
            status !== 'unlogin' && avatarUrl ? `url(${avatarUrl})` : null,
        }"
      />
      <view class="name">
        <span class="name-lg">
          {{ status !== "unlogin" && name ? name : "登录/注册" }}</span
        >
        <span class="name-ws">{{
          status !== "unlogin" && phone ? phone : "支持微信快速登录"
        }}</span>
      </view>
      <view class="more">
        <text class="iconfont icon-arrow-right" />
      </view>
    </view>
    <view class="box"> </view>
  </view>
</template>

<script lang="ts">
import { computed, Ref, defineComponent, PropType, ref } from "vue";
import authService from "@/service/authService";
import dayjs from "@/utils/dayjs";
import { navigateTo } from "@/utils/helper";
import { Case } from "@/api/types/models";
import { useStore } from "vuex";
const useLogin = () => {
  const handleLogin = () => {
    authService.login(true);
  };

  return { handleLogin };
};
const useWorkerRepairInfo = () => {
  //注册store实例
  const store = useStore();
  //维修师傅所有订单
  let totalRepairOrders: Ref<Array<Case>> = ref([]);
  //维系师傅正在进行中订单
  let workingRepairOrders: Ref<Array<Case>> = ref([]);
  //维修师傅待确认订单
  let unconfirmedRepairOrders: Ref<Array<Case>> = ref([]);
  //维修师傅已完成订单
  let finishedRepairOrders: Ref<Array<Case>> = ref([]);
  //维修师傅已退单订单
  let backRepairOrders: Ref<Array<Case>> = ref([]);
  return {
    totalRepairOrders,
    workingRepairOrders,
    unconfirmedRepairOrders,
    finishedRepairOrders,
    backRepairOrders,
  };
};
export default defineComponent({
  components: {},
  props: {
    status: {
      type: String as PropType<"unlogin" | "me" | "user">,
      default: "unlogin",
    },
    userInfo: {
      type: Object,
      default: undefined,
    },
  },
  setup(props) {
    const name = computed(() => {
      return props.status === "me"
        ? props?.userInfo?.volunteerInformation?.name
        : props?.userInfo?.name;
    });

    const sex = computed(() => {
      return props.status === "me"
        ? props?.userInfo?.volunteerInformation?.sex
        : props?.userInfo?.sex;
    });

    const registerTimeFromNow = computed(() => {
      const time =
        props.status === "me"
          ? props?.userInfo?.volunteerInformation?.registerTime
          : props?.userInfo?.registerTime;

      return dayjs(time).fromNow(true);
    });

    const avatarUrl = computed(() => {
      return props.status === "me"
        ? props?.userInfo?.avatarUrl
        : props?.userInfo?.volunteer?.avatarUrl;
    });

    const phone = computed(() => {
      return props.status === "me"
        ? props?.userInfo?.phone
        : props?.userInfo?.volunteer?.phone;
    });

    const handleEditProfile = () => {
      navigateTo("/pages/editProfile/index");
    };

    const handleJump = () => {
      console.log("正在登录");
      if (props.status === "unlogin") {
        authService.login(true);
      } else {
        navigateTo("/pages/editProfile/index");
      }
    };
    const handleClickPhone = () => {
      uni.makePhoneCall({
        phoneNumber: phone.value,
      });
    };
    //跳转至订单详情页面
    const handleNavigateToRepairList = (index: number) => {
      console.log("pageId", index);
      //如果未登录，则跳转登录
      if (props.status === "unlogin") {
        authService.login(true);
      } else {
        uni.navigateTo({
          url: `/pages/repairList/index?pageIndex=${index}`,
        });
      }
    };
    //查看更多订单
    const handleMoreRepairOrder = () => {
      //如果未登录，则跳转登录
      if (props.status === "unlogin") {
        authService.login(true);
      } else {
        uni.navigateTo({
          url: `/pages/repairList/index?pageIndex=0`,
        });
      }
    };
    //查看公告信息
    const moreInfo = (sceneType: string) => {
      navigateTo("/pages/announcement/index", { sceneType: sceneType });
    };
    const orderList = [
      {
        id: 1,
        icon: "../../static/images/user/repairring.png",
        title: "进行中",
        value: 5,
      },
      {
        id: 2,
        icon: "../../static/images/user/unconfirmed.png",
        title: "待确认",
        value: 2,
      },
      {
        id: 3,
        icon: "../../static/images/user/done.png",
        title: "已完成",
        value: 3,
      },
      {
        id: 4,
        icon: "../../static/images/user/cancel.png",
        title: "已售后",
        value: 1,
      },
    ];
    console.log("isLogin?", props.status);
    return {
      moreInfo,
      ...useLogin(),
      name,
      sex,
      registerTimeFromNow,
      avatarUrl,
      phone,
      handleEditProfile,
      handleJump,
      handleClickPhone,
      orderList,
      handleNavigateToRepairList,
      // ...useHistory(props.status, props.userInfo),
      handleMoreRepairOrder,
      ...useWorkerRepairInfo(),
    };
  },
});
</script>

<style lang="scss" scoped>
.tag {
  border-radius: 16rpx;
  font-size: 16rpx;
  font-weight: $uni-font-weight-base;
  line-height: 32rpx;
  padding: 0 16rpx;
  text-align: center;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  vertical-align: middle;

  &--nologin {
    background: #d0d0d0;
  }

  &--time {
    background: #f6eec9;
  }
}

.userBox {
  display: flex;
  height: 100rpx;
  box-sizing: border-box;
  margin: 0 auto 40rpx auto;
  width: 672rpx;
  align-items: center;
  position: relative;
  .avatar {
    width: 100rpx;
    height: 100rpx;
    border-radius: 100%;
    background-size: cover;
    box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 4px;
  }
  .avatar--nologin {
    background-color: #dadada;
    background-image: url("../../../../static/images/icon/user.png");
  }
  .name {
    display: flex;
    flex-direction: column;
    margin-left: 20rpx;
    font-weight: $uni-font-weight-bold;
    line-height: 44rpx;
    transition: 1s all;
    &-lg {
      color: #ffffff;
      font-size: $uni-font-size-lg;
      letter-spacing: 1rpx;
    }
    &-ws {
      color: #ebebeb;
      font-size: $uni-font-size-base;
      letter-spacing: 0.5rpx;
    }
  }
  .more {
    color: #ebebeb;
    position: absolute;
    right: 0rpx;
  }
  &:active {
    border-radius: 10rpx;
    background-color: rgba(85, 85, 85, 0.3); /* 半透明蓝色 */
  }
}
.box {
  margin: 0 auto 20rpx auto;
  width: 700rpx;
  height: 250rpx;
  background: #ffffff;
  box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 4px;
  border-radius: 10rpx;
  display: flex;
  flex-direction: column;
  .title {
    width: 100%;
    height: 50rpx;
    display: flex;
    box-sizing: border-box;
    padding: 20rpx;
    margin-top: 10rpx;
    align-items: center;
    justify-content: space-between;
    letter-spacing: 0.5rpx;
    &-name {
      font-size: $uni-font-size-base;
    }
    &-more {
      display: flex;
      align-items: center;
      font-size: $uni-font-size-xs;
      color: #979797;
    }
  }
  .list {
    display: flex;
    flex-direction: row;
    align-items: center;
    box-sizing: border-box;
    padding: 20rpx;
    width: 100%;
    flex: 1;
    justify-content: center;
    .list-box {
      width: 120px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      &-image {
        width: 70rpx;
        height: 70rpx;
      }
      &-title {
        margin-top: 20rpx;
        font-size: $uni-font-size-sm;
        color: #979797;
      }
    }
  }

  .divider {
    width: 416rpx;
    height: 2rpx;
    background-color: #979797;
    margin: 20rpx 0;
  }
}

.service {
  margin: 0 auto 20rpx auto;
  width: 700rpx;
  background: #ffffff;
  box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 4px;
  border-radius: 10rpx;
  display: flex;
  flex-direction: column;
  .title {
    width: 100%;
    height: 50rpx;
    display: flex;
    flex-direction: row;
    box-sizing: border-box;
    padding: 20rpx;
    margin-top: 10rpx;
    align-items: center;
    justify-content: space-between;
    letter-spacing: 0.5rpx;
    &-name {
      font-size: $uni-font-size-base;
    }
    &-more {
      display: flex;
      align-items: center;
      font-size: $uni-font-size-xs;
      color: #979797;
    }
  }
  .content {
    width: 100%;
    height: 100%;
    overflow: hidden;
    padding: 20rpx;
    &-item {
      float: left;
      width: 165rpx;
      height: 130rpx;
      display: flex;
      flex-direction: column;
      text-align: center;
      align-items: center;
      justify-content: center;
      border-radius: 15rpx;
      transition: all 0.2s;
      &:active {
        box-shadow: rgb(204, 219, 232) 3px 3px 6px 0px inset,
          rgba(255, 255, 255, 0.5) -3px -3px 6px 1px inset;
      }
      image {
        width: 60rpx;
        height: 60rpx;
      }
      span {
        margin-top: 10rpx;
        font-size: $uni-font-size-sm;
        color: $uni-text-color;
      }
    }
  }
}
</style>
