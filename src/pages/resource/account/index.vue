<template>
    <div>
        <!-- 终端开户 -->
        <el-row class="mgb10">
            <el-col :span="22">
                <span>行政区域 : </span>
                <el-select v-model="item.text" size="small"  @change="changeArea(index)" v-for="(item , index) in areaList" :disabled="!item.nuDisabled" class="w160 mgr5 mgb5" :key="item.id" :placeholder="item.placeholder">
                    <el-option v-if="item.options" v-for="subItem in item.options" :key="subItem.id" :label="subItem.text" :value="subItem.id"></el-option>
                </el-select>
                <el-button type="primary" size="small" @click="getList(1)">查询</el-button>
                <el-button size="small" @click="reset">重置</el-button>
            </el-col>
            <el-col :span="2">
                <el-button class="right" type="primary" size="small" @click="submit" :disabled="disabled">提交</el-button>
            </el-col>
        </el-row>
        <el-table :data="list" border stripe  style="width: 100%" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="80" align="center"></el-table-column>
            <el-table-column label="物理码" prop="wlCode"></el-table-column>
            <el-table-column label="所属区域" prop="area"></el-table-column>
            <el-table-column label="逻辑地址" prop="add"></el-table-column>
        </el-table>
    </div>
</template>

<script type="text/javascript">
import areaMin from '@/utils/mixin/area.js';

const URL = {
    list: ''
};
export default {
    mixins: [areaMin],
    data () {
        return {
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
        // 提交
        submit () {

        },
        // 列表
        getList () {
            // this.Http(URL.list, {}).then(res => {
            //     let msg = res.msg;
            //     this.list = msg;
            // });
        },
        // 重置
        reset () {
            this.getArea();
        }
    },
    mounted () {
        this.getArea();
    },
    components: {
    }
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
    
</style>
