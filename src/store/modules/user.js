import { login, getUserInfo, logOut } from "@/api/login";
import {
  getToken,
  setToken,
  setUser,
  getUser,
  removeToken
} from "@/utils/auth";
const user = {
  state: {
    //由于vuex在刷新页面后数据池会重置，所以使用localstorage保存数据池的初始值
    token: getToken(),
    user: getUser()
  },
  mutations: {
    SET_TOKEN(state, token) {
      state.token = token;
      setToken(token);
    },
    SET_USER(state, user) {
      state.user = user;
      setUser(user);
    }
  },
  actions: {
    // 登录获取token
    Login({ commit }, form) {
      // 提交表单给后台进行验证是否正确
      //将其封装为promise对象 调用后resolve 触发成功处理(then)，reject 触发异常处理(catch)
      return new Promise((resolve, reject) => {
        login(form.username.trim(), form.password)
          .then(response => {
            const resp = response.data;
            commit("SET_TOKEN", resp.data.token);
            resolve(resp);
          })
          .catch(error => {
            reject(error);
          });
      });
    },
    // 通过token获取用户信息
    GetUserInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
        getUserInfo(state.token)
          .then(response => {
            const respUser = response.data;
            commit("SET_USER", respUser.data);
            resolve(respUser);
          })
          .catch(error => {
            reject(error);
          });
      });
    },
    //退出
    Logout({ commit, state }) {
      return new Promise((resolve, reject) => {
        logOut(state.token)
          .then(response => {
            const resp = response.data;
            commit("SET_TOKEN", "");
            commit("SET_USER", null);
            removeToken();
            resolve(resp);
          })
          .catch(error => {
            reject(error);
          });
      });
    }
  }
};
export default user;
