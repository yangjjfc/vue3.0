<template>
    <div>
        <!-- 柱状统计图 -->
        <el-row class="mgb10">
            <el-col :span="24">
                <span>行政区域 : </span>
                <el-select v-model="item.text" size="small" @change="changeArea(index)" v-for="(item , index) in areaList" :disabled="!item.nuDisabled" class="w160 mgr5 mgb5" :key="item.id" :placeholder="item.placeholder">
                    <el-option v-if="item.options" v-for="subItem in item.options" :key="subItem.id" :label="subItem.text" :value="subItem.id"></el-option>
                </el-select>
            </el-col>
        </el-row>
        <el-row class="mgb10">
            <el-col :span="24">
                <span>统计时间 : </span>
                <el-date-picker v-model="value" type="datetimerange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" size="small"></el-date-picker>
                <el-button type="primary" size="small" @click="search">查询</el-button>
                <el-button size="small" @click="reset">重置</el-button>
                <div class=right>
                    <el-button type="primary" size="small" icon="el-icon-download">报表导出</el-button>
                </div>
            </el-col>
        </el-row>
        <div ref="charts" style="min-height:500px;width:100%;"></div>
    </div>
</template>

<script type="text/javascript">
import areaMin from '@/utils/mixin/area.js';

let echarts = require('echarts/lib/echarts');
require('echarts/lib/chart/bar');
// require('echarts/lib/component/title');
// require('echarts/lib/component/tooltip');
// require('echarts/lib/component/legend');

export default {
    mixins: [areaMin],
    data () {
        return {
            value: '',
            option: {
                // title: {
                //     text: '泗洪县广播下发数据',
                //     left: 'center'
                // },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: { // 坐标轴指示器，坐标轴触发有效
                        type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
                    }
                },
                legend: {
                    // orient: 'vertical',
                    align: 'right',
                    data: ['直接访问', '邮件营销', '联盟广告', '视频广告', '搜索引擎', '百度', '谷歌', '必应', '其他']
                },
                grid: {
                    left: '3%',
                    right: '3%',
                    bottom: '3%',
                    containLabel: true
                },
                xAxis: [
                    {
                        type: 'category',
                        data: ['一', '二', '三', '四', '五', '六', '日', '一', '二', '三', '四', '五', '六', '日', '一', '二', '三', '四', '五', '六', '日', '一', '二', '三', '四', '五', '六', '日', '一', '二', '三', '四', '五', '六', '日', '一', '二', '三', '四', '五', '六', '日']
                    }
                ],
                yAxis: [
                    {
                        name: '广播数量',
                        type: 'value'
                    }
                ],
                series: [
                    {
                        name: '邮件营销',
                        type: 'bar',
                        stack: '广告',
                        data: [120, 132, 101, 134, 90, 230, 210, 120, 132, 101, 134, 90, 230, 210, 120, 132, 101, 134, 90, 230, 210, 120, 132, 101, 134, 90, 230, 210, 120, 132, 101, 134, 90, 230, 210, 120, 132, 101, 134, 90, 230, 210]
                    },
                    {
                        name: '联盟广告',
                        type: 'bar',
                        stack: '广告',
                        data: [220, 182, 191, 234, 290, 330, 310, 220, 182, 191, 234, 290, 330, 310, 220, 182, 191, 234, 290, 330, 310, 220, 182, 191, 234, 290, 330, 310, 220, 182, 191, 234, 290, 330, 310, 220, 182, 191, 234, 290, 330, 310]
                    },
                    {
                        name: '视频广告',
                        type: 'bar',
                        stack: '广告',
                        data: [150, 232, 201, 154, 190, 330, 410, 150, 232, 201, 154, 190, 330, 410, 150, 232, 201, 154, 190, 330, 410, 150, 232, 201, 154, 190, 330, 410, 150, 232, 201, 154, 190, 330, 410, 150, 232, 201, 154, 190, 330, 410]
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

