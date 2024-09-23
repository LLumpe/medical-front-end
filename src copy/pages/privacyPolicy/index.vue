<!--
 * @Author: LLumpe LLumpe@163.com
 * @Date: 2024-08-13 23:13:24
 * @LastEditors: LLumpe LLumpe@163.com
 * @LastEditTime: 2024-08-13 23:34:44
 * @FilePath: \repair-miniapp-user\src\pages\privacyPolicy\index.vue
 * @Description: 
 * 
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved. 
-->
<template>
  <view
    style="
      min-height: 100vh;
      width: 100%;
      padding: 40rpx;
      box-sizing: border-box;
    "
  >
    <rich-text style="width: 700rpx" :nodes="privacy" />
  </view>
</template>

<script lang="ts">
import { defineComponent } from "vue";
const privacy =
  '<h3 class="panel__title-center" style="text-align: center;">高阳中捷售后维修小程序隐私保护指引</h3>\n<div class="group-infos" style="text-align: center;">\n<p>本指引是高阳中捷售后维修小程序开发者 "高阳县诚泰缝纫设备销售有限公司"（以下简称&ldquo;开发者&rdquo;）为处理你的个人信息而制定。</p>\n</div>\n<div class="group-infos" style="text-align: center;">\n<div class="group-infos__hd">\n<h4 class="group-infos__title">开发者处理的信息</h4>\n<p class="group-infos__hd-privacyText">根据法律规定，开发者仅处理实现小程序功能所必要的信息。</p>\n</div>\n</div>\n<div class="group-infos" style="text-align: center;">\n<div class="group-infos__hd">\n<h4 class="group-infos__title">你的权益</h4>\n</div>\n<p class="group-infos_order">关于你的个人信息，你可以通过以下方式与开发者联系，行使查阅、复制、更正、删除等法定权利。</p>\n<p class="group-infos_order">若你在小程序中注册了账号，你可以通过以下方式与开发者联系，申请注销你在小程序中使用的账号。在受理你的申请后，开发者承诺在十五个工作日内完成核查和处理，并按照法律法规要求处理你的相关信息。</p>\n<p>联系方式：18570753354</p>\n</div>\n<div class="group-infos" style="text-align: center;">\n<div class="group-infos__hd">\n<h4 class="group-infos__title">开发者对信息的存储</h4>\n</div>\n<p class="group-infos_order">&nbsp;开发者承诺，除法律法规另有规定外，开发者对你的信息的保存期限应当为实现处理目的所必要的最短时间。</p>\n</div>\n<div class="group-infos" style="text-align: center;">\n<div class="group-infos__hd">\n<h4 class="group-infos__title">信息的使用规则</h4>\n</div>\n<p class="group-infos_order">开发者将会在本指引所明示的用途内使用收集的信息</p>\n<p><span class="privacyLabel group-infos_order">如开发者使用你的信息超出本指引目的或合理范围，开发者必须在变更使用目的或范围前，再次以</span>待填写<span class="privacyLabel">方式告知并征得你的明示同意。</span></p>\n</div>\n<div class="group-infos" style="text-align: center;">\n<div class="group-infos__hd">\n<h4 class="group-infos__title">信息对外提供</h4>\n</div>\n<p class="group-infos_order">开发者承诺，不会主动共享或转让你的信息至任何第三方，如存在确需共享或转让时，开发者应当直接征得或确认第三方征得你的单独同意。</p>\n<p class="group-infos_order">开发者承诺，不会对外公开披露你的信息，如必须公开披露时，开发者应当向你告知公开披露的目的、披露信息的类型及可能涉及的信息，并征得你的单独同意。</p>\n</div>\n<div class="group-infos" style="text-align: center;">\n<div class="group-infos__hd">\n<h4 class="group-infos__title">你认为开发者未遵守上述约定，或有其他的投诉建议、或未成年人个人信息保护相关问题，可通过以下方式与开发者联系: 18570753354；或者向微信进行投诉。</h4>\n</div>\n</div>\n<p class="signature" style="text-align: center;">更新日期：2024-08-13</p>\n<p class="signature" style="text-align: center;">生效日期：2024-08-13</p>';

export default defineComponent({
  name: "PrivacyPolicy",
  components: {},
  setup() {
    return {
      privacy,
    };
  },
});
</script>

<style lang="scss"></style>
