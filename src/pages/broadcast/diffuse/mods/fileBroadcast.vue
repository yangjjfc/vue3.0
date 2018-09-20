<template>
    <section>
        <myDialog :title="title" :show.sync="shows" width="1000px" @submit="send" confirmButtonText="下发">
            <div slot="content">
                <el-row class="mgb10">
                    <el-col :span="12">
                        <span class="tt">关键字：</span>
                        <el-input v-model="keywords" class="w200" size="small"></el-input>
                        <el-button type="primary" size="mini" @click="getList(1)">查询</el-button>
                    </el-col>
                    <el-col :span="12" v-if="type === 'file'">
                        <span class="tt">播放次数：</span>
                        <el-input-number v-model="loopNum" controls-position="right" size="small" :min="1" :step="1"></el-input-number>
                    </el-col>
                </el-row>
                <el-table :data="list" border stripe  style="width: 100%">
                    <el-table-column label="资源名称" min-width="160" prop="name">
                        <template slot-scope="scope">
                            <el-radio v-if="type === 'file'" v-model="fileId" :label="scope.row.id">{{scope.row.name}}</el-radio>
                            <el-radio v-else v-model="netId" :label="scope.row.id">{{scope.row.name}}</el-radio>
                        </template>
                    </el-table-column>
                    <el-table-column label="持续时长(s)" min-width="160" prop="secStr" v-if="type === 'file'"></el-table-column>
                    <el-table-column label="创建时间" min-width="160" prop="createAt"></el-table-column>
                    <el-table-column label="类型">
                        <template slot-scope="scope">
                            <span>{{mediaTypeOptions[scope.row.mediaType+1].label}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" align="center" fixed="right">
                        <template slot-scope="scope">
                            <el-button type="text" @click="toPreview(scope.row)">预览</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <el-row class="right">
                    <pagination :total="page.total" :pageSize.sync="page.pageSize" :pageIndex.sync="page.pageNum" @change="getList"></pagination>
                </el-row>
            </div>
        </myDialog>

        <my-preview v-if="preview.show" :show.sync="preview.show" :data="preview.data" ></my-preview>
    </section>
</template>

<script>
    import myPreview from '../../content/mods/preview';
    const URL = {
        list: '/media/mediafile/listPage',
        send: '/media/broadcast/sendCmd'
    };
    export default {
        components: {
            myPreview
        },
        data () {
            return {
                loopNum: 1,
                fileId: '',
                netId: '',
                title: '',
                page: {
                    pageNum: 1,
                    pageSize: 20,
                    total: 0
                },
                preview: {
                    show: false,
                    data: {}
                },
                list: [],
                keywords: '',
                mediaTypeOptions: [
                    { value: -1, label: '媒体类型' },
                    { value: 0, label: '视频' },
                    { value: 1, label: '音频' }
                ]
            };
        },
        props: {
            show: {
                type: Boolean,
                required: true,
                default: false
            },
            data: {
                required: true,
                default: {}
            },
            type: {
                type: String,
                default: 'mic'
            }
        },
        methods: {
            toPreview (msg) {
                this.preview.data = msg;
                this.preview.show = true;
            },
            // 列表
            getList (pageNum = this.page.pageNum, pageSize = this.page.pageSize) {
                this.Http(URL.list, {
                    keywords: this.keywords,
                    fileType: this.type === 'file' ? 1 : 3,
                    mediaType: -1,
                    pageSize: pageSize,
                    pageNum: pageNum
                }).then(res => {
                    let msg = res.msg;
                    this.page.pageNum = msg.pageNumber;
                    this.page.pageSize = msg.pageSize;
                    this.page.total = msg.totalRow;
                    this.list = msg.list;
                });
            },
            send () {
                let _data = {};
                if ((this.type === 'file' && !this.fileId) || (this.type === 'net' && !this.netId)) {
                    this.$message({
                        message: '请选择您要下发的资源',
                        type: 'warning'
                    });
                    return false;
                }

                switch (this.type) {
                case 'file':
                    _data = Object.assign(this.data, {
                        loopNum: this.loopNum,
                        fileId: this.fileId
                    });
                    break;
                case 'net':
                    _data = Object.assign(this.data, {
                        netId: this.netId
                    });
                    break;
                default:
                    break;
                }

                // console.log(_data);

                this.Http(URL.send, _data).then(res => {
                    this.$message({
                        message: '下发成功',
                        type: 'success'
                    });
                    this.shows = false;
                });
            },
            setTitle () {
                // mic:话筒广播  txt:文字广播  file:文件广播   net:网络直播流
                switch (this.type) {
                case 'file':
                    this.title = '文件广播';
                    break;
                case 'net':
                    this.title = '网络直播流';
                    break;
                default:
                    break;
                }
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
        created () {
            this.setTitle();
            this.getList();
        },
        mounted () {
        }
    };
</script>
