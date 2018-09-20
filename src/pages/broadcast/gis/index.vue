<template>
    <section class="gis">
        <el-row :gutter="10">
            <el-col :span="16">
                <el-card shadow="never">
                    <div>
                        <div id="allmap" class="allmap" :style="styleObject"></div>
                    </div>
                </el-card>
            </el-col>
            <el-col :span="8">
                <el-card shadow="hover" class="mgb10">
                    <div slot="header" class="clearfix"><span>模式选择</span></div>
                    <div class="pad10">
                        <el-radio-group v-model="radio1" size="small">
                            <el-radio-button label="区域下发" ></el-radio-button>
                            <el-radio-button label="终端下发"></el-radio-button>
                        </el-radio-group>
                    </div>
                </el-card>
                <el-card shadow="hover" class="mgb10">
                    <div slot="header" class="clearfix"><span>下发广播</span></div>
                    <div class="pad10">
                        <el-input v-model.number="chanValue" class="w200 mgb10" size="small" :maxlength="3">
                            <template slot="prepend">广播音量</template>
                        </el-input>
                        <div></div>
                        <el-radio-group v-model="radio2" size="small" class="mgb10">
                            <el-radio-button label="紧急" ></el-radio-button>
                            <el-radio-button label="日常"></el-radio-button>
                        </el-radio-group>
                        <div></div>
                        <el-radio-group v-model="radio3" size="small" class="mgb10">
                            <el-radio-button label="话筒广播" ></el-radio-button>
                            <el-radio-button label="文字广播"></el-radio-button>
                            <el-radio-button label="文件广播"></el-radio-button>
                            <el-radio-button label="网络直播流"></el-radio-button>
                        </el-radio-group>
                    </div>
                </el-card>
                <el-card shadow="hover" class="mgb10 table">
                    <div slot="header" class="clearfix"><span>行政区域或终端</span></div>
                    <el-table :data="list" border stripe  style="width: 100%">
                        <el-table-column label="行政区域" align="center"></el-table-column>
                        <el-table-column label="操作"  align="center" width="80">
                            <template slot-scope="scope">
                                <el-button type="text">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-card>
            </el-col>
        </el-row>
    </section>
