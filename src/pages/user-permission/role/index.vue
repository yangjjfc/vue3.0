<template>
    <div>
        <el-row class="mgb10">
             <el-col :span="24">
                 <el-button type="primary" size="small" @click="add('add')">添加角色</el-button>
             </el-col>
        </el-row>
        <el-table :data="list" border stripe  style="width: 100%">
            <el-table-column type="index" label="序号" width="60" align="center"></el-table-column>
            <el-table-column label="角色" width="180" prop="name"></el-table-column>
            <el-table-column label="描述" align="center" prop="description"></el-table-column>
            <el-table-column prop="" label="操作"  align="center">
                <template slot-scope="scope">
                    <el-button type="text" @click="add('edit',scope.row.id)">编辑</el-button>
                    <el-button type="text" @click="setRole(scope.row.id)">权限</el-button>
                    <el-button type="text" @click="del(scope.row.id)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <edit v-if="edit.show" :show.sync="edit.show" :data="edit.data" :type="edit.type" @refish="getList"></edit>
        <role v-if="role.show" :show.sync="role.show" :data="role.data" ></role>
    </div>
</template>

<script type="text/javascript">
import edit from './mods/edit';
import role from './mods/role';
const URL = {
    list: '/sys/role/list',
    del: '/sys/role/delete'
};
export default {
    data () {
        return {
            list: [],
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
        // 列表
        getList () {
            this.Http(URL.list).then(res => {
                this.list = res.msg;
            });
        },
        // 配置
        add (type, id) {
            this.edit.data = id;
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
        },
        // 角色权限
        setRole (id) {
            this.role.data = id;
            this.role.show = true;
        }
    },
    mounted () {
        this.getList();
    },
    components: {
        edit,
        role
    }
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
    
</style>
