<template>
    <div>
        <!-- 曲线统计图 -->
        <el-row class="mgb10">
            <el-col :span="24">
                <span>行政区域 : </span>
                <el-select v-model="item.text" size="small" @change="changeArea(index)" v-for="(item , index) in areaList" :disabled="!item.nuDisabled" class="w160 mgr5 mgb5" :key="item.id" :placeholder="item.placeholder">
                    <el-option v-if="item.options" v-for="subItem in item.options" :key="subItem.id" :label="subItem.text" :value="subItem.id"></el-option>
                </el-select>
                <span>发起人 : </span>
                <el-select v-model="value" placeholder="请选择" size="small" class="w100" >
                    <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
            </el-col>
        </el-row>
        <el-row class="mgb10">
            <el-col :span="24">
                <span>广播级别 : </span>
                <el-select v-model="value" placeholder="请选择" size="small" class="w100" >
                    <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
                <span>统计粒度 : </span>
                <el-select v-model="value" placeholder="请选择" size="small" class="w100" >
                    <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
                <span>查询时间 : </span>
                <el-date-picker class="w100" v-model="dateValue" type="date" placeholder="选择日期" size="small"></el-date-picker>
                <el-button type="primary" size="small" @click="search">查询</el-button>
                <el-button size="small" @click="reset">重置</el-button>
                <div class=right>
                    <el-button type="primary" size="small" icon="el-icon-download">报表导入</el-button>
                </div>
            </el-col>
        </el-row>
        <div ref="charts" style="min-height:500px;width:100%;"></div>
    </div>
</template>

<script type="text/javascript">
import areaMin from '@/utils/mixin/area.js';

let echarts = require('echarts/lib/echarts');
require('echarts/lib/chart/line');

export default {
    mixins: [areaMin],
    data () {
        return {
            dateValue: '',
            options: [
                {
                    value: '选项1',
                    label: '黄金糕'
                }, {
                    value: '选项2',
                    label: '双皮奶'
                }, {
                    value: '选项3',
                    label: '蚵仔煎'
                }, {
                    value: '选项4',
                    label: '龙须面'
                }, {
                    value: '选项5',
                    label: '北京烤鸭'
                }],
            value: '',
            option: {
                title: {
                    text: '折线图堆叠'
                },
                tooltip: {
                    trigger: 'axis'
                },
                legend: {
                    data: ['邮件营销', '联盟广告', '视频广告', '直接访问', '搜索引擎']
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                toolbox: {
                    feature: {
                        saveAsImage: {}
                    }
                },
                xAxis: {
                    type: 'category',
                    boundaryGap: false,
                    data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日', '周一', '周二', '周三', '周四', '周五', '周六', '周日', '周一', '周二', '周三', '周四', '周五', '周六', '周日', '周一', '周二', '周三', '周四', '周五', '周六', '周日', '周一', '周二', '周三', '周四', '周五', '周六', '周日']
                },
                yAxis: {
                    type: 'value'
                },
                series: [
                    {
                        name: '邮件营销',
                        type: 'line',
                        smooth: true,
                        stack: '总量',
                        data: [120, 132, 101, 134, 90, 230, 210, 120, 132, 101, 134, 90, 230, 210, 120, 132, 101, 134, 90, 230, 210, 120, 132, 101, 134, 90, 230, 210, 120, 132, 101, 134, 90, 230, 210]
                    },
                    {
                        name: '联盟广告',
                        type: 'line',
                        smooth: true,
                        stack: '总量',
                        data: [220, 182, 191, 234, 290, 330, 310, 220, 182, 191, 234, 290, 330, 310, 220, 182, 191, 234, 290, 330, 310, 220, 182, 191, 234, 290, 330, 310, 220, 182, 191, 234, 290, 330, 310]
                    },
                    {
                        name: '视频广告',
                        type: 'line',
                        smooth: true,
                        stack: '总量',
                        data: [150, 232, 201, 154, 190, 330, 410, 150, 232, 201, 154, 190, 330, 410, 150, 232, 201, 154, 190, 330, 410, 150, 232, 201, 154, 190, 330, 410, 150, 232, 201, 154, 190, 330, 410]
                    },
                    {
                        name: '直接访问',
                        type: 'line',
                        smooth: true,
                        stack: '总量',
                        data: [320, 332, 301, 334, 390, 330, 320, 320, 332, 301, 334, 390, 330, 320, 320, 332, 301, 334, 390, 330, 320, 320, 332, 301, 334, 390, 330, 320, 320, 332, 301, 334, 390, 330, 320]
                    },
                    {
                        name: '搜索引擎',
                        type: 'line',
                        smooth: true,
                        stack: '总量',
                        data: [820, 932, 901, 934, 1290, 1330, 1320, 820, 932, 901, 934, 1290, 1330, 1320, 820, 932, 901, 934, 1290, 1330, 1320, 820, 932, 901, 934, 1290, 1330, 1320, 820, 932, 901, 934, 1290, 1330, 1320]
                    }
                ]
            }
        };
    },
    computed: {

    },
    methods: {
        search () {

        },
        reset () {
            this.getArea();
        }
    },
    created () {
    },
    mounted () {
        this.getArea();
        let mainChart = echarts.init(this.$refs.charts);
        mainChart.setOption(this.option);
    },
    components: {
    }
};
</script>

