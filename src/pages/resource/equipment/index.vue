<template>
    <div>
        <!-- 设备管理 -->
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
                <span>关键字 : </span>
                <el-input size="small" class="w200"></el-input>
                <el-button type="primary" size="small" @click="getList(1)">查询</el-button>
                <el-button size="small" @click="reset">重置</el-button>
                <div class=right>
                    <el-button type="danger" size="small" :disabled="disabled" icon="el-icon-delete">批量删除</el-button>
                    <el-button type="primary" size="small" icon="el-icon-download">设备导入</el-button>
                    <el-button type="primary" size="small" icon="el-icon-upload2">设备导出</el-button>
                    <el-button type="primary" size="small" icon="el-icon-upload2">模板导出</el-button>
                </div>
            </el-col>
        </el-row>
        <el-table :data="list" border stripe  style="width: 100%" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="70" align="center"></el-table-column>
            <el-table-column label="行政区域" prop="area"></el-table-column>
            <el-table-column label="设备名称" prop="planType"></el-table-column>
            <el-table-column label="物理地址" prop="shape"></el-table-column>
            <el-table-column label="经度" prop="longitude" width="120"></el-table-column>
            <el-table-column label="纬度" prop="latitude" width="120"></el-table-column>
            <el-table-column label="连接状态" prop="wlCode"></el-table-column>
            <el-table-column label="操作" header-align="center" width="150">
                <template slot-scope="scope" >
                    <el-button type="text" @click="view(scope.row)">详情</el-button>
                    <el-button type="text" @click="add(scope.row, 'edit')">修改</el-button>
                    <el-button type="text" @click="del(scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-row class="right">
            <pagination :total="page.total" :pageSize.sync="page.pageSize" :pageIndex.sync="page.pageNum" @change="getList"></pagination>
        </el-row>

        <edit v-if="edit.show" :show.sync="edit.show" :data="edit.data" :type="edit.type" @refish="getList"></edit>
        <detail v-if="detail.show" :show.sync="detail.show" :data="detail.data"></detail>
    </div>
</template>

<script type="text/javascript">
import areaMin from '@/utils/mixin/area.js';
import edit from './mods/edit';
import detail from './mods/detail';
const URL = {
    list: '',
    del: ''
};
export default {
    mixins: [areaMin],
    data () {
        return {
            page: {
                pageNum: 1,
                pageSize: 20,
                total: 0
            },
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
            disabled: true,
            edit: {
                show: false,
                data: '',
                type: 'add'
            },
            detail: {
                show: false,
                data: ''
            },
            list: [{
                id: 1,
                wlCode: 11111,
                area: '北京市市辖区2朝阳区',
                add: '31231231312',
                longitude: 116.123212,
                latitude: 22.1232212,
                shape: '室内收扩机',
                planType: 'IP_KT'
            }, {
                id: 2,
                wlCode: 22222,
                area: '北京市市辖区2海淀区八里庄街道办事处',
                add: '2112312',
                longitude: 118.1222312,
                latitude: 34.222223,
                shape: '室外音柱',
                planType: 'TS'
            }]
        };
    },
    computed: {

    },
    methods: {
        handleSelectionChange (val) {
            if (val.length) {
                this.disabled = false;
            } else {
                this.disabled = true;
            }
        },
        add (item, type) {
            this.edit.data = item;
            this.edit.type = type;
            this.edit.show = true;
        },
        view (row) {
            this.detail.show = true;
            this.detail.data = row;
        },
        del (row) {
            this.$myConfirm({
                content: '确定删除该终端吗？'
            }).then(() => {
                this.Http(URL.del, {
                }).then(res => {
                    this.$message({
                        type: 'success',
                        message: '删除成功'
                    });
                    this.getList();
                });
            });
        },
        // 列表
        getList () {
            // this.Http(URL.list, {}).then(res => {
            // let msg = res.msg;
            // this.page.pageNum = msg.pageNumber;
            // this.page.pageSize = msg.pageSize;
            // this.page.total = msg.totalRow;
            // this.list = msg.list;
            //     this.list = msg;
            // });

        },
        // 重置
        reset () {
            this.getArea(true);
        }
    },
    mounted () {
        this.getArea(true);
    },
    components: {
        edit,
        detail
    }
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
    
</style>
