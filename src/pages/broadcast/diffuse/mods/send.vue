<template>
    <section>
        <myDialog :title="title" :show.sync="shows" width="500px" @submit="send" :confirmButtonText="btnTxt">
            <div slot="content">
                <el-form ref="dialogForm" label-width="120px" size="small">
                    <el-form-item label="媒体类型" v-if="type === 'mic'">
                        <el-radio-group v-model="mediaType" class="mgr40">
                            <el-radio :label="0">视频</el-radio>
                            <el-radio :label="1">音频</el-radio>
                        </el-radio-group>
                    </el-form-item>

                    <el-form-item label="文字内容" v-if="type === 'txt'">
                        <el-input type="textarea" :rows="4" placeholder="请输入内容" v-model="text"></el-input>
                    </el-form-item>
                    <el-form-item label="下发次数" v-if="type === 'txt'">
                        <el-input-number v-model="loopNum" controls-position="right" :min="1" :step="1"></el-input-number>
                    </el-form-item>
                </el-form>
            </div>
        </myDialog>
    </section>
</template>

<script>
    const URL = {
        list: '/media/mediafile/listPage',
        send: '/media/broadcast/sendCmd'
    };
    export default {
        data () {
            return {
                title: '话筒广播',
                btnTxt: '下发',
                mediaType: 1,
                action: 'start',

                text: '',
                loopNum: 1
            };
        },
        props: {
            show: {
                type: Boolean,
                required: true,
                default: false
            },
            data: {
                required: true,
                default: {}
            },
            type: {
                type: String,
                default: 'mic'
            }
        },
        methods: {
            send () {
                let _data = {};
                switch (this.type) {
                case 'txt':
                    _data = Object.assign(this.data, {
                        text: this.text,
                        loopNum: this.loopNum
                    });
                    break;
                case 'file':
                    _data = Object.assign(this.data, {

                    });
                    break;
                case 'net':
                    _data = Object.assign(this.data, {

                    });
                    break;
                default:
                    // 话筒
                    this.btnTxt = (this.action === 'start' ? '停止' : '下发');
                    _data = Object.assign(this.data, {
                        mediaType: this.mediaType,
                        action: this.action
                    });
                    this.action = (this.action === 'start' ? 'stop' : 'start');
                    break;
                }

                console.log(_data);

                // this.Http(URL.send, _data).then(res => {
                //     console.log(res);
                //     this.shows = false;
                //     this.$message({
                //         message: '下发成功',
                //         type: 'success'
                //     });
                // });
            },
            setTitle () {
                // mic:话筒广播  txt:文字广播  file:文件广播   net:网络直播流
                switch (this.type) {
                case 'txt':
                    this.title = '文字广播';
                    break;
                case 'file':
                    this.title = '文件广播';
                    break;
                case 'net':
                    this.title = '网络直播流';
                    break;
                default:
                    this.title = '话筒广播';
                    break;
                }
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
        created () {
            this.setTitle();
        },
        mounted () {
        },
        components: {
        }
    };
</script>
