const URL = {
    findDeployAreaAndParent: '/sys/area/findDeployAreaAndParent',
    findChildArea: '/sys/area/findChildArea',
    findParentAndBrother: '/sys/area/findParentAndBrother'
};
export default {
    data () {
        return {
            areaList: [],
            areaName: ['省级', '市级', '县级（区）', '乡/街道', '村/社区']
        }; 
    },
    methods: {
        getFindParentArea (id, index) {
            this.Http(URL.findParentAndBrother, { id }).then(res => {
                let len = res.msg.length;
                this._id = res.msg[len - 1].id;
                this.getList && this.getList(1);
                this._getAreaID && this._getAreaID(this._id); // 方便获取id
                let arr = len < this._defaultArea.length ? JSON.parse(JSON.stringify(this._defaultArea.slice(len - this._defaultArea.length))) : [];
                res.msg = res.msg.map(item => {
                    item.options = item.brothers;
                    return item;
                });
                this.areaList = [...res.msg, ...arr].map((item, i) => {
                    item.nuDisabled = (i >= index);// 判断是否能编辑
                    return item;
                });
                if (len < this._defaultArea.length) {
                    this.getFindChildArea(len);
                }
            });
        },
        // 获取部署区域
        async getArea (isUpdateAreaId = true) {
            let res = await this.Http(URL.findDeployAreaAndParent).then(res => {
                let len = res.msg.length;
                this._id = res.msg[len - 1].id;
                this.getList && this.getList(1);
                if (isUpdateAreaId) {
                    this._getAreaID && this._getAreaID(this._id); // 方便获取id
                    let arr = len < this._defaultArea.length ? JSON.parse(JSON.stringify(this._defaultArea.slice(len - this._defaultArea.length))) : [];
                    this.areaList = [...res.msg, ...arr];
                    if (len < this._defaultArea.length) {
                        this.getFindChildArea(len);
                    }
                }
                return len;
            });
            return res;
        },
        // 获取子区域
        async getFindChildArea (len) {
            let res = await this.Http(URL.findChildArea, { id: this._id });
            this.areaList[len].options = res.msg;
            return res;
        },
        // 改变区域地址
        changeArea (num) {
            for (let a = 4; a > num; a--) {
                this.areaList[a].options = [];
                this.areaList[a].text = '';
            }

            this._id = this.areaList[num].text;
            this.getList && this.getList(1);
            this._getAreaID && this._getAreaID(this._id);// 方便获取id
            if (num < 4) {
                this.getFindChildArea(num + 1);
            }
        },
        // 生成初始地址
        createDefaultArea () {
            let arr = [];
            for (let item of this.areaName) {
                let _json = {
                    placeholder: item,
                    id: Math.random(),
                    text: '',
                    nuDisabled: true,
                    options: []
                };
                arr.push(_json);
            }
            this._defaultArea = arr;
        }
    },
    created () {
        this.createDefaultArea();
    }

};