<template>
	<div class="menu">
		<el-row class="menu-top">
			<el-button type="primary" @click="handleClick(null, 2)" v-if="getBtn('staticData_post')">静态资源创建</el-button>
		</el-row>
		<el-row class="contentBox">
            <el-table :data="menuData" border style="width: 100%" height="100%">
                <el-table-column align="center" type="index" width="60" label="序号"></el-table-column>
                <el-table-column align="center" prop="name" label="名称"></el-table-column>
                <el-table-column align="center" prop="creator" label="创建人"></el-table-column>
                <el-table-column align="center" prop="editor" label="修改人"></el-table-column>
                <el-table-column align="center" prop="createTime" label="创建时间"></el-table-column>
                <el-table-column align="center" prop="editTime" label="最后修改时间"></el-table-column>
                <el-table-column align="center" prop="path" label="路径"></el-table-column>
                <el-table-column align="center" label="操作" width="310" v-if="getBtn('staticData_put')||getBtn('staticData_delete')">
                    <template slot-scope="scope">
                        <el-button @click="handleClick(scope.row, 0)" size="small" type="success">详情</el-button>
                        <el-button v-if="getBtn('staticData_put')" @click="handleClick(scope.row, 1)" size="small" type="primary">编辑</el-button>
                        <el-button  @click="handleutil(scope.row.id)" size="small" type="warning">备份</el-button>
                        <el-button v-if="getBtn('staticData_delete')" @click="deleteClick(scope.row)" type="danger" size="small">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
		</el-row>
		<!--分页按钮到达一定的页数才会出现 -->
		<!-- v-if="menuData.length>3" -->
		<div class="enum_block">
			<el-pagination
			:hide-on-single-page="menuData.length<1"
			background
			layout="prev, pager, next"
			:total="pageJson.total"
			@current-change="handleCurrentChange"
			></el-pagination>
		</div>
		<!-- <el-dialog :close-on-click-modal="false" :title="dialogTitle" :visible.sync="dialogVisible"  width="30%">
            <div class="form">
                <el-form :rules="rules" ref="ruleForm" :model="ruleForm" label-width="90px">
                    <el-form-item label="姓名:" :prop='infoData?"name":""'>
                        <span v-if="infoData == 0">{{ruleForm.name}}</span>
                        <el-input v-else v-model="ruleForm.name"></el-input>
                    </el-form-item>
                    <el-form-item label="路径:" :prop='infoData?"path":""'>
                        <span v-if="infoData == 0">{{ruleForm.path}}</span>
                        <el-input v-else  v-model="ruleForm.path"></el-input>
                    </el-form-item>
                </el-form>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="cancelFun">取 消</el-button>
                <el-button type="primary" @click="submitForm('ruleForm')" :loading="!isBtnTrue" v-if="infoData == 2">创 建</el-button>
                <el-button type="primary" @click="submitForm('ruleForm')" :loading="!isBtnTrue" v-if="infoData == 1">修改</el-button>
            </span>
		</el-dialog> -->
		<el-dialog :close-on-click-modal="false" title="提示" :visible.sync="deletBool" width="30%">
            <span>确定删除此条数据？</span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="deletBool = false">取 消</el-button>
                <el-button type="primary" @click="deletMenu">确 定</el-button>
            </span>
		</el-dialog>
        <el-dialog class="util_dialog" :close-on-click-modal="false" :title="infoData !== 2 ? '静态资源备份' : '创建'" :visible.sync="dialogVisible" :width="infoData !== 2 ? '90%' : '50%'">
            <div class="form">
                <el-form :rules="rules" ref="ruleForm" :model="ruleForm" label-width="90px">
                    <el-col :span="12">
                        <el-form-item label="名称:" :prop='infoData?"name":""'>
                            <span v-if="infoData == 0">{{ruleForm.name}}</span>
                            <el-input v-else v-model="ruleForm.name"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="路径:" :prop='infoData?"path":""'>
                            <span v-if="infoData == 0">{{ruleForm.path}}</span>
                            <el-input v-else  v-model="ruleForm.path"></el-input>
                        </el-form-item>
                    </el-col>
                </el-form>
            </div>
            <el-table
            v-show="infoData !== 2"
                :data="staticList"
                border
                tooltip-effect="dark"
                style="width: 100%;"
                height="100%">
                    <el-table-column
                    align="center"
                    prop="name" 
                    label="名称">
                    </el-table-column>
                     <el-table-column
                    align="center"
                    prop="creator"
                    label="创建人">
                    </el-table-column>
                    <el-table-column
                    align="center"
                    prop="createTime"
                    label="创建时间">
                    </el-table-column>
                    <el-table-column
                    align="center"
                    prop="recoverTime"
                    label="重置时间">
                    </el-table-column>
                     <el-table-column
                    align="center"
                    prop="remark"
                    label="备注">
                    <template scope="scope">
                        <el-input v-model="scope.row.remark"  placeholder="请输入备注"></el-input>
                    </template>
                    </el-table-column>
                    <el-table-column
                    align="center"
                    label="操作">
                    <template slot-scope="scope">
                        <span>
                            <el-button  icon="el-icon-refresh" @click="refCopy(scope.row)" type="warning" circle></el-button>
                            <el-button  @click="handleCopy(scope.row,1)" type="primary" icon="el-icon-check" circle></el-button>
                            <el-button @click="handleCopy(scope.row,0)" type="danger" icon="el-icon-delete" circle></el-button>
                        </span>
                    </template>
                </el-table-column>
            </el-table>
             <span slot="footer" class="dialog-footer">
                <el-button @click="cancelFun">取 消</el-button>
                <el-button type="primary" @click="submitForm('ruleForm')" :loading="!isBtnTrue" v-if="infoData == 2">创 建</el-button>
                <el-button type="primary" @click="submitForm('ruleForm')" :loading="!isBtnTrue" v-if="infoData == 1">修改</el-button>
            </span>
        </el-dialog>
	</div>
