<template>
    <div class="loadingmain">
        <section>   
            <h3 class="title">抽取选择题</h3>
            <el-form v-model="select" :inline="true" class="form-inline">
                <el-form-item label="简单" class="point">
                    <el-input v-model="select.esay" class="myinput" type="number"></el-input>%
                </el-form-item>
                <el-form-item label="复杂" class="point">
                    <el-input v-model="select.normal" class="myinput" type="number"></el-input>%
                </el-form-item>
                <el-form-item label="题量" class="point">
                    <el-input v-model="select.number" class="myinput" type="number"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="reset()">重置</el-button>
                </el-form-item>
            </el-form>
        </section>

        <section>
            <h3 class="title">抽取非选择题</h3>
            <el-select v-model="type" placeholder="请选择题型" class="select-type">
                <el-option label="简答题" value="1" selected="selected"></el-option>
                <el-option label="求解题" value="2"></el-option>
                <el-option label="设计题" value="3"></el-option>
                <el-option label="应用题" value="4"></el-option>
            </el-select>
            <el-table
            :data="tableData"
            border
            stripe
            v-loading="loading"
            style="width: 100%;margin-top:10px"
            max-height="449"
            highlight-current-row
            :cell-style="styleFunc">
            <el-table-column
            prop="id"
            label="ID"
            width="60"
            align="center"
            show-overflow-tooltip>
            </el-table-column>
            <el-table-column
            prop="level"
            label="难易等级"
            width="78"
            align="center"
            show-overflow-tooltip>
            </el-table-column>
            <el-table-column
            prop="chapter"
            label="所属章节"
            width="83"
            align="center"
            show-overflow-tooltip>
            </el-table-column>
            <el-table-column
            prop="question"
            label="问题描述"
            width="350"
            align="center"
            show-overflow-tooltip>
            </el-table-column>
            <el-table-column
            prop="answer"
            label="答案"
            width="80"
            align="center"
            show-overflow-tooltip>
            </el-table-column>
            <el-table-column
            prop="imgName"
            label="图片"
            width="90"
            align="center"
            show-overflow-tooltip>
            </el-table-column>
            <el-table-column
            prop="additional"
            label="备注"
            width="138"
            align="center"
            show-overflow-tooltip>
            </el-table-column>
            <el-table-column
            label="操作"
            width="150"
            align="center">
                <template slot-scope="scope">
                        <el-button @click="handleLook(scope.row)" type="primary" size="mini"><i class="el-icon-view"></i></el-button>
                        <el-button  size="mini" type="success" @click="selectItem(scope.row)"><i class="el-icon-plus"></i></el-button>
                </template>
            </el-table-column>              
        </el-table>

         <!-- 分页 -->
        <div class="block">
            <el-pagination
            @current-change="handleCurrentChange"
            :current-page.sync="currentPage"
            :page-size="20"
            layout="total, prev, pager, next"
            :total="count">
            </el-pagination>
        </div>
        </section>
        <hr>
        <h3>已选题目：</h3>
        <el-tabs v-model="activeName"  type="border-card">
            <el-tab-pane label="简答题" name="first">
                <selectproject1></selectproject1>
            </el-tab-pane>
            <el-tab-pane label="求解题" name="second">
                <selectproject2></selectproject2>
            </el-tab-pane>
            <el-tab-pane label="设计题" name="third">
                <selectproject3></selectproject3>
            </el-tab-pane>
            <el-tab-pane label="应用题" name="fourth">
                <selectproject4></selectproject4>
            </el-tab-pane>
        </el-tabs>
        <p class="product"><el-button type="primary" size="medium" @click="productProtect()">生成试卷</el-button></p>
        <lookInfo></lookInfo>
    </div>
</template>

