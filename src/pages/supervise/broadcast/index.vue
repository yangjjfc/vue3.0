<template>
    <my-tabs :tabs="tabs"></my-tabs>
</template>

<script>
import myTabs from '@/components/elTabs';
import columnar from './mods/columnar/index.vue';
import curve from './mods/curve/index.vue';
export default {
    data () {
        return {
            tabs: [{
                label: '柱状统计图',
                name: 'columnar'
            }, {
                label: '曲线统计图',
                name: 'curve'
            }]
        };
    },
    components: {
        myTabs,
        columnar,
        curve
    }
};
</script>