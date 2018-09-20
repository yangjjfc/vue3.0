<template>
    <section>
        <myDialog title="修改密码" :show.sync="shows" width="500px" @submit="add('dialogForm')">
            <div slot="content">
                <el-form ref="dialogForm" :model="form" label-width="120px" :rules="rules" size="small" status-icon>
                   
                    <el-form-item label="新密码" prop="password">
                        <el-input v-model.trim="form.password" type="password" class="w300" :maxlength="20"></el-input>
                    </el-form-item>
                    <el-form-item label="确认密码" prop="repassword">
                        <el-input v-model.trim="form.repassword" type="password" class="w300" :maxlength="20"></el-input>
                    </el-form-item>
                </el-form>
            </div>
        </myDialog>
    </section>
</template>

<script>
    import {encryption} from '~/global.common.js';
    const URL = {
        change: '/sys/user/resetPassword'
    };
    export default {
        data () {
            // 密码校验
            let validatePass = (rule, value, callback) => {
                if (!value) {
                    callback(new Error('请输入密码'));
                } else {
                    if (value.length < 6 || value.length > 20) {
                        callback(new Error('长度在 6 到 20 个字符'));
                    } else {
                        if (this.form.repassword !== '') {
                            this.$refs.dialogForm.validateField('repassword');
                        }
                        callback();
                    }
                }
            };

            // 确认密码
            let validatePass2 = (rule, value, callback) => {
                if (!value) {
                    callback(new Error('请再次输入密码'));
                } else if (value !== this.form.password) {
                    callback(new Error('两次输入密码不一致!'));
                } else {
                    callback();
                }
            };
            return {
                form: {
                    emailAlarm: 0,
                    mobileAlarm: 0,
                    status: 1
                },
                rules: {
                    password: [
                        { required: true, validator: validatePass, trigger: 'blur' }
                    ],
                    repassword: [
                        { required: true, validator: validatePass2, trigger: 'blur' },
                        { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' }
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
                default: 'add'
            }
        },
        methods: {
            add () {
                this.$refs.dialogForm.validate(valid => {
                    if (valid) {
                        let params = JSON.parse(JSON.stringify(this.form));
                        params.password = encryption(params.password, this.$store.getters.clientid, this.$store.getters.token);
                        this.Http(URL.change, 
                            {
                                id: this.data,
                                password: params.password
                            }
                        ).then(res => {
                            this.shows = false;
                            this.$message({
                                message: '修改成功',
                                type: 'success'
                            });
                        });
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
        }
    };
</script>
