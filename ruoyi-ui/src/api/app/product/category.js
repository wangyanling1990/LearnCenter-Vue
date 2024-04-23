/**
 * 商品管理-分类管理 调用后台接口api
 */
// import request from "@/utils/request";
import request from "@/utils/request-mock";
import { parseStrEmpty } from "@/utils/ruoyi";

// 查询分类列表
export function listCategory(query) {
  return request({
    url: "/product/category/list",
    method: "get",
    params: query,
  });
}

// 查询分类详细
export function getCategory(id) {
  return request({
    url: "/product/category/" + parseStrEmpty(id),
    method: "get",
  });
}

// 新增分类
export function addCategory(data) {
  return request({
    url: "/product/category",
    method: "post",
    data: data,
  });
}

// 修改分类
export function updateCategory(data) {
  return request({
    url: "/product/category",
    method: "put",
    data: data,
  });
}

// 删除分类
export function delCategory(id) {
  return request({
    url: "/product/category/" + id,
    method: "delete",
  });
}
