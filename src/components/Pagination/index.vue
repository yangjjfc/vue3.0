/**分页插件*/
<template>
    <el-pagination  :total="total" 
                    :page-size="pageSize" 
                    @size-change="changeSize" 
                    :current-page="index" 
                    @current-change="changePage" 
                    layout="total, sizes, prev, pager, next, jumper" 
                    class="mgt10 mgb10">
    </el-pagination>
</template>
<script>
export default {
    name: 'pagination',
    data () {
        return {
            size: this.pageSize,
            index: 1,
            flag: true// 标记,避免重复更新
        };
    },
    // 需要传的参数
    props: {
        total: { // 总页数
            type: [String, Number],
            required: true
        },
        pageSize: { // 单页显示数量
            type: [String, Number],
            required: true
        },
        pageIndex: { // 页码
            type: [String, Number],
            required: true
        }
    },
    mounted () {
        this.index = this.pageIndex;
    },
    watch: {
        pageIndex (val, oldval) {
            if (this.index !== val) {
                this.index = val; // 防止重复触发
                this.flag = false;  
            }
        }
    },
    methods: {      
        // 改变页码
        changePage (page) {
            if (!this.flag) { 
                this.flag = true;
            } else {
                this.index = page;
                this.$emit('update:pageIndex', page);
                this.$emit('change', page, this.size);
            }
        },
        // 改变总条数
        changeSize (size) {
            this.flag = this.index === 1; // 防止重复触发
            this.size = size;
            this.$emit('update:pageSize', size);
            this.$emit('change', 1, size);
        }
    }
};
</script>


<style lang="scss" scoped>

</style>