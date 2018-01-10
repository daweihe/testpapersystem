<template>
    <el-menu
    :default-active="activeIndex2"
    class="el-menu-header"
    mode="horizontal"
    @select="handleSelect"
    background-color="#545c64"
    text-color="#fff"
    active-text-color="#ffd04b">
        <div id="title">
            《数据库原理》出卷系统
        </div>

        <div id="notice">
            <el-button type="primary" @click="open">公告</el-button>
        </div>
    </el-menu>
</template>

<script>
    import bus from './BUS.vue'

    export default {
    data() {
      return {
        activeIndex: '1',
        activeIndex2: '1'
      };
    },
    methods: {
      handleSelect(key, keyPath) {
      },
      open () {
          bus.$emit("showNotice",{flag:true});
      }
    }
  }
</script>

<style scoped>
   .el-menu-header{
       width: 100%;
       float:right;
   }

   #title{
       height: 60px;
       line-height: 60px;
       font-size: 28px;
       float: left;
       color: #fff;
       margin-left: 30px;
   }
   
   #notice{
       float: left;
       margin-left: 600px;
       margin-top: 10px;

   }
</style>

