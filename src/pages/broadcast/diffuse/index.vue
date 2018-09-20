<template>
    <section class="issued">
        <!-- 广播控制 => 广播下发 -->
        <el-row>
            <el-col :span="6">
                <div class="container-left">
                    <section>
                        <div class="left-tree">
                            <el-tree ref="tree" :data="leftList" :props="defaultProps" check-strictly :expand-on-click-node="false" :default-expand-all="true" show-checkbox @check-change="checkChange" node-key="id">
                                <span class="custom-tree-node" slot-scope="{ node, data }">
                                    <span>
                                        <i v-if="data.nodeType === 'area'" class="el-icon-location"></i>
                                        <i v-else class="el-icon-bell"></i>
                                        {{ node.label }}
                                    </span>
                                </span>
                            </el-tree>
                        </div>
                    </section>
                </div>
            </el-col>
            <el-col :span="18">
                <div class="container-right">
                    <el-row class="mgb10">
                        <el-col :span="12">
                            <span class="tt">广播级别：</span>
                            <el-radio-group v-model="level" size="mini" class="mgr40">
                                <el-radio-button :label="1">紧急</el-radio-button>
                                <el-radio-button :label="0">日常</el-radio-button>
                            </el-radio-group>
                        </el-col>
                        <el-col :span="12">
                            <span class="tt">广播音量：</span>
                            <el-input-number v-model="volume" size="mini" controls-position="right" :step="1" :min="1" :max="100"></el-input-number>
                            <el-button type="primary" size="mini" :disabled="!checkedNodes.length" @click="setVolume">设置音量</el-button>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col class="text-right tips">
                            <div class="fl">广播下发区域</div>
                            <el-button type="primary" size="small" :disabled="!checkedNodes.length" @click="showSend('mic')">话筒广播</el-button>
                            <el-button type="primary" size="small" :disabled="!checkedNodes.length" @click="showSend('txt')">文字广播</el-button>
                            <el-button type="primary" size="small" :disabled="!checkedNodes.length" @click="showFileSend('file')">文件广播</el-button>
                            <el-button type="primary" size="small" :disabled="!checkedNodes.length" @click="showFileSend('net')">网络直播流</el-button>
                        </el-col>
                        <el-table :data="checkedNodes" border stripe  style="width: 100%">
                            <el-table-column label="类型">
                                <template slot-scope="scope" >{{scope.row.nodeType === 'area' ? '区域' : '多模终端'}}</template>
                            </el-table-column>
                            <el-table-column label="区域" prop="detail"></el-table-column>
                            <el-table-column label="区域（逻辑）码">
                                <template slot-scope="scope" >{{scope.row.nodeType === 'area' ? scope.row.areaCode : scope.row.physicalNo}}</template>
                            </el-table-column>
                            <el-table-column label="操作" align="center" width="100">
                                <template slot-scope="scope" >
                                    <el-button type="text" @click="remove(scope.row.id)">移除</el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                    </el-row>
                </div>
            </el-col>
        </el-row>

        <my-send v-if="send.show" :show.sync="send.show" :data="send.data" :type="send.type"></my-send>
        <file-broadcast v-if="file.show" :show.sync="file.show" :data="file.data" :type="file.type"></file-broadcast>
    </section>
</template>
<script type="text/javascript">
import mySend from './mods/send';
import fileBroadcast from './mods/fileBroadcast';
const URL = {
    tree: '/media/broadcast/findAreaDevTree',
    send: '/media/broadcast/sendCmd'
};

export default {
    data () {
        return {
            list: [],
            leftList: [],
            filterText: '',
            defaultProps: {
                children: 'children',
                label: 'text'
            },
            level: 0,
            volume: 80,
            send: {
                show: false,
                data: {
                    areaIds: [],
                    devIds: []
                },
                type: 'mic' // mic:话筒广播  txt:文字广播  file:文件广播   net:网络直播流
            },
            file: {
                show: false,
                data: {
                    areaIds: [],
                    devIds: []
                },
                type: 'mic' // mic:话筒广播  txt:文字广播  file:文件广播   net:网络直播流
            },
            checkedNodes: []
        };
    },
    methods: {
        remove (id) {
            this.checkedNodes = this.checkedNodes.filter(item => item.id !== id);
            this.$nextTick(function () {
                this.$refs.tree.setCheckedNodes(this.checkedNodes);
            });
        },
        getCheckedData () {
            this.checkedNodes = this.$refs.tree.getCheckedNodes();
        },
        checkChange (data) {
            this.getCheckedData();
        },
        setVolume () {
            this.getListData();
             
            this.Http(URL.send, {
                level: this.level,
                volume: this.volume,
                cmdType: 'volume',
                areaIds: this.send.data.areaIds,
                devIds: this.send.data.devIds
            }).then(res => {
                this.$message({
                    message: '广播音量设置成功',
                    type: 'success'
                });
            });
        },
        getListData () {
            this.send.data.areaIds = [];
            this.send.data.devIds = [];
            this.checkedNodes.forEach(item => {
                if (item.nodeType === 'area') {
                    this.send.data.areaIds.push(item.id);
                    this.file.data.areaIds.push(item.id);
                } else if (item.nodeType === 'endDev') {
                    this.send.data.devIds.push(item.id);
                    this.file.data.devIds.push(item.id);
                }
            });
        },
        showSend (type) {
            this.send.data.level = this.level;
            this.send.data.volume = this.volume;
            this.send.data.cmdType = type;
            
            this.getListData();

            this.send.show = true;
            this.send.type = type;
        },
        showFileSend (type) {
            this.file.data.level = this.level;
            this.file.data.volume = this.volume;
            this.file.data.cmdType = type;
            
            this.getListData();

            this.file.show = true;
            this.file.type = type;
        },
        getTree () {
            this.Http(URL.tree, {areaId: ''}).then(res => {
                this.leftList = res.msg || [];
            });
        }
    },
    mounted () {
        this.getTree();
    },
    components: {
        mySend,
        fileBroadcast
    }
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
$height: 500px;
.issued{
    .container-left{
        border: 1px #e6e6e6 solid;
        min-height: $height;
        overflow: hidden;
        text-overflow: ellipsis;
        padding: 10px;

        /deep/ .el-checkbox{
            margin-right: 10px !important;
        }
    }
    .container-right{
        padding-left: 10px;
        .tt{
            line-height: 38px;
        }
        .tips{
            background: #f4f9fd;
            line-height: 32px;
            padding: 10px;
            font-weight: bold;
            border: 1px solid #e6e6e6;
        }
    }
}
</style>
