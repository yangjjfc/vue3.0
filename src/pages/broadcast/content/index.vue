<template>
    <div>
        <el-row class="mgb10">
             <el-col :span="24">
                <el-button  type="primary" size="small" @click="add('add')">添加广播</el-button>
                 <div class="right">
                    <el-input placeholder="文件名称" class="w200" v-model="search.keywords" size="small" @keydown.enter.native="getList(1)"></el-input>
                    <el-select v-model="search.fileType" class="w140" placeholder="请选择" size="small" @change="getList(1)">
                        <el-option v-for="item in fileTypeOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                    <el-select v-model="search.mediaType" class="w140" placeholder="请选择" size="small">
                        <el-option v-for="item in mediaTypeOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                    <el-button type="primary" icon="el-icon-search" size="small" @click="getList(1)" >查询</el-button>
                    <el-button type="info" size="small" @click="reset" >重置</el-button>
                 </div>
             </el-col>
        </el-row>
        <el-table :data="list" border stripe  style="width: 100%">
            <el-table-column type="index" label="序号" width="60" align="center"></el-table-column>
            <el-table-column label="内容名称"  min-width="160" prop="name"></el-table-column>
            <el-table-column label="文件内容"  min-width="160" prop="fileName"></el-table-column>
            <el-table-column label="文件类型"  min-width="160" >
                <template slot-scope="scope">
                    <span>{{fileTypeOptions[scope.row.fileType+1].label}}</span>
                </template>
            </el-table-column>
            <el-table-column label="媒体类型"  min-width="160">
                 <template slot-scope="scope">
                    <span>{{mediaTypeOptions[scope.row.mediaType+1].label}}</span>
                </template>
            </el-table-column>
            <el-table-column label="文件大小(Mb)"  min-width="160" prop="fileSize"></el-table-column>
            <el-table-column label="持续时长(s)"   min-width="160" prop="secStr"></el-table-column>
            <el-table-column label="创建时间"  min-width="160" prop="createAt"></el-table-column>
            <el-table-column label="转码状态"  width="100" prop="createAt" align="center">
                <template slot-scope="scope">
                    <el-popover trigger="hover" placement="top" v-if="scope.row.convertStatus==2">
                        <p>原因: {{ scope.row.convertFailMsg }}</p>
                        <div slot="reference" class="name-wrapper">
                            <span class="link">{{convertStatus[scope.row.convertStatus]}}</span>
                        </div>
                    </el-popover>
                    <span v-else>{{convertStatus[scope.row.convertStatus]}}</span>
                </template>
            </el-table-column>
            <el-table-column label="备注"  min-width="160" prop="remark"></el-table-column>
            <el-table-column prop="" label="操作" min-width="160" align="center" fixed="right">
                <template slot-scope="scope">
                    <el-button type="text" @click="toPreview(scope.row)">预览</el-button>
                    <el-button type="text" @click="add('edit',scope.row.id)">编辑</el-button>
                    <el-button type="text" @click="del(scope.row.id)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-row class="right">
            <pagination :total="page.total" :pageSize.sync="page.pageSize" :pageIndex.sync="page.pageNum" @change="getList"></pagination>
        </el-row>
        <edit v-if="edit.show" :show.sync="edit.show" :data="edit.data" :type="edit.type" @refish="getList"></edit>
        <preview v-if="preview.show" :show.sync="preview.show" :data="preview.data" ></preview>
    </div>
</template>

<script type="text/javascript">
import edit from './mods/edit';
import preview from './mods/preview';
const URL = {
    list: '/media/mediafile/listPage',
    del: '/media/mediafile/delete'
};
export default {
    data () {
        return {
            fileTypeOptions: [{
                value: -1,
                label: '文件类型'
            }, {
                value: 0,
                label: '文字'
            }, {
                value: 1,
                label: '文件'
            }, {
                value: 2,
                label: '实时采集'
            }, {
                value: 3,
                label: '网络直播流'
            }],
            mediaTypeOptions: [{
                value: -1,
                label: '媒体类型'
            }, {
                value: 0,
                label: '视频'
            }, {
                value: 1,
                label: '音频'
            }],
            convertStatus: ['未转码', '已转码', '转码失败'],
            list: [],
            edit: {
                show: false,
                data: '',
                type: 'add'
            },
            preview: {
                show: false,
                data: {}
            },
            page: {
                pageNum: 1,
                pageSize: 20,
                total: 0
            },
            search: {
                keywords: '',
                fileType: -1,
                mediaType: -1
            }
          
        };
    },
    computed: {

    },
    methods: {
        // 列表
        getList (pageNum = this.page.pageNum, pageSize = this.page.pageSize) {
            this.Http(URL.list, {
                keywords: this.search.keywords,
                fileType: this.search.fileType,
                mediaType: this.search.mediaType,
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
        reset () {
            this.search = {
                keywords: '',
                fileType: -1,
                mediaType: -1
            };
            this.getList(1);
        },
        toPreview (msg) {
            this.preview.data = msg;
            // this.preview.fileType = msg.fileType;
            // this.preview.type = msg.mediaType;
            // this.preview.data = msg.fileType === 3 ? msg.id : process.env.IMAGE_DOWNLOAD + msg.localPath;
            this.preview.show = true;
        },
        // 配置
        add (type, id) {
            this.edit.data = id;
            this.edit.type = type;
            this.edit.show = true;
        },
        // 删除
        del (id) {
            this.$myConfirm({
                content: '确定要删除吗?'
            }).then(() => {
                this.Http(URL.del, {id}).then(res => {
                    this.$message({
                        type: 'success',
                        message: '删除成功'
                    });
                    this.getList();
                });
            });
        },
        // 角色权限
        setRole (id) {
            this.role.data = id;
            this.role.show = true;
        },
        changPasswd (id) {
            this.passwd.data = id;
            this.passwd.show = true;
        }
    },
    mounted () {
        this.getList();
    },
    components: {
        preview,
        edit
    }
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
    .link{
        color:red;
        cursor: pointer;
    }
</style>
