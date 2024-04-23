/**
 * 商品管理-商品列表 调用后台接口api
 */
// import request from "@/utils/request";
import request from "@/utils/request-mock";
import { parseStrEmpty } from "@/utils/ruoyi";

// 查询商品列表
export function listProduct(query) {
  return request({
    url: "/product/list",
    method: "get",
    params: query,
  });
}

// 查询商品详细
export function getProduct(id) {
  return request({
    url: "/product/" + parseStrEmpty(id),
    method: "get",
  });
}

// 新增商品
export function addProduct(data) {
  return request({
    url: "/product",
    method: "post",
    data: data,
  });
}

// 修改商品
export function updateProduct(data) {
  return request({
    url: "/product",
    method: "put",
    data: data,
  });
}

// 删除商品
export function delProduct(id) {
  return request({
    url: "/product/" + id,
    method: "delete",
  });
}
