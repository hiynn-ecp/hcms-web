<template>
  <div id="app">
    <el-container>
      <div class="view-wrap">
        <router-view />
      </div>
    </el-container>
  </div>
</template>
<script>
export default {
  name: "app",
  created() {
    // 判断是否存
  },
  mounted() {}
};
</script>
<style>
html,
body,
#app,
.el-container,
.view-wrap {
  width: 100%;
  height: 100%;
}
</style>