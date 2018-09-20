<template>
    <div>
        <!-- 终端管理 -->
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
                <span>包含子区域 : </span>
                <el-select v-model="search.includeChild" placeholder="请选择" size="small" class="w120">
                    <el-option v-for="item in includeChildOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
                <el-select v-model="search.devType" placeholder="请选择" size="small" class="w180">
                    <el-option v-for="item in devTypeOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
                <el-input placeholder="名称/物理码" class="w200" v-model="search.keywords" size="small" @keydown.enter.native="getList(1)"></el-input>
                <el-button type="primary" size="small" @click="getList(1)">查询</el-button>
                <el-button size="small" class="mgb10" @click="reset">重置</el-button>
            </el-col>
            <el-col :span="24">
                <el-button type="danger" size="small" :disabled="disabled" icon="el-icon-delete" @click="del('all')">批量删除</el-button>
                <el-button type="primary" size="small" :disabled="disabled" icon="el-icon-delete" @click="handleControl('batch')">批量控制</el-button>
                <div class="right">
                    <el-button type="primary" size="small" icon="el-icon-edit" @click="add('add')">新增</el-button>
                    <el-button type="primary" size="small" icon="el-icon-download">终端导入</el-button>
                    <el-button type="primary" size="small" icon="el-icon-upload2" @click="exportFun">终端导出</el-button>
                    <el-button type="primary" size="small" icon="el-icon-upload2">模板导出</el-button>
                </div>
            </el-col>
        </el-row>
        <el-table :data="list" border stripe @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="70" align="center"></el-table-column>
            <el-table-column label="行政区域" prop="areaFullName"></el-table-column>
            <el-table-column label="终端名称" prop="name"></el-table-column>
            <el-table-column label="终端类型" prop="devTypeName"></el-table-column>
            <el-table-column label="物理码" prop="physicalNo"></el-table-column>
            <el-table-column label="经度" prop="longitude"></el-table-column>
            <el-table-column label="纬度" prop="latitude"></el-table-column>
            <el-table-column label="标签" prop="tagsX"></el-table-column>
            <el-table-column label="操作" header-align="center" width="200">
                <template slot-scope="scope" >
                    <el-button type="text" @click="view(scope.row)">详情</el-button>
                    <el-button type="text" @click="add('edit',scope.row)">修改</el-button>
                    <el-button type="text" @click="handleControl('single',scope.row)">控制</el-button>
                    <el-button type="text" @click="del('single',scope.row.id)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-row class="right">
            <pagination :total="page.total" :pageSize.sync="page.pageSize" :pageIndex.sync="page.pageNum" @change="getList"></pagination>
        </el-row>
        <edit v-if="edit.show" :show.sync="edit.show" :data="edit.data" :type="edit.type" @refish="getList"></edit>
        <detail v-if="detail.show" :show.sync="detail.show" :data="detail.data"></detail>
        <control v-if="control.show" :show.sync="control.show" :type="control.type" :data="control.data" @refish="getList"></control>
    </div>
</template>

<script type="text/javascript">
import areaMin from '@/utils/mixin/area.js';
import edit from './mods/edit';
import detail from './mods/detail';
import control from './mods/control';
const URL = {
    list: '/media/devend/listPage',
    del: '/media/devend/delete',
    delAll: '/media/devend/deleteByIds',
    export: '/media/devend/export'
};
export default {
    mixins: [areaMin],
    data () {
        return {
            search: {
                keywords: '',
                areaId: '',
                tag: '',
                includeChild: 1,
                devType: '-1'
            },
            devTypeOptions: [
                {
                    value: '-1',
                    label: '终端类型'
                }, {
                    value: '01',
                    label: '适配器'
                }, {
                    value: '02',
                    label: '室外收扩机'
                }, {
                    value: '03',
                    label: '音柱'
                }, {
                    value: '04',
                    label: 'IP话筒'
                }],
            includeChildOptions: [
                {
                    value: 1,
                    label: '包含'
                }, {
                    value: 0,
                    label: '不包含'
                }],
            disabled: true,
            page: {
                pageNum: 1,
                pageSize: 20,
                total: 0
            },
            edit: {
                show: false,
                data: '',
                type: 'add'
            },
            detail: {
                show: false,
                data: ''
            },
            control: {
                show: false,
                data: null,
                type: 'all'
            },
            list: []
        };
    },
    methods: {
        exportFun () {
            this.search.areaId = this.search.areaId || this._id;
            let _str = '?keywords=' + this.search.keywords + '&areaId=' + this.search.areaId + '&includeChild=' + this.search.includeChild + '&devType=' + this.search.devType;
            window.open(URL.export + _str);
        },
        handleSelectionChange (val) {
            if (val.length) {
                this.disabled = false;
                this.ids = val.map(item => item.id);
            } else {
                this.disabled = true;
            }
        },
        add (type, item, id) {
            item && (this.edit.data = item.id);
            this.edit.type = type;
            this.edit.show = true;            
        },
        view (row) {
            this.detail.data = row.id;
            this.detail.show = true;
        },
        handleControl (type, item) {
            this.control.type = type;
            this.control.show = true;
            if (type === 'batch') {
                this.control.data = this.ids;
            } else {
                this.control.data = item;
            }
        },
        del (type, id) {
            this.$myConfirm({
                content: type === 'all' ? '确定删除选中列表吗？' : '确定删除该终端吗？'
            }).then(() => {
                this.Http(type === 'all' ? URL.delAll : URL.del, type === 'all' ? {ids: this.ids} : {id
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
        getList (pageNum = this.page.pageNum, pageSize = this.page.pageSize) {
            let params = {...this.search, areaId: this._id + '', pageSize, pageNum};
            this.Http(URL.list, params).then(res => {
                let msg = res.msg;
                this.page.pageNum = msg.pageNumber;
                this.page.pageSize = msg.pageSize;
                this.page.total = msg.totalRow;
                this.list = msg.list.map((item) => {
                    if (item.tags && item.tags.length) {
                        item.tagsX = item.tags.join(',');
                    }
                    return item;
                });
            });
        },
        // 重置
        reset () {
            this.search = {
                keywords: '',
                areaId: '',
                includeChild: 1,
                devType: '-1'
            };
            this.getArea();
        }
    },
    mounted () {
        this.getArea();
    },
    components: {
        edit,
        detail,
        control
    }
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
    
</style>
