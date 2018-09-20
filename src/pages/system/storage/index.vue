<template>
    <div class="storage-container">
        <el-row class="mgb10">
            <el-col :span="22">
                <span>存储系统名称 : </span>
                <el-input size="small" class="w200" v-model="keywords"></el-input>
                <span>IP地址 : </span>
                <el-input size="small" class="w200" v-model="keywords"></el-input>
                <el-button type="primary" icon="el-icon-search" size="small" @click="getList(1)">查询</el-button>
                <el-button type="info" size="small" @click="reset" >重置</el-button>
            </el-col>
            <el-col :span="2">
                <el-button class="right" type="primary" size="small" @click="add('add')">新增</el-button>
            </el-col>
        </el-row>
        <el-table :data="list" border stripe  style="width: 100%">
            <el-table-column type="index" label="序号" width="60" align="center"></el-table-column>
            <el-table-column label="存储系统名称" prop=""></el-table-column>
            <el-table-column label="IP地址" prop=""></el-table-column>
            <el-table-column label="添加时间" prop=""></el-table-column>
            <el-table-column label="访问方式" prop=""></el-table-column>
            <el-table-column label="系统容量" prop=""></el-table-column>
            <el-table-column label="可用容量" prop=""></el-table-column>
            <el-table-column label="可分配容量" prop=""></el-table-column>
            <el-table-column label="设备状态" prop=""></el-table-column>
            <el-table-column prop="" label="操作" min-width="120" align="center">
                <template slot-scope="scope">
                    <el-button type="text" @click="add('edit',scope.row.id)">修改</el-button>
                    <el-button type="text" @click="del(scope.row.id)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-row class="right">
            <pagination :total="page.total" :pageSize.sync="page.pageSize" :pageIndex.sync="page.pageNum" @change="getList"></pagination>
        </el-row>

        <edit v-if="edit.show" :show.sync="edit.show" :data="edit.data" :type="edit.type" @refish="getList"></edit>
    </div>
</template>

<script type="text/javascript">
import edit from './mods/edit';
const URL = {
    list: '',
    del: ''
};
export default {
    data () {
        return {
            page: {
                pageNum: 1,
                pageSize: 20,
                total: 0
            },
            list: [],
            keywords: '',
            edit: {
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
            // this.Http(URL.list, {
            //     keywords: this.keywords,
            //     parentId: this._id,
            //     pageSize: pageSize,
            //     pageNum: pageNum
            // }).then(res => {
            //     let msg = res.msg;
            //     this.page.pageNum = msg.pageNumber;
            //     this.page.pageSize = msg.pageSize;
            //     this.page.total = msg.totalRow;
            // });
        },
        // 重置
        reset () {
            this.keywords = '';
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
    },
    components: {
        edit
    }
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
    
</style>
