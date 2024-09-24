/*
 * @Author: LLumpe LLumpe@163.com
 * @Date: 2024-09-23 21:40:32
 * @LastEditors: LLumpe LLumpe@163.com
 * @LastEditTime: 2024-09-23 21:59:37
 * @FilePath: \medical-front-end\src\main.ts
 * @Description:
 *
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved.
 */
import { createApp } from "vue";
import App from "./App.vue";
import store from "./store";
import { internalMixin } from "./utils/runtime";
const app = createApp(App);
// app.config.globalProperties.$tim = tim;

internalMixin(app);

app.use(store).mount("#app");
