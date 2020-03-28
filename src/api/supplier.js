import request from "@/utils/request";

export default {
  // 获取列表
  getList() {
    return request({
      url: "/supplier/list",
      method: "get"
    });
  },
  // 分页查询,
  search(page, size, searchMap) {
    return request({
      url: `/supplier/list/search/${page}/${size}`,
      method: "post",
      data: searchMap
    });
  },
  // 新增
  add(pojo) {
    return request({
      url: "/supplier/add",
      method: "post",
      data: pojo
    });
  },
  // 查询
  getById(id) {
    return request({
      url: `/supplier/${id}`, // 反单引号 ``
      method: "get"
    });
  },
  // 更新
  update(pojo) {
    return request({
      url: `/supplier/edit/${pojo.id}`, // 反单引号 ``
      method: "put", // put 方式提交
      data: pojo
    });
  },
  //删除
  deleteById(id) {
    return request({
      url: `/supplier/del/${id}`, // 反单引号 ``
      method: "put" // put 方式提交
    });
  }
};
