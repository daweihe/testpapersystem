<template>
    <div id="app">
        <my-header></my-header>
        <div class="clearfix"></div>
        <section class="myrow" >
            <nav>
                <left-nav></left-nav>
            </nav>
            
            <section id="container">
                  <keep-alive>
                      <transition name="el-fade-in">
                         <router-view></router-view>
                      </transition>  
                  </keep-alive>
            </section>
        </section>

        <notice></notice>
    </div>
</template>

<script>

import Header from './components/Header.vue'
import leftNav from './components/leftNav.vue'
import notice from './components/notice.vue'

export default {
    name: 'app',
    data () {
      return {
        msg: 'Hello vue.js'
      }
    },
    components:{
      'myHeader':Header,
      'leftNav':leftNav,
      'notice':notice
    }
}
</script>

<style  scoped>
    #app{
      height: 100%;
    }
    .clearfix{
      clear: both;
    }
    .myrow{
      height: 90.5%;
      margin-top: -1px;
    }

    .el-pager li .number{
      border: 1px solid gray!important;
      border-radius: 4px!important;
    }

    nav {
      width: 17%;
      height: 100%;
      float: left;
    }

    #container{
      width: 82.9%;
      height:100%;
      float: right;
      overflow-y: auto;
    }
</style>
