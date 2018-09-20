<template>
    <section>
        <el-form ref="form" :model="form" label-width="80px" size="small" :rules="rules">
            <el-form-item label="部署区域">
                <el-select v-model="item.text" size="small" @change="changeArea(index)" v-for="(item , index) in areaList" class="w160 mgr5 mgb5" :key="item.id" :placeholder="item.placeholder">
                    <el-option v-if="item.options" v-for="subItem in item.options" :key="subItem.id" :label="subItem.text" :value="subItem.id"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="经度" prop="longitude">
                <el-input v-model.number="form.longitude" class="w200"></el-input>
                <el-button type="warning"  @click="getMap" icon="el-icon-location" size="small">地图助手</el-button>
            </el-form-item>
            <el-form-item label="纬度" prop="latitude">
                <el-input v-model.number="form.latitude" class="w200"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="initSys">保存</el-button>
            </el-form-item>
        </el-form>

        <my-map v-if="maps.show" :show.sync="maps.show" :data="maps.data" :type="maps.type" @refish="refish"></my-map>
    </section>
</template>

<script>
import myMap from './mods/map.vue';
import areaMin from '@/utils/mixin/area.js';

const URL = {
    // check: '/sys/init/checkInit',
    init: '/sys/init/initSys',
    detail: '/sys/init/findSysParam',
    getArea: '/sys/area/findDeployParentAndBrother'
};
export default {
    mixins: [areaMin],
    data () {
        return {
            form: {
                areaId: '',
                longitude: '',
                latitude: ''
            },
            maps: {
                show: false,
                data: {},
                type: 'add'
            },
            rules: {
                longitude: [{required: true, message: '请填写经度', trigger: 'blur'}],
                latitude: [{required: true, message: '请填写纬度', trigger: 'blur'}]
            }
        };
    },
    mounted () {
        this.getArea();
        this.getDetail();
    },
    methods: {
        getMap () {
            if (this.form.longitude) {
                this.maps.data.point = {lat: this.form.latitude, lng: this.form.longitude};
                // this.maps.data.city && (delete this.maps.data.city);
            } else {
                // this.maps.data.city = this.data.detail;
                this.maps.data.point && (delete this.maps.data.point);
            }
            this.maps.show = true;
        },
        refish (point) {
            this.form.longitude = point.lng;
            this.form.latitude = point.lat;
        },
        initSys () {
            this.$refs.form.validate(valid => {
                if (valid) {
                    this.Http(URL.init, {
                        areaId: this.form.areaId,
                        longitude: Number(this.form.longitude),
                        latitude: Number(this.form.latitude)
                    }).then(res => {
                        this.$message({
                            message: '保存成功',
                            type: 'success'
                        });
                    });
                } else {
                    return false;
                }
            });
        },
        _getAreaID (id) {
            this.form.areaId = id;
        },
        sortBy (filed, rev, primer) {
            rev = (rev) ? -1 : 1;
            return function (a, b) {
                a = a[filed];
                b = b[filed];
                if (typeof (primer) !== 'undefined') {
                    a = primer(a);
                    b = primer(b);
                }
                if (a < b) { return rev * -1; }
                if (a > b) { return rev * 1; }
                return 1;
            };
        },
        getArea () {
            this.Http(URL.getArea, {}).then(res => {
                let len = res.msg.length;
                
                let arr = len < this._defaultArea.length ? JSON.parse(JSON.stringify(this._defaultArea.slice(len - this._defaultArea.length))) : [];
                res.msg = res.msg.map(item => {
                    item.options = item.brothers;
                    return item;
                });
                res.msg.sort(this.sortBy('level', false, parseInt));

                this._id = res.msg[len - 1].id;
                // this.getList && this.getList(1);
                this._getAreaID && this._getAreaID(this._id); // 方便获取id

                this.areaList = [...res.msg, ...arr];
                if (len < this._defaultArea.length) {
                    this.getFindChildArea(len);
                }
            });
        },
        getDetail () {
            this.Http(URL.detail, {}).then(res => {
                this.form = res.msg;
            });
        }
    },
    components: {
        myMap
    }
};
</script>

<style scoped lang="scss">

</style>
