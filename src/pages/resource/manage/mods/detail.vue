<template>
    <section>
        <myDialog title="终端详情" :show.sync="shows" width="400px" hide="true">
            <div slot="content">
                <el-form ref="form" :model="form" label-width="120px" size="small">
                    <el-form-item label="工作状态：">{{form.workStatus==1?'正常':'无响应'}}</el-form-item>
                    <el-form-item label="流类型：">{{form.workStatus}}</el-form-item>
                    <el-form-item label="音频格式：">{{form.audioType}}</el-form-item>
                    <el-form-item label="视频格式：">{{form.videoType}}</el-form-item>
                    <el-form-item label="物理码：">{{form.physicalNo}}</el-form-item>
                    <el-form-item label="IP：">{{form.yzIp}}</el-form-item>
                    <el-form-item label="端口号：">{{form.yzPort}}</el-form-item>
                    <el-form-item label="是否回传：">{{form.loop==1?'回传':'不回传'}}</el-form-item>
                    <el-form-item label="标签：">{{form.tagsX}}</el-form-item>
                </el-form>
            </div>
        </myDialog>
    </section>
</template>

<script>
const URL = {
    detail: '/media/devend/findById'
};
export default {
    data () {
        return {
            form: {
                tagsX: ''
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
        getDetail () {
            this.Http(URL.detail, {
                id: this.data
            }).then(res => {
                this.form = res.msg;
                if (res.msg.tags && res.msg.tags.length) {
                    this.form.tagsX = res.msg.tags.join(',');
                }
            });
        }
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
        this.getDetail();
    },
    created () {
    },
    components: {
    }
};
</script>

<style lang="scss" scoped>


</style>

