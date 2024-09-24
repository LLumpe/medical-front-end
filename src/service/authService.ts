import templateMessageSettings from "@/config/templateMessage";
import { ActionTypes } from "@/enums/actionTypes";
import { MutationTypes } from "@/enums/mutationTypes";
import store from "@/store";
import {
  hideLoading,
  navigateTo,
  showLoading,
  showModalError,
  showToast,
} from "@/utils/helper";
import {
  getToken,
  removeRefreshToken,
  removeToken,
  setRefreshToken,
  setToken,
} from "@/utils/auth";
const login = async (triggeredByButton = false) => {
  // showLoading("登录中");
  // await store.dispatch(ActionTypes.login);
  // const res = await getUserInfo(); //获取个人信息
  // await requestLocationPermission(); // 申请定位权限
  // console.log("store.getters.hasVolunteerInfo", store.getters.hasVolunteerInfo);
  // if (store.getters.hasVolunteerInfo) {
  //   showToast("登录成功", "success");
  //   try {
  //     checkPermissions(triggeredByButton); // 检查权限
  //   } catch (e) {
  //     console.log(e);
  //   }
  // } else {
  //   hideLoading();
  //   console.log("111", store.getters.userInfo);
  //   if (!store.getters.userInfo.phone) {
  //     // 如果没有绑定手机，则直接进入绑定个人信息页面
  //     navigateTo("/pages/register/index");
  //   }
  // }
};

const logout = async () => {
  showLoading("退出中");

  try {
    await store.dispatch(ActionTypes.logout);
    await store.dispatch(ActionTypes.clearCurrentMission);
    store.commit(MutationTypes.SET_MY_ALL_MISSIONS, []);
    showToast("退出成功", "success");
  } catch (e) {
    hideLoading();
    console.log(e);
  }
};

const getUserInfo = async () => {
  try {
    await store.dispatch(ActionTypes.getUserInfo);
  } catch (e) {
    console.log(e);
  }
};

const getLocation = () => {
  return new Promise<UniApp.GetLocationSuccess>((resolve, reject) => {
    uni.getLocation({
      type: "gcj02",
      altitude: true,
      success: (data) => {
        console.log("location", data);
        resolve(data);
      },
      fail() {
        reject();
      },
    });
  });
};

const requestLocationPermission = () => {
  return new Promise<void>((resolve, reject) => {
    uni.authorize({
      scope: "scope.userLocation",
      success() {
        console.log("位置权限申请成功");
        getLocation();
        resolve();
      },
      fail() {
        showModalError("请授予本程序定位权限");
        reject();
      },
    });
  });
};

const checkPermissions = (triggeredByButton = false) => {
  return new Promise<void>((resolve, reject) => {
    uni.getSetting({
      withSubscriptions: true,
      success(res) {
        console.debug(res.subscriptionsSetting);
        if (
          !res.subscriptionsSetting.mainSwitch ||
          !res.subscriptionsSetting.itemSettings ||
          res.subscriptionsSetting.itemSettings[
            templateMessageSettings.tmplIds[0]
          ] !== "accept"
        ) {
          // navigateTo("/pages/requestSubscribeMessage/index");
        } else if (triggeredByButton) {
          // 如果用户已永久授权并通过点击登录按钮登录，则申请一次订阅权限
          try {
            uni.requestSubscribeMessage({
              tmplIds: templateMessageSettings.tmplIds,
            });
          } catch (e) {}
        }

        resolve();
      },
      fail() {
        reject();
      },
    });
  });
};

export default { login, logout, getUserInfo };
