<template>
    <section>
        <myDialog :title="title" :show.sync="shows" width="600px" @submit="add('dialogForm')" :showFooter="false">
            <div slot="content">
                <el-form ref="dialogForm" :model="form" label-width="120px" size="small">
                    <el-card shadow="hover" class="mgb10">
                        <el-form-item label="音量" prop="devType">
                            <el-slider v-model="form.volume" class="fl w300"></el-slider>
                            <el-button class="fr" type="primary" size="small" @click="setVolume">设置</el-button>
                        </el-form-item>
                    </el-card>
                    <el-card shadow="hover" class="mgb10">
                        <el-form-item label="服务层参数" prop="audioType" style="margin-bottom:10px;">
                            <el-input v-model.trim="form.loopUrl" class="w300"></el-input>
                            <el-button class="fr" type="primary" size="small" @click="setLoop">设置</el-button>
                        </el-form-item>
                        <el-form-item label="回传周期（秒）" prop="audioType">
                            <el-input v-model.number.trim="form.loopRate" class="w300"></el-input>
                        </el-form-item>
                    </el-card>
                    <el-card shadow="hover" class="mgb10">
                        <el-form-item label="TS终端受控电源">
                            <el-radio-group v-model="form.openPower">
                                <el-radio :label="1">开</el-radio>
                                <el-radio :label="0">关</el-radio>
                            </el-radio-group>
                            <el-button class="fr" type="primary" size="small" @click="setTsPower">设置</el-button>
                        </el-form-item>
                    </el-card>
                    <el-card shadow="hover">
                        <el-form-item label="TS终端开/关机" prop="">
                            <el-radio-group v-model="form.openShutdown">
                                <el-radio :label="1">开</el-radio>
                                <el-radio :label="0">关</el-radio>
                            </el-radio-group>
                            <el-button class="fr" type="primary" size="small" @click="setTsShutdown">设置</el-button>
                        </el-form-item>
                    </el-card>
                </el-form>
            </div>
        </myDialog>
    </section>
</template>

<script>
    const URL = {
        cfgVolume: '/media/devend/cfgVolume',
        cfgLoop: '/media/devend/cfgLoop',
        cfgTsPower: '/media/devend/cfgTsPower',
        cfgTsShutdown: '/media/devend/cfgTsShutdown'
    };
    export default {
        data () {
            return {
                title: '',
                ids: [],
                form: {
                    volume: 80,
                    openPower: 1,
                    openShutdown: 1
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
            },
            type: {
                type: String,
                required: true,
                default: 'batch'
            }
        },
        methods: {
            setVolume () {
                this.Http(URL.cfgVolume, {
                    ids: this.ids,
                    volume: this.form.volume
                }).then(res => {
                    this.shows = false;
                    this.$message({
                        message: '音量设置成功',
                        type: 'success'
                    });
                    this.$emit('refish');
                });
            },
            setLoop () {
                if (!this.form.loopUrl) {
                    this.$message({
                        message: '请填写服务层参数',
                        type: 'warning'
                    });
                    return false;
                }
                if (!this.form.loopRate) {
                    this.$message({
                        message: '请填写回传周期',
                        type: 'warning'
                    });
                    return false;
                }
                
                this.Http(URL.cfgTsPower, {
                    ids: this.ids,
                    loopUrl: this.form.loopUrl,
                    loopRate: this.form.loopRate
                }).then(res => {
                    this.shows = false;
                    this.$message({
                        message: '回传参数设置成功',
                        type: 'success'
                    });
                    this.$emit('refish');
                });
            },
            setTsPower () {
                this.Http(URL.cfgTsPower, {
                    ids: this.ids,
                    open: this.form.openPower
                }).then(res => {
                    this.shows = false;
                    this.$message({
                        message: 'TS终端受控电源设置成功',
                        type: 'success'
                    });
                    this.$emit('refish');
                });
            },
            setTsShutdown () {
                this.Http(URL.cfgTsShutdown, {
                    ids: this.ids,
                    open: this.form.openShutdown
                }).then(res => {
                    this.shows = false;
                    this.$message({
                        message: 'TS终端开/关机设置成功',
                        type: 'success'
                    });
                    this.$emit('refish');
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
            if (this.type === 'single') {
                if (this.data.openPower === undefined) {
                    this.data.openPower = 1;
                }
                if (this.data.openShutdown === undefined) {
                    this.data.openShutdown = 1;
                }
                this.form = this.data;
                this.ids.push(this.data.id);
            } else if (this.type === 'batch') {
                this.ids = this.data;
            }
            this.title = '终端控制（选中终端' + this.ids.length + '台）';
        },
        created () {
        },
        components: {
        }
    };
</script>
<style lang="scss" scoped>
.el-form-item{
    margin-bottom: 0;
}
</style>
