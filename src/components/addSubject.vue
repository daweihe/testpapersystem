<template>
  <el-dialog title="增加题目" :visible.sync="dialogFormAddSubjectVisible"  :show-close="false">
            <el-form :model="form">
                <el-form-item label="难易等级">
                    <el-input v-model="form.level"></el-input>
                </el-form-item>
                <el-form-item label="所属章节">
                    <el-input v-model="form.chapter"></el-input>
                </el-form-item>
                <el-form-item label="问题描述">
                    <el-input type="textarea" v-model="form.question"></el-input>
                </el-form-item>
                <el-form-item>
                    <h3>题目相关图片</h3>
                    <el-upload
                    class="upload"
                    action="/addQuestions"
                    ref="upload"
                    :file-list="question_fileList"
                    :auto-upload="false"
                    :on-change="handleQuestionChange"
                    :on-remove="handleQuestionImgRemove"
                    list-type="picture">
                        <el-button size="small" type="primary">点击上传</el-button>
                        <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
                    </el-upload>
                </el-form-item>
                <el-form-item label="答案">
                    <el-input type="textarea" v-model="form.answer"></el-input>
                </el-form-item>
                <el-form-item>
                    <h3>答案相关图片</h3>
                    <el-upload
                    class="upload"
                    action="/addQuestions"
                    ref="upload"
                    :file-list="answer_fileList"
                    :auto-upload="false"
                    :on-change="handleAnswerChange"
                    :on-remove="handleAnswerImgRemove"
                    list-type="picture">
                        <el-button size="small" type="primary">点击上传</el-button>
                        <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
                    </el-upload>
                </el-form-item>
                <el-form-item label="备注">
                    <el-input type="textarea" v-model="form.additional"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="handleClose">取 消</el-button>
                <el-button type="primary" @click="handleAddClose">保 存</el-button>
            </div>
        </el-dialog>
</template>

