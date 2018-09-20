<template>
    <div >
        <tree-table :data="tree.data" :columns="columns" :expandAll="expandAll" border>
            <el-table-column label="操作" width="230">
                <template slot-scope="scope">
                    <el-button type="text" @click="modify(scope.row, 'add')">添加子级</el-button>
                    <el-button type="text" @click="modify(scope.row, 'edit')">编辑</el-button>
                    <el-button type="text" @click="del(scope.row.id)">删除</el-button>
                    <el-button type="text" @click="associatedApi(scope.row.id)">关联api</el-button>
                </template>
            </el-table-column>
        </tree-table>

        <menu-api v-if="menuApi.show" :show.sync="menuApi.show" :data="menuApi.data" ></menu-api>
        <edit v-if="update.show" :show.sync="update.show" :data="update.data" :type="update.type" @refish="getTreee"></edit>
    </div>
</template>
<script type="text/javascript">
import treeTable from '@/components/TreeTable';
import menuApi from './mods/menuApi';
import edit from './mods/edit';

const URL = {
    tree: '/sys/menu/listTree',
    del: '/sys/menu/delete',
    menuApi: '/sys/menu/menuApiTree' // 菜单api
};

export default {
    data () {
        return {
            update: {
                show: false,
                data: {},
                type: 'add'
            },
            columns: [
                {text: '菜单名', value: 'text', width: 200},
                {text: 'code', value: 'code'},
                {text: '权限', value: 'permission'},
                {text: '描述', value: 'remark'}
            ],
            expandAll: true,
            menuApi: {
                show: false,
                data: ''
            },
            tree: { // 树类型
                data: [],
                defaultProps: {
                    children: 'children',
                    label: 'text'
                }
            }
        };
    },
    methods: {
        associatedApi (id) {
            this.menuApi.show = true;
            this.menuApi.data = id;
        },
        modify (row, type) {
            this.update.data = row;
            this.update.type = type;
            this.update.show = true;
        },
        del (id) {
            this.$myConfirm({
                content: '确定要删除吗？'
            }).then(() => {
                this.Http(URL.del, {
                    id
                }).then(res => {
                    this.$message({
                        type: 'success',
                        message: '删除成功'
                    });
                    this.getTreee();
                });
            });
        },
        getTreee () {
            this.Http(URL.tree, {}).then(res => {
                this.tree.data = res.msg;
            });
        }
    },
    computed: {
    },
    mounted () {
        this.getTreee();
    },
    components: {
        treeTable,
        menuApi,
        edit
    }
};
</script>

