<template>
  <view class="editName">
    <u-cell-group>
      <u-cell-item title="昵称" :arrow="false">
        <input v-model="name" class="uni-input" maxlength="15" />
      </u-cell-item>
    </u-cell-group>
    <u-cell-group title=" ">
      <view class="save" @click="handleEditName"> 保存 </view>
    </u-cell-group>
  </view>
</template>

<script lang="ts">
import { VolunteerInformation } from "@/api/types/models";
import { requestUpdateInformation } from "@/api/user";
import UCellGroup from "@/components/UCellGroup/index.vue";
import UCellItem from "@/components/UCellItem/index.vue";
import authService from "@/service/authService";
import {
  hideLoading,
  showLoading,
  showToast,
  navigateBack,
  navigateTo,
} from "@/utils/helper";
import { computed, defineComponent, ref } from "vue";
const editUserInfo = async (params: VolunteerInformation) => {
  showLoading("请稍候");
  try {
    await requestUpdateInformation(params);
    showToast("修改成功", "success");
    setTimeout(() => {
      navigateBack();
    }, 600);
  } catch (e) {
    console.log(e);
    hideLoading();
  }
};
export default defineComponent({
  name: "EditName",
  components: { UCellGroup, UCellItem },
  props: {
    name: {
      type: String,
      default: "",
    },
  },
  setup(props) {
    const useEditName = () => {
      const name = ref(props.name);
      const handleEditName = async () => {
        await editUserInfo({ name: name.value });
      };
      return { name, handleEditName };
    };
    return {
      ...useEditName(),
    };
  },
});
</script>

<style lang="scss">
.editName {
  .save {
    // margin-top: 60px;
    text-align: center;
    line-height: 96rpx;
    box-sizing: border-box;
    &:active {
      background-color: rgb(247, 248, 249, 1);
    }
  }
}
</style>
