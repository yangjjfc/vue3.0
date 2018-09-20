<template>
    <section>
        <myDialog :title="(type==='add'?'添加存储系统':'编辑存储系统')" :show.sync="shows" width="950px" @submit="add">
            <div slot="content">
                <el-form ref="dialogForm" :model="form" label-width="120px" :rules="rules" size="small" status-icon>
                    <el-form-item label="存储系统名称" prop="name">
                        <el-input v-model.trim="form.name" class="w300 fl mgr10" :maxlength="16" :minlength="2" placeholder="请填写名称"></el-input>
                        <el-tag type="warning" class="fl">请填写存储系统名称，包含字母或汉字，2到16位</el-tag>
                    </el-form-item>
                    <el-form-item label="存储系统级别">
                        <el-select v-model="value" placeholder="请选择" size="small" class="w300 fl mgr10" >
                            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="访问方式">
                        <el-select v-model="value" placeholder="请选择" size="small" class="w300 fl mgr10" >
                            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="主存储系统IP">
                        <el-input v-model.trim="form.latitude"  class="w300 fl mgr10" placeholder="请填写IP"></el-input>
                        <el-tag type="warning" class="fl">请填写存储系统IP地址</el-tag>
                    </el-form-item>
                    <el-form-item label="主端口号">
                        <el-input v-model.trim="form.latitude"  class="w300 fl mgr10" placeholder="请填写端口号"></el-input>
                        <el-tag type="warning" class="fl">请填写端口号，即搭建的FTP服务器端口号，默认为21</el-tag>
                    </el-form-item>
                    <el-form-item label="主访问用户名">
                        <el-input v-model.trim="form.latitude"  class="w300 fl mgr10" placeholder="请填写用户名"></el-input>
                        <el-tag type="warning" class="fl">请填写存储系统用户名，即搭建的FTP服务器用户名</el-tag>
                    </el-form-item>
                    <el-form-item label="主密码">
                        <el-input v-model.trim="form.latitude" type="password" class="w300 fl mgr10" placeholder="请输入密码"></el-input>
                        <el-tag type="warning" class="fl">请填写密码，即搭建的FTP服务器访问密码</el-tag>
                    </el-form-item>
                    <el-form-item label="备存储系统IP">
                        <el-input v-model.trim="form.latitude"  class="w300 fl mgr10" placeholder="请填写IP"></el-input>
                        <el-tag type="warning" class="fl">请填写存储系统IP地址</el-tag>
                    </el-form-item>
                    <el-form-item label="备端口号">
                        <el-input v-model.trim="form.latitude"  class="w300 fl mgr10" placeholder="请填写端口号"></el-input>
                        <el-tag type="warning" class="fl">请填写端口号，即搭建的FTP服务器端口号，默认为21</el-tag>
                    </el-form-item>
                    <el-form-item label="备访问用户名">
                        <el-input v-model.trim="form.latitude"  class="w300 fl mgr10" placeholder="请填写用户名"></el-input>
                        <el-tag type="warning" class="fl">请填写存储系统用户名，即搭建的FTP服务器用户名</el-tag>
                    </el-form-item>
                    <el-form-item label="备密码">
                        <el-input v-model.trim="form.latitude"  class="w300 fl mgr10" placeholder="请输入密码"></el-input>
                        <el-tag type="warning" class="fl">请填写密码，即搭建的FTP服务器访问密码</el-tag>
                    </el-form-item>
                    <el-form-item label="系统容量（MB）">
                        <el-input v-model.number.trim="form.latitude"  class="w300 fl mgr10" placeholder="请填写容量"></el-input>
                        <el-tag type="warning" class="fl">请填写存储系统容量，必须为数字，单位为MB，不能超过FTP服务器的剩余容量！</el-tag>
                    </el-form-item>
                </el-form>
            </div>
            
            <el-button slot="btns" type="primary" size="small">测试主连接</el-button>
            <el-button slot="btns" type="primary" size="small">测试备连接</el-button>
        </myDialog>
    </section>
</template>

<script>
    const URL = {
        add: '',
        detail: '',
        edit: ''
    };
    export default {
        data () {
            return {
                options: [
                    {
                        value: '选项1',
                        label: '黄金糕'
                    }, {
                        value: '选项2',
                        label: '双皮奶'
                    }, {
                        value: '选项3',
                        label: '蚵仔煎'
                    }, {
                        value: '选项4',
                        label: '龙须面'
                    }, {
                        value: '选项5',
                        label: '北京烤鸭'
                    }],
                value: '',
                form: {
                    name: '',
                    code: '',
                    longitude: '',
                    latitude: ''
                },
                codelength: 2,
                rules: {
                    name: [{required: true, message: '请填写存储系统名称，包含字母或汉字，2到16位', trigger: 'blur'}]
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
            refish (point) {
                this.form.longitude = point.lng;
                this.form.latitude = point.lat;
            },
            async getDetail () {
                await this.Http(URL.detail, {
                    id: this.data.id
                }).then(res => {
                    this.form = {...this.form, ...res.msg, code: res.msg.id, name: res.msg.text};
                });
            },
            add () {
                this.$refs.dialogForm.validate(valid => {
                    if (valid) {
                        let params = {parentId: this.data.id, ...this.form};
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
            // if (this.type === 'edit') {
            //     this.getDetail();
            // }
        },
        components: {
        }
    };
</script>
