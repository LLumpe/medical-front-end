<!--
 * @Author: LLumpe LLumpe@163.com
 * @Date: 2024-07-09 03:16:54
 * @LastEditors: LLumpe LLumpe@163.com
 * @LastEditTime: 2024-07-29 14:22:27
 * @FilePath: \repair-miniapp-user\src\pages\editProfile\index.vue
 * @Description: 
 * 
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved. 
-->
<template>
  <view>
    <u-cell-group>
      <u-cell-item
        title="头像"
        :value-style="{
          display: 'flex',
          flexDirection: 'row-reverse',
          alignItems: 'center',
        }"
        @click="handleChooseAvatar"
      >
        <view class="avatar">
          <image
            :src="userInfo.avatarUrl"
            mode="aspectFill"
            class="avatar-image"
          />
          <view class="avatar-icon">
            <image
              src="@/static/images/profile/camera.png"
              class="avatar-icon-image"
            />
          </view>
        </view>
      </u-cell-item>
      <u-cell-item
        title="昵称"
        :value="userInfo.name || 'N/A'"
        hover-class="none"
        @click="handleEditName"
      />
      <picker
        :range="sexRange"
        :range-key="'name'"
        :value="userInfo.sex - 1"
        @change="handleSexPickerChange"
      >
        <u-cell-item
          title="性别"
          :value="
            userInfo.sex &&
            (userInfo.sex == 1 ? '男' : userInfo.sex == 2 ? '女' : '')
          "
        />
      </picker>
      <u-cell-item
        title="手机号"
        :value="userInfo.phone || 'N/A'"
        @click="handleEditPhoneNumber"
      />
    </u-cell-group>
    <u-cell-group title=" ">
      <u-cell-item
        title="加入时间"
        :value="userInfo.registerTime || 'N/A'"
        :arrow="false"
        hover-class="none"
      />
      <u-cell-item
        title="加入时长"
        :value="registerTimeFromNow || 'N/A'"
        :arrow="false"
        hover-class="none"
      />
      <picker
        mode="region"
        :value="addressArray || 'N/A'"
        @change="handleAddressPickerChange"
      >
        <u-cell-item title="常居地" :value="address" />
      </picker>
    </u-cell-group>
    <u-cell-group title=" ">
      <view class="quit" @click="handleLogout"> 退出登录 </view>
    </u-cell-group>
  </view>
</template>

<script lang="ts">
import { computed, defineComponent } from "vue";
import UCellGroup from "@/components/UCellGroup/index.vue";
import UCellItem from "@/components/UCellItem/index.vue";
import { useStore } from "vuex";
import dayjs from "@/utils/dayjs";
import { requestUpdateAvatar, requestUpdateInformation } from "@/api/user";
import authService from "@/service/authService";
import {
  hideLoading,
  navigateBack,
  navigateTo,
  showLoading,
  showModalError,
  showToast,
} from "@/utils/helper";
import { VolunteerInformation } from "@/api/types/models";
import { requestUploadImage } from "@/api/common";
import bus from "@/utils/bus";
import store from "@/store";

const editUserInfo = async (params: VolunteerInformation) => {
  showLoading("请稍候");
  try {
    await requestUpdateInformation(params);
    await authService.getUserInfo();
    showToast("修改成功", "success");
  } catch (e) {
    console.log(e);
    hideLoading();
  }
};

const useShowInfo = () => {
  const store = useStore();

  const userInfo = computed(() => {
    return store.getters.userInfo;
  });
  console.log("userInfo", userInfo);
  const registerTimeFromNow = computed(() => {
    const time: string = userInfo?.value?.registerTime;

    return dayjs(time).fromNow(true);
  });

  const address = computed(() => {
    const province = userInfo?.value?.province;
    const city = userInfo?.value?.city;
    const district = userInfo?.value?.district;

    return province && city && district
      ? `${province} ${city} ${district}`
      : "";
  });

  const addressArray = computed(() => {
    const province = userInfo?.value?.province;
    const city = userInfo?.value?.city;
    const district = userInfo?.value?.district;

    return [province, city, district];
  });

  return {
    userInfo,
    registerTimeFromNow,
    address,
    addressArray,
  };
};

const useEditSex = () => {
  const sexRange = [
    {
      id: 1,
      name: "男",
    },
    {
      id: 2,
      name: "女",
    },
  ];

  const handleSexPickerChange = async (e: any) => {
    const index = parseInt(e.detail.value, 10);
    const sex = sexRange[index].id;

    await editUserInfo({ sex });
  };

  return { sexRange, handleSexPickerChange };
};

const useEditAddress = () => {
  const handleAddressPickerChange = async (e: any) => {
    const arr = e.detail.value;
    await editUserInfo({
      province: arr[0],
      city: arr[1],
      district: arr[2],
    });
  };

  return { handleAddressPickerChange };
};

const useEditAvatar = () => {
  const handleChooseAvatar = () => {
    navigateTo("/pages/UAvatarCropper/index", {
      // 输出图片宽度，高等于宽，单位px
      destWidth: 200,
      // 裁剪框宽度，高等于宽，单位px
      rectWidth: 200,
      // 输出的图片类型，如果'png'类型发现裁剪的图片太大，改成"jpg"即可
      fileType: "jpg",
    });
  };

  return { handleChooseAvatar };
};

const handleEditName = () => {
  navigateTo("/pages/editName/index", { name: store.getters.userInfo.name });
};
const uploadAvatar = async (path: string) => {
  showLoading("请稍候");
  console.log("path", path);
  try {
    const uploadRes = await requestUploadImage(path);
    console.log(uploadRes);
    if (uploadRes.data.status !== 200 || !uploadRes.data.data) {
      throw Error("上传图片失败");
    }
    const avatarUrl = uploadRes.data.data;
    await requestUpdateAvatar({ avatarUrl });
    await authService.getUserInfo();
    showToast("修改成功", "success");
  } catch (e) {
    console.log(e);
    hideLoading();
    showModalError("上传图片失败");
  }
};

const handleAvatarChange = (path: any) => {
  uploadAvatar(path);
};

export default defineComponent({
  components: { UCellGroup, UCellItem },
  setup() {
    const handleEditPhoneNumber = () => {
      navigateTo("/pages/editPhoneNumber/index");
    };
    const handleLogout = () => {
      navigateBack();
      authService.logout();
    };
    return {
      ...useShowInfo(),
      ...useEditSex(),
      ...useEditAddress(),
      ...useEditAvatar(),
      handleLogout,
      handleEditName,
      handleEditPhoneNumber,
    };
  },
  onShow() {
    authService.getUserInfo();
  },
  onLoad() {
    bus.on("uAvatarCropper", handleAvatarChange);
  },
  onUnload() {
    bus.off("uAvatarCropper", handleAvatarChange);
  },
});
</script>

<style lang="scss" scoped>
.avatar {
  width: 96rpx;
  height: 96rpx;
  border-radius: 100%;
  overflow: hidden;
  position: relative;

  &-image {
    width: 96rpx;
    height: 96rpx;
    border-radius: 100%;
  }

  &-icon {
    position: absolute;
    bottom: 0;
    width: 96rpx;
    height: 24rpx;
    // background-color: rgba(0, 0, 0, 0.3);
    display: flex;
    justify-content: center;
    align-items: center;

    &-image {
      width: 24rpx;
      height: 24rpx;
    }
  }
}
.quit {
  // margin-top: 60px;
  text-align: center;
  line-height: 96rpx;
  color: $uni-color-error;
  box-sizing: border-box;
  &:active {
    background-color: rgb(247, 248, 249, 1);
  }
}
</style>
