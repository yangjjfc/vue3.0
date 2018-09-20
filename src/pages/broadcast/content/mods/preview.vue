<template>
    <section>
        <myDialog title="预览回放" :show.sync="shows" width="800px" :showFooter="false" class="previewDialog">
            <div slot="content" class="video-container" style="width:100%">
                <div class="radio-box" v-if="data.convertStatus==1">
                    <el-radio-group v-model="radio" @change="changeRadio">
                        <el-radio label="1" border>{{data.mediaType==0?'原视频':'原音频'}}</el-radio>
                        <el-radio label="2" border >{{data.mediaType==0?'转码视频':'转码音频'}}</el-radio>
                    </el-radio-group>
                </div>
                <video controls autoplay id="my-player"  class="video-js"  preload="auto" v-if="data.fileType == 3" width="700" height="500">
                    <source :src="src" type="rtmp/mp4"/>
                    <source :src="src" type="rtmp/flv"/>
                </video>
                <audio :src="src" id="my-player" controls autoplay v-else-if="data.mediaType==1 && data.fileType != 3" >亲 您的浏览器不支持html5的audio标签</audio>
                <video controls autoplay id="my-player"  class="video-js"  preload="auto" v-else-if="data.mediaType==0 && data.fileType != 3" width="700" height="500">
                    <source :src="src" type="video/mp4"/>
                    <source :src="src" type="video/webm"/>
                    <source :src="src" type="video/ogg"/>
                </video>
            </div>
        </myDialog>
    </section>
</template>

<script>
import videojs from 'video.js';
import 'videojs-flash';
import 'video.js/dist/video-js.css';
import {addEvent, delEvent} from '~/global.common.js';
const URL = {
    openFfmpeg: '/media/mediafile/openFfmpeg'
};
export default {
    data () {
        return {
            src: '',
            radio: '1'
        };
    },
    props: {
        show: {
            type: Boolean,
            required: true,
            default: false
        },
        // type: {// 0：视频，1：音频
        //     required: true
        // },
        // fileType: {// 0：文字，1：文件，2：实时采集，3：网络直播流
        //     required: true
        // },
        data: {
            type: Object,
            required: true
        }
    },
    methods: {
        bindVideoInit () {
            this.$nextTick(() => {
                let options = {};
                this.player = videojs(document.getElementById('my-player'), options, function onPlayerReady () {
                    videojs.log('Your player is ready!');
                    // In this context, `this` is the player that was created by Video.js.
                    this.play();
                    // How about an event listener?
                    this.on('ended', function () {
                        videojs.log('播放结束');
                    });
                });
            });
        },
        changeRadio (id) {
            let src = '';
            if (id === '1') {
                src = process.env.IMAGE_DOWNLOAD + this.data.localPath;
            } else {
                src = process.env.IMAGE_DOWNLOAD + this.data.convertPath; // 转码视频
            }
            if (this.data.mediaType === 0) {
                this.player.src(src);
                this.player.load();
            } else {
                this.src = src;
                this.player.load();
            }
        },
        async getLiveAddress () {
            let res = await this.Http(URL.openFfmpeg, {
                id: this.data.id
            });
            this.src = 'rtmp://www.poopp.cn' + res.msg;
            // this.src = 'rtmp://www.poopp.cn:11935/live/testMv';
            return res;
        },
        bindAudioListener () {
            this.$nextTick(() => {
                this.player = document.getElementById('my-player');
                addEvent(this.player, 'play', this.audioPlay, false);
                addEvent(this.player, 'loadstart', this.audioLoadstart, false);
            });
        },
        audioPlay () {
            this.loading.close();
        },
        audioLoadstart () {
            this.loading = this.$loading({
                lock: true,
                text: '加载中...',
                target: '.previewDialog .el-dialog',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)'
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
    async created () {
        if (this.data.fileType === 1) {
            this.src = process.env.IMAGE_DOWNLOAD + this.data.localPath;
        } else if (this.data.fileType === 3) {
            await this.getLiveAddress();
        }
        if (this.data.mediaType === 0) {
            this.bindVideoInit();
        } else {
            this.bindAudioListener();
        }
    },
   
    beforeDestroy () {
        if (this.data.mediaType === 0) {
            this.player.dispose(); // 注销video,debug
        } else {
            delEvent(this.player, 'play', this.audioPlay);
            delEvent(this.player, 'loadstart', this.audioLoadstart);
        }
    }
    
};
</script>
<style lang="scss" scoped>
.video-container{
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    .radio-box{
        margin-bottom: 20px;
    }
}
</style>
