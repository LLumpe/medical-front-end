<template>
  <view class="repairDetail">
    <view class="box">
      <view class="box-title">
        <view>
          <view style="display: flex; flex-direction: row">
            <h1 style="margin-right: 15rpx">{{ orderLabel[state].title }}</h1>
            <ULoadMore v-if="isLoading" status="loading" iconSize="20" />
          </view>
          <h3>{{ orderLabel[state].content }}</h3>
        </view>
        <view class="box-image">
          <image src="@/static/images/repairDetail/repairMan.png" />
        </view>
      </view>
      <view class="box-orderId">
        <span class="box-orderId-content"> 订单号：{{ orderNumber }} </span>
        <view style="color: #09c46e" @click="handleCopyRepairId">复制</view>
      </view>
      <view class="box-order">
        <view class="box-order-title"> 订单状态：</view>
        <view class="box-order-content">
          <view class="box-order-steps">
            <view class="box-order-steps-item">
              <USteps
                :options="stepList"
                active-icon="loop"
                :active="activeIndex"
                active-color="#09C46E"
              />
            </view>
          </view>
        </view>
      </view>
      <view class="box-order">
        <view class="box-order-title"> 订单详情：</view>
        <view class="box-order-content">
          <RepairOrderDetailInfo :orderDetail="currentRepairOrder" />
        </view>
      </view>
      <view
        v-if="currentRepairOrder.state !== 0 && currentRepairOrder.state !== 1"
        class="box-order"
      >
        <view class="box-order-title">
          {{ currentRepairOrder.state === 2 ? "接单师傅：" : "维修记录：" }}
        </view>
        <view class="box-order-content">
          <RepairOrderWorkerInfo :orderDetail="currentRepairOrder" />
        </view>
      </view>
      <view
        v-if="
          currentRepairOrder.state !== 2 &&
          currentRepairOrder.state !== -10 &&
          currentRepairOrder.state >= 0
        "
        class="block"
      />
      <view
        v-if="
          currentRepairOrder.state !== 2 &&
          currentRepairOrder.state !== -10 &&
          currentRepairOrder.state >= 0
        "
        class="box-option"
      >
        <view
          v-if="
            currentRepairOrder.state === 0 || currentRepairOrder.state === 1
          "
          class="box-option-item"
          @click="handleRepairCancel"
        >
          取消订单
        </view>
        <view
          v-if="
            currentRepairOrder.state === 3 || currentRepairOrder.state === 4
          "
          class="box-option-item"
          @click="handleRepairBack"
        >
          返修
        </view>
        <view
          v-if="
            currentRepairOrder.state === 3 || currentRepairOrder.state === 4
          "
          class="box-option-item"
          @click="handleOrderBack"
        >
          退单
        </view>
        <view
          v-if="currentRepairOrder.state === 3"
          class="box-option-item"
          @click="handleSubmitImage"
        >
          确认完成
        </view>
      </view>

      <u-popup
        v-model="showMessage"
        custom-class="place-info-popup"
        mode="center"
        :border-radius="20"
        @close="handleModalClose"
      >
        <view class="message">
          <title class="message-title">确认订单须知</title>
          <h1></h1>
          <view class="message-content">
            <view>
              尊敬的客户，您好！感谢您选择我们的维修服务，为了确保您的权益，请仔细阅读一下确认订单须知：
            </view>
            <view class="message-content-text">
              请检查师傅是否已按照订单要求完成所有维修项目，若有任何未完成或遗漏的项目，请及时告知师傅或联系客户服务。
            </view>
            <view class="message-content-text">
              请仔细检查维修质量，确保所有修理部位正常运行且没有出现新的问题。
            </view>
            <view class="message-content-text">
              如有任何不满意之处，可以后续提供退单或者返修的需求。
            </view>
            <br />
          </view>
          <view class="message-button">
            <button @click="handleCancelOrder">
              {{ text }}
            </button>
            <button @click="handleAcceptOrder">确认</button>
          </view>
        </view>
      </u-popup>
    </view>
  </view>
</template>

