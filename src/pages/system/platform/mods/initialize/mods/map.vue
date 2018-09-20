<template>
    <section>
        <myDialog title="地图" :show.sync="shows" width="800px" @submit="submit">
            <div slot="content" id="map-content">
            </div>
        </myDialog>
    </section>
</template>
<script>
export default {
    data () {
        return {
            point: {
                lng: '',
                lat: ''
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
        submit () {
            // console.log(this.point);
            this.shows = false;
            this.$emit('refish', this.point);
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
        this.$nextTick(() => {
            /* eslint-disable no-new */
            let map = new BMap.Map('map-content', {minZoom: 3, maxZoom: 16});
            var point = new BMap.Point(110.404, 35.915); // 创建点坐标
            map.enableScrollWheelZoom(true);
            map.addControl(new BMap.NavigationControl());
            if (this.data.point) {
                this.point = this.data.point;
                let point = new BMap.Point(this.data.point.lng, this.data.point.lat);
                map.centerAndZoom(point, 15);
                let marker = new BMap.Marker(point);
                map.clearOverlays();
                map.addOverlay(marker);
            } else {
                // map.centerAndZoom(this.data.city, 6);
                map.centerAndZoom(point, 6);
            }
            map.addEventListener('click', e => {
                let point = new BMap.Point(e.point.lng, e.point.lat);
                let marker = new BMap.Marker(point);
                this.point = e.point;
                map.clearOverlays();
                map.addOverlay(marker);
            });
        });
    }
};
</script>
<style lang="scss" scoped>
#map-content {
  min-height: 500px;
  width: 100%;
}
</style>
