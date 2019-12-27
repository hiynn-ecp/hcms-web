<template>
	<div class="menu">
		<el-row class="menu-top">
			<el-button type="primary" @click="handleClick(null, 2)" v-if="getBtn('User_Post')">用户创建</el-button>
		</el-row>
		<el-row class="contentBox">
		<el-table :data="menuData" border style="width: 100%" height="100%">
			<el-table-column align="center" type="index" width="60" label="序号"></el-table-column>
			<el-table-column align="center" prop="account" label="账户"></el-table-column>
			<!-- <el-table-column prop="password" label="密码" width></el-table-column> -->
			<el-table-column align="center" prop="userName" label="姓名"></el-table-column>
			<el-table-column align="center" prop="phone" label="手机"></el-table-column>
			<el-table-column align="center" prop="email" label="邮箱"></el-table-column>
			<el-table-column align="center" prop="picture" label="头像">
			<!-- <img :src /> -->
			<template slot-scope="scope">
				<img style="width: 70px;height:70px;object-fit:cover" :src="baseURL +'/img/' + scope.row.picture" />
			</template>
			</el-table-column>
			<el-table-column align="center" label="操作" width="220" v-if="getBtn('User_Get_id')||getBtn('User_Put')||getBtn('User_Delete')">
			<template slot-scope="scope">
				<el-button v-if="getBtn('User_Get_id')" @click="handleClick(scope.row, 0)" size="small" type="success">详情</el-button>
				<el-button v-if="getBtn('User_Put')" @click="handleClick(scope.row, 1)" size="small" type="primary">编辑</el-button>
				<el-button v-if="getBtn('User_Delete')" @click="deleteClick(scope.row)" type="danger" size="small">删除</el-button>
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
		<el-dialog :close-on-click-modal="false" :title="dialogTitle" :visible.sync="dialogVisible"  width="30%">
		<div class="form">
			<el-form :rules="rules" ref="ruleForm" :model="ruleForm" label-width="90px">
			<el-form-item label="账户:" :prop='infoData ==2 ? "account":""'>
				<span v-if="infoData !== 2">{{ruleForm.account}}</span>
				<el-input v-else v-model="ruleForm.account"></el-input>
			</el-form-item>
			<el-form-item v-show="infoData == 2" label="密码:" :prop='infoData==2?"password":""'>
				<el-input v-model="ruleForm.password"></el-input>
			</el-form-item>
			<el-form-item label="姓名:" :prop='infoData?"userName":""'>
				<span v-if="infoData == 0">{{ruleForm.userName}}</span>
				<el-input v-else v-model="ruleForm.userName"></el-input>
			</el-form-item>
			<el-form-item label="手机:" :prop='infoData?"phone":""'>
				<span v-if="infoData == 0">{{ruleForm.phone}}</span>
				<el-input v-else type="phone" v-model="ruleForm.phone"></el-input>
			</el-form-item>
			<el-form-item label="邮箱:" :prop='infoData?"email":""'>
				<span v-if="infoData == 0">{{ruleForm.email}}</span>
				<el-input v-else type="email" v-model="ruleForm.email"></el-input>
			</el-form-item>
			<el-form-item label="绑定角色:"  v-if="infoData !== 2">
				<span v-if="infoData == 0">
					<span  v-for="(i,n) in roleIdArr" :key="n">{{i.name}}{{roleIdArr.length == (n + 1) ? '' : ','}}</span>
				</span>
				<el-select
				style="width: 100%;"
				v-else
				@change="productsChange"
				v-model="roleIdArr"
				multiple
				placeholder="请选择"
				>
				<el-option
					v-for="(item) in roleList"
					:key="item.id"
					:label="item.name"
					:value="item.id"
				></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="头像:">
				<span v-if="infoData == 0">{{ruleForm.picture}}</span>
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
			<el-button type="primary" @click="submitForm('ruleForm')" :loading="!isBtnTrue" v-if="infoData == 2">创 建</el-button>
			<el-button type="primary" @click="submitForm('ruleForm')" :loading="!isBtnTrue" v-if="infoData == 1">修改</el-button>
		</span>
		</el-dialog>
		<el-dialog :close-on-click-modal="false" title="提示" :visible.sync="deletBool" width="30%">
		<span>确定删除此条数据？</span>
		<span slot="footer" class="dialog-footer">
			<el-button @click="deletBool = false">取 消</el-button>
			<el-button type="primary" @click="deletMenu">确 定</el-button>
		</span>
		</el-dialog>
	</div>
</template>
<script>
import {url_userList,url_user,url_roleList,url_role_user,url_userid_role} from "../../../common/requestUrl/requestUrl";
import {getLocal} from "../../../common/js/common";

