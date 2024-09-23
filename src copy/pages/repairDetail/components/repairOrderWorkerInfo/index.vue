<template>
  <view class="repairOrderItem">
    <view class="box">
      <view class="box-info">
        <view class="box-info-user">
          <image
            v-if="orderDetail.volunteer.avatarUrl"
            :src="orderDetail.volunteer.avatarUrl"
            style="width: 80rpx; height: 80rpx; border-radius: 50%"
          />
          <image
            v-if="!orderDetail.volunteer.avatarUrl"
            src="@/static/images/icon/user.png"
            style="width: 80rpx; height: 80rpx; border-radius: 50%"
          />
          <view
            style="
              display: flex;
              flex-direction: column;
              color: #333;
              margin-left: 20rpx;
            "
          >
            <span style="font-size: 28rpx">
              {{ orderDetail.volunteerInformation.name || "暂无师傅姓名" }}
            </span>
            <span style="font-size: 24rpx; margin-left: 10rpx; color: gray">
              {{ orderDetail.volunteerInformation.name ? "师傅" : "" }}
            </span>
          </view>
          <view
            style="
              position: absolute;
              right: 0;
              display: flex;
              align-items: center;
            "
            @click="
              handleShowUserPhone(
                orderDetail.volunteerInformation.phone || undefined
              )
            "
          >
            <image
              style="width: 40rpx; height: 40rpx"
              class="image"
              src="@/static/images/repairDetail/phone-call.png"
            />
            <span style="margin-left: 10rpx; font-size: 26rpx; color: #999">{{
              orderDetail.volunteerInformation.phone || "暂无师傅手机号码"
            }}</span>
          </view>
        </view>
        <view class="box-divide" />
        <view v-if="orderDetail.state !== 2" class="box-info-item">
          <view class="box-info-item-label">维修描述</view>
          <view class="box-info-item-value">{{
            orderDetail.repairDesc || "N/A"
          }}</view>
        </view>
        <view v-if="orderDetail.state !== 2" class="box-info-item">
          <view class="box-info-item-label">维修图片</view>
          <view class="box-info-item-value">
            <view
              v-if="orderDetail.repairImg || orderDetail.repairImg.length"
              class="box-info-item-value-image"
            >
              <view
                class="box-info-item-value-image-item"
                v-for="(item, index) in orderDetail.repairImg"
                :key="index"
                @click="showImageEvent(item, index)"
              >
                <image :src="item" mode="aspectFit" />
              </view>
            </view>
            <view v-if="!orderDetail.repairImg && !orderDetail.repairImg.length"
              >暂无维修照片</view
            >
          </view>
        </view>
      </view>
      <view v-if="orderDetail.state !== 2" class="box-divide" />
      <view v-if="orderDetail.state !== 2" class="box-info-item">
        <view class="box-info-item-label">维修时间</view>
        <view class="box-info-item-value">
          {{ orderDetail.finishAt || "N/A" }}
        </view>
      </view>
    </view>
    <u-popup
      v-model="showPhone"
      custom-class="place-info-popup"
      mode="bottom"
      :border-radius="20"
    >
      <view class="phone">
        <view class="phone-title">联系师傅</view>
        <view
          class="phone-number"
          @click="handleCallUser(orderDetail.volunteerInformation.phone)"
        >
          <view style="display: flex; align-items: center">
            <image
              style="width: 40rpx; height: 40rpx; margin-right: 20rpx"
              class="image"
              src="@/static/images/repairDetail/phone-call.png"
            />
            电话联系
          </view>

          <span
            >{{ orderDetail.volunteerInformation.phone }}
            <text class="iconfont icon-arrow-right"
          /></span>
        </view>
      </view>
    </u-popup>
    <u-popup
      v-model="showImage"
      custom-class="place-info-popup"
      mode="center"
      :border-radius="20"
    >
      <view class="popup-box">
        <swiper
          class="popup-box-swiper"
          :indicator-dots="true"
          :autoplay="false"
          :animation="false"
          :interval="3000"
          :duration="200"
          :current="pickIndex"
          circular
        >
          <swiper-item
            class="popup-box-swiper-item"
            v-for="(item, index) in orderDetail.repairEquipmentContent[
              repairIndex
            ].equipmentImg"
            :key="index"
          >
            <image :src="item" />
          </swiper-item>
        </swiper>
      </view>
    </u-popup>
  </view>
</template>

<script lang="ts">
import { ref, Ref, reactive, defineComponent, watch } from "vue";
import UPopup from "@/components/UPopup/index.vue";
import { showToast } from "@/utils/helper";
const repairIndex: Ref<number> = ref(0);
const equipmentList: Ref<any> = ref([]);
const pickIndex: Ref<number> = ref(0);
const showImage: Ref<boolean> = ref(false);
const showPhone: Ref<boolean> = ref(false);

