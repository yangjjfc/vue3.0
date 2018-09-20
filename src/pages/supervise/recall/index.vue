<template>
    <div>
        <!-- 回溯与监听 -->
        <el-row class="mgb10">
            <el-col :span="22">
                <span>广播人 : </span>
                <el-input size="small" class="w200"></el-input>
                <span>开始时间 : </span>
                <!-- <el-date-picker v-model="value4" size="small" type="datetimerange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" class="w360"></el-date-picker> -->
                <el-date-picker v-model="value4" type="datetime" placeholder="选择开始时间" size="small"></el-date-picker>
                <span>类型 : </span>
                <el-select v-model="value" placeholder="请选择" size="small" class="w200" >
                    <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
                <el-button type="primary" size="small" @click="getList(1)">查询</el-button>
                <el-button size="small" @click="reset">重置</el-button>
            </el-col>
            <el-col :span="2">
                <el-button class="right" type="primary" size="small" @click="batchDeletion" :disabled="disabled">批量删除</el-button>
            </el-col>
        </el-row>
        <el-table :data="list" border stripe  style="width: 100%" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="70" align="center"></el-table-column>
            <el-table-column label="广播者" prop="wlCode"></el-table-column>
            <el-table-column label="开始时间" prop="area"></el-table-column>
            <el-table-column label="持续时长" prop="add"></el-table-column>
            <el-table-column label="广播内容" prop="add"></el-table-column>
            <el-table-column label="广播类型" prop="add"></el-table-column>
            <el-table-column label="广播级别" prop="add"></el-table-column>
            <el-table-column label="广播状态" prop="add"></el-table-column>
            <el-table-column label="广播覆盖区域/终端" prop="add"></el-table-column>
            <el-table-column label="操作" header-align="center" width="100">
                <template slot-scope="scope" >
                    <el-button type="text">回溯</el-button>
                    <el-button type="text" @click="del(scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-row class="right">
            <pagination :total="page.total" :pageSize.sync="page.pageSize" :pageIndex.sync="page.pageNum" @change="getList"></pagination>
        </el-row>
    </div>
</template>

<script type="text/javascript">
const URL = {
    list: ''
};
export default {
    data () {
        return {
            value4: '',
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
            },
            disabled: true,
            list: [{
                id: 1,
                wlCode: 11111,
                area: '北京市市辖区2朝阳区',
                add: '31231231312'
            }, {
                id: 2,
                wlCode: 22222,
                area: '北京市市辖区2海淀区八里庄街道办事处',
                add: '2112312'
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
        // 批量删除
        batchDeletion () {

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
        }
    },
    mounted () {
    },
    components: {
    }
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
    
</style>
