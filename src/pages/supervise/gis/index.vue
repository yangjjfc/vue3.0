<template>
    <div>
        <div id="allmap" class="allmap" :style="styleObject"></div>
    </div>
</template>

<script type="text/javascript">
const URL = {
    findDeployAreaAndParent: '/sys/area/findDeployAreaAndParent'
};

export default {
    data () {
        return {
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
            this.$nextTick(() => {
                // 百度地图API功能
                var map = new BMap.Map('allmap');
                map.centerAndZoom();

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
        
                let bdary = new BMap.Boundary();
                bdary.get(this.area, function (rs) { // 获取行政区域
                    // map.clearOverlays(); // 清除地图覆盖物       
                    var count = rs.boundaries.length; // 行政区域的点有多少个
                    if (count === 0) {
                        console.log('未能获取当前输入行政区域');
                        return;
                    }

                    let pointArray = [];
                    for (let i = 0; i < count; i++) {
                        let ply = new BMap.Polygon(rs.boundaries[i], {strokeWeight: 2, strokeColor: '#f00', fillColor: '#fff'}); // 建立多边形覆盖物
                        map.addOverlay(ply); // 添加覆盖物
                        pointArray = pointArray.concat(ply.getPath());
                    }    
                    map.setViewport(pointArray); // 调整视野  
                });   
            });
        }
    },
    created () {
        // 设置默认高宽
        this.styleObject.width = (document.body.clientWidth - 200) + 'px';
        this.styleObject.height = (document.body.clientHeight - 140) + 'px';
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

</style>
