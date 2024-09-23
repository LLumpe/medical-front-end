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
              v-model="formData.address"
              placeholder="请填写街道/小区/办公楼"
              class="box-edit-item-content-input"
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
            <input
              placeholder="请填写联系人"
              v-model="formData.name"
              class="box-edit-item-content-input"
            />
          </view>
        </view>
        <view class="box-edit-item">
          <title>手机号码</title>
          <view class="box-edit-item-content">
            <input
              placeholder="请填写手机号码"
              v-model="formData.phone"
              style="color: #09c46e"
              class="box-edit-item-content-input"
            />
          </view>
          <span @click="getUserPhone" style="font-size: 26rpx; color: gray"
            >自动填充</span
          >
        </view>
        <view class="box-edit-item">
          <view
            class="box-edit-item-content"
            style="justify-content: flex-start"
          >
            <checkbox-group @change="handleDefaultChange">
              <checkbox
                value="isDefault"
                color="#09C46E"
                style="transform: scale(0.7)"
              />
              <span style="font-size: 24rpx"> 是否设为默认地址</span>
            </checkbox-group>
          </view>
        </view>
        <view class="box-edit-item" style="padding: 0">
          <view
            class="box-edit-item-content"
            style="justify-content: flex-start"
          >
            <checkbox-group @change="handleAgreeChange">
              <checkbox
                value="agree"
                color="#09C46E"
                style="transform: scale(0.7)"
              />
              <span style="font-size: 24rpx">
                我已阅读并同意
                <a
                  @click="handleUserservice"
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
  navigateTo,
  showLoading,
  showModal,
  showToast,
} from "@/utils/helper";
const citySelector = requirePlugin("citySelector");
const chooseLocation = requirePlugin("chooseLocation");
import mapSettings from "@/config/map";
import { useLocation } from "@/uses/useLocation";
import { requestAddUserAddress, requestEditUserAddress } from "@/api/address";
import { useStore } from "vuex";
//当前位置
const currentLocation = reactive({ latitude: 0, longitude: 0 });
//获取位置信息
const getLocation = () => {
  return new Promise((resolve, reject) => {
    uni.getLocation({
      type: "gcj02",
      altitude: true,
      success: (data) => {
        console.log("location", data);
        [currentLocation.latitude, currentLocation.longitude] = [
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
  userId: 0,
  province: "",
  city: "",
  district: "",
  address: "",
  name: "",
  phone: "",
  isDefault: 0, //1表示默认，0表示不是默认，默认为0
  agree: false,
  latitude: 0,
  longitude: 0,
});

export default defineComponent({
  name: "CreateAddress",
  components: {},
  setup(props) {
    const store = useStore();
    const getUserPhone = () => {
      if (store.getters.userInfo.phone) {
        formData.phone = store.getters.userInfo.phone;
      } else {
        uni.showModal({
          title: "提示",
          content: "您还未绑定手机号，是否前往绑定？",
          success: function (res) {
            if (res.confirm) {
              navigateTo("/pages/editPhoneNumber/index");
            } else if (res.cancel) {
              console.log("用户点击取消");
            }
          },
        });
      }
    };
    const handleSubmit = async () => {
      showLoading("提交中");
      try {
        if (
          formData.phone === "" ||
          formData.city === "" ||
          formData.province === "" ||
          formData.district === "" ||
          formData.name === "" ||
          formData.address === ""
        ) {
          showToast("请完整填写地址信息");
        } else if (!formData.agree) {
          showToast("添加失败，您尚未同意用户服务协议和隐私政策");
        } else {
          console.log("formData", formData);
          const res = await requestAddUserAddress(formData);
          console.log("res", res);
          if (res.data.success) {
            showToast("添加成功！", "success");
          }
          hideLoading();
          navigateBack();
        }
      } catch (error) {
        showToast("提交事变");
        console.log("error", error);
      }
    };
    const handleDefaultChange = (e: any) => {
      formData.isDefault = e.detail.value.includes("isDefault") ? 1 : 0;
    };
    const handleAgreeChange = (e: any) => {
      console.log("e", e);
      formData.agree = e.detail.value.includes("agree") ? true : false;
    };
    const handleUserservice = () => {
      navigateTo("/pages/privacyPolicy/index");
    };
    const handlePrivacypolicy = () => {
      navigateTo("/pages/privacyPolicy/index");
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
        latitude: currentLocation.latitude,
        longitude: currentLocation.longitude,
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
      handleUserservice,
      handlePrivacypolicy,
      handleAgreeChange,
      handleDefaultChange,
      getUserPhone,
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
      formData.province = location.province || location.city; //省
      formData.city = location.city; //市
      formData.district = location.district; //区
      formData.address = location.address; // 详细地址
      formData.latitude = location.latitude; // 详细地址
      formData.longitude = location.longitude; // 详细地址
    }
  },
  onUnload() {
    console.log("onUnload");
    citySelector.clearCity();
    formData.address = "";
    formData.city = "";
    formData.district = "";
    formData.province = "";
    formData.phone = "";
    formData.name = "";
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
      bottom: -15rpx;
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
      margin: 0 auto;
      border-radius: 20rpx;
      background-color: #ffffff;
      box-shadow: rgba(0, 0, 0, 0.09) 0px 3px 12px;
      padding: 40rpx;
      box-sizing: border-box;
      &-item {
        display: flex;
        width: 100%;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        padding: 20rpx 0;
        title {
          width: 160rpx;
          letter-spacing: 2rpx;
          font-size: $uni-font-size-base;
          color: $uni-text-color-grey;
        }
        &-content {
          margin-left: 20rpx;
          flex: 1;
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: space-between;
          font-size: $uni-font-size-base;
          &-input {
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
