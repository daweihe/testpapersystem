<template>
    <div id="upload">
        <div>
            <el-select v-model="region" placeholder="请选择题型">
                <el-option label="单项选择题" value="0"></el-option>
                <el-option label="简答题" value="1"></el-option>
                <el-option label="求解题" value="2"></el-option>
                <el-option label="设计题" value="3"></el-option>
                <el-option label="应用题" value="4"></el-option>
            </el-select>
        </div>
        <el-upload
        class="upload-demo"
        drag
        accept="doc"
        :limit="number"
        auto-upload
        action="http://localhost:8080/upload"
        :on-success="handleSuccess"
        :on-error="handleError"
        multiple
        :data="{id:region}">
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <div class="el-upload__tip" slot="tip">只能上传doc/doxc文件</div>
        </el-upload>
    </div>
</template>

<script>
    export default {
        data(){
            return {
                region:'',
                number:5,
                dataObj:{
                    id:this.region
                }
            }
        },
        methods:{
           handleSuccess(){
               this.$message.success('上传成功！');
           },
           handleError(){
               this.$message.error('上传失败！');
           }
        }
    }
</script>

<style scoped>
    #upload{
        margin-top: 150px;
        margin-left: 350px;
    }
    .upload-demo{
        margin-top:15px;
    }
</style>

