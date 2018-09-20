<template>
    <section>
        <myDialog title="角色权限" :show.sync="shows" width="500px" @submit="add('dialogForm')">
            <div slot="content">
               <el-tree :data="list"  :check-strictly="true"  show-checkbox node-key="id" :props="defaultProps" default-expand-all highlight-current ref="tree">
                </el-tree>
            </div>
        </myDialog>
    </section>
</template>

<script>
    const URL = {
        detail: '/sys/role/menuTree',
        add: '/sys/role/updateMenu'
    };
    export default {
        data () {
            return {
                list: [],
                checkNodeTree: [],
                defaultProps: {
                    children: 'children',
                    label: 'text'
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
            }
        },
        methods: {
            getDetail () {
                this.Http(URL.detail, {
                    id: this.data
                }).then(res => {
                    this.list = res.msg;
                    this.filtersTreeCheckedId(res.msg);
                    this.$nextTick(() => {
                        this.$refs.tree.setCheckedKeys(this.checkNodeTree);
                    });
                });
            },
            // 查询选中节点
            filtersTreeCheckedId (msg) {
                for (let item of msg) {
                    if (item.checked) {
                        this.checkNodeTree.push(item.id);
                    }
                    if (item.children && item.children.length) {
                        this.filtersTreeCheckedId(item.children);
                    }
                }
            },
            add () {
                let msg = this.$refs.tree.getCheckedKeys();
                this.Http(URL.add, {
                    id: this.data,
                    menuIds: msg
                }).then(res => {
                    this.shows = false;
                    this.$message({
                        message: '设置成功',
                        type: 'success'
                    });
                });
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
            this.getDetail();
        }
    };
</script>
