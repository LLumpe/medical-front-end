import http from "@/utils/request";
import { Banner, JavaList, Address, ResponseData } from "./types/models";

/**
 * 查询当前用户所有地址
 *
 * @return {*}
 */
export const requestGetUserAddress = () => {
  return http.request<ResponseData<JavaList<Address>>>({
    url: `userAddress`,
    method: "GET",
    params: {},
    data: {},
    custom: { noAuth: true },
  });
};

/**
 * 分页查询当前用户所有地址
 *
 * @return {*}
 */
export const requestGetUserAddressByPage = (params?: {
  /* 当前页码 */
  current?: number;
  /* 页码数据量 */
  size?: number;
  [key: string]: unknown;
}) => {
  return http.request<ResponseData<JavaList<Address>>>({
    url: `api/userAddress/page`,
    method: "GET",
    params: {},
    data: {},
    custom: { noAuth: true },
  });
};

/**
 * 新增地址
 *
 * @data {Address} data
 * @return {*}
 */
export const requestAddUserAddress = (data: Address) => {
  return http.request<ResponseData<JavaList<Address>>>({
    url: `api/userAddress`,
    method: "POST",
    params: {},
    data: data,
    custom: { noAuth: true },
  });
};

/**
 * 修改地址
 *
 * @data {Address} data
 * @return {*}
 */
export const requestEditUserAddress = (data: Address) => {
  return http.request<ResponseData<JavaList<Address>>>({
    url: `api/userAddress`,
    method: "PUT",
    params: {},
    data: data,
    custom: { noAuth: true },
  });
};

/**
 * 删除地址
 *
 * @return {number} id
 */
export const requestDeleteUserAddress = (id: number) => {
  return http.request<ResponseData<JavaList<Address>>>({
    url: `api/userAddress`,
    method: "DELETE",
    params: {},
    data: { id: id },
    custom: { noAuth: true },
  });
};
