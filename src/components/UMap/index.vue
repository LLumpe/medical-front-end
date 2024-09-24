<template>
  <view class="u-map">
    <map
      id="map"
      class="u-map_map"
      :enable-traffic="enableTraffic"
      :min-scale="12"
      :max-scale="18"
      :show-location="showLocation"
      :latitude="currentLocation.latitude"
      :longitude="currentLocation.longitude"
      :subkey="mapConfig.key"
      :markers="markers"
      @callouttap="handleCalloutTap"
      @markertap="handleCalloutTap"
    />
  </view>
</template>

<script lang="ts">
/**
 * 通用组件参数
 * UMap U地图
 * @description 通用地图组件
 * @property {object:{latitude:number,longitude:number}} currentLocation 使用者当前位置
 * @property {Boolean} showLocation 是否显示位置信息
 * @property {object} mapConfig 地图服务配置
 * @property {Array} markers 地图标点合集
 * @property {Boolean} enableTraffic 地图标点合集
 * @property {type} column 传入参数描述
 */

import { useStore } from "vuex";
import { defineComponent, ref, reactive, getCurrentInstance } from "vue";
import { useLocation } from "@/uses/useLocation";
export interface locationType {
  latitude: number;
  longitude: number;
}
export interface mapMarkers {
  id: number;
  latitude: number; //纬度
  longitude: number; //经度
  title?: string; //标注点名
  iconPath?: string; //显示的图表
  rotate?: number; //顺时针旋转的角度，范围 0 ~ 360，默认为 0
  alpha?: number; //标注的透明度
  width?: number; //标注图标宽度
  height?: number; //标注图标高度
  callout?: object; //自定义标记点上方的气泡窗口
  label?: object; //为标记点旁边增加标签
  anchor?: object; //经纬度在标注图标的锚点，默认底边中点
  clusterId?: number; //自定义点聚合簇效果时使用
  customCallout?: object; //自定义气泡窗口
  joinCluster?: boolean; //是否参与点聚合
}
export interface propsType {
  currentLocation?: locationType;
  showLocation?: boolean;
  mapConfig: object;
  markers?: mapMarkers;
}

/* 自定义地图组件实际，暴露地图示例和方法 */

export default defineComponent({
  name: "USteps",
  props: {
    /**
     * 通用组件传入参数定义
     * column:{
     *    type:"type",
     *    default:"defaultValue"
     * }
     */
    currentLocation: {
      type: Object,
      default() {
        return { latitude: 39.909, longitude: 116.39742 };
      },
    },

    showLocation: {
      type: Boolean,
      default: true,
    },

    mapConfig: {
      type: Object,
      default() {
        return {};
      },
    },

    markers: {
      type: Array,
      default() {
        return [];
      },
    },

    enableTraffic: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, { expose }) {
    const { ctx }: any = getCurrentInstance();
    //地图实例
    const mapContext = uni.createMapContext("map", ctx);
    //debug
    console.log("props", props);
    //text-markers
    const text_markers = [
      {
        id: 1,
        latitude: 39.909,
        longitude: 116.39742,
        iconPath: "/static/images/map/user_location.png", // 需要自定义图标
        width: 30,
        height: 30,
      },
    ];
    // 地图的初始位置
    const mapRegion = reactive({
      latitude: 39.909,
      longitude: 116.39742,
    });
    //获取位置信息
    const getLocation = () => {
      return new Promise((resolve, reject) => {
        uni.getLocation({
          type: "gcj02",
          altitude: true,
          success: (data) => {
            console.log("location", data);
            const location = data;
            resolve({ location: location });
          },
          fail() {
            reject();
          },
        });
      });
    };
    //点击label回调函数
    const handleCalloutTap = (event: any) => {
      if (JSON.parse(JSON.stringify(props)).markers) {
        const markers = JSON.parse(JSON.stringify(props)).markers;
        if (markers.length) {
          markers.map((item: any) => {
            if (item.id === event.detail.markerId) {
              console.log("item", item);
              mapContext.moveToLocation({
                latitude: item.latitude,
                longitude: item.longitude,
              });
            }
          });
        }
      }
    };
    const useMap = () => {
      const store = useStore();
      return { mapContext };
    };
    return { text_markers, mapRegion, mapContext, handleCalloutTap };
  },
});
</script>

<style lang="scss">
.u-map {
  &_map {
    width: 100%;
    height: 40vh;
    z-index: 0;
  }
}
</style>
