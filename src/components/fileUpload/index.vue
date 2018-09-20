<template>
    <div>
        <el-upload  ref="imgUpload" :action="action" :headers="headers" :list-type="showType" :on-success="success" :show-file-list="show" class="upload-demo" :on-error="errors"  :before-upload="beforeUpload" :disabled="disabled" :multiple="multiple" :drag="drag"  :file-list="fileLists" :on-remove="remove" :class="classx">
            <el-button size="mini" type="primary" :limit="maxLength">点击上传</el-button>
            <slot></slot>
            <!-- <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div> -->
        </el-upload>
    </div>
</template>
<script>
    import {mapGetters} from 'vuex';
    const fileType = {
        video: ['AVI', 'WMV', 'MPEG', 'MP4', 'MKV', 'FLV', '3GP'], // 支持格式
        audio: ['MP3', 'WMA', 'WAV', 'APE', 'AAC', 'AC3']
    };
     
    export default {
        data () {
            return {
                action: process.env.IMAGE_UPLOAD + 'media/upload/uploadFile', // 上传地址
                headers: {}, // 添加请求头{}
                multiple: true, // 支持多张上传
                drag: false, // 是否支持拖拽上传
                fileLists: [], // 文件地址[{name,url}]
                imgUrls: [],
                maxLength: 1
            };
        },
        props: {
            readonly: {
                type: [Boolean, String]
            },
            files: { // 图片地址
                type: [String, Array],
                required: true
            },
            max: { // 最大上传数量
                type: [Number, String],
                default () {
                    return 2;
                }
            },
            classx: { // 自定义class
                type: String
            },
            showType: { // 显示类型
                type: String,
                default: 'text'
            },
            show: { // 是否显示上传图片 默认显示
                type: Boolean,
                default: true
            },
            type: { // 需要上传的文件类型
                type: String,
                default: 'audio' 
            }
        },
        beforeMount () {
            this.maxLength = Number(this.max); // 最大上传数
        },
        mounted () {
            if (this.token) {
                this.headers.jtoken = this.token;
            } else {
                this.$message({
                    showClose: true,
                    message: '无法获取token',
                    type: 'error'
                });
                return;
            }
            this.initFiles(this.files);
        },
        computed: {
            ...mapGetters([
                'token'
            ]),
            disabled () {
                return this.readonly ? JSON.parse(this.readonly) : false;
            }
        },
        watch: {
            files: {
                deep: true,
                handler: function (val, oldVal) {
                    if (val && val + '' !== oldVal + '') {
                        this.initFiles(val);
                    }
                }
            }
        },
        methods: {
            // 初始化file
            initFiles (val, oldval) {
                // let src = (typeof val === 'string' ? val.split(',') : (val instanceof Array ? val : null)),
                //     list = [];
                // this.imgUrls = [];
                // src.forEach(item => {
                //     if (item) {
                //         let formatUrl = this._formatFile(item);
                //         list.push(formatUrl);
                //         this.imgUrls.push(formatUrl.reUrl);
                //     }
                // });
                // this.fileLists = [...list];
            },
            updateFiles () {
                this.$emit('getUrl', this.imgUrls + '');// 方便获取图片list,适合表单验证
                this.$emit('update:files', this.imgUrls + '');// 方便获取图片list
            },
            // 上传前
            beforeUpload (file) {
                let type = file.name.split('.').reverse()[0].toUpperCase();
                // 文件类型
                if (!fileType[this.type].includes(type)) {
                    this.$message({
                        showClose: true,
                        message: '暂不支持上传文件 ' + type + ' 格式。',
                        type: 'error'
                    });
                    return false;
                }
                // 文件大小不能超过10M
                if (file.size > process.env.IMG_SIZE_MAX) {
                    this.$message({
                        showClose: true,
                        message: '文件大小不能超过 10MB。',
                        type: 'error'
                    });
                    return false;
                }
                if (this.fileLists.length === this.maxLength) {
                    this.$message({
                        showClose: true,
                        message: '最多上传' + this.maxLength + '个文件',
                        type: 'error'
                    });
                    return false;
                }
            },
            // 上传失败错误
            errors () {
                this.$message({
                    showClose: true,
                    message: '文件上传失败。',
                    type: 'error'
                });
            },
            // 上传成功
            success (response, file, fileList) {
                let res;
                if (typeof response === 'string') {
                    res = JSON.parse(response);
                } else {
                    res = response;
                }
                if (res.code === '200') {
                    let formatUrl = this._formatFile(res.msg, file);
                    this.fileLists.push(formatUrl);
                    this.imgUrls.push(formatUrl.uid);
                    this.updateFiles();
                } else {
                    let uploadFiles = this.$refs.imgUpload.uploadFiles;
                    this.$refs.imgUpload.uploadFiles = uploadFiles.filter(item => !item.response);
                    this.$message({
                        showClose: true,
                        message: res.msg,
                        type: 'error'
                    });
                }
            },
            // 删除
            remove (file, fileList) {
                if (!file) {
                    this.$message({
                        showClose: true,
                        message: '删除失败',
                        type: 'error'
                    });
                    return;
                }
                this.fileLists = this.fileLists.filter((item) => file.uid !== item.uid);
                this.imgUrls = this.fileLists.map(item => item.uid);
                setTimeout(() => {
                    this.updateFiles();
                }, 500);
            },
            // 格式化文件
            _formatFile (item, file = {}) {
                return {
                    name: file.name || '',
                    uid: item.uuid || Math.random() * 10000000,
                    url: process.env.IMAGE_DOWNLOAD + item.path 
                };
            }

        }
    };
</script>

<style lang="scss" rel="stylesheet/scss">
    $width: 90px;
    .upload-demo {
        line-height: 1;
        padding-top: 5px;
    }

    .el-upload--picture-card {
        background-color: #fbfdff;
        border: 1px dashed #c0ccda;
        border-radius: 6px;
        box-sizing: border-box;
        width: $width;
        height: $width;
        cursor: pointer;
        line-height: $width;
        vertical-align: top;
        margin-bottom: 8px;
    }

    .el-upload-list--picture-card .el-upload-list__item {
        overflow: hidden;
        background-color: #fff;
        border: 1px solid #c0ccda;
        border-radius: 6px;
        box-sizing: border-box;
        width: $width;
        height: $width;
        margin: 0 8px 8px 0;
        display: inline-block;
    }
</style>
 
 
 
