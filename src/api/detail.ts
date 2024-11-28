import http from "@/utils/request";
import { ResponseData } from "./types/models";

/**
 * 发送消息给GPT
 *
 * @param {{ message: string, history:array<any> }} params
 * @return {*}
 */
export const requestGetMessageByGPT = (data: {
  message: string;
  history: Array<any>;
}) => {
  return http.request<ResponseData<object>>({
    url: "http://127.0.0.1:5000/api/chat/ask",
    method: "POST",
    params: {},
    data: data,
  });
};
