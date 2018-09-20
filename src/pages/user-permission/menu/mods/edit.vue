<template>
    <section>
        <myDialog :title="(type === 'add' ? '添加菜单' : '编辑菜单')" :show.sync="shows" width="500px" @submit="submit">
            <div slot="content">
                <el-form ref="form" :model="form" label-width="100px" :rules="rules" size="small">
                    <el-form-item label="菜单名" prop="text">
                        <el-input v-model.trim="form.text" class="w300" :maxlength="20"></el-input>
                    </el-form-item>
                    <el-form-item label="Code" prop="code">
                        <el-input :disabled="type === 'edit'" v-model.trim="form.code" class="w300" :maxlength="20"></el-input>
                    </el-form-item>
                    <el-form-item label="描述" prop="remark">
                        <el-input v-model.trim="form.remark" type="textarea" class="w300" :maxlength="60"></el-input>
                    </el-form-item>
                </el-form>
            </div>
        </myDialog>
    </section>
</template>

<script>
    const URL = {
        add: '/sys/menu/save',
        update: '/sys/menu/update'
    };
    export default {
        data () {
            return {
                form: {
                    text: '', // 菜单名称
                    code: '' // 菜单编码
                },
                rules: {
                    text: [{required: true, message: '请填写菜单名', trigger: 'blur'}],
                    code: []
                },
                codeRule: {required: true, message: '请填写菜单code', trigger: 'blur'}
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
            getDetail () {
                this.Http(URL.detail, {
                    id: this.data
                }).then(res => {
                    this.form = {...this.form, ...res.msg};
                });
            },
            submit () {
                this.$refs.form.validate(valid => {
                    if (valid) {
                        let _url = this.type === 'add' ? URL.add : URL.update,
                            _data = {};

                        if (this.type === 'add') {
                            _data = {
                                parentId: this.data.id,
                                name: this.form.text,
                                code: this.form.code,
                                remark: this.form.remark
                            };
                        } else {
                            _data = {
                                id: this.data.id,
                                parentId: this.data.parentId || 0,
                                name: this.form.text,
                                remark: this.form.remark
                            };
                        }

                        this.Http(_url, _data).then(res => {
                            this.$message({
                                message: (this.type === 'add' ? '新增' : '修改') + '成功',
                                type: 'success'
                            });
                            this.$emit('refish');
                            this.shows = false;
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
                this.form = {...this.form, ...this.data};
            } else {
                this.rules.code.push(this.codeRule);
            }
        }
    };
</script>
