<template>
    <section>
        <myDialog title="设备详情" :show.sync="shows" width="400px" hide="true">
            <div slot="content">
                <el-form ref="form" :model="form" label-width="120px" size="small">
                    <el-form-item label="工作状态："></el-form-item>
                    <el-form-item label="流类型："></el-form-item>
                    <el-form-item label="音频格式："></el-form-item>
                    <el-form-item label="视频格式："></el-form-item>
                    <el-form-item label="物理码："></el-form-item>
                    <el-form-item label="IP："></el-form-item>
                    <el-form-item label="端口号："></el-form-item>
                    <el-form-item label="是否回传："></el-form-item>
                </el-form>
            </div>
        </myDialog>
    </section>
</template>

<script>
    export default {
        data () {
            return {
                form: {
                }
            };
        },
        props: {
            show: {
                type: Boolean,
                required: true,
                default: false
            },
            data: {
                required: true
            }
        },
        methods: {
            
        },
        computed: {
            shows: {
                get () {
                    return this.show;
                },
                set (newValue) {
                    this.$emit('update:show', newValue);
                }
            }
        },
        mounted () {
            
        },
        created () {
        },
        components: {
        }
    };
</script>

<style lang="scss" scoped>
/deep/ .el-dialog__body{
    padding: 0;
}
.el-form-item--small.el-form-item{
     margin-bottom: 0;
     color:red;
}
</style>

