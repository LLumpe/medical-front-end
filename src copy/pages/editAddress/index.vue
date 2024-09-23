<template>
  <view class="EditAddress">
    <view class="box">
      <view class="box-notice">地址信息仅仅用于上门维修，隐私信息完全保密</view>
      <view class="box-edit">
        <view class="box-edit-item">
          <title>城市</title>
          <view class="box-edit-item-content" @click="handleSelectCity">
            <!-- <view class="box-eidt-item-content-text">{{
              formData.city || "请选择城市"
            }}</view> -->
            <input v-model="formData.city" placeholder="请选择城市" disabled />
            <text class="iconfont icon-arrow-right" />
          </view>
        </view>
        <view class="box-edit-item">
          <title>具体地址</title>
          <view class="box-edit-item-content">
            <input
              placeholder="请填写街道/小区/办公楼"
              v-model="formData.address"
            />
            <image
              src="@/static/images/address/location.png"
              @click="handleSelectPlace"
            />
          </view>
        </view>
        <view class="box-edit-item">
          <title>联系人</title>
          <view class="box-edit-item-content">
            <input placeholder="请填写联系人" v-model="formData.name" />
          </view>
        </view>
        <view class="box-edit-item">
          <title>手机号码</title>
          <view class="box-edit-item-content">
            <input
              placeholder="请填写手机号码"
              v-model="formData.phone"
              style="color: #09c46e"
            />
          </view>
        </view>
        <view class="box-edit-button">
          <button @click="handleSubmit">保存</button>
        </view>
      </view>
    </view>
  </view>
</template>

<script lang="ts">
import { Ref, computed, defineComponent, reactive, ref } from "vue";
import { Address } from "@/api/types/models";
import {
  hideLoading,
  navigateBack,
  showLoading,
  showToast,
} from "@/utils/helper";
const citySelector = requirePlugin("citySelector");
const chooseLocation = requirePlugin("chooseLocation");
import mapSettings from "@/config/map";
import { useLocation } from "@/uses/useLocation";
import { requestEditUserAddress } from "@/api/address";
//当前位置
// const currentLocation = reactive({ latitude: 0, longitude: 0 });
//获取位置信息
const getLocation = () => {
  return new Promise((resolve, reject) => {
    uni.getLocation({
      type: "gcj02",
      altitude: true,
      success: (data) => {
        console.log("location", data);
        [formData.latitude, formData.longitude] = [
          data.latitude,
          data.longitude,
        ];

        resolve("获取位置成功");
      },
      fail() {
        reject();
      },
    });
  });
};
const formData = reactive({
  id: "",
  userId: 0,
  city: "",
  address: "",
  name: "",
  phone: "",
  province: "",
  district: "",
  latitude: 0,
  longitude: 0,
});

export default defineComponent({
  name: "EditAddress",
  components: {},
  setup(props) {
    const handleSubmit = async () => {
      showLoading("提交中");
      try {
        console.log("formData", formData);
        const res = await requestEditUserAddress(formData);
        console.log("res", res);
        if (res.data.success) {
          showToast("编辑成功！", "success");
        }
        hideLoading();
        navigateBack();
      } catch (error) {
        showToast("提交失败");
        console.log("error", error);
      }
    };
    const handleSelectCity = () => {
      let key = mapSettings.key; //使用在腾讯位置服务申请的key
      let referer = mapSettings.appName; //调用插件的app的名称
      let hotCitys = [
        "北京",
        "上海",
        "广州",
        "天津",
        "重庆",
        "深圳",
        "成都",
        "杭州",
        "长沙",
      ];
      wx.navigateTo({
        url: `plugin://citySelector/index?key=${key}&referer=${referer}&hotCitys=${hotCitys}`,
      });
    };
    //选择位置
    const handleSelectPlace = () => {
      let key = mapSettings.key; //使用在腾讯位置服务申请的key
      let referer = mapSettings.appName; //调用插件的app的名称
      let location = JSON.stringify({
        latitude: formData.latitude,
        longitude: formData.longitude,
      });
      wx.navigateTo({
        url:
          "plugin://chooseLocation/index?key=" +
          key +
          "&referer=" +
          referer +
          "&location=" +
          location,
      });
    };
    return {
      handleSubmit,
      handleSelectCity,
      formData,
      handleSelectPlace,
    };
  },
  onShow() {
    getLocation();
    const selectedCity = citySelector.getCity(); // 选择城市后返回城市信息对象，若未选择返回null
    const location = chooseLocation.getLocation(); // 如果点击确认选点按钮，则返回选点结果对象，否则返回null
    console.log("selectedCity", selectedCity);
    console.log("location", location);
    if (selectedCity) {
      formData.city = selectedCity.fullname;
    }
    if (location) {
      formData.address = location.address;
      formData.city = location.city;
      formData.district = location.district;
      formData.province = location.city;
    }
  },
  onLoad(option) {
    if (option.address) {
      console.log("address", JSON.parse(decodeURIComponent(option.address)));
      const address = JSON.parse(decodeURIComponent(option.address));
      formData.address = address.address;
      formData.city = address.city;
      formData.district = address.district;
      formData.name = address.name;
      formData.phone = address.phone;
      formData.province = address.province;
      formData.userId = address.userId;
      formData.id = address.id;
    }
  },
  onUnload() {
    citySelector.clearCity();
    chooseLocation.setLocation(null);
  },
});
</script>

<style lang="scss">
.EditAddress {
  width: 100%;
  .box {
    width: 100%;
    &-notice {
      width: 720rpx;
      height: 78rpx;
      margin: 10rpx auto 0 auto;
      position: relative;
      bottom: -30rpx;
      z-index: -1;
      background-color: #fafafa;
      line-height: 70rpx;
      border-top-left-radius: 20rpx;
      border-top-right-radius: 20rpx;
      text-align: center;
      font-weight: 600;
      color: $uni-color-error;
      box-shadow: rgba(0, 0, 0, 0.09) 0px 3px 12px;
    }
    &-edit {
      width: 720rpx;
      margin: 20rpx auto;
      border-radius: 20rpx;
      background-color: #ffffff;
      box-shadow: rgba(0, 0, 0, 0.09) 0px 3px 12px;
      padding: 40rpx;
      box-sizing: border-box;
      &-item {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        padding: 20rpx 0;
        title {
          width: 160rpx;
          font-weight: 600;
          letter-spacing: 2rpx;
          font-size: $uni-font-size-lg;
        }
        &-content {
          margin-left: 20rpx;
          flex: 1;
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: space-between;
          font-size: $uni-font-size-base;
          color: $uni-text-color-grey;
          input {
            display: flex;
            overflow: auto;
          }
          image {
            width: 50rpx;
            height: 50rpx;
          }
          &-text {
            color: $uni-text-color-grey;
          }
        }
      }
      &-button {
        width: 100%;
        margin-top: 20rpx;
        button {
          height: 80rpx;
          line-height: 80rpx;
          border-radius: 50rpx;
          background-color: $uni-color-primary;
          color: #ffffff;
          &:active {
            background-color: $uni-click-green;
          }
        }
      }
    }
  }
}
</style>
