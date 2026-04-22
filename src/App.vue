<script setup>
// App.vue现在使用路由视图来显示不同页面
</script>

<template>
  <div class="app-container">
    <!-- 背景图片 -->
    <div class="background-image"></div>
    <router-view />
  </div>
</template>

<style scoped lang="scss">
@import url("@/styles/common.scss");

.app-container {
  position: relative;
  min-height: 100vh;
}

.background-image {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  background-image: url('@/assets/images/back.jpg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}
</style>