export default {
	data() {
		return {
			imageUrl: "",
			ruleForm: {
				account: "",
				userName: "",
				password: "",
				phone: "",
				email: ""
			},
			rules: {
				userName: [
					{ required: true, message: "请输入姓名", trigger: "blur" },
					{ min: 1, max: 50, message: "长度在 1 到 50 个字符", trigger: "blur" }
				],
				account: [
					{ required: true, message: "请输入昵称", trigger: "blur" },
					{ min: 1, max: 50, message: "长度在 1 到 50 个字符", trigger: "blur" }
				],
				password: [
					{ required: true, message: "请输入密码", trigger: "blur" },
					{ min: 1, max: 50, message: "长度在 1 到 50 个字符", trigger: "blur" }
				],
				phone: [{ required: true, message: "请输入手机号", trigger: "blur" },
					{ min: 1, max: 50, message: "长度在 1 到 50 个字符", trigger: "blur" }
				],
				email: [{ required: true, message: "请输入邮箱地址", trigger: "blur" },
					{ min: 1, max: 50, message: "长度在 1 到 50 个字符", trigger: "blur" },
					{ type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
				]
			},
			dialogTitle: "创建用户",
			editStatus: false,

			dialogVisible: false,
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
			roleIdUser: [],
			roleList: [],
			resourceUpploadList: [], //上传文件列表
			uploadData: {},
			isBtnTrue: true,
			
		};
	},
	methods: {
		cancelFun () {
            if (this.infoData) {
				this.$refs.ruleForm.resetFields();
				if (this.resourceUpploadList.length) {
                	this.$refs.fileUserImg.clearFiles();
                	this.resourceUpploadList = [];
				}
			}
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
		 * 获取角色列表
		 * @method getRoleLists
		 * @return void
		 * */
		getRoleLists() {
			var params = {
				page: 1,
				pageSize: 10
			};
			this.axios({
				method: "get",
				url: url_roleList,
				params
			}).then(res => {
				this.roleList = res.data.data.list;
			});
		},
		/**
		 * 切换角色列表
		 * @method getRoleLists
		 * @param { String } v 角色id
		 * @return void
		 * */
		productsChange(v) {
		console.log(v);
		},
		/**
		 * 角色分配到用户
		 * @method postRoleToUser
		 * @return void
		 * */
		postRoleToUser() {
			let data = {
				roles: this.roleIdArr,
				userId: this.ruleForm.id
			};
			this.axios({
				method: "post",
				url: url_role_user,
				data: data
			}).then(res => {
				if (res) {
					this.$message({
						type: "success",
						message: '保存成功'
					});
					this.ruleForm = {
						acount: "",
						userName: "",
						password: "",
						phone: "",
						email: "",
						id: ""
					};
					this.dialogVisible = false;
					this.getRoleList();
					this.roleIdArr = [];
				}
				this.isBtnTrue = true;
			}).catch(() =>{
				this.isBtnTrue = true;
			});
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
         * 文件上传发生变化
         * @method uploadChange
         * */
        uploadChange (file, fileList) {
			this.uploadData = {
				name: file.name,
				url: URL.createObjectURL(file.raw)
			};
            this.resourceUpploadList = [file.raw];
        },
		/**
		 * 创建修改操作
		 * @method create
		 * @return void
		 * */
		create() {
			if (this.isBtnTrue) {
				this.isBtnTrue = false;
				let fd = new FormData();
				if (this.resourceUpploadList[0]) {
					fd.append("picture", this.resourceUpploadList[0]);
				}
				if (this.infoData !==1) {
					fd.append("account", this.ruleForm.account);
				}
				if (this.ruleForm.password) {
					fd.append("password", this.ruleForm.password);
				}
				fd.append("userName", this.ruleForm.userName);
				fd.append("phone", this.ruleForm.phone);
				fd.append("email", this.ruleForm.email);
				if (this.infoData == 1) {
					fd.append("id", this.ruleForm.id);
				}
				this.axios({
					method: this.infoData == 2 ? "post" : "put",
					url: url_user,
					headers: {
					"Content-Type": "multipart/form-data"
					},
					data: fd
				}).then(res => {
					if (res) {
						if (this.infoData == 2) {
							this.ruleForm = {
								acount: "",
								userName: "",
								password: "",
								phone: "",
								email: "",
								id: ""
							};
							this.dialogVisible = false;
							this.isBtnTrue = true;
							this.getRoleList();
							this.$message({
								type: "success",
								message: '保存成功'
							});
						} else {
							this.postRoleToUser();
						}
						this.resourceUpploadList = [];
						this.$refs.fileUserImg.clearFiles();
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
				url: url_user + "/" + this.pId
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
			this.uploadData = {};
			this.infoData = n;
			this.getRoleLists();
			this.dialogVisible = true;
			this.$nextTick(() => {
				this.$refs.ruleForm.resetFields();
				this.editStatus = true;
				if (this.infoData == 0) {
					this.dialogTitle = "用户详情";
					this.ruleForm = JSON.parse(JSON.stringify(row));
					this.getUserRoleList(row)
				} else if (this.infoData == 1) {
					this.dialogTitle = "修改资料";
					this.ruleForm = JSON.parse(JSON.stringify(row));
					if (row.picture) {
						this.uploadData = {name: row.picture, url: baseURL + "/img/" + row.picture};
					}
					this.getUserRoleList(row)
				} else {
					this.dialogTitle = "创建用户";
					this.ruleForm = {
					acount: "",
					userName: "",
					password: "",
					phone: "",
					email: ""
					};
				}
			})
		},
		/**
		 * userId查询角色
		 * @method getUserRoleList
		 * @return void
		 * */
		getUserRoleList (r) {
			this.roleIdArr = []
			this.axios.get(`${url_userid_role}/${r.id}`).then(res => {
				let a = res.data.data
				if (this.infoData == 0) {
					this.roleIdArr = res.data.data
				} else {
					for (let i of a) {
						this.roleIdArr.push(i.id)
					}
				}
			})
		},
		/**
		 * userList列表
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
				url: url_userList,
				params
			}).then(res => {
				let dataJson = res.data.data;
				if (dataJson) {
				this.menuData = dataJson.list;
				(this.pageJson.pageSize = dataJson.pageSize),
					(this.pageJson.total = dataJson.total);
				}
			});
		}
	},
	mounted() {
			this.getRoleList();
	}
};
</script>
<style lang="scss" scoped>
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
</style>