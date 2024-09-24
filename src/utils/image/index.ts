/*
 * @Author: LLumpe LLumpe@163.com
 * @Date: 2024-09-23 22:43:09
 * @LastEditors: LLumpe LLumpe@163.com
 * @LastEditTime: 2024-09-24 23:01:25
 * @FilePath: \medical-front-end\src\utils\image\index.ts
 * @Description:
 *
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved.
 */
export function openImage(url: string, condition: boolean) {
  if (condition) {
    uni.previewImage({
      urls: [url],
    });
  }
}