<script lang="ts">
import { ref, Ref, defineComponent, onUnmounted, computed } from "vue";
import USteps from "@/components/USteps/index.vue";
import RepairOrderDetailInfo from "./components/repairOrderDetailInfo/index.vue";
import RepairOrderWorkerInfo from "./components/repairOrderWorkerInfo/index.vue";
import UPopup from "@/components/UPopup/index.vue";
import ULoadMore from "@/components/ULoadMore/index.vue";
import {
  hideLoading,
  navigateBack,
  navigateTo,
  showLoading,
  showToast,
} from "@/utils/helper";
import { repairOrder } from "@/api/types/models";
import { requestUserFinishRepairOrder } from "@/api/repairOrder";
import { requestCancelOrder } from "@/api/repairOrder";
//维修进度状态
const stepList = ref<Array<object>>([]);
//显示确认须知
const showMessage = ref(false);
//定时关闭
let timeout = ref<number | null>(null);
//定时跳转
let timenav = ref<number | null>(null);
//设置关闭秒数
const count = ref<number>(7);
//显示关闭
const text = ref<string>("取消");
//折叠是否显示
const showCollapse = ref<Array<string>>(["0"]);
//steps所在的当前状态
const activeIndex = ref(0);
//维修标签状态
const repairLabel = {
  "2": "订单进行中",
  "3": "订单待确认",
  "4": "订单已完成",
  "4-4": "订单已退单",
};
//订单状态描述
const orderLabel = {
  "0": {
    title: "待审核",
    content: "订单正在审核中，请您耐心等待~",
  },
  "1": {
    title: "待接单",
    content: "订单正在等待师傅接单，祝您生活愉快~",
  },
  "2": {
    title: "进行中",
    content: "订单正在进行中，祝您生活愉快~",
  },
  "3": {
    title: "待确认",
    content: "订单已维修完毕，请您确认~",
  },
  "4": {
    title: "已完成",
    content: "订单已经完成，祝您生活愉快~",
  },

  "-1": {
    title: "已取消",
    content: "订单已取消，祝您生活愉快~",
  },
  "-2": {
    title: "审核不通过",
    content: "订单售后审核被驳回，请您咨询客户或重新提交~",
  },
  "-3": {
    title: "退单申请中",
    content: "订单退单申请中，请您耐心等待~",
  },
  "-4": {
    title: "退单审核不通过",
    content: "订单退单审核被驳回，请您咨询客户或重新提交~",
  },
  "-5": {
    title: "已退单",
    content: "订单已退单，祝您生活愉快~",
  },
  "-6": {
    title: "返修申请中",
    content: "订单返修申请中，请您耐心等待~",
  },
  "-7": {
    title: "返修审核不通过",
    content: "订单返修审核被驳回，请您咨询客户或重新提交~",
  },
  "-8": {
    title: "已返修",
    content: "订单已返修，祝您生活愉快~",
  },
};
const currentRepairOrder: Ref<repairOrder | null> = ref(null);
export default defineComponent({
  name: "RepairDetail",
  components: {
    USteps,
    RepairOrderDetailInfo,
    UPopup,
    RepairOrderWorkerInfo,
    ULoadMore,
  },
  props: {
    repairOrder: {
      type: String,
      default: null,
    },
  },

  setup(props) {
    const useProps = () => {
      //订单状态
      const state = computed(() => {
        return JSON.parse(props.repairOrder).state;
      });
      //订单号
      const orderNumber = computed(() => {
        return JSON.parse(props.repairOrder).orderNumber || "N/A";
      });
      //是否加载
      const isLoading = computed(() => {
        return [0, 1, 2, 3, -3, -6].includes(
          JSON.parse(props.repairOrder).state
        );
      });
      return { state, orderNumber, isLoading };
    };
    const handleCopyRepairId = () => {
      uni.setClipboardData({
        data: useProps().orderNumber.value,
        success() {
          uni.showToast({
            title: "复制成功",
            icon: "success",
          });
        },
        fail() {
          uni.showToast({
            title: "复制失败",
            icon: "none",
          });
        },
      });
    };
    //折叠面板折叠
    const handleCollapseChange = (value: any) => {
      console.log("value", value);
    };

    //返修
    const handleRepairBack = () => {
      //type 0表示返修,1表示退单
      uni.navigateTo({
        url:
          "/pages/orderBack/index?id=" +
          currentRepairOrder.value.id +
          "&type=0&repairOrder=" +
          encodeURIComponent(props.repairOrder),
      });
      // navigateTo("/pages/orderBack/index", {
      //   id: currentRepairOrder.value.id,
      //   type: 0,
      //   repairOrder: encodeURIComponent(props.repairOrder),
      // });
    };
    //退单
    const handleOrderBack = () => {
      uni.navigateTo({
        url:
          "/pages/orderBack/index?id=" +
          currentRepairOrder.value.id +
          "&type=1&repairOrder=" +
          encodeURIComponent(props.repairOrder),
      });
    };
    //提醒用户
    const handlePushUser = () => {
      showToast("提醒用户成功！", "success");
    };
    //用户确认订单完成
    const handleSubmitImage = () => {
      startCountDown();
      showMessage.value = true;
    };
    //取消
    const handleCancelOrder = () => {
      showMessage.value = false;
      clearInterval(timeout.value);
    };
    //确认
    const handleAcceptOrder = async () => {
      showMessage.value = false;
      clearInterval(timeout.value);
      try {
        const data = {
          ...currentRepairOrder.value,
          repairEquipmentContent: JSON.stringify(
            currentRepairOrder.value.repairEquipmentContent
          ),
          repairImg: JSON.stringify(
            currentRepairOrder.value.repairEquipmentContent
          ),
          orderFlowDate: null,
          orderFlowDesc: null,
          orderFlowFinish: null,
          orderFlowList: null,
          orderFlowState: null,
        };
        const res = await requestUserFinishRepairOrder(data);
        console.log("res", res);
        if (res.data.success) {
          showToast("订单确认成功", "success");
          timenav.value = setTimeout(() => {
            navigateBack();
          }, 600);
        }
      } catch (error) {
        showToast("error");
        console.log("error", error);
      }
    };
    //弹窗关闭
    const handleModalClose = () => {
      clearInterval(timeout.value);
    };
    const CancelOrder = async () => {
      showLoading("取消中");
      try {
        const res = await requestCancelOrder(currentRepairOrder.value);
        console.log("res", res);
        if (res.data.success) {
          showToast("订单取消成功", "success");
          timenav.value = setTimeout(() => {
            navigateBack();
          }, 600);
        }
      } catch (error) {
        showToast("取消失败");
      }
    };
    //取消订单
    const handleRepairCancel = () => {
      uni.showModal({
        title: "提示",
        content: "是否取消订单？",
        success: function (res: any) {
          console.log("res", res);
          if (res.confirm) {
            showLoading("取消中");
            CancelOrder();
            hideLoading();
          } else {
            hideLoading();
            console.log("用户取消了");
          }
        },
        fail: function () {
          hideLoading();
          console.log("用户取消了");
        },
      });
    };

    const startCountDown = () => {
      count.value = 7;
      text.value = "关闭";
      timeout.value = setInterval(() => {
        console.log("count", count.value);

        if (count.value > 0) {
          if (count.value <= 5) {
            text.value = `关闭 (${count.value})`;
          } else {
            text.value = "关闭";
          }
          count.value--;
        } else {
          showMessage.value = false;
          clearInterval(timeout.value);
        }
      }, 1000);
    };
    onUnmounted(() => {
      if (timeout.value) {
        clearInterval(timeout.value);
        clearInterval(timenav.value);
      }
    });
    return {
      activeIndex,
      ...useProps(),
      orderLabel,
      handleRepairBack,
      handleOrderBack,
      repairLabel,
      currentRepairOrder,
      handleCopyRepairId,
      stepList,
      handleCollapseChange,
      showCollapse,
      handleSubmitImage,
      showMessage,
      handlePushUser,
      handleRepairCancel,
      timeout,
      timenav,
      CancelOrder,
      handleCancelOrder,
      handleModalClose,
      count,
      startCountDown,
      text,
      handleAcceptOrder,
    };
  },
  onLoad(options) {
    console.log(
      "repairDetail options --->",
      JSON.parse(decodeURIComponent(options?.repairOrder))
    );
    const data = JSON.parse(decodeURIComponent(options?.repairOrder));
    let newData = {};
    if (data.repairEquipmentContent) {
      newData = {
        ...data,
        repairEquipmentContent: JSON.parse(data.repairEquipmentContent),
        repairImg: JSON.parse(data.repairImg),
      };
    }
    console.log("repairDetail newData", newData);
    if (newData.orderFlowList) {
      const tempList: Array<object> = [];
      newData.orderFlowList.map((item: any, index: number) => {
        tempList.push({
          title: item.desc,
          desc: item.time || "",
        });
        if (item.finish) {
          activeIndex.value = index + 1;
        }
      });
      stepList.value = tempList;
    }
    currentRepairOrder.value = newData;
  },
});
</script>

