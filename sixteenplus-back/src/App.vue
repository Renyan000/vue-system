<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>

export default {
  name: 'app',
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
.el-input__icon{line-height: 35px!important;}
.el-image-viewer__close {
  top: 80px !important;
}
.el-image-viewer__mask {
  top: 60px;
}
</style>