<script>
    import bus from './BUS.vue'
    import { Loading } from 'element-ui';

    export default {
        data () {
           return {
                form:{
                    level:'',
                    chapter:'',
                    question:'',
                    imgName:'',
                    answer:'',
                    additional:'',
                    questionImg:{},
                    answerImg:{}
                },
                dialogFormAddSubjectVisible: false,
                question_fileList:[],
                answer_fileList:[],
                type:'',
                isLast:false,
                questionImgCounter:0,
                answerImgCounter:0,
                questionImgNameAry:[],
                answerImgNameAry:[],
           }
        },
        watch:{
            "this.form": function (newValue) {
                console.log(newValue);
            }
        },
        methods:{
            handleAddClose(){  //点击关闭按钮后把添加的内容发送给服务器
                this.dialogFormAddSubjectVisible = false;
                var loadingInstance = Loading.service({   //读取文件时显示加载条
                    target:'#container',
                    text:'题目上传中...'
                });
                var params = new URLSearchParams();
                params.append('type',this.type);
                params.append('level',this.form.level);
                params.append('chapter',this.form.chapter);
                params.append('question',this.form.question);
                var queLen = this.questionImgNameAry.length;
                var ansLen = this.answerImgNameAry.length;
                this.form.imgName = (queLen == 0 && ansLen == 0) ? "" : (queLen == 0 ? " " : this.questionImgNameAry.join('-')) + ',' + (ansLen == 0 ? " " : this.answerImgNameAry.join('-'));
                params.append('imgName', this.form.imgName);
                params.append('answer',this.form.answer);
                params.append('additional',this.form.additional);
                if (this.questionImgCounter > 0) {
                    for (let i = 1 ; i < this.questionImgCounter + 1; i ++) {
                        params.append('questionImg'+ i,this.form.questionImg[i]);
                    }
                    params.append('questionImgCounter',this.questionImgCounter);
                }
                if (this.answerImgCounter > 0) {
                    for (let i = 1 ; i < this.answerImgCounter + 1; i ++) {
                        params.append('answerImg'+ i,this.form.answerImg[i]);
                    }
                    params.append('answerImgCounter',this.answerImgCounter);
                }
                this.axios.post('http://localhost:8080/addQuestions',params)
                .then( res => {
                    loadingInstance.close();
                    this.$message.success('添加成功！');
                })
                .catch( res => {
                    loadingInstance.close();
                    this.$message.error('添加失败！');
                })
                if (this.isLast) {
                    bus.$emit("isLast",true);
                }
                this.handleClose();
            },
            handleClose () {
                this.dialogFormAddSubjectVisible = false;
                  for (var index in this.form) {   //关闭弹框后把内容清空
                        if (index == 'questionImg' || index == 'answerImg') {
                            this.form[index] = {};
                        } else {
                            this.form[index] = '';
                        }
                    }
                    this.question_fileList = [];
                    this.answer_fileList = [];
                    this.questionImgCounter = 0;
                    this.answerImgCounter = 0;
                    this.questionImgNameAry = [];
                    this.answerImgNameAry = [];
            },
            handleQuestionChange (file,fileList) { //问题图片处理方法
                this.handleImgChange('questionImgCounter','questionImgNameAry','question_','questionImg',file);
            },
            handleAnswerChange (file,fileList) {//答案图片处理方法
                this.handleImgChange('answerImgCounter','answerImgNameAry','answer_','answerImg',file);
            },
            handleImgChange(ImgCounter,imgNameAry,type,imgType,file) { //图片处理公共方法
                this[ImgCounter] ++;
                let loadingInstance2;
                let temp = this.form;   //转换完成后，在事件中的this指不向vue实例，所以这里首先拿到form对象
                this[imgNameAry].push(type + new Date().getTime() + file.raw.name);
                let target = this;
                let reader = new FileReader();
                reader.onloadend = function () {  //读取完毕后赋值
                    let Img = target[ImgCounter];
                    temp[imgType][Img] = reader.result;
                    loadingInstance2.close();  //关闭加载条
                }
                if (file.raw) {
                    loadingInstance2 = Loading.service({   //读取文件时显示加载条
                        target:'.el-dialog',
                        text:'图片上传中...'
                    });
                    reader.readAsDataURL(file.raw);   //读取文件
                } else {
                    console.log('error');
                }
            },

            //重新生成图片库
            reProductImg (imgType,fileList) {
                for (let i = 0; i < fileList.length; i ++) {
                    let loadingInstance2;
                    let temp = this.form;   //转换完成后，在事件中的this指不向vue实例，所以这里首先拿到form对象
                    let target = this;
                    let reader = new FileReader();
                    reader.onloadend = function () {  //读取完毕后赋值
                        temp[imgType][i+1] = reader.result;
                        loadingInstance2.close();  //关闭加载条
                    }
                    if (fileList[i].raw) {
                        loadingInstance2 = Loading.service({   //读取文件时显示加载条
                            target:'.el-dialog',
                            text:'图片上传中...'
                        });
                        reader.readAsDataURL(fileList[i].raw);   //读取文件
                    } else {
                        console.log('error');
                    }
                }
            },

            //将图片名称移除
            removeImgName (imgName,imgNameArr) {
                for (let i = 0; i < this[imgNameArr].length; i ++) {
                    if (this[imgNameArr][i].indexOf(imgName) > -1) {
                        this[imgNameArr].splice(i,1);
                    } 
                }
            },

            //问题图片移除触发事件
            handleQuestionImgRemove(file,fileList) {
                this.questionImgCounter --;
                this.form.questionImg = {};
                if (this.questionImgCounter >= 0) {
                    this.removeImgName(file.name,'questionImgNameAry');
                    //重新生成图片库
                    this.reProductImg('questionImg',fileList);
                }
            },
            //答案图片移除触发事件
            handleAnswerImgRemove(file,fileList) {
                this.answerImgCounter --;
                this.form.answerImg = {};
                if (this.answerImgCounter >= 0) {
                    this.removeImgName(file.name,'answerImgNameAry');
                    //重新生成图片库
                    this.reProductImg('answerImg',fileList);
                }
            }
        },
        mounted() {    //在组件的钩子函数中监听事件
            bus.$on('addSubject', data => {   //获取值
                this.dialogFormAddSubjectVisible = data.flag;
                this.type = data.type;
                this.isLast = data.isLast;
            })
        }
    }
</script>

<style scoped>

</style>

