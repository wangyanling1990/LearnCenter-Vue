/**
 * app管理调用后台接口api
 */
// import request from "@/utils/request";
import request from "@/utils/request-mock";
import { parseStrEmpty } from "@/utils/ruoyi";

// 查询app列表
export function listApp() {
  return request({
    url: "/app/list",
    method: "get",
  });
}

// 查询app详细
export function getApp(appId) {
  return request({
    url: "/app/" + parseStrEmpty(appId),
    method: "get",
  });
}

// 新增app
export function addApp(data) {
  return request({
    url: "/app",
    method: "post",
    data: data,
  });
}

// 修改app
export function updateApp(data) {
  return request({
    url: "/app",
    method: "put",
    data: data,
  });
}

// 删除app
export function delApp(appId) {
  return request({
    url: "/app/" + appId,
    method: "delete",
  });
}

// app状态修改
export function changeAppStatus(appId, status) {
  const data = {
    appId,
    status,
  };
  return request({
    url: "/app/changeStatus",
    method: "put",
    data: data,
  });
}
