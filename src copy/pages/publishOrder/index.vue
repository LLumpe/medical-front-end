<template>
  <view class="publishOrder">
    <view class="box">
      <view class="box-form">
        <view class="box-form-item">
          <title class="box-form-item-title">维修地址</title>
          <view
            label="维修地址"
            class="box-form-item-content"
            @click="handleSelectAddress"
          >
            <view class="box-form-item-content-address">
              <view>
                <view style="font-size: 30rpx; margin-bottom: 5rpx"
                  >{{ formData.province || "" }}
                  {{ formData.city ? `- ${formData.city}` : "" }}
                  {{ formData.district ? `- ${formData.district}` : "" }}
                </view>
                <view
                  style="
                    font-size: 36rpx;
                    font-weight: 600;
                    margin-bottom: 5rpx;
                  "
                  >{{ formData.address || "" }}
                </view>
                <view style="font-size: 26rpx"
                  >{{ formData.name || "请选择维修地址" }}
                  {{ formData.phone ? `(${formData.phone})` : "" }}
                </view>
              </view>
              <text
                class="iconfont icon-arrow-right"
                style="align-items: center; display: flex"
              />
            </view>
          </view>
        </view>
        <view class="box-form-item">
          <title class="box-form-item-title">期待维修日期</title>
          <view label="维修地址" class="box-form-item-content">
            <view class="box-form-item-content-date">
              <view style="width: 100%">
                <picker
                  mode="date"
                  :value="formData.expectDate"
                  :start="startDate"
                  :end="endDate"
                  @change="handleDateChange"
                >
                  <view class="uni-input">{{ currentDate }}</view>
                  <span v-if="!currentDate" style="font-size: 26rpx"
                    >请选择期待维修日期</span
                  >
                </picker>
              </view>
              <text
                class="iconfont icon-arrow-right"
                style="align-items: center; display: flex"
              />
            </view>
          </view>
        </view>
        <view class="box-form-item">
          <title class="box-form-item-title">维修方式</title>
          <view label="维修方式" class="box-form-item-content">
            <view class="box-form-item-content-date">
              <view style="width: 100%">
                <picker
                  :value="formData.way"
                  :range="wayRange"
                  @change="handleWayChange"
                >
                  <view class="uni-input">{{ wayRange[currentWay] }}</view>
                </picker>
              </view>
              <text
                class="iconfont icon-arrow-right"
                style="align-items: center; display: flex"
              />
            </view>
          </view>
        </view>
        <view class="box-form-item">
          <title class="box-form-item-title_notrequired">期待维修师傅</title>
          <view label="期待维修师傅" class="box-form-item-content">
            <view class="box-form-item-content-worker">
              <input
                placeholder="请选择期待维修的师傅"
                v-model="formData.expectVolunteer"
              />
            </view>
          </view>
        </view>
      </view>
      <view :key="index" class="box-form" v-for="(item, index) in deviceNumber">
        <title class="box-form-item-title">维修设备信息</title>
        <span class="box-form-item-delete" @click="handleDeviceDelete(index)"
          >删除</span
        >
        <view class="box-form-item">
          <view label="维修设备填报" class="box-form-item-content">
            <view class="box-form-item-content-device">
              <view class="box-form-item-content-device-item">
                <title class="box-form-item-content-device-item-title">
                  设备名称
                </title>
                <input
                  placeholder="请输入设备名称"
                  v-model="formData.repairEquipmentContent[index].equipmentName"
                />
              </view>
              <view class="box-form-item-content-device-item">
                <title class="box-form-item-content-device-item-title">
                  设备故障描述
                </title>
                <view class="box-form-item-content-device-item-desc">
                  <textarea
                    v-model="formData.repairEquipmentContent[index].repairDesc"
                    type="textArea"
                    placeholder="请输入维修描述"
                    :maxlength="50"
                  />
                </view>
              </view>
              <view class="box-form-item-content-device-item">
                <title class="box-form-item-content-device-item-title">
                  故障照片上传
                </title>
                <view label="上传图片" class="box-form-item-content-image">
                  <UUploader
                    :image-styles="imageStyles"
                    :multiple="true"
                    @select="handleImageSelect($event, index)"
                    @delete="handleDelete($event, index)"
                    limit="3"
                    title="最多选择3张图片"
                  />
                </view>
              </view>
            </view>
          </view>
        </view>
      </view>
      <view class="box-add">
        <button @click="handleAdd" type="primary">+添加维修设备</button>
      </view>
    </view>
    <view class="box-block"> </view>
    <view class="box-button">
      <button @click="handleSubmit" type="primary" :disabled="isDiabled">
        提交
      </button>
    </view>
  </view>
