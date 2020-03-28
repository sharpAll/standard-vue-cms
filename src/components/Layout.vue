<template>
  <div>
    <!-- 头部区域 -->
    <app-header></app-header>
    <!-- 左侧导航区域 -->
    <app-nav-bar></app-nav-bar>
    <!-- 右侧主区域 -->
    <app-main></app-main>
  </div>
</template>

<script>
import AppHeader from "./AppHeader";
import AppMain from "./AppMain";
import AppNavBar from "./AppNavBar";
export default {
  data() {
    return {};
  },

  components: { AppHeader, AppMain, AppNavBar },

  methods: {}
};
</script>

<style scoped>
.header {
  position: absolute;
  line-height: 51px;
  padding: 0px;
  top: 0px;
  left: 0px;
  right: 0px;
  background-color: #2d3a4b;
}
/* 左侧导航栏 */
.navbar {
  position: absolute;
  width: 230px;
  top: 50px;
  left: 0px;
  bottom: 0px;
  overflow-y: auto;
  background-color: #545c64;
}
/* 右侧主区域 */
.main {
  position: absolute;
  top: 50px;
  left: 230px;
  right: 0px;
  bottom: 0px;
  padding: 10px;
  overflow-y: auto;
}
</style>
