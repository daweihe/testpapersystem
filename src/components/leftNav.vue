<template>
    <el-menu
      default-active="1"
      router
      class="el-menu-vertical"
      @select="handleSelect"
      @open="handleOpen"
      @close="handleClose"
      background-color="#545c64"
      text-color="#fff"
      active-text-color="#ffd04b">
      <el-menu-item index="1">
        <i class="el-icon-upload"></i>
        <span slot="title">首页</span>
      </el-menu-item>
      <el-menu-item index="2">
        <i class="el-icon-upload"></i>
        <span slot="title">导入试题</span>
      </el-menu-item>

      <el-menu-item index="3">
          <i class="el-icon-location"></i>
          <span slot="title">编辑试题</span>
      </el-menu-item>

      <el-menu-item index="4">
          <i class="el-icon-circle-check"></i>
          <span slot="title">组合试卷</span>
      </el-menu-item>

      <el-menu-item index="5">
        <i class="el-icon-menu"></i>
        <span slot="title">导出试卷</span>
      </el-menu-item>
    </el-menu>
  

</template>

<script>
    export default {
    methods: {
      handleSelect(key, keyPath){
        
      },
      handleOpen(key, keyPath) {
        
      },
      handleClose(key, keyPath) {
        
      }
    }
  }
</script>

<style scoped>
  .el-menu-vertical{
    width: 100%;
    height: 100%;
    overflow-x: hidden;
   overflow-y: auto;
  }
</style>