</template>

<script lang="ts">
import { Ref, computed, defineComponent, reactive, ref } from "vue";
import UPopup from "@/components/UPopup/index.vue";
import { requestAddRepairOrder } from "@/api/repairOrder";
import UUploader from "@/components/UUploader/index.vue";
import { requestUploadImage } from "@/api/myRepairOrder";
import {
  hideLoading,
  navigateBack,
  showLoading,
  showModalError,
  showToast,
} from "@/utils/helper";
import { Address } from "@/api/types/models";
import { useStore } from "vuex";
export interface formType {
  id: number;
  userId: number;
  desc: string;
  province: string;
  city: string;
  district: string;
  address: string;
  expectDate: string;
  name: string;
  phone: string;
  latitude: number;
  expectVolunteer?: string | null;
  longitude: number;
  creatorType: number;
  repairEquipmentNumber: number;
  repairEquipmentContent: Array<repairEquipmentDetail> | string;
  way: string;
}
export interface UserType {
  id: number;
  name: string;
  phone: string;
  sex: number;
  nickName: string;
  avatarUrl: string;
  country: string;
  province: string;
  city: string;
  district: string;
  state: number;
  registerTime: string;
}
export interface repairEquipmentDetail {
  equipmentName: string;
  repairDesc: string;
  equipmentImg: Array<string>;
}
export default defineComponent({
  name: "PublishOrder",
  components: { UUploader },
  setup() {
    //获取当前日期
    const getDate = (type?: string) => {
      const date = new Date();
      let year = date.getFullYear();
      let month: number | string = date.getMonth() + 1;
      let day: number | string = date.getDate();

      if (type === "start") {
        year = year - 60;
      } else if (type === "end") {
        year = year + 2;
      } else if (type === "current") {
        const futureDate = new Date();
        futureDate.setDate(date.getDate() + 2);
        year = futureDate.getFullYear();
        month = futureDate.getMonth() + 1;
        day = futureDate.getDate();
        return `${year}-${month}-${day}`;
      }
      month = month > 9 ? month : "0" + month;
      day = day > 9 ? day : "0" + day;
      return `${year}-${month}-${day}`;
    };
    //是否可提交
    const isDiabled = ref(false);
    const currentDate = ref(getDate("current"));
    const currentWay = ref(0);
    const repairWorker = ref(null);
    const formData = reactive<formType>({
      id: 0,
      userId: 0,
      desc: "",
      province: "",
      district: "",
      city: "",
      address: "",
      name: "",
      phone: "",
      latitude: 0,
      longitude: 0,
      creatorType: 1,
      expectVolunteer: null,
      repairEquipmentNumber: 0,
      repairEquipmentContent: [],
      expectDate: currentDate.value,
      way: currentWay.value,
    });
    const deviceNumber = ref<number>(0);
    const getAddressFromPage = (address: formType) => {
      formData.province = address.province;
      formData.district = address.district;
      formData.address = address.address;
      formData.city = address.city;
      formData.name = address.name;
      formData.phone = address.phone;
      formData.latitude = address.latitude;
      formData.longitude = address.longitude;
    };
    const handleSubmit = async () => {
      try {
        console.log("formData", formData);
        if (!formData.province && !formData.district && !formData.address) {
          showToast("请填写详细维修地址", "none");
          setTimeout(() => {
            uni.navigateTo({
              url: "/pages/address/index?select=true",
            });
          }, 1000);
        } else if (deviceNumber.value === 0) {
          showToast("请添加需要维修的设备", "none");
        } else if (
          !formData.repairEquipmentContent.every((item: any) => {
            console.log("item", item.equipmentName === "");
            if (item.equipmentName === "") {
              return false;
            }
            return true;
          })
        ) {
          showToast("请填写待维修设备名称");
        } else if (
          !formData.repairEquipmentContent.every((item: any) => {
            if (item.repairDesc == "") {
              return false;
            }
            return true;
          })
        ) {
          showToast("请填写待维修设备描述");
        } else if (
          !formData.repairEquipmentContent.every((item: any) => {
            if (item.equipmentImg.length === 0) {
              return false;
            }
            return true;
          })
        ) {
          showToast("请上传待维修设备图片");
        } else {
          isDiabled.value = true;
          const newData = {
            ...formData,
            repairEquipmentContent: JSON.stringify(
              formData.repairEquipmentContent
            ),
          };
          console.log("formData", newData);
          const res = await requestAddRepairOrder(newData);
          console.log("res", res);
          if (res.data.success) {
            showToast("发布成功", "success");
            setTimeout(() => {
              isDiabled.value = false;
              navigateBack();
            }, 600);
          }
          isDiabled.value = false;
        }
      } catch (error) {
        console.log(error);
        isDiabled.value = false;
        showModalError("提交失败");
      }
    };
    const handleClick = (index: number) => {
      console.log(index);
    };
    //起始日期
    const startDate = () => {
      return getDate("start");
    };
    //起始日期
    const endDate = () => {
      return getDate("end");
    };
    //选择日期
    const handleDateChange = (e: object) => {
      console.log("value", e.detail.value);
      currentDate.value = e.detail.value;
      formData.expectDate = e.detail.value;
    };
    //选择维修方式
    const handleWayChange = (e: object) => {
      console.log("value", e.detail.value);
      currentWay.value = e.detail.value;
      formData.way = e.detail.value;
    };
    //维修方式
    const wayRange = ["上门维修", "店内维修"];
    //选择图片
    const handleImageSelect = async (e: any, index: number) => {
      showLoading();
      try {
        isDiabled.value = true;
        console.log("e--->", e, index);
        const tempFilePath = e.tempFilePaths;
        for (let i = 0; i < tempFilePath.length; i++) {
          const imageUrl = await requestUploadImage(tempFilePath[i]);
          console.log("imageUrl", imageUrl.data.data);
          formData.repairEquipmentContent[index].equipmentImg.push(
            imageUrl.data.data
          );
        }
        // const imageUrl = await requestUploadImage(tempFilePath);
        // console.log("imageUrl", imageUrl.data.data);
        // formData.repairEquipmentContent[index].equipmentImg.push(
        //   imageUrl.data.data
        // );
        showToast("加载成功", "success");
        isDiabled.value = false;
        hideLoading();
      } catch (error) {
        console.log(error);
        hideLoading();
        showModalError("上传图片失败");
      }
    };
    //选择地址
    const handleSelectAddress = () => {
      console.log("选择地址");
      uni.navigateTo({
        url: "/pages/address/index?select=true",
      });
    };
    //删除照片
    const handleDelete = (e: any, index: number) => {
      console.log("e", e.index);
      formData.repairEquipmentContent[index].equipmentImg.splice(e.index, 1);
    };
    //添加设备
    const handleAdd = () => {
      deviceNumber.value++;
      formData.repairEquipmentNumber++;
      formData.repairEquipmentContent.push({
        equipmentName: "",
        repairDesc: "",
        equipmentImg: [],
      });
    };
    //删除设备
    const handleDeviceDelete = (index: number) => {
      uni.showModal({
        title: "提示",
        content: "确认删除设备？",
        success: function (res) {
          if (res.confirm) {
            console.log("index", index);
            formData.repairEquipmentNumber--;
            formData.repairEquipmentContent.splice(index, 1);
            deviceNumber.value--;
          } else if (res.cancel) {
            console.log("用户点击取消");
          }
        },
      });
    };
    //照片样式
    const imageStyles = {
      width: 100,
      height: 100,
      border: {
        width: 2,
        style: "dashed",
        radius: "10px",
      },
    };
    return {
      isDiabled,
      repairWorker,
      handleDeviceDelete,
      deviceNumber,
      currentDate,
      currentWay,
      handleDateChange,
      handleWayChange,
      formData,
      getDate,
      startDate,
      handleClick,
      endDate,
      handleSubmit,
      imageStyles,
      handleImageSelect,
      getAddressFromPage,
      handleDelete,
      handleSelectAddress,
      handleAdd,
      wayRange,
    };
  },
});
</script>