export default defineComponent({
  name: "RepairOrderWorkerInfo",
  components: { UPopup },
  props: {
    orderDetail: {
      type: Object,
      default: null,
    },
    pageIndex: {
      type: String,
      default: "0",
    },
  },
  setup(props) {
    console.log("props---->", props.orderDetail);
    //待维修设备选择设备
    const handlePickDevice = (e: any) => {
      console.log("value", e.target.value);
      repairIndex.value = e.target.value;
    };
    //放大图片
    const showImageEvent = (item: any, index: number) => {
      uni.previewImage({
        urls: [item],
      });
      // showImage.value = true;
      pickIndex.value = index;
    };
    //构造设备列表
    const getCurrentRepairEquipment = () => {
      const equipment = props.orderDetail.repairEquipmentContent.map(
        (item: object, index: number) => {
          return `当前设备  ${index + 1} ( 总计 ${
            props.orderDetail.repairEquipmentContent.length
          } 个)`;
        }
      );
      console.log("equipment", equipment);
      equipmentList.value = equipment;
    };
    //联系用户事件
    const handleShowUserPhone = (phone: string) => {
      if (phone != undefined) {
        showPhone.value = true;
      } else {
        showToast("师傅未绑定手机号码");
      }
    };
    const handleCallUser = (value: string) => {
      uni.makePhoneCall({
        phoneNumber: value,
      });
    };
    //监听props中data的变化
    watch(
      props,
      (newValue: any, oldValue: any) => {
        getCurrentRepairEquipment();
      },
      { immediate: true }
    );
    return {
      repairIndex,
      equipmentList,
      pickIndex,
      showImage,
      handleCallUser,
      handlePickDevice,
      handleShowUserPhone,
      showImageEvent,
      showPhone,
    };
  },
});
</script>
<style lang="scss">
@mixin flex($direction: row) {
  display: flex;
  flex-direction: $direction;
}

.repairOrderItem {
  width: 100%;
  background-color: #ffffff;
  border-radius: 20rpx;
  .box {
    width: 630rpx;
    border-radius: 15rpx;
    padding: 5rpx 10rpx 40rpx 10rpx;
    &-info {
      width: 100%;
      height: fit-content;
      &-user {
        width: 100%;
        @include flex;
        box-sizing: border-box;
        position: relative;
        align-items: center;
      }
      &-item {
        margin-top: 20rpx;
        width: 100%;
        @include flex;
        &-label {
          width: 180rpx;
          font-size: $uni-font-size-sm;
          color: $uni-text-color-grey;
        }

        &-value {
          flex: 1;
          white-space: nowrap;
          /* 强制文本在一行显示 */
          overflow: hidden;
          /* 隐藏超出容器的内容 */
          text-overflow: ellipsis;
          /* 用省略号表示被截断的文本 */
          font-size: $uni-font-size-sm;
          color: $uni-text-color;
          &-image {
            margin-right: 30rpx;
            text-align: center;
            align-items: center;
            display: flex;
            &-item {
              display: flex;
              border-radius: 10rpx;
              border: 1rpx solid gainsboro;
              margin-right: 20rpx;
              &:active {
                border: 1rpx solid rgba(124, 124, 124, 0.7);
              }
              image {
                width: 120rpx;
                height: 120rpx;
                border-radius: 10rpx;
              }

              span {
                font-size: $uni-font-size-sm;
              }
            }
          }
        }
      }
    }

    &-divide {
      margin-top: 20rpx;
      height: 100%;
      border: 1rpx solid $uni-border-color;
    }

    .popup-box {
      width: 600rpx;
      height: 600rpx;
      background-color: rgba(124, 124, 124, 0.2);

      &-swiper {
        width: 100%;
        height: 100%;

        &-item {
          display: flex;
          // align-items: center;
          justify-content: center;

          image {
            width: 100%;
            height: 90%;
            object-fit: contain;
          }
        }
      }
    }
  }
  .phone {
    width: 100%;
    height: 200rpx;
    &-title {
      width: 100%;
      text-align: center;
      font-size: 32rpx;
      margin-top: 20rpx;
    }

    &-number {
      width: 100%;
      @include flex;
      justify-content: space-between;
      margin-top: 30rpx;
      padding: 30rpx;
      border-radius: 20rpx;
      box-sizing: border-box;

      &:active {
        background-color: $uni-click-black;
      }
    }
  }
}
</style>
