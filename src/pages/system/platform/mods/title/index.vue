<template>
<el-row class="my-title">
    <el-row class="my-title-top">
        <div>页面抬头管理</div>
    </el-row>
    <el-row class="my-title-input">
        <el-col :span="16" class="my-title-input-section">
            <el-input v-model="form.val" :placeholder="sysTitle||'请输入内容'" maxlength="20">
                <el-button type="primary" slot="append" @click="setTitle">确定</el-button>
            </el-input>
        </el-col>
    </el-row>
</el-row>
</template>

<script>
import { mapGetters } from 'vuex';
const URL = {
    sysTitleGet: '/media/cfg/sysTitleGet', // 获取标题
    sysTitleSet: '/media/cfg/sysTitleSet' // 修改标题
};
export default {
    data () {
        return {
            form: {
                val: ''
            }
        };
    },
    mounted () {},
    computed: {
        ...mapGetters(['sysTitle'])
    },
    methods: {
        setTitle () {
            let sysTitle = this.form.val.trim();
            if (!sysTitle.length) {
                this.$message.error({
                    showClose: true,
                    message: '请先填写内容'
                });
                return;
            }
            this.Http(URL.sysTitleSet, { sysTitle }).then(res => {
                this.$store.dispatch('changeSystemTitle', this.form.val);
                this.$message({
                    message: '设置成功',
                    type: 'success'
                });
            });
        }
    },
    components: {}
};
</script>

<style scoped lang="scss">
.my-title {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    min-height: 500px;
    &-top {
        display: flex;
        justify-content: center;
        font-size: 30px;
        font-weight: bold;
        margin-bottom: 20px;
    }
    &-input {
        width: 100%;
        display: flex;
        justify-content: center;
        &-section {
            display: flex;
            justify-content: center;
            .el-button--primary {
            border-radius: 0;
            color: #fff;
            background-color: #409eff;
            border-color: #409eff;
            }
        }
    }
}
</style>