</template>
<script>
import {url_static_list,url_static,url_copy_list,url_copy_save,url_copy_up} from "../../../common/requestUrl/requestUrl";
import {getLocal} from "../../../common/js/common";
import { format } from 'path';

export default {
	data() {
		return {
			imageUrl: "",
			ruleForm: {
                name: "",
                path: ""
			},
			rules: {
				name: [
					{ required: true, message: "请输入资源名称", trigger: "blur" },
				],
				path: [
					{ required: true, message: "请输入资源路径", trigger: "blur" },
				],
			},
			dialogTitle: "创建用户",
			editStatus: false,

            dialogVisible: false,
            dialogStatic: false,
			pageJson: {
				page: 1,
				pageNum: 0,
				pageSize: 10,
				total: 0
			},
			menuData: [],
			baseURL: window.baseURL,
			infoData: null,
			pId: "",
			deletBool: false,
			roleIdArr: [],
			roleIdutil: [],
			roleList: [],
			isBtnTrue: true,
            staticList: [],
            copyBtn: false,
            staticId: ''
		};
	},
	methods: {
		cancelFun () {
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
		 * 静态资源备份
		 * @method handleutil
		 * @param { Obj } r 资源对象
		 * @return void
		 * */
        handleutil (r) {
            // this.copyBtn = true
            this.axios.post(`${url_copy_save}?staticDataId=${r}`).then(res => {
                if (res.data.returnCode == '0000000') {
                     this.$message({
                        type: "success",
                        message: '备份成功'
                    });
                    // this.copyBtn = false
                }
            })
        },
        /**
		 * 重置备份
		 * @method refCopy
		 * @param { Obj } d 备份id
		 * @return void
		 * */
        refCopy (d) {
            this.axios.put(`${url_copy_up}/${d.id}`).then(res => {
                if (res.data.returnCode == '0000000') {
                     this.$message({
                        type: "success",
                        message: '重置成功'
                    });
                    this.getCopyList(this.staticId)
                }
            })
        },
        /**
		 * 修改删除备份
		 * @method handleCopy
		 * @param { Obj } d 备份id
		 * @return void
		 * */
        handleCopy (d,i) {
            console.log(d)
            let f = new FormData();
            f.append('remark', d.remark)
            this.axios({
                method: i == 1 ? "put" : "delete",
                url: `${url_copy_save}/${d.id}`,
                data: f
            }).then (res => {
                if (res.data.returnCode == '0000000') {
                     this.$message({
                        type: "success",
                        message: i == 1 ? '修改成功' : '删除成功'
                    })
                    this.getCopyList(this.staticId)
                }
            })
        },
		/**
		 * 保存前判断
		 * @method submitForm
		 * @param { String } formName ref值
		 * @return void
		 * */
		submitForm(formName) {
			this.$refs[formName].validate(valid => {
				if (valid) {
					this.create();
				} else {
					return false;
				}
			});
		},
		/**
		 * 分页查询
		 * @method handleCurrentChange
		 * @param { String } val page值
		 * @return void
		 * */
		handleCurrentChange(val) {
			this.pageJson.page = val;
			this.getRoleList();
		},
		/**
		 * 创建修改操作
		 * @method create
		 * @return void
		 * */
		create() {
			if (this.isBtnTrue) {
				this.isBtnTrue = false;
				let fd = {id: this.infoData == 1 ?this.ruleForm.id :'', name: this.ruleForm.name, path: this.ruleForm.path}
				// if (this.infoData == 1) {
				// 	fd.append("id", this.ruleForm.id);
                // }
                console.log(this.ruleForm)
				this.axios({
					method: this.infoData == 2 ? "post" : "put",
					url: url_static,
					data: fd
				}).then(res => {
					if (res) {
						if (this.infoData == 2) {
							this.ruleForm = {
								name: "",
								path: "",
                            };
							
                        }
                        this.dialogVisible = false;
                        this.getRoleList();
                        this.$message({
                            type: "success",
                            message: this.infoData == 2 ? '保存成功' : '修改成功'
                        });
                        this.isBtnTrue = true;
					} else {
						this.isBtnTrue = true;
					}
				}).catch(() =>{
					this.isBtnTrue = true;
				});
			}
		},
		/**
		 * 删除前操作
		 * @method deleteClick
		 * @param { String } p 删除id
		 * @return void
		 * */
		deleteClick(p) {
			this.pId = p.id;
			this.deletBool = true;
		},
		/**
		 * 删除操作
		 * @method deletMenu
		 * @return void
		 * */
		deletMenu() {
			this.axios({
				method: "delete",
				url: url_static + "/" + this.pId
			}).then(res => {
				this.$message({
				type: "success",
				message: "删除成功"
				});
				this.deletBool = false;
				this.getRoleList();
			});
		},
		/**
		 * 创建修改之前操作
		 * @method handleClick
		 * @param { Obj } row 所需对象
		 * @param { Number } n 判断值
		 * @return void
		 * */
		handleClick(row, n) {
			this.infoData = n;
			this.dialogVisible = true;
			this.$nextTick(() => {
				this.$refs.ruleForm.resetFields();
				this.editStatus = true;
				if (this.infoData == 0) {
					this.dialogTitle = "用户详情";
                    this.ruleForm = JSON.parse(JSON.stringify(row));
                    this.staticId = row.id
                    this.getCopyList(row.id)
				} else if (this.infoData == 1) {
					this.dialogTitle = "修改资料";
                    this.ruleForm = JSON.parse(JSON.stringify(row));
                    this.staticId = row.id
                    this.getCopyList(row.id)
				} else {
					this.dialogTitle = "创建用户";
					this.ruleForm = {
                        name: "",
                        path: "",
					};
				}
			})
        },
        /**
		 * 备份列表
		 * @method getCopyList
		 * @return void
		 * */
        getCopyList (id) {
            this.axios.get(`${url_copy_list}?sysStaticDataId=${id}`).then(res =>{
                this.staticList = res.data.data.list
            })
        },
		/**
		 * utilList列表
		 * @method getRoleList
		 * @return void
		 * */
		getRoleList() {
			var params = {
				page: this.pageJson.page,
				pageSize: this.pageJson.pageSize
			};
			this.axios({
				method: "get",
				url: url_static_list,
				params
			}).then(res => {
                let dataJson = res.data.data;
				this.menuData = dataJson.list;
			});
		}
	},
	mounted() {
			this.getRoleList();
	}
};
</script>
<style lang="scss">
	.menu {
		position: absolute;
		height: 100%;
		width: 100%;
        padding: 20px;
		.menu-top{
			margin-bottom: 15px;
		}
		.contentBox{
			height: calc(100% - 100px);
		}
		.enum_block {
			text-align: center;
			margin-top: 20px;
		}
	}
	.uploadImg{
		display: block;
		width: 100px;
		height:100px; 
		object-fit: fill;
		border:1px solid #ccc;
	}
    .util_dialog  {
        .el-dialog {
            height: 80% !important;
        }
        .el-dialog__body {
            height: 85%;
            padding-top: 0px !important;
        }
        .el-table {
            height: 94% !important;
        }
    }
</style>