<style lang="scss">
@mixin flex($direction: row) {
  display: flex;
  flex-direction: $direction;
}
@mixin box() {
  width: 100%;
  border-radius: 20rpx;
  background-color: #ffffff;
  box-shadow: rgba(0, 0, 0, 0.04) 0px 3px 5px;
}
.repairDetail {
  .box {
    width: 100vw;
    padding: 30rpx;
    box-sizing: border-box;
    border-radius: 15rpx;
    &-title {
      @include flex(row);
      height: 170rpx;
      width: 100%;
      padding: 0 10rpx;
      box-sizing: border-box;
      justify-content: space-between;
      align-items: center;
      h1 {
        font-size: $uni-font-size-xxl;
        margin-bottom: 10rpx;
      }
      h2 {
        font-size: $uni-font-size-lg;
      }
    }
    &-image {
      width: 130rpx;
      height: 130rpx;
      border-radius: 50%;
      overflow: hidden;
      image {
        width: 130rpx;
        height: 130rpx;
      }
    }
    &-notice {
      width: 100%;
      height: 200rpx;
      @include flex;
      align-items: center;
      &-content {
        flex: 1;
        // height: 130rpx;
        background-color: #ffffff;
        margin-left: 20rpx;
        border-radius: 30rpx;
        // padding: 20rpx;
        box-sizing: border-box;
        display: flex;
        align-items: center;
        box-shadow: rgba(0, 0, 0, 0.04) 0px 3px 5px;
        span {
          margin-left: 20rpx;
          width: 100%;
          letter-spacing: 2rpx;
          font-size: $uni-font-size-base;
          color: $uni-text-color;
        }
      }
    }
    &-orderId {
      @include box;
      @include flex(row);
      align-items: center;
      justify-content: space-between;
      box-sizing: border-box;
      padding: 30rpx;
      &-content {
        letter-spacing: 2rpx;
        font-size: $uni-font-size-base;
        color: $uni-text-color;
        width: 530rpx;
        white-space: nowrap; /* 禁止文本换行 */
        overflow: hidden; /* 隐藏溢出内容 */
        text-overflow: ellipsis; /* 使用省略号表示溢出内容 */
      }
    }
    &-order {
      width: 100%;
      @include flex(column);
      border-radius: 20rpx;
      box-shadow: rgba(0, 0, 0, 0.04) 0px 3px 5px;
      margin-top: 30rpx;
      background-color: #ffffff;
      display: flex;
      &-content {
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 0;
      }
      &-title {
        font-size: $uni-font-size-base;
        color: $uni-text-color;
        padding: 30rpx 0 20rpx 30rpx;
      }
      &-steps {
        margin: 0 30rpx;
        width: 100%;
        overflow-x: auto;
        overflow-y: hidden;
        -webkit-overflow-scrolling: touch; /* 在 iOS 上启用惯性滚动 */
        &-item {
          width: 1200rpx;
          margin: 0 0 30rpx 0;
        }
      }
    }
    &-option {
      display: flex;
      flex-direction: row;
      justify-content: flex-end;
      width: 100%;
      height: 140rpx;
      background-color: #ffffff;
      position: fixed;
      bottom: 0;
      left: 0;
      padding: 20rpx;
      box-sizing: border-box;
      box-shadow: rgba(0, 0, 0, 0.04) 0px 3px 5px;
      &-item {
        display: flex;
        align-items: center;
        justify-content: center;
        // width: 200rpx;
        padding: 0 20rpx;
        height: 70rpx;
        margin-left: 20rpx;
        border-radius: 50rpx;
        background-color: $uni-color-primary;
        color: #ffffff;
      }
    }
    .message {
      width: 600rpx;
      position: relative;
      padding-bottom: 100rpx;
      &-title {
        display: block;
        text-align: center;
        box-sizing: border-box;
        padding: 20rpx;
        font-size: $uni-font-size-xl;
        color: $uni-color-primary;
        font-weight: 600;
      }
      &-content {
        width: 100%;
        padding: 30rpx;
        box-sizing: border-box;
        &-text {
          padding: 20rpx 20rpx 0 20rpx;
          box-sizing: border-box;
          &::before {
            content: "*";
            color: red;
          }
        }
      }
      &-button {
        width: 100%;
        display: flex;
        flex-direction: row;
        position: absolute;
        bottom: 0;
        button {
          font-size: $uni-font-size-lg;
          width: 50%;
        }
      }
    }
    .block {
      display: inline-block;
      width: 100%;
      height: 130rpx;
    }
  }
}
.box-order-steps::-webkit-scrollbar {
  height: 0rpx; /* 滚动条的宽度 */
}
</style>
