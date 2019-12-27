<template>
  <div class="menu">
    <el-row>
        <el-col class="code_input">
            <el-input v-model="inputName" placeholder="包名"></el-input>
        </el-col>
        <el-col class="code_input">
            <el-input v-model="inputAutor" placeholder="作者"></el-input>
        </el-col>
        <el-col class="code_btn">
            <el-button @click="codeBtn" type="danger" v-if="getBtn('CodeGenerator_Get_generate')">生成代码</el-button>
        </el-col>
    </el-row>
    <el-row>
        <el-col class="code_input">
            <el-input v-model="inputTab" placeholder="表名"></el-input>
        </el-col>
        <el-col class="code_input">
            <el-select v-model="value" placeholder="请选择" @change="changeInput">
                <el-option
                v-for="item in options"
                :key="item.id"
                :label="item.nameIp"
                :value="item.id">
                </el-option>
            </el-select>
        </el-col>
        <el-col class="code_btn">
            <el-button @click="searchTab" type="primary">查 询</el-button>
        </el-col>
        <el-col class="ref_btn">
            <el-button icon="el-icon-refresh" @click="refTab" type="warning"></el-button>
        </el-col>
        <el-col class="resource_btn">
            <el-button @click="handleResource" type="success">数据源</el-button>
        </el-col>
    </el-row>
    <el-row class="code_tab_box">
        <el-table
            ref="multipleTable"
            :data="tableData"
            border
            tooltip-effect="dark"
            style="width: 100%"
            height="100%"
            @selection-change="handleSelectionChange">
            <el-table-column
            type="selection"
            align="center"
            width="55">
            </el-table-column>
            <el-table-column
            prop="tableName"
            align="center"
            label="表名">
            </el-table-column>
            <el-table-column
            prop="engine"
            align="center"
            label="Engine">
            </el-table-column>
            <el-table-column
            prop="tableComment"
            align="center"
            label="表备注">
            </el-table-column>
            <el-table-column
            prop="createTime"
            align="center"
            label="创建时间">
            </el-table-column>
        </el-table>
    </el-row>
    <el-dialog class="resource_dialog" :close-on-click-modal="false" title="数据源" :visible.sync="dialogVisible" width="90%">
        <el-col style="margin-bottom:15px;">
            <el-button @click="addList" type="success">增加一条</el-button>
        </el-col>
		<el-table
            ref="multipleTable"
            :data="resourceList"
            border
            tooltip-effect="dark"
            style="width: 100%;"
            height="100%">
                <el-table-column
                align="center"
                label="名称">
                    <template slot-scope="scope">
                        <el-input v-model="scope.row.name"  placeholder="请输入数据源名称"></el-input>
                    </template>
                </el-table-column>
              
                <el-table-column
                align="center"
                label="url地址">
                    <template slot-scope="scope">
                        <el-input v-model="scope.row.url"  placeholder="请输入url地址"></el-input>
                        <!-- {{'http://' + scope.row.ip + '/hcms?allowMultiQueries=true&useUnicode=true&characterEncoding=UTF-8&zeroDateTimeBehavior=convertToNull&useSSL=true'}} -->
                    </template>
                </el-table-column>
                <el-table-column
                align="center"
                label="用户名">
                    <template slot-scope="scope">
                        <el-input v-model="scope.row.userName" type="password" placeholder="请输入用户名"></el-input>
                    </template>
                </el-table-column>
                <el-table-column
                align="center"
                label="密码">
                    <template slot-scope="scope">
                        <el-input v-model="scope.row.password" type="password" placeholder="请输入密码"></el-input>
                    </template>
                </el-table-column>
                <el-table-column
                align="center"
                label="日期">
                    <template slot-scope="scope">
                        {{scope.row.createTime}}
                        <!-- <el-input v-model="scope.row.createTime" type="password" placeholder="请输入密码"></el-input> -->
                    </template>
                </el-table-column>
                <el-table-column
                align="center"
                label="文件">
                    <template slot-scope="scope">
                        {{scope.row.sourceName}}<span v-if="scope.row.sourceName" class="dele_btn" @click="deleteFiles(scope.$index)">X</span>
                        <!-- <el-input v-model="scope.row.createTime" type="password" placeholder="请输入密码"></el-input> -->
                    </template>
                </el-table-column>
                <el-table-column
                align="center"
                label="操作">
                <template slot-scope="scope">
                    <span>
                        <el-button @click="upLoad(scope.$index)" class="up_load" type="success" icon="el-icon-upload2" circle>
                            <input @change="changeFile" value="" type="file">
                        </el-button>
                        <el-button :disabled="!scope.row.id" icon="el-icon-refresh" @click="refRsource(scope.row.id)" type="warning" circle></el-button>
                        <el-button :disabled="!(scope.row.name && scope.row.url && scope.row.userName && scope.row.password)" @click="createResource(scope.row,scope.$index)" type="primary" icon="el-icon-check" circle></el-button>
                        <el-button @click="deleteResource(scope.row,scope.$index)" type="danger" icon="el-icon-delete" circle></el-button>
                    </span>
                </template>
            </el-table-column>
        </el-table>
    </el-dialog>
    <el-dialog
        title="提示"
        :visible.sync="deleDia"
        :show-close="false"
        width="440px"
        class="dele_dia">
            <span><i class="el-icon-delete"></i> 是否重置?</span>
            <span slot="footer" class="dialog-footer" style="text-align: center;">
                <el-button class="custom" type="primary" @click="refDiaClick">确 定</el-button>
                <el-button class="custom" @click="deleDia = false">取 消</el-button>
            </span>
        </el-dialog>
  </div>