<script>
    import Vue from 'vue'
    import bus from './BUS.vue'
    import { Loading } from 'element-ui';
    import lookInfo from './lookInfo.vue'
    import selectproject1 from './selectproject1.vue'
    import selectproject2 from './selectproject2.vue'
    import selectproject3 from './selectproject3.vue'
    import selectproject4 from './selectproject4.vue'

    export default {
        data(){
            return {
               select:{
                    esay:80,
                    normal:20,
                    number:25
               },
               type:'1',
               currentPage:1,
               count:400,
               tableData:[],
               loading:true,
               activeName: 'first',  //标签页当前激活位置

               //保存发往服务器端的各题型数据
                selectQuestions:'',    //选择题
                shortAnswers:'',//简答题
                solvingProblems:'',//求解题
                designQuestions:'',//设计题
                applicationProblems:''  //应用题
            }
        },
        methods:{
            reset(){   //重置选择题难易比例
                for (var val in this.select) {
                    this.select[val] = 0;
                }
            },
            handleLook(param){  //点击查看时向lookinfo发送消息
                bus.$emit("look", {flag:true,value:param});
            },
            selectItem(param){  //单个增加题目
                var number = Number(this.type);
                if ( number === 1) {
                    bus.$emit("addData1", param);
                } else if ( number === 2) {
                    bus.$emit("addData2", param);
                }else if ( number === 3) {
                    bus.$emit("addData3", param);
                }else if ( number === 4) {
                    bus.$emit("addData4", param);
                }else {
                    
                }
            },
            handleCurrentChange(val) {  //更改当前页,重新发起请求
                this.loading = true;
                this.currentPage = val;
                this.axios.get('http://localhost:8080/getQuestions',{
                    params: {
                        page: val,
                        limit:20,
                        type:this.type
                    }
                })
                .then( res => {
                    this.loading = false;
                    this.tableData = res.data.data;
                    this.count = res.data.count;
                })
                .catch( res => {
                    this.loading = false;
                    console.log("error");
                })
            },
            styleFunc(row,rowIndex){   //更改表格样式
                return {padding:'5px 0',hieght:'23px',lineHeight:'23px'}
            },
            productProtect(){     //生成试卷
                //判断抽取的选择题比例之和是否为100%
                if (Number(this.select.esay) + Number(this.select.normal) != 100) {
                    this.$message.error('单项选择题所选比例之和必须为100！');
                    return false;
                } 
                if (Number (this.select.number) < 10 ) {
                    this.$message.error('您选择的单项选择题题量过少，请重新选择！');
                    return false;
                }
                this.selectQuestions = `${this.select.esay},${this.select.normal}` ;

                //向各保存非选择题题型的组件发送信息，让它们传送所保存题目的id过来，以便上传服务器
                bus.$emit('needids',true);

                //等获取了各组件发来的题型数据以后再发送请求（DOM更新后）
                this.$nextTick(function () {
                    let loadingInstance = Loading.service({
                        lock: true,
                        text: '正在生成试卷...',
                        spinner: 'el-icon-loading',
                        background: 'rgba(0, 0, 0, 0.8)'
                    });  //加载加载条

                    //将抽题信息发往服务端
                    var params = new URLSearchParams();
                    params.append("selectQuestionsNumber",this.select.number);
                    params.append("selectQuestions",this.selectQuestions);
                    params.append("shortAnswers",this.shortAnswers);
                    params.append("solvingProblems",this.solvingProblems);
                    params.append("designQuestions",this.designQuestions);
                    params.append("applicationProblems",this.applicationProblems);
                    this.axios.post('http://localhost:8080/takeQuestionnaire',params)
                    .then( res => {
                        loadingInstance.close();  //关闭加载条
                        this.$message.success('生成成功！');
                    })
                    .catch( res => {        
                        loadingInstance.close();  //关闭加载条
                        this.$message.error('生成失败！');
                    })
                })
            }
        },
        components:{
            lookInfo,
            selectproject1,
            selectproject2,
            selectproject3,
            selectproject4,
        },
        mounted(){
            //默认请求第一类数据
            this.axios.get('http://localhost:8080/getQuestions',{
                params: {
                    page: this.currentPage,
                    limit:20,
                    type:'1'
                }
            })
            .then( res => {
                this.loading = false;
                this.tableData = [];
                this.tableData = res.data.data;
                this.count = res.data.count; 
            })
            .catch( res => {
                this.loading = false;
                console.log("error");
            })


          //获取各保存非选择题题型的组件发来的数据
            bus.$on('id1', data =>{
                this.shortAnswers = data;
            });
            bus.$on('id2', data =>{
                this.solvingProblems = data;
            });
            bus.$on('id3', data =>{
                this.designQuestions = data;
            });
            bus.$on('id4', data =>{ 
                this.applicationProblems = data;
            });
        },
        watch: {
            // 如果 `question` 类型发生改变，这个函数就会运行
            type: function (testtype) {
                this.loading = true;
                this.axios.get('http://localhost:8080/getQuestions',{
                params: {
                    page: 1,
                    limit:20,
                    type:testtype
                }
                })
                .then( res => {
                    this.loading = false;
                    this.tableData = [];
                    this.tableData = res.data.data;
                    this.count = res.data.count; 
                })
                .catch( res => {
                    this.loading = false;
                    console.log("error");
                })
            }
        },
    }
</script>

<style scoped>
    .title{
        font-size: 26px;
        font-family: '楷体'
    }
    .point{
        margin-left: 15px;
    }
    .myinput {
        width: 100px;
        text-align: center;
    }
    .form-inline{
        padding-top: 5px;
        padding-left: 50px;
    }
    .select-type{
        width: 150px;
    }
    .product{
        margin: 30px auto;
        text-align: center;
    }
</style>
