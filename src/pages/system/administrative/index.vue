<template>
    <div class="storage-container">
        <el-row class="mgb10">
             <el-col :span="22">
                <span>行政区域 : </span>
                <el-select v-model="item.text" size="small" @change="changeArea(index)" v-for="(item , index) in areaList" :disabled="!item.nuDisabled" class="w160 mgr5 mgb5" :key="item.id" :placeholder="item.placeholder">
                    <el-option v-if="item.options" v-for="subItem in item.options" :key="subItem.id" :label="subItem.text" :value="subItem.id"></el-option>
                </el-select>
                <el-input placeholder="区域名称" class="w300" v-model="keywords" size="small" @keydown.enter.native="getList(1)"></el-input>
                <el-button type="primary" icon="el-icon-search" size="small" @click="getList(1)">查询</el-button>
                <el-button  size="small" @click="reset" >重置</el-button>
             </el-col>
             <el-col :span="2">
                <el-button class="right" type="primary" size="small" @click="add('add')">新增</el-button>
             </el-col>
        </el-row>
        <tree-table :data="table.list" :columns="table.columns" :expandAll="table.expandAll" border>
            <el-table-column label="操作" width="230">
                <template slot-scope="scope" >
                    <el-button type="text" v-if="scope.row.level !=5" @click="add(scope.row, 'add')">添加子级</el-button>
                    <el-button type="text" @click="add(scope.row, 'edit')">编辑</el-button>
                    <el-button type="text" @click="del(scope.row.id)">删除</el-button>
                </template>
            </el-table-column>
        </tree-table>
         <el-row class="right">
                <pagination :total="page.total" :pageSize.sync="page.pageSize" :pageIndex.sync="page.pageNum" @change="getList"></pagination>
            </el-row>
        <edit v-if="edit.show" :show.sync="edit.show" :data="edit.data" :type="edit.type" @refish="getList"></edit>
    </div>
</template>

<script type="text/javascript">
import treeTable from '@/components/TreeTable';
import edit from './mods/edit';
import areaMin from '@/utils/mixin/area.js';
const URL = {
    list: '/sys/area/listPageTree',
    findDeployAreaAndParent: '/sys/area/findDeployAreaAndParent',
    findChildArea: '/sys/area/findChildArea',
    del: '/sys/area/delete'
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
            table: {
                expandAll: false,
                columns: [
                    {text: '行政区域', value: 'text'},
                    {text: '区域编码', value: 'id'},
                    {text: '区域级别', value: 'levelX'}
                ],
                list: []
            },
            src: '',
            keywords: '',
            edit: {
                show: false,
                data: '',
                type: 'add'
            },
            role: {
                show: false,
                data: '',
                type: 'add'
            }
        };
    },
    computed: {

    },
    methods: {
        formatData (msg) {
            let res = msg.map((item, index) => {
                item.levelX = this.areaName[item.level - 1];
                if (item.children && item.children.length) {
                    item.children = this.formatData(item.children);
                }
                return item;
            });
            return res;
        },
        // 列表
        getList (pageNum = this.page.pageNum, pageSize = this.page.pageSize) {
            this.Http(URL.list, {
                keywords: this.keywords,
                parentId: this._id,
                pageSize: pageSize,
                pageNum: pageNum
            }).then(res => {
                let msg = res.msg;
                this.page.pageNum = msg.pageNumber;
                this.page.pageSize = msg.pageSize;
                this.page.total = msg.totalRow;
                this.table.list = this.formatData(msg.list);
            });
        },
        // 重置
        reset () {
            this.keywords = '';
            this.getArea();
        },
        // 配置
        add (item, type) {
            this.edit.data = item;
            this.edit.type = type;
            this.edit.show = true;
        },
        // 删除
        del (id) {
            this.$myConfirm({
                content: '确定要删除吗?'
            }).then(() => {
                this.Http(URL.del, {id}).then(res => {
                    this.$message({
                        type: 'success',
                        message: '删除成功'
                    });
                    this.getList();
                });
            });
        }
    },
    mounted () {
        this.getArea();
    },
    components: {
        treeTable,
        edit
    }
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
    
</style>