</template>
<script>
import { url_datasourceList, url_data_tab ,url_dataToCode,url_datasource,url_datasource_refresh,url_datasource_reset } from "../../../common/requestUrl/requestUrl";
import {getLocal} from "../../../common/js/common";
export default {
    data() {
        return {
            inputName: '',
            inputAutor: '',
            inputTab: '',
            options: [{
                id: '',
                name: ''
            }],
            value: '',
            tableData: [],
            codeTables: [],
            infoData: 0,
            dialogTitle: '创建数据源',
            dialogVisible: false,
            form: {},
            resourceList: [{
                deleteType: 0,
                id:'',
                name: '',
                ip: '',
                nameIp: '',
                url: '',
                sourceName: ''
            }],
            trueDelete: false,
            fileIndex: 0,
            fileList: [],
            saveIng: true,
            deleDia: false,
            refCont: ''
        };
    },
    mounted() {
        this.getDataList()
    },
    methods: {
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
		 * 上传
		 * @method upLoad
		 * @return void
		 * */
        upLoad (i) {
            this.fileIndex = i
        },
        changeFile (e) {
            this.resourceList[this.fileIndex].sourceName = e.target.files[0].name
            this.resourceList[this.fileIndex].deleteType = 1
            this.fileList[this.fileIndex].files = e.target.files[0]
        },
        /**
		 * 删除附件
		 * @method deleteFiles
		 * @return void
		 * */
        deleteFiles (i) {
            this.resourceList[i].deleteType = 1
            this.resourceList[i].sourceName = ''
            this.fileList[i].files = ''
        },
        /**
		 * 重置数据源
		 * @method refRsource
		 * @return void
		 * */
        refRsource (d) {
            this.deleDia = true
            this.refCont = d
        },
        refDiaClick () {
            this.axios.put(`${url_datasource_reset}/${this.refCont}`).then(res => {
                if (res.data.returnCode == '0000000') {
                    this.$message({
                        type: "success",
                        message: "重置成功"
                    });
                    this.deleDia = false
                }
            })
        },
        /**
		 * 数据源操作
		 * @method handleResource
		 * @return void
		 * */
		handleResource(row, n) {
			this.dialogVisible = true;
        },
        /**
		 * 增加一列
		 * @method addList
		 * @return void
		 * */
        addList () {
            this.resourceList.push({
                deleteType: 0,
                id: '',
                name: '',
                password: 'root',
                url: '',
                userName: 'root',
                sourceName: ''
            })
            this.fileList.push({files: ''})
        },
        /**
		 * 创建/修改
		 * @method createResource
		 * @return void
		 * */
        createResource (r,i) {
            console.log(r)
            console.log(this.fileList[i].files)
            console.log(r.deleteType)
            let resource = new FormData();
            if (r.id) {
                resource.append('id', r.id);
            }
            resource.append('name', r.name);        
            resource.append('password', r.password);        
            resource.append('url', r.url);        
            resource.append('userName', r.userName);
            resource.append('files', this.fileList[i].files);
            resource.append('deleteType', r.deleteType);
            this.axios({
                method: r.id ? 'put' : 'post',
                url: `${url_datasource}`,
                data: resource
            }).then(res =>{
                if(res.data.returnCode == '0000000') {
                    this.$message({
                        type: "success",
                        message: "创建成功"
                    });
                    this.getDataList()
                }
            })
        },
        /**
		 * 删除
		 * @method deleteResource
		 * @return void
		 * */
        deleteResource (r,i) {
            if (r.id) {
                this.axios.delete(`${url_datasource}/${r.id}`).then(res => {
                    this.$message({
                        type: "success",
                        message: "删除成功"
                    });
                    this.getDataList()
                })
            } else {
                this.resourceList.splice(i, 1);
                this.fileList.splice(i, 1);
            }
        },
         /**
         * 下拉框切换
         * @method changeInput
         * @param { String } v 数据源id
         * @return void
         * */
        changeInput (v) {
            console.log(v)
        },
        /**
         * 获取数据源列表
         * @method getDataList
         * @return void
         * */
        getDataList () {
            this.axios.get(url_datasourceList).then(res => {
                this.options = res.data.data
                this.resourceList = res.data.data
                this.value = this.options[0].id
                for (let i of this.resourceList) {
                    console.log(i)
                    this.fileList.push({files: ''})
                }
                console.log(this.fileList)
                this.getTabList(this.value, this.inputTab)
            })
        },
        /**
         * 获取列表数据
         * @method getTabList
         * @param { String } id 数据源id
         * @param { String } tab 数据源名称
         * @return void
         * */
        getTabList (id, tab) {
            this.axios.get(`${url_data_tab}?dataSourceId=${id}&tableName=${tab}`).then(res => {
                console.log(res)
                this.tableData = res.data.data;
            })
        },
        /**
         * 获取列表处理
         * @method handleSelectionChange
         * @param { Array } list 表包list
         * @return void
         * */
        handleSelectionChange (list) {
            this.codeTables = [];
            for (let i = 0; i < list.length; i++) {
                this.codeTables.push('&tables=' + list[i].tableName)
            }
        },
        /**
         * 查询列表
         * @method searchTab
         * @return void
         * */
        searchTab () {
            this.getTabList(this.value, this.inputTab)
        },
        /**
         * 刷新
         * @method refTab
         * @return void
         * */
        refTab () {
            this.axios.put(url_datasource_refresh).then(res => {
                console.log(res)
                if (res.data.returnCode == '0000000') {
                    this.$message({
                        type: "success",
                        message: "刷新成功"
                    });
                }
            })
        },
        /**
         * 生成代码
         * @method codeBtn
         * @return void
         * */
        codeBtn () {
            if (!this.codeTables.length) {
                this.$message.error('请选择一行记录');
                return
            }
            this.axios({
                method: 'GET',
                url: `${url_dataToCode}?dataSourceId=${this.value}&author=${this.inputAutor}&packagePath=${this.inputName}${this.codeTables.join('')}`,
                responseType: 'blob'
            }).then(res => {
                let blob = new Blob([res.data])
                let downloadElement = document.createElement('a')
                let href = window.URL.createObjectURL(blob); //创建下载的链接
                downloadElement.href = href;
                downloadElement.download = res.headers.filename; //下载后文件名
                document.body.appendChild(downloadElement);
                downloadElement.click(); //点击下载
                document.body.removeChild(downloadElement); //下载完成移除元素
                window.URL.revokeObjectURL(href); //释放blob对象
            })
        },
    },
};
</script>
<style lang="scss">
.menu {
    position: absolute;
    height: 100%;
    width: 100%;
    padding: 20px;
  .menu-bottom {
    width: 100%;
    height: calc(100% - 60px);
    // background: skyblue;
    padding: 15px 0;
    position: relative;
    overflow: hidden;
    overflow-y: auto;
  }
  .block {
    width: 100%;
    height: 40px;
    line-height: 40px;
    text-align: center;
    .el-pagination {
      margin: 0 auto;
      margin-top: 4px;
    }
  }
}
.code_input {
    width: 360px !important;
    padding: 0px 10px 10px 0px;
    .el-select {
        width: 100% !important;
    }
}
.code_btn {
    width: 100px !important;
    padding: 0px 10px 0 0px;
    .el-button {
        width: 98px !important;
    }
}
.code_tab_box {
    height: calc(100% - 100px);
    padding: 10px 0px;
}
.page_tab {
    text-align: center;
    margin-top: 10px;
}
.resource_btn {
    width: 130px !important;
    margin-left: 10px;
    padding: 0px 10px 0 0px;
    .el-button {
        width: 118px !important;
    }
}
.resource_dialog .el-dialog {
    height: 80% !important;
    .el-dialog__body {
        height: 85%;
        padding-top: 0px !important;
    }
}
.up_load {
    position: relative;
    text-align: center;
    i {
        cursor: pointer;
    }
    span {
        margin: 0px !important;
        cursor: pointer;
      
    }
    input {
        position: absolute;
        width: 40px !important;
        height: 40px !important;
        border-radius: 50%;
        left: 0;
        top: 0;
        cursor: pointer;
        opacity: 0;
        
    }
}
.ref_btn {
    width: 60px !important;
    padding: 0px 10px 0 0px;
    margin-left: 12px;
}
.dele_btn {
    color: red;
    cursor: pointer;
    margin-left: 10px; 
}
/*弹框样式*/
.dele_dia .el-dialog {
    border-radius: 0 !important;
}
.dele_dia .el-dialog .el-dialog__header{
    height: 46px !important;
    padding: 0 0 0 20px !important;
    background:rgba(55,71,79,1) !important;
    line-height: 48px !important;
}
.dele_dia .el-dialog .el-dialog__header .el-dialog__title {
    font-size: 18px !important;
    color: white !important;
}
.dele_dia .el-dialog .el-dialog__body {
    height: 100px !important;
    padding: 0 !important;
    text-align: center !important;
    line-height: 100px !important;
}
.dele_dia .el-dialog .el-dialog__footer {
    text-align: center !important;
}
.dele_dia .el-dialog .el-dialog__body span {
    color:rgba(255,0,0,1) !important;
    font-size:18px !important;
}
</style>