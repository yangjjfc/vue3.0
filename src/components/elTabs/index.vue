<!-- 员工管理 -->
<template>
        <el-tabs type="border-card" v-model="active" @tab-click="tabChange">
            <el-tab-pane v-for="item in tabs" :key="item.name" v-bind="item">
                <component :is="$parent.$options.components[item.name]" v-if="(active === item.name)"></component>
            </el-tab-pane>
        </el-tabs>
</template>

<script>
export default {
    props: {
        tabs: {
            type: Array,
            required: true,
            default: [
                //  label: '在职员工',
                // name: 'inService'
            ]
        }
    },
    data () {
        return {
            active: ''
        };
    },
    mounted () {
        this.active = this.$route.query.source || this.tabs[0].name;
    },
    methods: {
        tabChange (tab, event) {
            this.$router.push({query: {source: tab.name}});
            this.$emit('change');
        }
    }
};
</script>