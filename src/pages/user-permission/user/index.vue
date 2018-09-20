<template>
    <div>
        <el-row class="mgb10">
             <el-col :span="24">
                <el-button  type="primary" size="small" @click="add('add')">添加用户</el-button>
                 <div class="right">
                    <el-input placeholder="姓名/用户名" class="w200" v-model="search.keywords" size="small" @keydown.enter.native="getList(1)"></el-input>
                    <el-select v-model="search.status" placeholder="请选择" size="small">
                        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                    <el-button type="primary" icon="el-icon-search" size="small" @click="getList(1)" >查询</el-button>
                 </div>
             </el-col>
        </el-row>
        <el-table :data="list" border stripe  style="width: 100%">
            <el-table-column type="index" label="序号" width="60" align="center"></el-table-column>
            <el-table-column label="用户名"  prop="account"></el-table-column>
            <el-table-column label="姓名"   prop="userName"></el-table-column>
            <el-table-column label="角色"  min-width="160" prop="roleNames"></el-table-column>
            <el-table-column label="手机号码"  prop="mobilePhone"></el-table-column>
            <el-table-column label="邮箱"  prop="email"></el-table-column>
            <el-table-column label="状态" align="center" >
                <template slot-scope="scope">
                    <span v-if="scope.row.status==1" class="text-success">启用</span>
                    <span v-else class="text-danger">禁用</span>
                </template>
            </el-table-column>
            <el-table-column prop="" label="操作" min-width="120" align="center">
                <template slot-scope="scope">
                    <el-button type="text" @click="add('edit',scope.row.id)">编辑</el-button>
                    <el-button type="text" @click="changPasswd(scope.row.id)">修改密码</el-button>
                    <el-button type="text" @click="del(scope.row.id)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-row class="right">
            <pagination :total="page.total" :pageSize.sync="page.pageSize" :pageIndex.sync="page.pageNum" @change="getList"></pagination>
        </el-row>
        <edit v-if="edit.show" :show.sync="edit.show" :data="edit.data" :type="edit.type" @refish="getList"></edit>
        <passwd v-if="passwd.show" :show.sync="passwd.show" :data="passwd.data" ></passwd>
    </div>
</template>

<script type="text/javascript">
import edit from './mods/edit';
import passwd from './mods/passwd';
const URL = {
    list: '/sys/user/listPage',
    del: '/sys/user/delete'
};
export default {
    data () {
        return {
            options: [{
                value: -1,
                label: '所有'
            }, {
                value: 1,
                label: '正常'
            }, {
                value: 0,
                label: '禁用'
            }],
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
            },
            page: {
                pageNum: 1,
                pageSize: 20,
                total: 0
            },
            search: {
                keywords: '',
                status: -1
            },
            passwd: {
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
        getList (pageNum = this.page.pageNum, pageSize = this.page.pageSize) {
            this.Http(URL.list, {
                keywords: this.search.keywords,
                status: this.search.status,
                pageSize: pageSize,
                pageNum: pageNum
            }).then(res => {
                let msg = res.msg;
                this.page.pageNum = msg.pageNumber;
                this.page.pageSize = msg.pageSize;
                this.page.total = msg.totalRow;
                this.list = msg.list;
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
        },
        changPasswd (id) {
            this.passwd.data = id;
            this.passwd.show = true;
        }
    },
    mounted () {
        this.getList();
    },
    components: {
        edit,
        passwd
    }
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
    
</style>
