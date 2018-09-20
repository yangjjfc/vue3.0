<template>
    <section>
        <myDialog title="终端详情" :show.sync="shows" width="400px" hide="true">
            <div slot="content">
                <el-form ref="form" :model="form" label-width="120px" size="small">
                    <el-form-item label="资源标识："></el-form-item>
                    <el-form-item label="资源类型："></el-form-item>
                    <el-form-item label="所属区域："></el-form-item>
                    <el-form-item label="资源状态："></el-form-item>
                    <el-form-item label="回传时间："></el-form-item>
                    <el-form-item label="回传周期："></el-form-item>
                    <el-form-item label="信号质量："></el-form-item>
                    <el-form-item label="信号强度："></el-form-item>
                    <el-form-item label="回传模式："></el-form-item>
                    <el-form-item label="功放状态："></el-form-item>
                    <el-form-item label="私有描述："></el-form-item>
                    <el-form-item label="电源状态："></el-form-item>
                    <el-form-item label="方案类型："></el-form-item>
                    <el-form-item label="接收频率："></el-form-item>
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

