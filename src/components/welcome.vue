<template>
    <div>
        <h1>欢迎使用盐城师范学院《数据库原理》出卷系统</h1>
        <div id="main"></div>
    </div>
</template>

<script>
    // 引入 ECharts 主模块
    var echarts = require('echarts/lib/echarts');
    // 引入柱状图
    require('echarts/lib/chart/pie');
    // 引入提示框和标题组件
    require('echarts/lib/component/tooltip');
    require('echarts/lib/component/title');

    export default {
        data(){
            return {
                typedistribution:{}
            }
        },
        methods:{
            drawLine(){
                 // 基于准备好的dom，初始化echarts实例
                var myChart = echarts.init(document.getElementById('main'));
                // 指定图表的配置项和数据
                var option = {
                    title : {
                        text: '题型数量分布比例',
                        x: 'center'
                    },
                    tooltip: {
                        trigger: 'item',
                        formatter: "{a} <br/>{b} : {c} ({d}%)"
                    },
                    legend: {
                        orient: 'vertical',
                        left: 'left',
                        data: ['单项选择题','解答题','求解题','设计题','应用题']
                    },
                    series : [
                        {
                            name: '题型',
                            type: 'pie',
                            radius : '55%',
                            center: ['50%', '60%'],
                            data:[
                                {value:this.typedistribution.selectQuestions, name:'单项选择题'},
                                {value:this.typedistribution.shortAnswers, name:'解答题'},
                                {value:this.typedistribution.solvingProblems, name:'求解题'},
                                {value:this.typedistribution.designQuestions, name:'设计题'},
                                {value:this.typedistribution.applicationProblems, name:'应用题'}
                            ],
                            itemStyle: {
                                emphasis: {
                                    shadowBlur: 10,
                                    shadowOffsetX: 0,
                                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                                }
                            }
                        }
                    ]
                };
                // 使用刚指定的配置项和数据显示图表。
                myChart.setOption(option);
            }
        },
        mounted(){
            //请求数据
            this.axios.get('http://localhost:8080/getDiffNumbers')
            .then ( res => {
                this.typedistribution = res.data;
                 //画图
                this.drawLine();
            })
            .catch( res => {
                console.log('error');
            })    
        }
    }
</script>

<style scoped>
    h1 {
        font-size: 25px;
        padding: 5px auto;
        text-align: center;
    }

    #main{
        width: 600px;
        height:400px;
        margin:0 auto;
        border: 1px solid lightgray;
    }
</style>

