<template>
    <section>
        <myDialog :title="(type==='add'?'添加角色':'编辑角色')" :show.sync="shows" width="500px" @submit="add('dialogForm')">
            <div slot="content">
                <el-form ref="dialogForm" :model="form" label-width="100px" :rules="rules" size="small" status-icon>
                    <el-form-item label="角色名" prop="name">
                        <el-input v-model.trim="form.name" class="w300" :maxlength="20"></el-input>
                    </el-form-item>
                    <el-form-item label="描述" prop="description">
                        <el-input v-model.trim="form.description" class="w300" :maxlength="60"></el-input>
                    </el-form-item>
                </el-form>
            </div>
        </myDialog>
    </section>
</template>

<script>
    const URL = {
        detail: '/sys/role/findById',
        add: '/sys/role/save',
        edit: '/sys/role/update'
    };
    export default {
        data () {
            return {
                form: {
                    name: '',
                    description: ''
                },
                rules: {
                    name: [{
                        required: true,
                        message: '请填写角色名',
                        trigger: 'blur'
                    }],
                    description: [{
                        required: true,
                        message: '请填写描述',
                        trigger: 'blur'
                    }]
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
            getDetail () {
                this.Http(URL.detail, {
                    id: this.data
                }).then(res => {
                    this.form = {...this.form, ...res.msg};
                });
            },
            add () {
                this.$refs.dialogForm.validate(valid => {
                    if (valid) {
                        this.Http(this.type === 'add' ? URL.add : URL.edit, 
                            this.form
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
                this.getDetail();
            }
        }
    };
</script>
