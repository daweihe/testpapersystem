<template>
    <div>
        <div class="myaction">
            <div class="first">
                <div class="left">
                <el-form :inline="true" class="demo-form-inline">
                        <el-form-item label="搜索内容" class="myelform">
                            <el-input v-model="searchContent" placeholder="请输入搜索内容"></el-input>
                        </el-form-item>
                        <el-form-item  class="myelform">
                            <el-button type="primary" @click="onSubmit" icon="el-icon-search">查询</el-button>
                        </el-form-item>
                    </el-form>
                </div>
                <div class="right">
                    <el-button type="primary" icon="el-icon-document">复制到剪切板</el-button>
                </div>
                <div class="clearfix"></div>
            </div>
            <div class="clearfix"></div>

            <div class="bottom">
                <div class="left">
                    <el-button type="danger" icon="el-icon-delete" @click="batchDel">批量删除</el-button>
                    <el-button icon="el-icon-plus" type="primary" @click="handerAddSubject">添加题目</el-button>
                </div>
                <div class="right">
                    <el-button type="primary" icon="el-icon-sold-out">导出csv</el-button>
                    <el-button type="primary" id="btnprint" icon="el-icon-printer">打印</el-button>
                </div>
                <div class="clearfix"></div>
            </div>
            <div class="clearfix"></div>
        </div>

        <div class="projectselect">
            <span>题型：</span>
            <el-select v-model="region" placeholder="请选择题型">
                <el-option label="单项选择题" value="0"></el-option>
                <el-option label="简答题" value="1"></el-option>
                <el-option label="求解题" value="2"></el-option>
                <el-option label="设计题" value="3"></el-option>
                <el-option label="应用题" value="4"></el-option>
            </el-select>
        </div>

        <el-table
        :data="tableData"
        @selection-change="handleSelectionChange"
        border
        stripe
        style="width: 100%"
        max-height="449"
        highlight-current-row
        :cell-style="styleFunc">
            <el-table-column
            type="selection"
            width="55"
            align="center">
            </el-table-column>
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
            width="60"
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
            width="182"
            align="center">
                <template slot-scope="scope">
                    <el-tooltip class="item" effect="light" content="查看" placement="bottom-end">
                        <el-button @click="handleLook(scope.row)" type="info" size="mini"><i class="el-icon-view"></i></el-button>
                    </el-tooltip>
                    <el-tooltip class="item" effect="light" content="编辑" placement="bottom-end">
                        <el-button  size="mini" type="primary" @click="handleEdit(scope.row)"><i class="el-icon-edit"></i></el-button>
                    </el-tooltip>
                    <el-tooltip class="item" effect="light" content="删除" placement="bottom-end">
                        <el-button  size="mini" type="danger" @click="handleDel(scope.row.id)"><i class="el-icon-delete"></i></el-button>
                    </el-tooltip>
                </template>
            </el-table-column>              
        </el-table>

        <!-- 分页 -->
        <div class="block">
            <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-sizes="[20, 30, 40, 50]"
            :page-size="20"
            layout="total, sizes, prev, pager, next, jumper"
            :total="count">
            </el-pagination>
        </div>
    </div>
</template>

