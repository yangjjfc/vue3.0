<template>
    <section>
        <myDialog :title="(type==='add'?'添加用户':'编辑用户')" :show.sync="shows" width="600px" @submit="add('dialogForm')">
            <div slot="content">
                <el-form ref="dialogForm" :model="form" label-width="120px" :rules="rules" size="small" status-icon>
                    <el-form-item label="用户名" prop="account" >
                        <el-input v-model.trim="form.account" class="w300" :maxlength="20" :disabled="type==='edit'"></el-input>
                    </el-form-item>
                       <el-form-item label="姓名" prop="userName">
                        <el-input v-model.trim="form.userName" class="w300" :maxlength="20"></el-input>
                    </el-form-item>
                      <el-form-item label="新密码" prop="password" v-if="type==='add'">
                        <el-input v-model.trim="form.password" type="password" class="w300" :maxlength="20"></el-input>
                    </el-form-item>
                    <el-form-item label="确认密码" prop="repassword" v-if="type==='add'">
                        <el-input v-model.trim="form.repassword" type="password" class="w300" :maxlength="20"></el-input>
                    </el-form-item>
                    <el-form-item label="角色" prop="roleIds">
                        <div class="el-card box-card is-always-shadow pad10">
                            <el-checkbox-group v-model="form.roleIds">
                                <el-checkbox v-for="role in roles" :label="role.id" :key="role.id">{{role.description}}</el-checkbox>
                            </el-checkbox-group>
                        </div>
                    </el-form-item>
                      <el-form-item label="手机号" prop="mobilePhone">
                        <el-input v-model.trim="form.mobilePhone" class="w300" :maxlength="11"></el-input>
                    </el-form-item>
                    <el-form-item label="邮箱" prop="email">
                        <el-input v-model.trim="form.email" class="w300" :maxlength="50"></el-input>
                    </el-form-item>
                   <el-form-item label="描述" prop="remark">
                        <el-input v-model.trim="form.remark" class="w300" :maxlength="60"></el-input>
                    </el-form-item>
                     <el-form-item label="接收手机告警" prop="mobileAlarm">
                        <el-switch v-model="form.mobileAlarm"  :active-value="1" :inactive-value="0" active-color="#13ce66" inactive-color="#ff4949"> </el-switch>
                    </el-form-item>
                    <el-form-item label="接收邮箱告警" prop="emailAlarm">
                        <el-switch v-model="form.emailAlarm" :active-value="1" :inactive-value="0" active-color="#13ce66" inactive-color="#ff4949"> </el-switch>
                    </el-form-item>
                     <el-form-item label="启用状态" prop="status">
                        <el-switch v-model="form.status" :active-value="1" :inactive-value="0" active-color="#13ce66" inactive-color="#ff4949"> </el-switch>
                    </el-form-item>
                </el-form>
            </div>
        </myDialog>
    </section>
</template>

<script>
    import reg from '~/regexp.js';
    import {encryption, filtersParams} from '~/global.common.js';
    const URL = {
        list: '/sys/role/list',
        detail: '/sys/user/findById',
        add: '/sys/user/save',
        edit: '/sys/user/update'
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
                    roleIds: [],
                    emailAlarm: 0,
                    mobileAlarm: 0,
                    status: 1
                },
                roles: [],
                rules: {
                    account: [
                        {required: true, message: '请填写用户名', trigger: 'blur'}
                    ],
                    userName: [
                        {required: true, message: '请填写姓名', trigger: 'blur'}
                    ],
                   
                    mobilePhone: [
                        { message: '请输入正确手机号码', trigger: 'blur', pattern: reg.phone }
                    ],
                    email: [
                        { message: '请输入正确邮箱', trigger: 'blur', pattern: reg.email }
                    ]
                   
                },
                addRules: {
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
                required: true,
                default: 'add'
            }
        },
        methods: {
            // 获取角色
            async getList () {
                let res = await this.Http(URL.list).then(res => {
                    this.roles = res.msg;
                });
                return res;
            },
            async getDetail () {
                await this.Http(URL.detail, {
                    id: this.data
                }).then(res => {
                    let roleIds = res.msg.roles.map(item => item.id);
                    this.form = {...this.form, ...res.msg, roleIds};
                });
            },
            add () {
                this.$refs.dialogForm.validate(valid => {
                    if (valid) {
                        let params = {};
                        if (this.type === 'add') {
                            params = JSON.parse(JSON.stringify(this.form));
                            params.password = encryption(params.password, this.$store.getters.clientid, this.$store.getters.token);
                        } else {
                            let key = ['id', 'userName', 'roleIds', 'mobilePhone', 'email', 'mobileAlarm', 'emailAlarm', 'status']; 
                            params = filtersParams(this.form, key);
                        }
                        this.Http(this.type === 'add' ? URL.add : URL.edit, 
                            params
                        ).then(res => {
                            this.shows = false;
                            this.$message({
                                message: (this.type === 'add' ? '添加' : '编辑') + '成功',
                                type: 'success'
                            });
                            this.$emit('refish');
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
            if (this.type === 'edit') {
                this.getList().then(res => {
                    this.getDetail();
                });
            } else {
                this.getList();
                this.rules = {...this.rules, ...this.addRules};
            }
        }
    };
</script>
