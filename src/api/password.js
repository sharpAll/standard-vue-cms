import request from "@/utils/request";

export default {
  // 密码校验(旧密码)
  checkPwd(userId, password) {
    return request({
      url: `/user/pwd`,
      method: "post",
      data: {
        userId,
        password
      }
    });
  },
  // 密码校验(新密码)
  updatePwd(userId, password) {
    return request({
      url: `/user/pwd/edit`,
      method: "put",
      data: {
        userId,
        password
      }
    });
  }
};
