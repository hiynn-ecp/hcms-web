<template>
    <div class="padding_box">
        <el-row class="art_top">
            <el-col class="art_top_input">
                 <el-input placeholder="请输入文章标题" v-model="artInput">
                    <el-button slot="append" @click="searchArt" icon="el-icon-search"></el-button>
                </el-input>
            </el-col>
            <el-col class="art_top_btn">
                <el-button v-if="getBtn('ArticleData_Post')" type="primary" @click="handleClick(null, 2)">创建文章</el-button>
            </el-col>
        </el-row>
        <el-row class="contentBox">
            <el-table :data="artData" border style="width: 100%" height="100%">
			<el-table-column align="center" type="index" width="60" label="序号"></el-table-column>
                <el-table-column align="center" prop="title" label="文章标题" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="文章类型">
                    <template slot-scope="scope">
                        <span>{{typeLsit['type' + scope.row.type]}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" prop="description" show-overflow-tooltip label="文章描述"></el-table-column>
                <el-table-column align="center" label="操作" width="220" v-if="getBtn('ArticleData_Get_id')||getBtn('ArticleData_Put')||getBtn('ArticleData_Delete')">
                <template slot-scope="scope">
    				<el-button v-if="getBtn('ArticleData_Get_id')" @click="handleClick(scope.row, 0)" size="small" type="success">详情</el-button>
                    <el-button v-if="getBtn('ArticleData_Put')" @click="handleClick(scope.row, 1)" size="small" type="primary">编辑</el-button>
                    <el-button v-if="getBtn('ArticleData_Delete')" @click="deleteClick(scope.row)" type="danger" size="small">删除</el-button>
                </template>
                </el-table-column>
            </el-table>
        </el-row>
        <div class="art_block">
                <el-pagination
                :hide-on-single-page="!artData"
                background
                layout="prev, pager, next"
                :total="total"
                @current-change="handleCurrentChange"
                ></el-pagination>
            </div>
        <el-dialog :close-on-click-modal="false" :title="dialogTitle" :visible.sync="dialogVisible" width="50%">
            <div class="form">
                <el-form :rules="rules" :model="artForm" ref="ruleForm" label-width="90px">
                    <el-form-item  label="文章标题:" :prop='infoData?"title":""'>
                        <span v-if="infoData == 0">{{artForm.title}}</span>
                        <el-input v-else v-model="artForm.title"></el-input>
                    </el-form-item>
                    <el-form-item  label="文章描述:" :prop='infoData?"description":""'>
                        <div v-if="infoData == 0"  class="textDescribe">{{artForm.description}}</div>
                        <el-input type="textarea" :rows="5" v-else v-model="artForm.description"></el-input>
                    </el-form-item>
                    <el-form-item  :label='infoData == 0? "资源文件:":"上传文章:"'>
                        <span v-if="infoData == 0"></span>
                        <el-upload
                        v-else
                        ref="fileImg"
                        :action='baseURL+"/task/excel"'
                        :on-change="uploadChange"
                        :on-remove="uploadChange"
                        multiple
                        :auto-upload="false">
                            <el-button size="small" type="primary">批量导入</el-button>
                        </el-upload>
                        <el-row class="datumsBox">
                            <el-col :span="18" :offset="infoData == 0?0:2" v-for="(item,i) in filesListArr" :key="i">
                                <el-col :span="18" class='omitCls'>
                                    <span >{{item.sourceName}}</span>
                                </el-col>
                                <el-col :span="6">
                                    <i v-if="infoData == 0" @click="uploadFile(item)" class="el-icon-download icon_files" style="margin-right: 5px;color: #606266;"></i>
                                    <a :href="baseURL + '/files/' + item.previewName" target="_blank" v-if="item.previewName">
                                        <i class="el-icon-view icon_files" style="margin-right: 5px;color: #409EFF;"></i>
                                    </a>
                                    <i style="color: #F56C6C;" v-if="infoData !== 0" @click="deletFile(item.id)" class="el-icon-circle-close icon_files"></i>
                                </el-col>
                            </el-col>
                        </el-row>
                    </el-form-item>
                </el-form>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="cancelFun">取 消</el-button>
                <el-button type="primary" @click="artCreat" :loading="!isBtnTrue" v-if="infoData == 2">创 建</el-button>
                <el-button type="primary" @click="artCreat" :loading="!isBtnTrue" v-if="infoData == 1">修改</el-button>
                <el-button type="primary" v-if="infoData == 0 && filesListArr.length>1 && getBtn('ArticleData_Get_download_package_files')" @click="uploadAll">打 包 下 载</el-button>
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
                <el-button type="primary" @click="deletArt">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import { url_download_files,url_art,url_art_list,url_art_type,url_enum_type,url_art_files } from "../../../common/requestUrl/requestUrl";
import {getLocal} from "../../../common/js/common";

export default {
    name: "index",
    data() {
        return {
			baseURL: window.baseURL,
            artData: [],
            infoData: null,
            artForm: {
                description: '',
                id: '',
                title: '',
                type: '',
            },
            dialogTitle: '',
            dialogVisible: false,
            total: 0,
            page: 1,
            deletBool: false,
            pId: '',
            artInput: '',
            artOptions: [],
            artValue: '',
            creatValue: '',
            filesListArr: [],
            rId: '',
            currentPage: 1,
            typeLsit: {},
            resourceUpploadList: [],
            rules: {
				title: [
                    { required: true, message: "请输入文章标题", trigger: "blur" },
                    { min: 1, max: 1000, message: "长度在 1 到 1000 个字符", trigger: "blur" }
				],
				description: [
				    {required: true, message: "请输入文章描述", trigger: "blur" },
                    { min: 1, max: 1000, message: "长度在 1 到 1000 个字符", trigger: "blur" }
				]
            },
            isBtnTrue: true,
        };
    },
    created() {},
    watch: {
        $route (to,from) {
            this.getEnumList();
        }
    },
    mounted() {
        this.getEnumList();
    },
    methods: {
        uploadFile (item) {
            var imgUrl = this.axios.defaults.baseURL + '/files/' + item.targetName;
            window.URL = window.URL || window.webkitURL;
            var xhr = new XMLHttpRequest();
            xhr.open("get", imgUrl, true);
            xhr.responseType = "blob";
            xhr.onload = function () {
                if (this.status == 200) {
                    //得到一个blob对象
                    var blob = this.response;
                    let oFileReader = new FileReader();
                    oFileReader.onloadend = function (e) {
                        let base64 = e.target.result;
                    };
                    oFileReader.readAsDataURL(blob);
                    let a = document.createElement('a')
                    let href = window.URL.createObjectURL(blob); //创建下载的链接
                    a.href = href;
                    a.download = item.sourceName;
                    a.click(); //点击下载
                    document.body.removeChild(a); //下载完成移除元素
                    window.URL.revokeObjectURL(href); //释放blob对象
                }
            }
            xhr.send();
        },
        uploadAll () {
            this.axios({
                method: 'GET',
                url: `${url_download_files}/${this.artForm.id}`,
                responseType: 'blob',
                timeout: 60 * 1000
            }).then(res => {
                let blob = new Blob([res.data])
                let downloadElement = document.createElement('a')
                let href = window.URL.createObjectURL(blob); //创建下载的链接
                downloadElement.href = href;
                downloadElement.download = this.artForm.title+'.zip'; //下载后文件名
                document.body.appendChild(downloadElement);
                downloadElement.click(); //点击下载
                document.body.removeChild(downloadElement); //下载完成移除元素
                window.URL.revokeObjectURL(href); //释放blob对象
            })
        },
        cancelFun () {
            if (this.infoData) {
                this.$refs.fileImg.clearFiles();
                this.resourceUpploadList = [];
            }
            this.$refs.ruleForm.resetFields();
            this.dialogVisible = false;
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
         * 文件上传发生变化
         * @method uploadChange
         * */
        uploadChange (file, fileList) {
            let data = [];
            fileList.forEach(item => {
                data.push(item.raw);
            })
            this.resourceUpploadList = data;
        },
        /**
         * 枚举类型查询
         * @method getEnumList
         * @return void
         * */
        getEnumList () {
            this.axios.get(`${url_enum_type}?type=sys_article_data_type`).then(res => {
                this.artOptions = res.data.data
                this.artOptions.forEach(item => {
                    if (item.value == this.$route.name) {
                        this.artValue = item.key
                    }
                    this.typeLsit['type'+item.key] = item.value;
                })
                this.getArtList(this.artValue)
            })
        },
        /**
         * 文章类型查询
         * @method searchArt
         * @return void
         * */
        searchArt () {
            this.getArtList(this.artValue)
        },
        /**
         * 文章列表
         * @method getArtList
         * @return void
         * */
        getArtList () {
            this.axios.get(`${url_art_list}?page=${this.page}&pageSize=10&type=${this.artValue}&title=${this.artInput}`).then(res => {
                this.artData = res.data.data.list;
                this.total = res.data.data.total;
            })
        },
        /**
         * 文章操作触发按钮
         * @method handleClick
         * @param { Obj } r 文章对象
         * @param { Number } n 修改/新建/详情判断值
         * @return void
         * */
        handleClick (r, n) {
            this.infoData = n
            this.filesListArr = []
            if (this.infoData == 2) {
                    this.dialogTitle = '创建文章'
                    this.creatValue = this.artValue;
                    this.artForm = {
                        description: '',
                        id: '',
                        title: '',
                        type: '',
                    };
            } else {
                this.artInfo(r, n)
                
            }
            this.dialogVisible = true;
            this.$nextTick(() => {
                this.$refs.ruleForm.resetFields();
            })
        },
        artInfo (r, n) {
            this.rId = r.id
            this.axios.get(`${url_art}/${r.id}`).then(res => {
                if (this.infoData == 1) {
                    this.creatValue = res.data.data.type
                    this.dialogTitle = '修改文章'
                } else {
                    this.dialogTitle = '文章详情'
                }
                this.artForm = JSON.parse(JSON.stringify(res.data.data));
            })
            this.getFilesAr(this.rId)
        },

        // 分页
        handleCurrentChange (v) {
            this.page = v
            this.getArtList()
        },
        /**
         * 文章新建/修改
         * @method artCreat
         * @return void
         * */
        artCreat () {
            if (this.isBtnTrue) {
                this.$refs.ruleForm.validate(valid => {
                    if (valid) {
                        let fd = new FormData();
                        if (this.infoData == 1) {
                            fd.append('id', this.artForm.id);
                        }
                        fd.append('title', this.artForm.title);
                        fd.append('type', this.creatValue);
                        fd.append('description', this.artForm.description);
                        let allSize = 0;
                        let istrue = true;
                        for (let index = 0; index < this.resourceUpploadList.length; index++) {
                            const item = this.resourceUpploadList[index];
                            fd.append('files', item);
                            if (item.size/1080/1080 > 45) {
                                this.$message({
                                    type: 'error',
                                    message: `${item.name}文件大于45MB无法上传，请压缩后再上传`
                                });
                                istrue = false;
                                break;
                            }
                            allSize+=item.size/1080/1080;
                        }
                        if (allSize> 90 && istrue) {
                            istrue = false;
                            this.$message({
                                type: 'error',
                                message: '文件集合大于90MB无法上传，请压缩后再上传'
                            });
                        }
                        if (istrue) {
                            this.isBtnTrue = false;
                            this.axios({
                                method: this.infoData == 2 ? 'post' : 'put',
                                url: url_art,
                                data: fd,
                                timeout: 60 * 1000
                            }).then(res => {
                                if (res) {
                                    this.$refs.ruleForm.resetFields();
                                    this.dialogVisible = false;
                                    this.$message({
                                        type: 'success',
                                        message: this.infoData == 2 ? '创建成功' : '修改成功'
                                    });
                                    this.$refs.fileImg.clearFiles();
                                    this.resourceUpploadList = [];
                                    this.getArtList()              
                                }
                                this.isBtnTrue = true;
                            }).catch((err) => {
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
         * 获取某个文章附件
         * @method getFilesAr
         * @param { String } r 文章对象id
         * @return void
         * */
        getFilesAr (r) {
             this.axios.get(`${url_art_files}/${r}`).then(res => {
                if (res) {
                    res.data.data.forEach((item) => {
                        if ('text/png/jpg/jpeg/mp4/pdf'.indexOf(item.targetName.slice(item.targetName.lastIndexOf('.')+1).toLocaleLowerCase()) !== -1) {
                            item.previewName = item.targetName;
                        }
                    })
                    this.filesListArr = res.data.data;
                }
                
            })
        },
        /**
         * 文章某个附件删除
         * @method deletFile
         * @param { String } r 文章对象id
         * @return void
         * */
        deletFile (r) {
            this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                cancelButtonText: '取消',
                confirmButtonText: '确定',
                type: 'warning'
                }).then(() => {
                    this.axios.delete(`${url_art_files}/${r}`).then(res => {
                        if (res) {
                                this.$message({
                                type: "success",
                                message: "删除成功"
                            });
                            this.getFilesAr(this.rId)
                        }
                    })
                }).catch(() => {         
            });
            
        },
        /**
         * 删除文章触发按钮
         * @method deleteClick
         * @param { Obj } r 文章对象
         * @return void
         * */
        deleteClick (r) {
            this.pId = r.id
            this.deletBool = true
        },
        /**
         * 删除文章触发按钮
         * @method deletArt
         * @param { Obj } r 文章对象
         * @return void
         * */
        deletArt () {
            this.axios.delete(`${url_art}/${this.pId}`).then(res => {
                this.$message({
                    type: "success",
                    message: "删除成功"
                });
                this.deletBool = false
                this.getArtList();
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
        .art_top {
            margin-bottom: 15px;
            .art_top_input {
                width: 400px !important;
            }
            .art_top_btn {
                width: 100px !important;
                margin-left: 15px;
            }
        }
        .contentBox{
			height: calc(100% - 100px);
			overflow-y: auto;
        }
        .art_block {
            text-align: center;
            margin-top: 20px;
        }
    }
    
    .art_top_select {
        width: 150px !important;
        margin-left: 15px;
    }
    .file_input {
        text-overflow: -o-ellipsis-lastline;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 1;
        line-clamp: 1;
        -webkit-box-orient: vertical;
    }
    .icon_files {
        cursor: pointer;
        font-size: 16px;
    }
    .omitCls{
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        padding-right: 5px;
        &:hover{
            background: #F5F7FA;
        }
    }
    .textDescribe{
        padding-top: 8px; 
        line-height: 24px;
        max-height: 140px;
        overflow-y:auto; 
        white-space: pre-wrap;
        word-wrap: break-word;
        word-break: break-all;
    }
    .datumsBox{
        max-height: 160px;
        overflow-y: auto;
    }
</style>
<style lang="scss">
.el-upload-list{
    width: 60%;
    max-height: 98px;
    overflow-y: auto;
}
</style>


