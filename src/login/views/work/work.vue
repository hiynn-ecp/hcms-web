<template>
    <div class="padding_box">
        <el-row class="work_top">
            <el-col class="work_top_btn">
                <el-button type="primary" v-if="getBtn('WorkPlatform_Post')" @click="handleClick(null, 2)">创建工作平台</el-button>
            </el-col>
        </el-row>
        <div class="contentBox">
            <div class="work_list" v-for="(item,i) in workData" :key="i"  @click="openUrl(item.url)">
                <el-row v-if="item.title">
                    <el-col>
                        <el-button v-if="getBtn('WorkPlatform_Put')" class="work_list_btn work_list_btn1" @click.stop="deleteClick(item)" type="danger" size="mini">删除</el-button>
                        <el-button v-if="getBtn('WorkPlatform_Delete')" class="work_list_btn work_list_btn2" @click.stop="handleClick(item, 1)" type="primary" size="mini">编辑</el-button>
                        <img :src="baseURL + '/img/' + item.icon" alt="">
                        <p>{{item.title}}</p>
                    </el-col>
                    <el-col>
                        <h6 :title="item.description">{{item.description}}</h6>
                    </el-col>
                </el-row>
                <el-row v-else class="noneWork">

                </el-row>
            </div>
        </div>
        <el-dialog :close-on-click-modal="false" :title="dialogTitle" :visible.sync="dialogVisible" width="30%">
            <div class="form">
                <el-form ref="ruleForm" :rules="rules" :model="workForm" label-width="90px">
                    <el-form-item  label="平台名称:" prop="title">
                        <span v-if="infoData == 0">{{workForm.title}}</span>
                        <el-input v-else v-model="workForm.title"></el-input>
                    </el-form-item>
                    <el-form-item  label="平台描述:" prop="description">
                        <span v-if="infoData == 0">{{workForm.description}}</span>
                        <el-input v-else v-model="workForm.description"></el-input>
                    </el-form-item>
                    <el-form-item  label="平台URL:" prop="url">
                        <span v-if="infoData == 0">{{workForm.url}}</span>
                        <el-input v-else v-model="workForm.url"></el-input>
                    </el-form-item>
                    <el-form-item  label="上传图标:" prop="icon">
                        <span v-if="infoData == 0">{{workForm.icon}}</span>
				        <!-- <input v-else type="file" ref="fileImg" @change="getFile" /> -->
                        <el-upload
                        v-else
                        ref="fileUserImg"
                        :action='baseURL+"/task/excel"'
                        :on-change="uploadChange"
                        :show-file-list="false"
                        accept='.jpg,.jpeg,.png,.gif,.bmp,.tiff'
                        :auto-upload="false">
                            <el-button size="small" type="primary">上 传</el-button>
                            <img class="uploadImg" v-if="uploadData.url" :src="uploadData.url" alt="文件损毁">
                        </el-upload>
                    </el-form-item>
                </el-form>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="cancelFun">取 消</el-button>
                <el-button type="primary" @click="workCreat" :loading="!isBtnTrue" v-if="infoData == 2">创 建</el-button>
                <el-button type="primary" @click="workCreat" :loading="!isBtnTrue" v-if="infoData == 1">修改</el-button>
            </span>
        </el-dialog>
        <el-dialog
        :close-on-click-modal="false"
        title="提示"
        :visible.sync="deletBool"
        width="30%">
            <span>确定删除此条数据？</span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="deletBool = false">取 消</el-button>
                <el-button type="primary" @click="deletWork">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import { url_work,url_work_list } from "../../../common/requestUrl/requestUrl";
import {getLocal} from "../../../common/js/common";

