<template>
    <el-dialog 
    title="公告" 
    :visible.sync="dialogNoticeVisible" 
    center
    :width="noticeWidth"
    :custom-class="activeClass"
    :close-on-click-modal="myFlag">
            <div>
                你知道吗？亲！<br><br> 
                这是我们微瞰科技的第一个正式系统。是程序员哥哥们的辛勤敲代码得到的产品，欢迎鼓励。
                <br><br>我们此后的征途是星辰大海 ^_^
            </div>

            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="dialogNoticeVisible = false">关 闭</el-button>
            </div>
    </el-dialog>
</template>


<script>
    import bus from './BUS.vue'
    export default {
        data(){
            return {
                dialogNoticeVisible:false,
                noticeWidth:'25%',
                activeClass: 'active',
                myFlag:false
            }
        },
        mounted(){
            bus.$on("showNotice", data =>{
                this.dialogNoticeVisible = data.flag;
            })
        }
    }
</script>

<style scoped>
    .active{
        padding: 50px; 
        line-height: 22px; 
        background-color: #393D49!important; 
        color: #fff!important; 
        font-weight: 300!important;
    }
</style>
