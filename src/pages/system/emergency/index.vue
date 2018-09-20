<template>
    <my-tabs :tabs="tabs"></my-tabs>
</template>

<script>
import myTabs from '@/components/elTabs';
import realtime from './mods/realtime/index.vue';
import history from './mods/history/index.vue';
import blocked from './mods/blocked/index.vue';
export default {
    data () {
        return {
            tabs: [{
                label: '实时告警',
                name: 'realtime'
            }, {
                label: '历史告警',
                name: 'history'
            }, {
                label: '已屏蔽告警',
                name: 'blocked'
            }]
        };
    },
    components: {
        myTabs,
        realtime,
        history,
        blocked
    }
};
</script>