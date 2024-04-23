// 该js只作为mock使用，实际使用request.js
import axios from "axios";

const service = axios.create({
  baseURL: "https://yeahai.usemock.com",
  timeout: 10000,
});

service.interceptors.response.use((res) => {
  return res.data;
});
export default service;
