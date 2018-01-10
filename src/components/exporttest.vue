<template>
    <div>
        <h3>导出试卷模块</h3>
         <el-table
            :data="tableData"
            border
            stripe
            style="width: 100%;margin-top:10px"
            max-height="449"
            v-loading="loading"
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
            prop="time"
            label="生成时间"
            width="160"
            align="center"
            show-overflow-tooltip>
            </el-table-column>
            <el-table-column
            prop="level"
            label="难易比例"
            width="150"
            align="center"
            show-overflow-tooltip>
            </el-table-column>
            <el-table-column
            prop="discription"
            label="试卷摘要"
            width="300"
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
            width="280"
            align="center">
                <template slot-scope="scope">
                    <el-button  size="mini" type="warning" @click="deleteItem(scope.row.id)"><i class="el-icon-delete"></i></el-button>
                    <a  :download="vdownload|myname(scope.row.id)"  :href="vhref|myhreftest(scope.row.discription)">下载试题</a>
                    <a  :download="vdownload|myname(scope.row.id)"  :href="vhref|myhrefanswer(scope.row.discription)">下载答案</a>
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
    </div>
</template>

<script>
    import bus from './BUS.vue'

    export default {
        filters:{
            myname: (data,id) => {
                return  "数据库原理试卷" + id;
            },
            myhreftest: (data,id) => {
                return 'http://localhost:8080/layui/question' + id + '.doc';
            },
            myhrefanswer: (data,id) => {
                return 'http://localhost:8080/layui/answer' + id + '.doc';
            }
        },
        data(){
            return {
               vdownload:'',
               vhref:'',
               currentPage:1,
               count:0,
               loading:true,
               tableData:[]
            }
        },
        methods:{
            deleteItem(id){   //删除试题
                this.$confirm('此操作将永久删除该试卷, 是否继续?', '提示',{
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    var params = new URLSearchParams();
                    params.append("id",id);
                    this.axios.post('http://localhost:8080/deleteQuestionnaire',params)
                    .then( res => {
                        this.searchPlace(this.tableData,id);
                        this.$message.success('删除成功！');
                        this.count --;
                    })
                    .catch( res => {
                        this.$message.error('删除失败！');
                    })
                }).catch(() => {
                });
            },
            styleFunc(row,rowIndex){   //更改样式
                return {padding:'5px 0',hieght:'23px',lineHeight:'23px'}
            },
            handleCurrentChange(val) {  //更改当前页,重新发起请求,获取文件列表
                this.loading = true;
                this.currentPage = val;
                this.axios.get('http://localhost:8080/showQuestionnaire',{
                    params: {
                        page: val,
                        limit:20
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
        },
        mounted(){  //获取试题文件列表
            this.axios.get('http://localhost:8080/showQuestionnaire',{
                params: {
                    page: this.currentPage,
                    limit:20
                }
            })
            .then( res => {
                this.loading = false;
                this.tableData = res.data.data;
                this.count = res.data.count;
            })
            .catch( res => {
                this.loading = false;
                console.log('error');
            })
        }
    }
</script>

<style scoped>
    h3 {
        text-align: center;
    }
    a {
        color: #179ed4;
        padding-left: 15px;
    }
</style>

