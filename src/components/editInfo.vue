<template>
    <el-dialog title="编辑题目" :visible.sync="dialogFormEditVisible" :show-close="false">
            <el-form>
                <el-form-item>
                    <h3>ID</h3>
                    <el-input v-model="form.id" disabled></el-input>
                </el-form-item>
                <el-form-item>
                    <h3>难易等级</h3>
                    <el-input v-model="form.level"></el-input>
                </el-form-item>
                <el-form-item>
                    <h3>所属章节</h3>
                    <el-input v-model="form.chapter"></el-input>
                </el-form-item>
                <el-form-item>
                    <h3>问题描述</h3>
                    <el-input type="textarea" v-model="form.question"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="handleClearQuestionImg">删除图片</el-button>
                    <h3>问题相关图片</h3>
                    <div class="imgshow" v-show="showImg" ref="questionimgdiv">
                    </div>
                    <span v-show="showTip" class="tip">无相关图片</span>
                    <div>
                        <el-upload
                        class="upload"
                        action="http://172.20.10.14:8080/updateQuestions"
                        ref="upload"
                        :file-list="question_fileList"
                        :auto-upload="false"
                        :on-change="handleQuestionChange"
                        :on-remove="handleQuestionImgRemove"
                        list-type="picture">
                        <el-button size="small" type="primary">重新上传</el-button>
                        <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
                        </el-upload>
                    </div>
                </el-form-item>
                <el-form-item >
                    <h3>答案</h3>
                    <el-input type="textarea" v-model="form.answer"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="handleClearAnswerImg">删除图片</el-button>
                    <h3>答案相关图片</h3>
                    <div class="imgshow" v-show="showImg"  ref="answerimgdiv">
                    </div>
                    <span v-show="showTip" class="tip">无相关图片</span>
                    <div>
                        <el-upload
                        class="upload"
                        action="http://172.20.10.14:8080/updateQuestionss"
                        ref="upload"
                        :file-list="answer_fileList"
                        :auto-upload="false"
                        :on-change="handleAnswerChange"
                        :on-remove="handleAnswerImgRemove"
                        list-type="picture">
                            <el-button size="small" type="primary">点击上传</el-button>
                            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
                        </el-upload>
                    </div>
                </el-form-item>
                <el-form-item>
                    <h3>备注</h3>
                    <el-input type="textarea" v-model="form.additional"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="clearImgs">取 消</el-button>
                <el-button type="primary" @click="handleEditClose">保 存</el-button>
            </div>
        </el-dialog>
</template>

<script>
    import bus from './BUS.vue'
    import { Loading } from 'element-ui'
     export default {
        data () {
            return {
                form:{},
                clearQuestionImgs:false,
                clearAnswerImgs:false,
                dialogFormEditVisible:false,
                question_fileList:[],
                answer_fileList:[],
                imgsrc:'',
                showImg:false,
                showTip:true,
                questionImgCounter:0,
                answerImgCounter:0,
                questionImgNameAry:[],
                answerImgNameAry:[],
                type:''
            }
        },
        methods:{
            clearImgs() {
                this.dialogFormEditVisible = false;
                this.question_fileList = [];
                this.answer_fileList = [];
                this.questionImgCounter = 0;
                this.answerImgCounter = 0;
                this.questionImgNameAry = [];
                this.answerImgNameAry = [];
                this.$refs.questionimgdiv.innerHTML = "";
                this.$refs.answerimgdiv.innerHTML = "";
            },
            handleClearQuestionImg() {
                this.$refs.questionimgdiv.innerHTML = "";
                this.clearQuestionImgs = true;
            },
            handleClearAnswerImg() {
                this.$refs.answerimgdiv.innerHTML = "";
                this.clearAnswerImgs = true;
            },
            handleImgs() {
                var formData = this.form.imgName;
                if (formData != '' && !(formData == 'null')) {
                    this.showImg = true;
                    this.showTip = false;
                    var arr = formData.split(','); 
                    if (arr[0] === " ") {
                        this.appendImg(arr[1],'answerimgdiv');
                    } else if (arr[1] === " ") {
                        this.appendImg(arr[0],'questionimgdiv');
                    } else {
                        this.appendImg(arr[0],'questionimgdiv');
                        this.appendImg(arr[1],'answerimgdiv');
                    }
                }
            },
            handleEditClose(){  //点击关闭按钮后把修改的内容发送给服务器
                this.dialogFormEditVisible = false;
                var loadingInstance = Loading.service({   //读取文件时显示加载条
                    target:'#container',
                    text:'题目更新中...'
                });
                var params = new URLSearchParams();
                params.append('type',this.type);
                params.append('id',this.form.id);
                params.append('level',this.form.level);
                params.append('chapter',this.form.chapter);
                params.append('question',this.form.question);
                params.append('clearQuestionImgs',this.clearQuestionImgs);
                params.append('clearAnswerImgs',this.clearAnswerImgs);
                var queLen = this.questionImgNameAry.length;
                var ansLen = this.answerImgNameAry.length;
                this.form.imgName = (queLen == 0 && ansLen == 0) ? (this.form.imgName) : (queLen == 0 ? " " : this.questionImgNameAry.join('-')) + ',' + (ansLen == 0 ? " " : this.answerImgNameAry.join('-'));
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
                this.axios.post('http://localhost:8080/updateQuestions',params)
                .then( res => {
                    loadingInstance.close();
                    this.$message.success('修改成功！');
                })
                .catch( res => {
                    loadingInstance.close();
                    this.$message.error('修改失败！');
                })
                this.clearImgs();
            },
            handleChange (file,fileList) {
                var loadingInstance2;
                var temp = this.form;   //转换完成后，在事件中的this指不向vue实例，所以这里首先拿到form对象
                temp.imgName = new Date().getTime() + file.raw.name;
                var reader = new FileReader();
                reader.onloadend = function () {  //读取完毕后赋值
                    temp.img = reader.result;
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
            appendImg (imgStr,divType) {
                let imgs = imgStr.split('-'); //再次对数组进行分割，获取图片名称
                for (let i = 0; i < imgs.length; i ++) {
                    let myimg = document.createElement('img');
                    myimg.src = 'http://localhost:8080/quest/layui/images/' + imgs[i];
                    myimg.className = 'myimg';
                    myimg.style = "width:50%;height:50%;margin:0 auto";
                    // DOM 更新了
                    this.$nextTick(function () {
                        this.$refs[divType].appendChild(myimg);
                    })
                }     
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
            bus.$on('edit', data => {   //获取值
                this.dialogFormEditVisible = data.flag; 
                data.value.questionImg = {};
                data.value.answerImg = {};
                this.form = data.value;
                this.type = data.region; 
                this.handleImgs();
            })
        }
    }
</script>

<style scoped>
    .showimg {
        width: 300px!important;
        margin: 0;
        float: left!important;
        margin-left: 15px;
    }

    .tip{
        color:grey;
        display: block;
        padding: 15px ;
        font-size: 16px;
    }

    .myimg{
        display: block;
        width:200px;
        height: 150px;
        margin-top: 15px;
    }
</style>