</template>
<script type="text/javascript">
    const URL = {
        findDeployAreaAndParent: '/sys/area/findDeployAreaAndParent',
        findAreaByRang: '/media/gisBroadcast/findAreaByRang', // 区域搜索-矩形
        findAreaByCircle: '/media/gisBroadcast/findAreaByCircle', // 区域搜索-圆形
        findAreaByPolygon: '/media/gisBroadcast/findAreaByPolygon' // 区域搜索-多变形
    };

    export default {
        data () {
            return {
                radio1: '区域下发',
                radio2: '紧急',
                radio3: '话筒广播',
                chanValue: 80,
                list: [],
                area: '',
                styleObject: {
                    width: '0px',
                    height: '0px'
                }
            };
        },
        computed: {
        },
        methods: {
            // 获取部署区域
            async getArea () {
                await this.Http(URL.findDeployAreaAndParent).then(res => {
                    console.log(res);
                    let _add = '';
                    res.msg.forEach(item => {
                        _add += item.text;
                    });
                    // TODO:去掉
                    _add = '浙江省杭州市江干区';
                    this.area = _add;
                });
            },
            getBoundary () {
                let map = new BMap.Map('allmap', {minZoom: 4, maxZoom: 15});
                // 杭州市西湖区:,
                let point = new BMap.Point(120.088993, 30.207036);
                // let point = new BMap.Point(116.418261, 39.921984);
                
                map.centerAndZoom(point, 13);

                // 启用滚轮放大缩小
                map.enableScrollWheelZoom();

                // 左上角，平移缩放控件 
                map.addControl(new BMap.NavigationControl());

                // 右上角负责切换地图类型的控件
                map.addControl(new BMap.MapTypeControl({
                    mapTypes: [
                        BMAP_NORMAL_MAP,
                        BMAP_HYBRID_MAP
                    ]})
                );

                // let bdary = new BMap.Boundary();
                // bdary.get(this.area, function (rs) { // 获取行政区域
                //     // map.clearOverlays(); // 清除地图覆盖物       
                //     var count = rs.boundaries.length; // 行政区域的点有多少个
                //     if (count === 0) {
                //         console.log('未能获取当前输入行政区域');
                //         return;
                //     }

                //     let pointArray = [];
                //     for (let i = 0; i < count; i++) {
                //         let ply = new BMap.Polygon(rs.boundaries[i], {strokeWeight: 2, strokeColor: '#f00', fillColor: '#fff'}); // 建立多边形覆盖物
                //         map.addOverlay(ply); // 添加覆盖物
                //         pointArray = pointArray.concat(ply.getPath());
                //     }    
                //     map.setViewport(pointArray); // 调整视野  
                // });
                
                let overlays = [];
                let overlaycomplete = function (e) {
                    console.log(e);
                    clearAll();
                    let _str = '';
                    overlays.push(e.overlay);
                    if (e.drawingMode === BMAP_DRAWING_CIRCLE || e.drawingMode === 'circle') {
                        // 圆
                        _str += ' 半径：' + e.overlay.getRadius();
                        _str += ' 中心点：' + e.overlay.getCenter().lng + ',' + e.overlay.getCenter().lat;
                    }
                    if (e.drawingMode === BMAP_DRAWING_POLYGON || e.drawingMode === 'polygon') {
                        // 多边形
                        
                    }
                    if (e.drawingMode === BMAP_DRAWING_RECTANGLE || e.drawingMode === 'rectangle') {
                        // 矩形
                    }

                    console.log(_str);
                };
                let styleOptions = {
                    strokeColor: 'red', // 边线颜色。
                    fillColor: 'red', // 填充颜色。当参数为空时，圆形将没有填充效果。
                    strokeWeight: 2, // 边线的宽度，以像素为单位。
                    strokeOpacity: 0.5, // 边线透明度，取值范围0 - 1。
                    fillOpacity: 0.1, // 填充的透明度，取值范围0 - 1。
                    strokeStyle: 'solid' // 边线的样式，solid或dashed。
                };
                // 实例化鼠标绘制工具
                let drawingManager = new BMapLib.DrawingManager(map, {
                    isOpen: false, // 是否开启绘制模式
                    enableDrawingTool: true, // 是否显示工具栏
                    drawingToolOptions: {
                        anchor: BMAP_ANCHOR_BOTTOM_RIGHT, // 位置
                        offset: new BMap.Size(5, 5), // 偏离值
                        drawingModes: [BMAP_DRAWING_CIRCLE, BMAP_DRAWING_POLYGON, BMAP_DRAWING_RECTANGLE]
                    },
                    circleOptions: styleOptions, // 圆的样式
                    polygonOptions: styleOptions, // 多边形的样式
                    rectangleOptions: styleOptions // 矩形的样式
                });  
                // 添加鼠标绘制工具监听事件，用于获取绘制结果
                drawingManager.addEventListener('overlaycomplete', overlaycomplete);

                // 
                let clearAll = () => {
                    for (let i = 0; i < overlays.length; i++) {
                        map.removeOverlay(overlays[i]);
                    }
                    overlays.length = 0;   
                };
            }
        },
        created () {
            this.styleObject.width = ((document.body.clientWidth - 200) * 2 / 3) + 'px';
            this.styleObject.height = (document.body.clientHeight - 150) + 'px';
        },
        mounted () {
            this.getArea().then(() => {
                this.getBoundary();
            });
        },
        components: {
        }
    };
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.gis{
    /deep/ .el-card__header{
        font-weight: bold;
        padding: 10px;
        background-color: #ecf1f6;
    }
    /deep/ .el-card__body{
        padding: 0;
    }
}
</style>
