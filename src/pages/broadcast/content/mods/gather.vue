<template>
    <section>
        <myDialog title="采集" :show.sync="shows" width="600px" :showFooter="false" @submit="submit()">
            <div slot="content" class="gather-container" style="width:100%">
            </div>
        </myDialog>
    </section>
</template>

<script>
// import videojs from 'video.js';
// import 'video.js/dist/video-js.css';
import AudioRecorder from '~/audio-recorder.js';
export default {
    data () {
        return {
        };
    },
    props: {
        show: {
            type: Boolean,
            required: true,
            default: false
        },
        type: {// 0：视频，1：音频
            required: true
        },
        data: {
            type: String,
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
        /* eslint-disable no-new */
        new AudioRecorder('.gather-container');
    }
};
</script>
<style lang="scss" scoped>

</style>
