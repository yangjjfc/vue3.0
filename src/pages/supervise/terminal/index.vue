<template>
    <my-tabs :tabs="tabs"></my-tabs>
</template>

<script>
import myTabs from '@/components/elTabs';
import realtime from './mods/realtime/index.vue';
import history from './mods/history/index.vue';
export default {
    data () {
        return {
            tabs: [{
                label: '历史状态图',
                name: 'history'
            }, {
                label: '实时状态图',
                name: 'realtime'
            }]
        };
    },
    components: {
        myTabs,
        realtime,
        history
    }
};
</script>