<script>
    import bus from './BUS.vue'

    export default {
        data () {
            return {
                currentPage:1,
                count:400,
                currentLimit:20,
                searchContent:"",
                multipleSelection: [],
                form:"",
                tableData:[],
                isSerach:false,  //是否为提交搜索
                region:'0',
                isLast:false,
                loading:true
            }
        },
        methods:{
            onSubmit(){  //提交搜索内容
                if ( this.searchContent == "") {
                    this.$message.error('搜索内容不能为空！');
                }else{
                    this.loading = true;
                    this.isSerach = true;
                    this.axios.get('http://localhost:8080/searchQuestions',{
                        params: {
                            page:this.currentPage,
                            limit:this.currentLimit,
                            data:this.searchContent
                        }
                    })
                    .then( res => {
                        this.loading = false;
                        this.tableData = [];
                        this.tableData = res.data.data;
                        this.count = res.data.count;
                        this.currentPage = 1;
                    })
                    .catch( res => {
                        this.loading = false;
                        console.log("error");
                    })
                }
            },
            handleLook(param){  //点击查看时向lookinfo发送消息
                bus.$emit("look", {flag:true,value:param});
            },
            handleEdit(param){   //点击编辑时向editinfo发送消息
                bus.$emit("edit", {flag:true,value:param,region:this.region});
            },
            handleDel(id){   //删除一条记录
                this.$confirm('此操作将永久删除该题目, 是否继续?', '提示',{
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.loading = true;
                    var params = new URLSearchParams();
                        params.append("id",id);
                        params.append("type",this.region);
                        this.axios.post('http://localhost:8080/deleteQuestions',params)
                        .then( res => {
                            this.$message.success('删除成功！');
                            //删除成功后重新请求当前页
                            this.axios.get('http://localhost:8080/getQuestions',{
                                params: {
                                    page: this.currentPage,
                                    limit:this.currentLimit,
                                    type:this.region
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
                        })
                        .catch( res => {
                            this.loading = false;
                            this.$message.error('删除失败！');
                        })
                }).catch(() => {    
                });
            },
            handerAddSubject() {  //添加一条题目
                if ( this.currentPage == Math.ceil( this.count / this.currentLimit) ) //判断是否是最后一页
                    this.isLast = true;
                bus.$emit("addSubject", {flag:true,type:this.region,isLast:this.isLast});
            },
            handleSizeChange(val) {  //更改每页的数量,重新发起请求
                this.loading = true;
                this.currentLimit = val;
                if (this.isSerach) {    //如果是搜索页
                    this.axios.get('http://172.20.10.14:8080/searchQuestions',{
                        params: {
                            page:this.currentPage,
                            limit:this.currentLimit,
                            data:this.searchContent
                        }
                    })
                    .then( res => {
                        this.loading = false;
                        this.tableData = [];
                        this.tableData = res.data.data;
                        this.count = res.data.count;
                        this.currentPage = 1;
                    })
                    .catch( res => {
                        this.loading = false;
                        console.log("error");
                    })
                } else {   //平常页
                    this.axios.get('http://localhost:8080/getQuestions',{
                    params: {
                        page: this.currentPage,
                        limit:val,
                        type:this.region
                    }
                })
                .then( res => {
                    this.loading = false;
                    this.tableData = res.data;
                    this.count = res.data.count;
                })
                .catch( res => {
                    this.loading = false;
                    console.log("error");
                })
                }
            },
            handleCurrentChange(val) {  //更改当前页,重新发起请求
                this.loading = true;
                this.currentPage = val;
                if (this.isSerach) {   //如果是搜索内容页面切换
                    this.axios.get('http://172.20.10.14:8080/searchQuestions',{
                        params: {
                            page:this.currentPage,
                            limit:this.currentLimit,
                            data:this.searchContent
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
                } else {
                    this.axios.get('http://localhost:8080/getQuestions',{
                        params: {
                            page: val,
                            limit:this.currentLimit,
                            type:this.region
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
                }
            },
            styleFunc(row,rowIndex){   //更改样式
                return {padding:'5px 0',hieght:'23px',lineHeight:'23px'}
            },
            handleSelectionChange(val) {   //处理多选框变化
                this.multipleSelection = val;
            },
            batchDel () {  //批量删除
                var delTarget = this.multipleSelection;
                var count = delTarget.length;
                var str = "";
                if (count == 0) {
                    this.$message.error("请至少选择一项删除");
                    return false;
                } else {
                    for ( var i = 0 ; i < count; i ++) {//将需要删除的id凭借为字符串发往服务器
                        str += delTarget[i].id + ",";  
                    }
                    this.$confirm('此操作将永久删除这些题目, 是否继续?', '提示',{
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        this.loading = true;
                        var params = new URLSearchParams();
                        params.append("data",str);
                        params.append("type",this.region);
                        this.loading = true;
                        this.axios.post('http://localhost:8080/bachDelete',params)
                        .then( res => {
                                this.$message.success('删除成功！');
                                //删除成功后其重新请求当前页
                                this.axios.get('http://localhost:8080/getQuestions',{
                                    params: {
                                        page: this.currentPage,
                                        limit:this.currentLimit,
                                        type:this.region
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
                        })
                        .catch( res => {
                            this.loading = false;
                            this.$message.error('删除失败！');
                        })
                    }).catch(() => {
                    })
                }
            }
        },
        mounted(){ //加载页面时默认请求第一类型数据
            this.axios.get('http://localhost:8080/getQuestions',{
                params: {
                    page: this.currentPage,
                    limit:this.currentLimit,
                    type:this.region
                }
            })
            .then( res => {
                this.loading = false;
                if (res.data.count != 0) {
                    this.tableData = res.data.data;
                    this.count = res.data.count; 
                }
            })
            .catch( res => {
                this.loading = false;
                console.log("error");
            })

            var target = this;
            //监听增加题目发来的信息
            bus.$on('isLast', function (data) {
                this.axios.get('http://localhost:8080/getQuestions',{
                    params: {
                        page: target.currentPage,
                        limit:target.currentLimit,
                        type:target.region
                    }
                })
                .then( res => {
                    target.tableData = res.data.data;
                    target.count = res.data.count; 
                })
                .catch( res => {
                    console.log("error");
                })
            });
        },
        watch:{    //更换题型重新发起请求
            region: function (newValue) {
                this.loading = true;
                this.currentPage = 1;
                this.axios.get('http://localhost:8080/getQuestions',{
                    params: {
                        page: this.currentPage,
                        limit:this.currentLimit,
                        type:newValue
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
            }
        }
    }
</script>

<style scoped>
        
    .myaction {
        margin-top: 15px;
    }

    .first {
        vertical-align: top;
    }

    .left {
        margin-left: 10px;
    }

    .left div {
        display: inline-block;
    }

    .left span,
    .left div,
    .left button {
        float: left;
        margin-left: 20px;
    }

    .left span {
        display: inline-block;
        height: 38px;
        line-height: 38px;
    }

    .right {
        float: right;
        margin-right: 25px;
    }

    .bottom {
        margin: 10px 20px;
    }

    .bottom button {
        margin-right: 10px;
    }
    .clearfix{
        clear:both;
    }

    .myelform{
        margin-bottom: 5px;
    }

    .block{
        margin:10px;
    }

    .projectselect {
        margin-top: 20px;
        margin-bottom: 10px;
    }

    .projectselect span {
        padding: 0 15px;
    }
</style>

