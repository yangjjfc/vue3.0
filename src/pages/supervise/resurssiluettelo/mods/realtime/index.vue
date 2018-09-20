<template>
    <div>
        <!-- 实时回传列表 -->
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
                <span>资源类型 : </span>
                <el-select v-model="value" placeholder="请选择" size="small" class="w200" >
                    <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
                <span>终端类型 : </span>
                <el-select v-model="value" placeholder="请选择" size="small" class="w200" >
                    <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
                <span>设备类型 : </span>
                <el-select v-model="value" placeholder="请选择" size="small" class="w200" >
                    <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
                <el-button type="primary" size="small" @click="search">查询</el-button>
                <el-button size="small" @click="reset">重置</el-button>
            </el-col>
        </el-row>
        <el-table :data="list" border stripe  style="width: 100%">
            <el-table-column type="index" label="序号" width="60" align="center"></el-table-column>
            <el-table-column label="资源标识" prop="account"></el-table-column>
            <el-table-column label="资源类型" prop="userName"></el-table-column>
            <el-table-column label="所属区域" prop="roleNames"></el-table-column>
            <el-table-column label="资源状态" prop="mobilePhone"></el-table-column>
            <el-table-column label="回传时间" prop="email"></el-table-column>
            <el-table-column label="回传周期（秒）" prop="email"></el-table-column>
            <el-table-column label="操作" min-width="120" align="center">
                <template slot-scope="scope">
                    <el-button type="text" @click="view(scope.row)">详情</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-row class="right">
            <pagination :total="page.total" :pageSize.sync="page.pageSize" :pageIndex.sync="page.pageNum" @change="getList"></pagination>
        </el-row>

        <detail v-if="detail.show" :show.sync="detail.show" :data="detail.data"></detail>
    </div>
</template>

<script type="text/javascript">
import areaMin from '@/utils/mixin/area.js';
import detail from '../detail';
export default {
    mixins: [areaMin],
    data () {
        return {
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
            this.getArea();
        },
        getList () {
            
        }
    },
    created () {
    },
    mounted () {
        this.getArea();
    },
    components: {
        detail
    }
};
</script>