export default {
    name: "index",
    data() {
        return {
            workData: [],
            infoData: null,
            workForm: {
                description: '',
                id: '',
                title: '',
                icon: '',
                url: ''
            },
            dialogTitle: '',
            dialogVisible: false,
            total: 0,
            deletBool: false,
            pId: '',
            workInput: '',
            baseURL: window.baseURL,
            uploadData: {},
            rules: {
				title: [{ required: true, message: "请输入平台名称", trigger: "change" }],
                description: [{ required: true, message: "请输入平台描述", trigger: "change" }],
                url: [{ required: true, message: "请输入平台URL", trigger: "change" }]
            },
            isBtnTrue: true
        };
    },
    created() {},
    mounted() {
        this.getWorkList()
    },
    methods: {
        cancelFun () {
            this.$refs.fileUserImg.clearFiles();
            this.workForm = {
                description: '',
                id: '',
                title: '',
                icon: '',
                url: ''};
            this.$refs.ruleForm.resetFields();
            this.dialogVisible = false;
        },
        /**
         * 文件上传发生变化
         * @method uploadChange
         * */
        uploadChange (file, fileList) {
			this.uploadData = {
				name: file.name,
				url: URL.createObjectURL(file.raw)
			};
            this.workForm.icon = file.raw;
        },
        getBtn (n) {
			if (getLocal('btnKey')) {
				if (getLocal('btnKey').indexOf(n) > -1) {
					return true
				} else {
					return false
				}
			}
		},
        /**
		 * 打开链接
		 * @method openUrl
		 * @param { String } u url地址
		 * @return void
		 * */
        openUrl (u) {
            if (u) {
                window.open(u);
            }
        },
        /**
		 * 图片上传
		 * @method handleAvatarSuccess
		 * @param { Obj } e 文件对象
		 * @return void
		 * */
        getFile(e,v) {
            console.log(e.target.files[0])
            this.workForm.icon = e.target.files[0]
		},
        /**
         * 枚举列表
         * @method getWorkList
         * @return void
         * */
        getWorkList () {
            this.axios.get(`${url_work_list}`).then(res => {
                let works =res.data.data.list;
                if (works.length%3 !==0) {
                    const workLen = Math.ceil(works.length/3)*3 - works.length;
                    console.log(workLen,works.length)
                    for (let index = 0; index < workLen; index++) {
                       works.push({});
                    }
                }
                this.workData = works;
                console.log(works)
                this.total = res.data.data.total
            })
        },
        /**
         * 枚举操作触发按钮
         * @method handleClick
         * @param { Obj } r 枚举对象
         * @param { Number } n 修改/新建/详情判断值
         * @return void
         * */
        handleClick (r, n) {
            this.uploadData = {};
            this.infoData = n
                if (this.infoData == 2) {
                    this.dialogTitle = '平台创建'
                    this.workForm = {
                        description: '',
                        id: '',
                        title: '',
                        icon: '',
                        url: ''
                    };
                } else {
                    this.workInfo(r, n)
                   
                }
                this.dialogVisible = true;
                this.$nextTick(() => {
					this.$refs.ruleForm.resetFields();
				})
        },
        workInfo (r, n) {
            this.axios.get(`${url_work}/${r.id}`).then(res => {
                if (this.infoData == 1) {
                    this.dialogTitle = '平台修改'
                    this.uploadData = {
                        name: res.data.data.title,
                        url: baseURL + "/img/" + res.data.data.icon
                    };
                } else {
                    this.dialogTitle = '平台详情'
                }
                res.data.data.icon = '';
                this.workForm = JSON.parse(JSON.stringify(res.data.data));
            })
        },
        /**
         * 枚举新建/修改
         * @method workCreat
         * @return void
         * */
        workCreat () {
            if (this.isBtnTrue) {
                this.$refs.ruleForm.validate(valid => {
                    if (valid) {
                        if (this.infoData==2 && !this.workForm.icon) {
                            this.$message({
                                type: 'error',
                                message: '请先上传icon'
                            })
                        } else {
                            this.isBtnTrue = false;
                            let fd = new FormData();
                            fd.append('title', this.workForm.title);
                            if (this.workForm.id) {
                                fd.append('id', this.workForm.id);
                            }
                            fd.append('description', this.workForm.description);
                            fd.append('url', this.workForm.url);
                            fd.append('icon', this.workForm.icon);
                            this.axios({
                                method: this.infoData == 2 ? 'post' : 'put',
                                url: url_work,
                                data: fd
                            }).then(res => {
                                if (res) {
                                    this.dialogVisible = false;
                                    this.$message({
                                        type: 'success',
                                        message: this.infoData == 2 ? '创建成功' : '修改成功'
                                    });
                                    this.workForm = {
                                        description: '',
                                        id: '',
                                        title: '',
                                        icon: '',
                                        url: ''};
                                    this.getWorkList();           
                                }
                                this.isBtnTrue = true;
                            }).catch((err) =>{
                                this.isBtnTrue = true;
                            });
                        }
                    } else {
                        return false;
                    }
                });
            }
        },
        /**
         * 删除枚举触发按钮
         * @method deleteClick
         * @param { Obj } r 枚举对象
         * @return void
         * */
        deleteClick (r) {
            this.pId = r.id
            this.deletBool = true
        },
        /**
         * 删除枚举触发按钮
         * @method deleteClick
         * @param { Obj } r 枚举对象
         * @return void
         * */
        deletWork () {
            this.axios.delete(`${url_work}/${this.pId}`).then(res => {
                this.$message({
                    type: "success",
                    message: "删除成功"
                });
                this.deletBool = false
                this.getWorkList();
            });
        },
    }
};
</script>
<style lang="scss" scoped>
    .padding_box {
        position: absolute;
        height: 100%;
        width: 100%;
        padding: 20px;
        .work_top {
            margin-bottom: 15px;
            .work_top_input {
                width: 400px !important;
            }
            .work_top_btn {
                width: 120px !important;
            }
        }
    }
    .work_block {
        text-align: center;
        margin-top: 20px;
    }
    .contentBox{
        height: calc(100% - 55px);
        overflow-y: auto;
        display: flex;
        justify-content: center;
        width: 100%;
        flex-wrap: wrap;
        align-content:flex-start
    }
    .work_list {
        // flex: 1;
        width: 400px !important;
        height: 120px;
        margin: 0px 50px 20px 0px;
        position: relative;
        .noneWork{
            border:0;
            cursor: default;
            visibility: hidden;
        }
        &>div{
            cursor: pointer;
            padding: 10px;
            background-color: #fff;
            border-radius: 4px;
            border: 1px solid #e4ecf3;
        }
        img {
            width: 50px;
            height: 50px;
            float: left;
        }
        p {
            margin-top: 12px;
            margin-left: 20px;
            font-size: 20px;
            float: left;
        }
        h6 {
            color: #7d7b7b;
            margin: 10px 0;
            text-overflow: -o-ellipsis-lastline;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            line-clamp: 2;
            -webkit-box-orient: vertical;
        }
        .work_list_btn {
            position: absolute;
            padding: 4px 8px;
        }
        .work_list_btn1 {
            top: 0px;
            right: 0px;
        }
        .work_list_btn2 {
            top: 0px;
            right: 50px;
        }
    }
    .uploadImg{
		display: block;
		width: 100px;
		height:100px; 
		object-fit: fill;
		border:1px solid #ccc;
	}
</style>


