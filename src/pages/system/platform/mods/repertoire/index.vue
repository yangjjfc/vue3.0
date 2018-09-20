<template>
    <div>
        <el-input v-model="chanValue" class="w300 mgr10" size="small" :maxlength="6">
            <template slot="prepend">指令发送PID：</template>
        </el-input>
        <el-button type="primary" size="small" @click="save('save')">保存</el-button>
        <el-button size="small" @click="reset">重置</el-button>
    </div>
</template>

<script>
const URL = {
    detail: '/media/cfg/ctrlChanGet',
    update: '/media/cfg/ctrlChanSet'
};
export default {
    data () {
        return {
            chanValue: '0x21' // 默认值 0x21 值范围在0 ~ 0x1FFF区间
        };
    },
    mounted () {
        this.getDetail();
    },
    methods: {
        reset () {
            this.chanValue = '0x21';
            this.save('reset');
        },
        save (type) {
            if (!this.chanValue) {
                this.$message({
                    type: 'warning',
                    message: '请输入指令发送PID'
                });
                return;
            }
            this.Http(URL.update, {
                chanValue: this.chanValue
            }).then((res) => {
                this.$message({
                    type: 'success',
                    message: (type === 'save' ? '保存' : '重置') + '成功'
                });
            });
        },
        getDetail () {
            this.Http(URL.detail, {}).then(res => {
                this.chanValue = res.msg;
            });
        }
    }
};
</script>

<style scoped lang="scss">
</style>
