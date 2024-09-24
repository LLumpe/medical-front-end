/*
 * @Author: LLumpe LLumpe@163.com
 * @Date: 2024-09-23 22:43:09
 * @LastEditors: LLumpe LLumpe@163.com
 * @LastEditTime: 2024-09-24 16:38:25
 * @FilePath: \medical-front-end\src\utils\auth\index.ts
 * @Description:
 *
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved.
 */
const TokenKey = "token";
const RefreshTokenKey = "refresh_token";

export function getToken() {
  return uni.getStorageSync(TokenKey);
}

export function setToken(token: string) {
  return uni.setStorageSync(TokenKey, token);
}

export function removeToken() {
  return uni.removeStorageSync(TokenKey);
}

export function getRefreshToken() {
  return uni.getStorageSync(RefreshTokenKey);
}

export function setRefreshToken(refreshToken: string) {
  return uni.setStorageSync(RefreshTokenKey, refreshToken);
}

export function removeRefreshToken() {
  return uni.removeStorageSync(RefreshTokenKey);
}
