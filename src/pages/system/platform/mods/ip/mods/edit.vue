<template>
    <section>
        <myDialog :title="(type==='add'?'添加IP':'编辑IP')" :show.sync="shows" width="500px" @submit="add('dialogForm')">
            <div slot="content">
                <el-form ref="dialogForm" :model="form" label-width="100px" :rules="rules" size="small" status-icon>
                    <el-form-item label="IP地址" prop="ip">
                        <el-input v-model.trim="form.ip" class="w300" :maxlength="16"></el-input>
                    </el-form-item>
                    <el-form-item label="端口号" prop="port">
                        <el-input v-model.trim="form.port" class="w300" :maxlength="4"></el-input>
                    </el-form-item>
                </el-form>
            </div>
        </myDialog>
    </section>
</template>

<script>
import reg from '~/regexp.js';
const URL = {
    add: '/media/cfg/addIpChan',
    edit: '/media/cfg/updateIpChan'
};
export default {
    data () {
        return {
            form: {
                ip: '',
                port: ''
            },
            rules: {
                ip: [
                    {
                        required: true,
                        message: '请填写ip地址',
                        trigger: 'blur'
                    },
                    { message: 'ip地址格式有误', trigger: 'blur', pattern: reg.ip }
                ],
                port: [
                    {
                        required: true,
                        message: '请填写端口号',
                        trigger: 'blur'
                    },
                    {
                        pattern: /^[0-9]*$/,
                        message: '端口号必须是数字',
                        trigger: 'blur'
                    }
                ]
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
        add () {
            this.$refs.dialogForm.validate(valid => {
                if (valid) {
                    this.Http(this.type === 'add' ? URL.add : URL.edit, this.form).then(
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
        if (this.type === 'edit') {
            this.form = this.data;
        }
    }
};
</script>
