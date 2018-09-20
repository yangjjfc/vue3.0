<template>
    <section>
        <myDialog :title="(type==='add'?'添加':'编辑')" :show.sync="shows" width="600px" @submit="add('dialogForm')">
            <div slot="content">
                <el-form ref="dialogForm" :model="form" label-width="120px"  size="small" status-icon>
                    <el-form-item label="内容名称" prop="name" :rules="[
      { required: true, message: '请输入内容名称', trigger: 'blur' },
    ]">
                        <el-input v-model.trim="form.name" class="w300"  ></el-input>
                    </el-form-item>
                    <el-form-item label="文件类型" prop="fileType" :rules="[
      { required: true, message: '请选择文件类型', trigger: 'change' },
    ]">
                        <el-radio-group v-model="form.fileType" @change="changeRadio" :disabled="type==='edit'">
                            <el-radio :label="0">文字</el-radio>
                            <el-radio :label="1">文件</el-radio>
                            <el-radio :label="2">实时采集</el-radio>
                            <el-radio :label="3">网络直播流</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="媒体类型" prop="mediaType" v-if="form.fileType!=0" :rules="[
      { required: true, message: '请选择媒体类型', trigger: 'change' }
    ]">
                        <el-radio-group v-model="form.mediaType" :disabled="type==='edit'">
                            <el-radio :label="0">视频</el-radio>
                            <el-radio :label="1">音频</el-radio>
                        </el-radio-group>
                    </el-form-item>
                     <el-form-item label="上传文件" prop="uuid" v-if="type==='add'&&form.fileType==1"  :rules="[
      { required: true, message: '请上传文件', trigger: 'change,blur' }
    ]" >
                        <fileUpload :files.sync="form.uuid" :type="form.mediaType==1?'audio':'video'"></fileUpload>
                    </el-form-item>
                     <!-- <el-form-item label="马上采集" prop="uuid"  v-if="form.fileType==2">
                         <el-button type="primary" size="mini" @click="showGather" >采集</el-button>
                    </el-form-item> -->
                    <el-form-item label="文字资源" prop="text" v-if="form.fileType==0" :rules="[
      { required: true, message: '请输入文字资源', trigger: 'blur' }
    ]">
                        <el-input type="textarea" v-model.trim="form.text"  :disabled="type==='edit'" class="w300"  ></el-input>
                    </el-form-item>
                     <el-form-item label="直播地址" prop="netStream"  v-if="form.fileType==3" :rules="[
      { required: true, message: '请输入直播地址', trigger: 'blur' }
    ]">
                        <el-input  v-model.trim="form.netStream" class="w300" :disabled="type==='edit'"></el-input>
                    </el-form-item>
                     <el-form-item label="备注" prop="remark" >
                        <el-input  type="textarea" v-model.trim="form.remark" class="w300"  ></el-input>
                    </el-form-item>
                </el-form>
            </div>
        </myDialog>
        <gather v-if="gather.show" :show.sync="gather.show" :data="gather.data" :type="gather.type" ></gather>
    </section>
</template>

<script>
import fileUpload from '@/components/fileUpload/index.vue';
import gather from './gather';
const URL = {
    add: '/media/mediafile/save',
    edit: '/media/mediafile/update',
    find: '/media/mediafile/findById'
};
export default {
    data () {
        return {
            form: {
                uuid: '',
                fileType: 1,
                mediaType: 0,
                remark: ''
            },
            gather: {
                show: false,
                data: '',
                type: ''
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
            default: 'add'
        }
    },
    methods: {
        changeRadio () {
            this.$refs.dialogForm.clearValidate();
        },
        showGather () {
            this.gather.show = true;
        },
        getDetail () {
            this.Http(URL.find, {
                id: this.data
            }).then(res => {
                this.form = res.msg;
            });
        },
        add () {
            this.$refs.dialogForm.validate(valid => {
                if (valid) {
                    let params = this.form;
                    this.Http(this.type === 'add' ? URL.add : URL.edit, params).then(
                        res => {
                            this.shows = false;
                            this.$message({
                                message: (this.type === 'add' ? '添加' : '编辑') + '成功',
                                type: 'success'
                            });
                            this.$emit('refish');
                        }
                    );
                } else {
                    return false;
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
        this.type === 'edit' && (this.getDetail());
    },
    components: {
        fileUpload,
        gather
    }
};
</script>
