import request from "@/utils/request";

export function getList() {
  return request({
    url: "/member/list",
    method: "get"
  });
}
export function search(page, size, searchMap) {
  return request({
    url: `/member/list/search/${page}/${size}`,
    method: "post",
    data: searchMap
  });
}
export function add(obj) {
  return request({
    url: `/member`,
    method: "post",
    data: obj
  });
}
export function getById(id) {
  return request({
    url: `/member/${id}`,
    method: "get"
  });
}
export function update(data) {
  return request({
    url: `/member_edit/${data.id}`,
    method: "put",
    data: data
  });
}
export function deleteById(id) {
  return request({
    url: `/member_del/${id}`,
    method: "delete"
  });
}
