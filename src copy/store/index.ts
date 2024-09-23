/*
 * @Author: LLumpe LLumpe@163.com
 * @Date: 2024-09-23 21:40:33
 * @LastEditors: LLumpe LLumpe@163.com
 * @LastEditTime: 2024-09-23 21:53:05
 * @FilePath: \medical-front-end\src\store\index.ts
 * @Description:
 *
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved.
 */
import { createStore } from "vuex";

import user from "./modules/user";

export default createStore({
  modules: {
    user,
  },
});
