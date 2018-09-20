//基本的dailog弹框组件
<template>
    <section>
        <el-dialog :title="title"  :visible.sync="shows" :fullscreen="fullscreen" :width="width" :custom-class="classx" :modal="modal" :center="center" :close-on-click-modal="close" :close-on-press-escape="close" :before-close="cancel" >
            <slot name='content'></slot>
            <span slot="footer" class="dialog-footer" v-if="showFooter">
                <slot name='btns'></slot>
                <el-button type="primary" @click="submit" v-if="!hide" size="small" :disabled="disButton">{{this.confirmButtonText}}</el-button>
                <el-button @click="cancel" size="small">{{closeButtonText}}</el-button>
            </span>
        </el-dialog>
    </section>
</template>

<script>
export default {
    name: 'MyDialog',
    data () {
        return {};
    },
    props: {
        modal: { // 是否显示遮罩
            type: Boolean,
            default: true
        },
        show: { // 是否显示dailog
            type: Boolean,
            required: true,
            default: false
        },
        fullscreen: { // 是否为全屏 Dialog
            type: Boolean,
            default: false
        },
        title: {
            type: String,
            required: true
        },
        width: { // dailog大小
            type: String,
            default: '50%'
        },
        showFooter: {
            type: Boolean,
            default: true
        },
        close: { // 禁用某些操作,可配置
            type: Boolean,
            default: true
        },
        center: {
            type: Boolean,
            default: false
        },
        confirmButtonText: {
            type: String,
            default: '确定'
        },
        disButton: {
            type: Boolean,
            default: false
        },
        closeButtonText: {
            type: String,
            default: '关闭'
        },
        classx: String, // 自定义class
        hide: [String, Boolean] // 隐藏按钮
    },
    computed: {
        shows: {
            get () {
                return this.show;
            },
            set (newValue) {
                this.$emit('update:show', newValue); // 更新父组件shows
            }
        }
    },
    methods: {
        // 确认事件
        submit () {
            this.$emit('submit');
        }, 
        // 取消事件
        cancel () {
            this.shows = false;
            this.$emit('reset');
        }
    }

};
</script>

<style lang="scss" rel="stylesheet/scss">
.el-dialog {
    min-width: 300px;
    overflow: hidden;
}

@media screen and (max-height: 700px) {
    .el-dialog__wrapper{
        top:-80px;
    }
    .el-dialog__body {
        max-height: 540px;
        overflow: auto;
    }
}

@media (min-height: 700px) and (max-height: 800px) {
    .el-dialog__wrapper{
        top:-80px;
    }
    .el-dialog__body {
        // max-height: 435px;
        max-height: 540px;
        overflow: auto;
    }
}

@media (min-height: 800px) and (max-height: 900px) {
    .el-dialog__body {
        max-height: 540px;
        overflow: auto;
    }
}

@media (min-height: 900px) {
    .el-dialog__body {
        max-height: 660px;
        overflow: auto;
    }
}

@media (min-width: 1380px) {
    .el-dialog--small {
        width: 40%;
    }
}
</style>
