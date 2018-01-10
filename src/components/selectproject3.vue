<template>
    <el-table
                :data="tableData"
                border
                stripe
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
                        <el-button  size="mini" type="warning" @click="deleteItem(scope.row.id)"><i class="el-icon-delete"></i></el-button>
                    </template>
                </el-table-column>              
                </el-table>
</template>

<script>
    import bus from './BUS.vue'
    export default {
        data(){
            return {
                tableData:[]
            }
        },
        mounted(){
            //监听组件的要求显示信息事件
            bus.$on('addData3', data =>{
                 for (var index in this.tableData) {
                     if (this.tableData[index].id == data.id) {
                         return false;
                     }
                }
                this.tableData.unshift(data);
            });

             //监听组件的需要数据事件
            bus.$on('needids', data => {
                if (data) {      //将本题型所选择的题目id发往该组件
                    bus.$emit('id3',this.collectID(this.tableData));
                }
            });
        },
        methods:{
            handleLook(param){
                bus.$emit("look", {flag:true,value:param});
            },
            deleteItem(id){
                this.searchPlace(this.tableData,id);
            },
            styleFunc(row,rowIndex){   //更改表格样式
                return {padding:'5px 0',hieght:'23px',lineHeight:'23px'}
            },
        }
    }
</script>

<style scoped>

</style>

