<template>
    <div>
        <!-- 实时告警 -->
        <el-row class="mgb10">
            <el-col :span="24" class="mgb10">
                <span>设备 : </span>
                <el-select v-model="value" placeholder="请选择" size="small" class="w200" >
                    <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
                <span>模块 : </span>
                <el-select v-model="value" placeholder="请选择" size="small" class="w200" >
                    <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
                <span>编号 : </span>
                <el-input class="w200" size="small"></el-input>
                <span>级别 : </span>
                <el-select v-model="value" placeholder="请选择" size="small" class="w200" >
                    <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
            </el-col>
            <el-col :span="24" class="mgb10">
                <el-date-picker v-model="timeValue" type="datetimerange" range-separator="至" start-placeholder="首次开始时间" end-placeholder="首次结束时间" size="small"></el-date-picker>
                <el-date-picker v-model="timeValue" type="datetimerange" range-separator="至" start-placeholder="最新开始时间" end-placeholder="最新结束时间" size="small"></el-date-picker>
                <el-button type="primary" size="small" @click="search">查询</el-button>
                <el-button size="small" @click="reset">重置</el-button>
                <el-button type="primary" size="small" class="right">保存到文件</el-button>
            </el-col>
        </el-row>
        <el-table :data="list" border stripe  style="width: 100%">
            <el-table-column type="index" label="序号" width="60" align="center"></el-table-column>
            <el-table-column label="设备" prop="account"></el-table-column>
            <el-table-column label="编号" prop="userName"></el-table-column>
            <el-table-column label="名称" prop="roleNames"></el-table-column>
            <el-table-column label="级别" prop="mobilePhone"></el-table-column>
            <el-table-column label="最新时间" prop="email"></el-table-column>
            <el-table-column label="次数" prop="email"></el-table-column>
            <el-table-column label="操作" min-width="120" align="center">
                <template slot-scope="scope">
                    <el-button type="text" @click="view(scope.row)">详情</el-button>
                    <el-button type="text">忽略</el-button>
                    <el-button type="text">恢复</el-button>
                    <el-button type="text">屏蔽</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-row class="right">
            <pagination :total="page.total" :pageSize.sync="page.pageSize" :pageIndex.sync="page.pageNum" @change="getList"></pagination>
        </el-row>
    </div>
</template>

<script type="text/javascript">
export default {
    data () {
        return {
            timeValue: '',
            detail: {
                show: false,
                data: ''
            },
            list: [],
            value1: '',
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
            page: {
                pageNum: 1,
                pageSize: 20,
                total: 0
            }
        };
    },
    computed: {

    },
    methods: {
        view (row) {
            this.detail.show = true;
            this.detail.data = row;
        },
        search () {

        },
        reset () {
        },
        getList () {
            
        }
    },
    created () {
    },
    mounted () {
    },
    components: {
    }
};
</script>