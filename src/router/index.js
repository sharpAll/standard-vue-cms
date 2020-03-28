import Vue from "vue";
import VueRouter from "vue-router";
//登录
import Login from "@/views/login";
//布局组件
import Layout from "@/components/Layout.vue";
//左侧栏对应模块
import Home from "@/views/home";
import Member from "@/views/member";
import Goods from "@/views/goods";
import Supplier from "@/views/supplier";
import Staff from "@/views/staff";
/**
 * 重写路由的push方法
 */
const routerPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location) {
  return routerPush.call(this, location).catch(error => error);
};
Vue.use(VueRouter);

const routes = [
  {
    path: "/login",
    name: "login",
    component: Login
  },
  {
    path: "/",
    name: "layout",
    component: Layout,
    redirect: "/home", //重定向到子路由
    children: [
      {
        path: "/home",
        component: Home,
        name: "/home", //处理刷新后默认路由选中问题
        meta: { title: "首页" } //路由元信息
      }
      // ,{
      //   path:'/member/',
      //   component:Member,
      //   meta: {title: '会员管理'}
      // }
    ]
  },
  //这里提供了layout底下member子路由的另一种实现方式 '/member'+'/'
  {
    path: "/member",
    component: Layout,
    children: [
      {
        path: "/",
        name: "/member/",
        component: Member,
        meta: { title: "会员管理" }
      }
    ]
  },
  {
    path: "/supplier",
    component: Layout,
    children: [
      {
        path: "/",
        name: "/supplier/",
        component: Supplier,
        meta: { title: "供应商管理" }
      }
    ]
  },
  {
    path: "/goods",
    component: Layout,
    children: [
      {
        path: "/",
        name: "/goods/",
        component: Goods,
        meta: { title: "商品管理" }
      }
    ]
  },
  {
    path: "/staff",
    component: Layout,
    children: [
      {
        path: "/",
        name: "/staff/",
        component: Staff,
        meta: { title: "员工管理" }
      }
    ]
  }
];

const router = new VueRouter({
  routes
});

export default router;
