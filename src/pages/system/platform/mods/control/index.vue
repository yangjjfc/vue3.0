<template>
    <div class="ip-content">
        <div class="mgb10">
            <span>节目流通道数：</span>
            <el-input-number v-model="chanNums" controls-position="right" :min="1" :max="256" size="small"></el-input-number>
            <el-button type="primary" size="small" @click="changeNum">修改</el-button>
            <!-- <el-input v-model.number.trim="chanNums" class="w300 mgr10 fl" size="small" :maxlength="6">
                <template slot="prepend">节目流通道数：</template>
            </el-input> -->
        </div>
        <el-table :data="list" border stripe>
            <el-table-column label="节目名" prop="name" align="center"></el-table-column>
            <el-table-column label="节目号" align="center">
                <template slot-scope="scope">
                    <el-input v-model.trim="scope.row.chanNo" maxlength="6" size="small"></el-input>
                </template>
            </el-table-column>
            <el-table-column label="音频PID" align="center">
                <template slot-scope="scope">
                    <el-input v-model.trim="scope.row.audioPid" maxlength="6" size="small"></el-input>
                </template>
            </el-table-column>
            <el-table-column label="PMT PID" align="center">
                <template slot-scope="scope">
                    <el-input v-model.trim="scope.row.pmtPid" maxlength="6" size="small"></el-input>
                </template>
            </el-table-column>
            <el-table-column label="启用" align="center">
                <template slot-scope="scope">
                    <el-switch v-model="scope.row.status" active-color="#13ce66" :active-value="1" :inactive-value="0"></el-switch>
                </template>
            </el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button type="text" @click="update(scope.row)">修改</el-button>
                    <el-tag  size="mini" v-if="scope.row.editSuccess" type="success">修改成功</el-tag>
                    <!-- <el-tag  size="mini" v-else type="info">暂未修改</el-tag> -->
                </template>
            </el-table-column>
            <!-- <el-table-column label="修改状态" align="center">
                <template slot-scope="scope">
                    <el-tag  size="mini" v-if="scope.row.editSuccess" type="success">修改成功</el-tag>
                    <el-tag  size="mini" v-else type="info">暂未修改</el-tag>
                </template>
            </el-table-column> -->
        </el-table>
    </div>
</template>

<script type="text/ecmascript-6">

const URL = {
    changeNum: '/media/cfg/chgMediaChanNums',
    list: '/media/cfg/listMediaChan',
    update: '/media/cfg/updateMediaChan'
};
export default {
    data () {
        return {
            chanNums: 0,
            list: []
        };
    },
    mounted () {
        this.getList();
    },
    methods: {
        update (row) {
            if (!row.chanNo) {
                this.$message({
                    type: 'warning',
                    message: '请为【' + row.name + '】填写节目号'
                });
                return;
            }
            if (!row.audioPid) {
                this.$message({
                    type: 'warning',
                    message: '请为【' + row.name + '】填写音频PID'
                });
                return;
            }
            if (!row.pmtPid) {
                this.$message({
                    type: 'warning',
                    message: '请为【' + row.name + '】填写PMT PID'
                });
                return;
            }

            this.Http(URL.update, {
                id: row.id,
                name: row.name,
                chanNo: row.chanNo,
                audioPid: row.audioPid,
                PMTPid: row.pmtPid,
                status: row.status
            }).then(res => {
                this.list[row.index].editSuccess = true;
                this.$message({
                    type: 'success',
                    message: '修改成功'
                });
            });
        },
        getList () {
            this.Http(URL.list, {}).then(res => {
                this.list = res.msg.map((item, index) => {
                    item.index = index;
                    item.editSuccess = false;
                    return item;
                });
                this.chanNums = this.list.length;
            });
        },
        changeNum () {
            this.$myConfirm({
                content: '确定修改节目流通道数？一经修改无法恢复！'
            }).then(() => {
                this.Http(URL.changeNum, {
                    chanNums: this.chanNums
                }).then(res => {
                    this.$message({
                        type: 'success',
                        message: '修改成功'
                    });
                    this.getList();
                });
            });
        }
    },
    components: {
    }
};
</script>

<style lang="scss" scoped>
.ip-content{
    min-height: 500px;
}
</style>
