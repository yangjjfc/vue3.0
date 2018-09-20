<template>
    <div>
         <el-row class="mgb10">
             <el-col :span="24">
                 <el-button type="primary" size="small" @click="add('add')">添加 IP</el-button>
             </el-col>
        </el-row>
        <el-table :data="list" border stripe  style="width: 100%">
            <el-table-column type="index" label="序号" width="60" align="center"></el-table-column>
            <el-table-column label="IP地址" width="180" prop="ip"></el-table-column>
            <el-table-column label="端口" align="center" prop="port"></el-table-column>
            <el-table-column label="创建时间" align="center" prop="createAt"></el-table-column>
            <el-table-column label="更新时间" align="center" prop="updateAt"></el-table-column>
            <el-table-column prop="" label="操作"  align="center">
                <template slot-scope="scope">
                    <el-button type="text" @click="add('edit',scope.row)">编辑</el-button>
                    <el-button type="text" @click="del(scope.row.id)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <edit v-if="edit.show" :show.sync="edit.show" :data="edit.data" :type="edit.type" @refish="getList"></edit>
    </div>
</template>

<script type="text/javascript">
import edit from './mods/edit';
const URL = {
    list: '/media/cfg/listIpChan',
    del: '/media/cfg/delIpChan'
};
export default {
    data () {
        return {
            list: [],
            edit: {
                show: false,
                data: {},
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
        add (type, item) {
            type === 'edit' && (this.edit.data = item);
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
        this.getList();
    },
    components: {
        edit
    }
};
</script>

