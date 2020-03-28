import request from "@/utils/request";
export default {
  search(page, size, searchMap) {
    return request({
      url: `/goods/list/search/${page}/${size}`,
      method: "post",
      data: searchMap
    });
  },
  add(pojo) {
    return request({
      url: `/goods/add`,
      method: "post",
      data: pojo
    });
  },
  getById(id) {
    return request({
      url: `/goods/detail/${id}`,
      method: "get"
    });
  },
  update(pojo) {
    return request({
      url: `/goods/update/${pojo.id}`,
      method: "put",
      data: pojo
    });
  },
  deleteById(id) {
    return request({
      url: `/goods/delete/${id}`,
      method: "delete"
    });
  }
};
