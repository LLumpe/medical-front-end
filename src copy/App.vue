<script lang="ts">
import { defineComponent } from "vue";
import authService from "./service/authService";
import { getToken } from "./utils/auth";

export default defineComponent({
  onLaunch() {
    console.log("App Launch");
    if (getToken()) {
      authService.login();
    }
  },
  onShow() {
    console.log("App Show");
  },
  onHide() {
    console.log("App Hide");
  },
});
</script>
<style lang="scss">
@import "./styles/iconfont.scss";
@import "./styles/common.scss";
@import url("./static/iconfonts/iconfont.wxss");
@font-face {
  font-family: "alimama VF Regular";
  src: url("//at.alicdn.com/wf/webfont/FEu2OM05TFwF/nPSIwOLavlRs.woff2")
      format("woff2"),
    url("//at.alicdn.com/wf/webfont/FEu2OM05TFwF/Y3PqAhzF2Mju.woff")
      format("woff");
  font-display: swap;
}
@font-face {
  font-family: "alimama eng";
  src: url("//at.alicdn.com/wf/webfont/FEu2OM05TFwF/dkSzSOE2BVql.woff2")
      format("woff2"),
    url("//at.alicdn.com/wf/webfont/FEu2OM05TFwF/dWC17lDLAnTg.woff")
      format("woff");
  font-display: swap;
}

@font-face {
  font-family: "alimama eng italic";
  src: url("//at.alicdn.com/wf/webfont/FEu2OM05TFwF/6P2DSZMwCQPj.woff2")
      format("woff2"),
    url("//at.alicdn.com/wf/webfont/FEu2OM05TFwF/hal2YidwnCBW.woff")
      format("woff");
  font-display: swap;
}
page {
  background-color: $uni-bg-color;
}
#routeMap {
  flex: auto !important;
}
</style>
