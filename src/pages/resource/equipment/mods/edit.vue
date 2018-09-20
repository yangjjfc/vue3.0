<template>
    <section>
        <myDialog :title="(type==='add' ? '添加设备' : '修改设备')" :show.sync="shows" width="1000px" @submit="add('dialogForm')">
            <div slot="content">
                <el-form ref="dialogForm" :model="form" label-width="120px" :rules="rules" size="small" status-icon :inline="true" >
                    <el-form-item label="行政区域">
                        <el-select v-model="item.text" size="small" v-for="item in areaList" class="w160 mgr5" :key="item.id" :placeholder="item.placeholder"  :disabled="type==='edit'">
                            <el-option v-if="item.options" v-for="subItem in item.options" :key="subItem.id" :label="subItem.text" :value="subItem.id"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="设备形态">
                        <el-select v-model="value" placeholder="请选择" size="small" class="w300" >
                            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="设备名称">
                        <el-input v-model.trim="form.latitude"  class="w300" readonly></el-input>
                    </el-form-item>
                    <el-form-item label="物理地址">
                        <el-input v-model.trim="form.latitude"  class="w300" readonly></el-input>
                    </el-form-item>
                    <el-form-item label="经度">
                        <el-input v-model.trim="form.longitude" class="w200" readonly></el-input>
                        <el-button type="warning"  @click="getMap" icon="el-icon-location" size="small">地图助手</el-button>
                    </el-form-item>
                    <el-form-item label="类型">
                        <el-select v-model="value" placeholder="请选择" size="small" class="w300">
                            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="纬度">
                        <el-input v-model.trim="form.latitude"  class="w300" readonly></el-input>
                    </el-form-item>
                    <el-form-item label="控制口IP">
                        <el-input v-model.trim="form.latitude"  class="w300" readonly></el-input>
                    </el-form-item>
                    <el-form-item label="是否回传">
                        <el-radio-group v-model="radio">
                            <el-radio :label="1">是</el-radio>
                            <el-radio :label="0">否</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="控制端口">
                        <el-input v-model.trim="form.latitude"  class="w300" readonly></el-input>
                        <el-button type="text">更多</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </myDialog>
        <my-map v-if="maps.show" :show.sync="maps.show" :data="maps.data" :type="maps.type" @refish="refish"></my-map>
    </section>
</template>

<script>
    import reg from '~/regexp.js';
    import areaMin from '@/utils/mixin/area.js';
    import myMap from '../../../system/administrative/mods/map.vue';
    const URL = {
        add: '/sys/area/save',
        detail: '/sys/area/findById',
        edit: '/sys/area/update'
    };
    export default {
        mixins: [areaMin],
        data () {
            return {
                radio: 1,
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
                maps: {
                    show: false,
                    data: {},
                    type: 'add'
                },
                rules: {
                    name: [{required: true, message: '请填写设备名称', trigger: 'blur'}],
                    longitude: [{required: true, message: '请选择经度', trigger: 'blur'}],
                    latitude: [{required: true, message: '请选择纬度', trigger: 'blur'}]
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
            if (this.type === 'edit') {
                // this.getDetail();
            } 

            this.getArea();
        },
        created () {
        },
        components: {
            myMap
        }
    };
</script>
