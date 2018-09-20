<template>
    <section>
        <myDialog :title="(type==='add'?'添加终端':'修改终端')" :show.sync="shows" width="1000px" @submit="add('dialogForm')">
            <div slot="content">
                <el-form ref="dialogForm" :model="form" label-width="120px" :rules="rules" size="small" :inline="true" >
                    <el-form-item label="终端形态" prop="devType">
                        <el-select v-model="form.devType" placeholder="请选择" size="small" class="w300">
                            <el-option v-for="item in devTypeOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="音频格式" prop="audioType">
                        <el-select v-model="form.audioType" placeholder="请选择" size="small" class="w300">
                            <el-option v-for="item in audioTypeOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="视频格式" prop="videoType">
                        <el-select v-model="form.videoType" placeholder="请选择" size="small" class="w300">
                            <el-option v-for="item in videoTypeOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="终端名称" prop="name">
                        <el-input v-model.trim="form.name"  class="w300" maxlength="20"></el-input>
                    </el-form-item>
                    <el-form-item label="行政区域" prop="areaId">
                        <el-select v-model="item.text" size="small" @change="changeArea(index)" v-for="(item , index) in areaList" class="w160 mgr5" :key="item.id" :placeholder="item.placeholder" :disabled="!item.nuDisabled">
                            <el-option v-if="item.options" v-for="subItem in item.options" :key="subItem.id" :label="subItem.text" :value="subItem.id"></el-option>
                        </el-select>
                    </el-form-item>
                     <el-form-item label="物理码" prop="physicalNo">
                        <el-input v-model.trim="form.physicalNo"  class="w300" maxlength="50"></el-input>
                    </el-form-item>
                    <el-form-item label="是否回传" prop="loop">
                        <el-radio-group v-model="form.loop">
                            <el-radio :label="1">是</el-radio>
                            <el-radio :label="0">否</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <br/>
                    <el-form-item label="经度" prop="longitude">
                        <el-input v-model.trim="form.longitude" class="w200" readonly></el-input>
                        <el-button type="warning"  @click="getMap" icon="el-icon-location" size="small">地图助手</el-button>
                    </el-form-item>
                    <el-form-item label="音柱IP" prop="yzIp">
                        <el-input v-model.trim="form.yzIp"  class="w300" ></el-input>
                    </el-form-item>
                    <el-form-item label="纬度" prop="latitude">
                        <el-input v-model.trim="form.latitude"  class="w300" readonly></el-input>
                    </el-form-item>
                    <el-form-item label="音柱端口" prop="yzPort">
                        <el-input v-model.trim="form.yzPort"  class="w300" maxlength="4"></el-input>
                    </el-form-item>
                    <el-form-item label="标签">
                        <el-select v-model="form.tags" multiple filterable allow-create default-first-option placeholder="请选择标签" size="small" class="w300">
                            <el-option v-for="item in tagsList" :key="item.value" :label="item.label" :value="item.value"></el-option>
                        </el-select>
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
        add: '/media/devend/save',
        detail: '/media/devend/findById',
        edit: '/media/devend/update',
        tagList: '/media/devend/findTags'
    };
    export default {
        mixins: [areaMin],
        data () {
            return {
                tagsList: [],
                devTypeOptions: [
                    {value: '01', label: '适配器'},
                    {value: '02', label: '室外收扩机'},
                    {value: '03', label: '音柱'},
                    {value: '04', label: 'IP话筒'}
                ],
                videoTypeOptions: [
                    {value: '-1', label: '不支持'},
                    {value: 'MP2', label: 'MP2'}
                ],
                audioTypeOptions: [
                    {value: '-1', label: '不支持'},
                    {value: 'MPEG2', label: 'MPEG2'}
                ],
                form: {
                    loop: 1,
                    tags: []
                },
                maps: {
                    show: false,
                    data: {},
                    type: 'add'
                },
                rules: {
                    devType: [{required: true, message: '请选择终端形态', trigger: 'change'}],
                    audioType: [{required: true, message: '请选择音频格式', trigger: 'change'}],
                    videoType: [{required: true, message: '请选择视频格式', trigger: 'change'}],
                    name: [{required: true, message: '请填写终端名称', trigger: 'blur'}],
                    areaId: [{required: true, message: '请选择区域', trigger: 'change'}],
                    physicalNo: [{required: true, message: '请填写物理码', trigger: 'blur'}],
                    // yzIp: [{ message: 'IP格式有误', trigger: 'blur', pattern: reg.ip }],
                    yzPort: [{message: '音柱端口格式有误', trigger: 'blur', pattern: reg.digit}]
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
            async getTagList () {
                await this.Http(URL.tagList, {}).then(res => {
                    if (res.msg.length) {
                        res.msg.forEach(item => {
                            this.tagsList.push({value: item, label: item});
                        });
                    }
                });
            },
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
            _getAreaID (id) {
                this.form.areaId = id;
            },
            async getDetail () {
                await this.Http(URL.detail, {
                    id: this.data
                }).then(res => {
                    this.form = res.msg;
                    this.getArea(false).then((index) => {
                        this.getFindParentArea(this.form.areaId, index);
                    });
                });
            },
            add () {
                this.$refs.dialogForm.validate(valid => {
                    if (valid) {
                        let params = this.form;
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
                this.getTagList().then(() => {
                    this.getDetail();
                });
            } else {
                this.getArea();
                this.getTagList();
            }
        },
        created () {
        },
        components: {
            myMap
        }
    };
</script>
