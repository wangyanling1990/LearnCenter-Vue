/**
 * app用户管理 调用后台接口api
 */
// import request from "@/utils/request";
import request from "@/utils/request-mock";
import { parseStrEmpty } from "@/utils/ruoyi";

// 查询用户列表
export function listUser(query) {
  return request({
    url: "/app/user/list",
    method: "get",
    params: query,
  });
}

// 查询用户详细
export function getUser(id) {
  return request({
    url: "/app/user/" + parseStrEmpty(id),
    method: "get",
  });
}

// 新增用户
export function addUser(data) {
  return request({
    url: "/app/user",
    method: "post",
    data: data,
  });
}

// 修改用户
export function updateUser(data) {
  return request({
    url: "/app/user",
    method: "put",
    data: data,
  });
}

// 删除用户
export function delUser(ids) {
  return request({
    url: "/app/user/" + ids,
    method: "delete",
  });
}

// 重置密码
export function resetUserPwd(ids) {
  return request({
    url: "/app/user/resetPwd/" + ids,
    method: "put",
  });
}

// 用户状态修改
export function changeUserStatus(id, status) {
  const data = {
    id,
    status,
  };
  return request({
    url: "/app/user/changeStatus",
    method: "put",
    data: data,
  });
}
