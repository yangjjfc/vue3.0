<template>
    <div>
        <el-row class="mgb10">
                <el-col :lg="15" :xl="24" >
                        <el-select v-model="search.userNo" class="mgb5 w160" placeholder="请选择" size="small">
                            <el-option v-for="item in options" :key="item.userNo" :label="item.account" :value="item.userNo"></el-option>
                        </el-select>
                        <el-input placeholder="操作编码" class="w200 mgb5" v-model="search.operCode" size="small" @keydown.enter.native="getList(1)"></el-input>
                        <el-input placeholder="关键词" class="w200 mgb5" v-model="search.keywords" size="small" @keydown.enter.native="getList(1)"></el-input>
                        <el-date-picker value-format="yyyy-MM-dd HH:mm:ss" :clearable="false" v-model="search.timer" size="small" type="datetimerange"  range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
                         <el-button type="primary" icon="el-icon-search" size="small" @click="getList(1)" >查询</el-button>
                        <el-button type="info" size="small" @click="reset" >重置</el-button>
                </el-col>
        </el-row>
        <el-table :data="list" border stripe  style="width: 100%">
            <el-table-column type="index" label="序号" width="60" align="center"></el-table-column>
            <el-table-column label="用户名"  prop="account"></el-table-column>
            <el-table-column label="操作名称"   prop="operName"></el-table-column>
            <el-table-column label="操作编号"  min-width="160" prop="operCode"></el-table-column>
            <el-table-column label="操作描述"  prop="remark"></el-table-column>
            <el-table-column label="详情"  prop="detail"></el-table-column>
            <el-table-column label="操作时间"  prop="operTime"></el-table-column>
        </el-table>
         <el-row class="right">
                <pagination :total="page.total" :pageSize.sync="page.pageSize" :pageIndex.sync="page.pageNum" @change="getList"></pagination>
        </el-row>
    </div>
</template>

<script type="text/javascript">
import {format, getDayBefore} from '~/global.common.js';
const URL = {
    list: '/sys/operLog/listPage',
    userList: '/sys/user/listPage'
};
export default {
    data () {
        return {
            options: [{
                userNo: '',
                account: '全部用户'
            }],
            list: [],
            page: {
                pageNum: 1,
                pageSize: 20,
                total: 0
            },
            search: {
                userNo: '',
                operCode: '',
                keywords: '',
                timer: []
            }
        };
    },
    methods: {
        // 列表
        getList (pageNum = this.page.pageNum, pageSize = this.page.pageSize) {
            this.Http(URL.list, {
                userNo: this.search.userNo,
                operCode: this.search.operCode,
                keywords: this.search.keywords,
                startTime: this.search.timer[0],
                endTime: this.search.timer[1],
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
        getUserList (pageNum = this.page.pageNum, pageSize = this.page.pageSize) {
            this.Http(URL.userList, {
                keywords: '',
                status: -1,
                pageSize: 99999,
                pageNum: 1
            }).then(res => {
                let msg = res.msg;
                this.options = [...this.options, ...msg.list];
            });
        },
        reset () {
            this.search = {
                userNo: '',
                operCode: '',
                keywords: '',
                timer: [format(new Date(), 'yyyy-MM-dd') + ' 00:00:00', getDayBefore(-30, 'yyyy-MM-dd hh:mm:ss')]
            };
            this.getList(1);
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
    created () {
        this.search.timer = [format(new Date(), 'yyyy-MM-dd') + ' 00:00:00', getDayBefore(-30, 'yyyy-MM-dd hh:mm:ss')];
    },
    mounted () {
        this.getUserList();
        this.getList();
    },
    components: {
     
    }
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
    
</style>