<style lang="scss">
.publishOrder {
  background: linear-gradient(
    to bottom,
    rgba(9, 196, 110, 1),
    rgba(9, 196, 110, 1),
    rgba(9, 196, 110, 1),
    rgba(16, 216, 122, 0.4),
    rgba(17, 206, 118, 0.2),
    rgba(30, 212, 70, 0)
  );

  .box {
    width: 100%;
    box-sizing: border-box;
    overflow: hidden;
    padding: 20rpx 10rpx 20rpx 10rpx;

    &-form {
      width: 100%;
      border-radius: 20rpx;
      position: relative;
      padding: 20rpx;
      margin-bottom: 20rpx;
      overflow: hidden;
      box-sizing: border-box;
      background-color: #ffffff;

      &-item {
        width: 100%;
        position: relative;
        display: block;
        padding: 0 5rpx 0 5rpx;

        &-title {
          display: flex;
          align-items: center;
          font-size: $uni-font-size-xl;
          letter-spacing: 2rpx;
          font-weight: 600;

          &::before {
            content: "*";
            color: red;
          }
        }
        &-title_notrequired {
          display: flex;
          align-items: center;
          font-size: $uni-font-size-xl;
          letter-spacing: 2rpx;
          font-weight: 600;
          padding-left: 20rpx;
        }

        &-delete {
          color: red;
          font-size: 24rpx;
          position: absolute;
          top: 24rpx;
          right: 20rpx;
        }

        &-content {
          width: 100%;
          display: flex;
          flex-direction: row;
          margin: 20rpx 0 20rpx 0;

          &-address {
            width: 100%;
            padding-left: 20rpx;
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            color: $uni-text-color;
            border-radius: 15rpx;
            border: 1rpx solid #ffffff;
            transition: all 0.2s;

            &:active {
              border: 1rpx solid gainsboro;
            }
          }

          &-date {
            width: 100%;
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            margin-left: 20rpx;
          }
          &-worker {
            width: 100%;
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            color: $uni-text-color;
            border-radius: 15rpx;
            padding-left: 10rpx;
            border: 1rpx solid #ffffff;
            transition: all 0.2s;
            input {
              width: 100%;
              margin-top: 5rpx;
              padding: 20rpx;
              height: 10rpx;
              font-size: $uni-font-size-sm;
              border-radius: 15rpx;
              border: 1rpx solid $uni-border-color;
              &:hover {
                background-color: #f4f4f4;
              }
            }
          }
          &-device {
            width: 100%;
            display: flex;
            flex-direction: column;

            &-item {
              display: flex;
              flex-direction: column;

              input {
                margin-top: 10rpx;
                padding: 20rpx;
                height: 50rpx;
                font-size: $uni-font-size-base;
                border-radius: 15rpx;
                border: 1rpx solid $uni-border-color;

                &:hover {
                  background-color: #f4f4f4;
                }
              }

              textarea {
                font-size: $uni-font-size-base;
                box-sizing: border-box;
                padding: 20rpx;
                width: 100%;
                height: 300rpx;
                border-radius: 15rpx;
                border: 1rpx solid $uni-border-color;

                &:hover {
                  background-color: #f4f4f4;
                }
              }

              &-title {
                font-size: $uni-font-size-lg;
                color: $uni-text-color;
                font-weight: 600;
                margin: 10rpx;
              }
            }
          }

          &-desc {
            width: 100%;
            height: 200rpx;
            margin-top: 20rpx;
            border-radius: 20rpx;

            textarea {
              font-size: $uni-font-size-base;
              box-sizing: border-box;
              padding: 20rpx;
              width: 100%;
              height: 100%;
              border-radius: 20rpx;
              border: 1rpx solid $uni-border-color;

              &:hover {
                background-color: #f4f4f4;
              }
            }
          }

          &-image {
            box-sizing: border-box;
            width: 100%;
            height: 300rpx;
            border-radius: 20rpx;
            border: 1rpx dashed $uni-border-color;
            padding: 10rpx;
            margin-top: 20rpx;
            border-radius: 20rpx;
          }
        }
      }
    }

    &-add {
      width: 100%;
      height: 80rpx;
      box-sizing: border-box;
      border-radius: 20rpx;

      button {
        border-radius: 20rpx;
        height: 80rpx;
        line-height: 80rpx;
        border: 2rpx solid gainsboro;
        background-color: #ffffff;
        color: black;
        font-weight: 600;

        &:active {
          background-color: #f4f4f4;
        }
      }
    }

    &-block {
      width: 100%;
      height: 150rpx;
    }

    &-button {
      width: 100%;
      background-color: #ffffff;
      height: 160rpx;
      padding: 10rpx;
      padding-bottom: 40rpx;
      box-sizing: border-box;
      position: fixed;
      bottom: 0;
      left: 0;
      z-index: 2;

      button {
        margin-top: 20rpx;
        width: 700rpx;
        border-radius: 50rpx;
      }
    }
  }
}
</style>
