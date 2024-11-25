<template>
  <div
    class="UAudio"
    @touchstart="startRecord"
    @touchmove.stop="handleTouchMove"
    @touchend="stopRecord"
  >
    <span
      :style="{
        color: tipsColor.color,
        fontSize: tipsColor.fontSize,
        fontWeight: tipsColor.fontWeight,
      }"
      >{{ tips }}</span
    >
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from "vue";
const plugin = requirePlugin("WechatSI"); //引入微信同声传译包
type tipsColorType = {
  color?: string;
  fontSize?: string;
  fontWeight?: string;
};
export default defineComponent({
  name: "UAudio",
  components: {},
  props: {
    a: {
      type: String,
      default: "1",
    },
  },
  emits: ["recognize"],
  setup(props, { emit }) {
    console.log("props", props);

    //是否开始识别，识别的时候不允许继续录音
    const start = ref(false);

    //录音时的tips
    const tips = ref<string>("按住说话");

    //tips的样式
    const tipsColor = ref<tipsColorType>({
      color: "black",
      fontSize: "20px",
      fontWeight: "600",
    });

    //手指在上方还是下方，默认按压说话的时候在底部
    const isInBottom = ref(true);

    //全局当前屏幕信息
    const windowHeight = ref<number>(0);

    //是否是移出取消，如果是则取消发送，如果不是，则发送
    const isCancel = ref<boolean>(false);
    //初始化获取屏幕信息
    uni.getSystemInfo({
      success: (res) => {
        windowHeight.value = res.windowHeight;
      },
    });

    //全局语义识别管理器recordRecoManager作为状态进行管理
    const recordRecoManager = ref<any>(null);
    //实例化全局唯一的语音识别管理器recordRecoManager以及自定义回调方法
    const useAudio = () => {
      recordRecoManager.value = plugin.getRecordRecognitionManager();

      //注册正常开始录音回调
      recordRecoManager.value.onStart = function (res: any) {
        console.log("成功开始录音识别", res);
      };

      //注册识别结束事件
      recordRecoManager.value.onStop = function (res: any) {
        console.log("record file path", res.tempFilePath);
        console.log("result", res.result);
        if (res && res.result) {
          emit("recognize", { message: res.result, success: true });
        }
      };

      //注册有新的识别内容返回，则会调用此事件
      recordRecoManager.value.onRecognize = function (res: any) {
        console.log("current result", res.result);
      };

      //注册录音开始错误回调
      recordRecoManager.value.onError = function (res: any) {
        console.error("error msg", res.msg);
        if (res && res.msg) {
          emit("recognize", { message: res.msg, success: false });
        }
      };

      //开始录音
      const startRecord = async () => {
        //如果在识别录音，则不允许录音
        if (start.value) return;
        //正在识别
        start.value = true;
        console.log("按住开始录音");
        recordRecoManager.value.start({ duration: 30000, lang: "zh_CN" });
        tips.value = "松开发送，上移取消";
        uni.vibrateShort({
          success: () => {
            console.log("短振动触发成功");
          },
          fail: () => {
            console.log("短振动触发失败");
          },
        });
      };

      //取消录音
      const stopRecord = async () => {
        //如果未在识别，则无法停止
        if (!start.value) return;
        //取消识别
        start.value = false;
        console.log("停止录音");
        recordRecoManager.value.stop();
        //模拟手指松开动作，发送语音进行识别，并且返回识别内容
        tips.value = "按住说话";

        tipsColor.value.color = "#000";
      };

      //处理按压移动手指事件回调
      const handleTouchMove = (res: any) => {
        //保存当前按压位置对象
        const touch = res.touches[0];
        console.log("touchmove", touch);
        //保存当前按压位置离屏幕顶部的距离
        const currentY = touch.pageY;
        //计算当前按压位置离底部的距离
        const distanceFromBottom = windowHeight.value - currentY; // 计算离底部的距离
        console.log("touchmove", distanceFromBottom);
        if (distanceFromBottom && distanceFromBottom > 91) {
          console.log("超出范围，如果松开，则取消发送");
          //如果手指从下部分移动至上部分，则触发振动，其他不触发
          if (isInBottom.value) {
            uni.vibrateShort({
              success: () => {
                console.log("短振动触发成功");
              },
              fail: () => {
                console.log("短振动触发失败");
              },
            });
          }
          //触发松开手取消状态
          isCancel.value = true;
          //触发手指在上部分区域状态
          isInBottom.value = false;
          tips.value = "松开取消";
          tipsColor.value.color = "#fa3534";
        } else {
          console.log("没有超出范围，松开发送");
          //如果手指从上部分移动至下部分，则触发振动，其他不触发
          if (!isInBottom.value) {
            uni.vibrateShort({
              success: () => {
                console.log("短振动触发成功");
              },
              fail: () => {
                console.log("短振动触发失败");
              },
            });
          }
          //触发手指在下部分区域状态
          isInBottom.value = true;
          isCancel.value = false;
          tips.value = "松开发送，上移取消";
          tipsColor.value.color = "#000";
        }
      };
      return {
        recordRecoManager,
        startRecord,
        stopRecord,
        handleTouchMove,
      };
    };

    return {
      start,
      tips,
      ...useAudio(),
      windowHeight,
      tipsColor,
      isInBottom,
    };
  },
});
</script>

<style lang="scss" scoped>
.UAudio {
  width: 100%;
  height: 50px;
  font-size: 20px;
  font-weight: 600;
  letter-spacing: 2px;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
