<template>
    <section>
        <myDialog :title="(type==='add'?'添加区域':'编辑区域')" :show.sync="shows" width="600px" @submit="add('dialogForm')">
            <div slot="content">
                <el-form ref="dialogForm" :model="form" label-width="120px" :rules="rules" size="small" status-icon>
                    <el-form-item label="区域名称" prop="name" >
                        <el-input v-model.trim="form.name" class="w300"  :maxlength="20" ></el-input>
                    </el-form-item>
                       <el-form-item label="区域编码" prop="code">
                        <el-input v-model.trim="form.code" class="w300"   :maxlength="codelength" :disabled="type==='edit'"></el-input>
                    </el-form-item>
                      <el-form-item label="经度" prop="longitude">
                        <el-input v-model.trim="form.longitude" class="w300" readonly></el-input>
                        <el-button type="warning"  @click="getMap" icon="el-icon-location" size="small">地图助手</el-button>
                    </el-form-item>
                    <el-form-item label="纬度" prop="latitude">
                        <el-input v-model.trim="form.latitude"  class="w300" readonly></el-input>
                    </el-form-item>
                </el-form>
            </div>
        </myDialog>
        <my-map v-if="maps.show" :show.sync="maps.show" :data="maps.data" :type="maps.type" @refish="refish"></my-map>
    </section>
</template>

<script>
    import reg from '~/regexp.js';
    import myMap from './map.vue';
    const URL = {
        add: '/sys/area/save',
        detail: '/sys/area/findById',
        edit: '/sys/area/update'
    };
    export default {
        data () {
            return {
                form: {
                    name: '',
                    code: '',
                    longitude: '',
                    latitude: ''
                },
                maps: {
                    show: false,
                    data: {},
                    type: 'add'
                },
                codelength: 2,
                rules: {
                    name: [
                        {required: true, message: '请填写区域名称', trigger: 'blur'}
                    ],
                    
                    longitude: [
                        {required: true, message: '请选择经度', trigger: 'blur'}
                    ],
                    latitude: [
                        {required: true, message: '请选择纬度', trigger: 'blur'}
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
            
            getMap () {
                if (this.form.longitude) {
                    this.maps.data.point = {lat: this.form.latitude, lng: this.form.longitude};
                    this.maps.data.city && (delete this.maps.data.city);
                } else {
                    this.maps.data.city = this.data.detail;
                    this.maps.data.point && (delete this.maps.data.point);
                }
                this.maps.show = true;
            },
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
            this.codelength = this.data.level > 2 ? 3 : 2;
            let code = [
                {required: true, message: '请填写区域编码', trigger: 'blur'},
                { len: this.codelength, message: '区域编码长度为' + this.codelength, trigger: 'blur' },
                { pattern: reg.digit, message: '区域编码必须是数字', trigger: 'blur' }
            ];
            this.rules = {...this.rules, ...{code}};
            if (this.type === 'edit') {
                this.getDetail();
            } 
        },
        components: {
            myMap
        }
    };
</script>
