<template>
    <my-tabs :tabs="tabs"></my-tabs>
</template>

<script>
import myTabs from '@/components/elTabs';
import initialize from './mods/initialize/index.vue';
import myTitle from './mods/title/index.vue';
import myIp from './mods/ip/index.vue';
import repertoire from './mods/repertoire/index.vue';
import control from './mods/control/index.vue';
export default {
    data () {
        return {
            tabs: [{
                label: '系统初始化',
                name: 'initialize'
            }, {
                label: '系统标题',
                name: 'myTitle'
            }, {
                label: 'IP通道',
                name: 'myIp'
            }, {
                label: '控制流通道',
                name: 'repertoire'
            }, {
                label: '节目流通道',
                name: 'control'
            }]
        };
    },
    components: {
        initialize,
        myTabs,
        myTitle,
        myIp,
        repertoire,
        control
    }
};
</script>