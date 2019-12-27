<!--
 * @Author: your name
 * @Date: 2019-10-23 18:15:59
 * @LastEditTime: 2019-10-31 14:48:20
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \ysgz_webc:\developer\own-system\src\login\views\member.vue
 -->
<template>
	<div class="menu">
		<el-row class="menu-top">
			<el-button type="primary" @click="handleClick(null, 2)" v-if="getBtn('Role_Post')">角色创建</el-button>
		</el-row>
		<el-row  class="contentBox">
		<el-table :data="menuData" border style="width: 100%" height="100%">
			<el-table-column align="center" type="index" width="60" label="序号"></el-table-column>
			<!-- <el-table-column align="center" prop="id" label="ID" width></el-table-column> -->
			<el-table-column align="center" prop="name" label="角色名称"></el-table-column>
			<el-table-column label="操作" width="220" v-if="getBtn('Role_Get_id')||getBtn('Role_Put')||getBtn('Role_Delete')">
			<template slot-scope="scope">
				<el-button v-if="getBtn('Role_Get_id')" @click="handleClick(scope.row, 0)" size="small" type="success">详情</el-button>
				<el-button v-if="getBtn('Role_Put')" @click="handleClick(scope.row, 1)" size="small" type="primary">编辑</el-button>
				<el-button v-if="getBtn('Role_Delete')" @click="deleteClick(scope.row)" type="danger" size="small">删除</el-button>
			</template>
			</el-table-column>
		</el-table>
		</el-row>
		<!--分页按钮到达一定的页数才会出现 -->
		<div class="enum_block">
			<el-pagination
			:hide-on-single-page="menuData.length<1"
			background
			layout="prev, pager, next"
			:total="pageJson.total"
			@current-change="handleCurrentChange"
			></el-pagination>
		</div>
		<el-dialog :close-on-click-modal="false" :title="dialogTitle" :visible.sync="dialogVisible" width="30%">
		<div class="form">
			<el-form ref="ruleForm" :model="ruleForm" label-width="100px" :rules="rules">
			<el-form-item label="角色名称:" :prop='infoData?"name":""'>
				<span v-if="infoData == 0">{{ruleForm.name}}</span>
				<el-input v-else v-model="ruleForm.name"></el-input>
			</el-form-item>
			<el-form-item label="绑定菜单:" v-if='infoData!==2 && getBtn("Role_Post_user")'>
				<el-cascader
				:options="treeData"
				:props="defaultProps"
				v-model="menuIdArr"
				collapse-tags
				clearable></el-cascader>
			</el-form-item>
			</el-form>
		</div>
		<span slot="footer" class="dialog-footer">
			<el-button @click="cancelFun">取 消</el-button>
			<el-button type="primary" @click="create" :loading="!isBtnTrue" v-if="infoData == 2">创 建</el-button>
			<el-button type="primary" @click="create" :loading="!isBtnTrue" v-if="infoData == 1">修改</el-button>
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
import {url_roleList,url_role,url_pageMenu,url_menu_role,url_menu_role_tree,url_allMenu,url_perms} from "../../../common/requestUrl/requestUrl";
import {setLocal,getLocal} from "../../../common/js/common";
export default {
	data() {
		return {
			nodeValue: [],
			dialogTitle: "创建角色",
			editStatus: false,
			ruleForm: {
				name: ""
			},
			menuIdArr: [],
			dialogVisible: false,
			pageJson: {
				page: 1,
				pageNum: 0,
				pageSize: 10,
				total: 0
			},
			treeData: [],
			menuData: [],
			infoData: null,
			pId: "",
			deletBool: false,
			defaultProps: {
				children: 'child',
				label: 'name',
				value: 'id',
				multiple: true,
			},
			rules: {
				name: [
                    { required: true, message: "请输入角色名称", trigger: "blur" },
                    { min: 1, max: 50, message: "长度在 1 到 100 个字符", trigger: "blur" }
				]
			},
			menuShowLsit: [],
			isBtnTrue: true,
			cslist:[]
		};
	},
	methods: {
		cancelFun () {
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
		 * 目录列表
		 * @method getMenuLists
		 * @return void
		 * */
		getMenuLists(row) {
			this.axios.get(url_allMenu).then(res => {
				this.childrenSearch(res.data.data);
				this.treeData = res.data.data;
				if (this.infoData == 0 || this.infoData == 1) {
					this.getRoleTree(row);
				}
			});
		},
		childrenSearch (data) {
			data.forEach(item => {
				if (item.child){
					if (item.child.length){
						this.childrenSearch(item.child);
					} else {
						item.child = undefined;
					}
				}
			});
		},
		/**
		 * 给角色分配菜单
		 * @method roleMenuLi
		 * @return void
		 * */
		roleMenuLi() {
			let nodesArr = [];
			console.log(this.menuIdArr);
			this.menuIdArr.forEach((item) => {
				nodesArr.push(...item);
			})
			const menuIds = [...new Set(nodesArr)];
			let data = {
				menuIds: menuIds,
				roleId: this.ruleForm.id
			};
			this.axios({
				method: "post",
				url: url_menu_role,
				data: data
			}).then(res => {
				if (res) {
					this.ruleForm = {
						name: ""
					};
					this.dialogVisible = false;
					this.menuIdArr = [];
					this.getRoleList();
					this.$message({
						type: "success",
						message: this.infoData == 2 ? "创建成功" : "修改成功"
					});
					this.getPerms();
				}
				this.isBtnTrue = true;
			}).catch((err) => {
				this.isBtnTrue = true;
			});
		},
		/**
		 * 查询某一角色菜单
		 * @method getRoleTree
		 * @param { Obj } row 角色对象
		 * @return void
		 * */
		getRoleTree(row) {
			// this.menuIdArr = [];
			this.axios.get(`${url_menu_role_tree}/${row.id}`).then(res => {
				this.menuShowLsit =  [];
				this.menuIdArr = this.menuOnscreen(res.data.data);
			});
		},
		menuOnscreen (data) {
			let newMenuData = []
			for (let i of data) {
				if (i.child.length > 0) {
					for (let j of i.child) {
						newMenuData.push([i.id, j.id]);
						this.menuShowLsit.push(j.name);
					}
				}
				this.menuShowLsit.push(i.name);
			}
			return newMenuData;
		},
		/**
		 * 菜单切换
		 * @method productsChange
		 * @param { Obj } v 角色对象
		 * @return void
		 * */
		productsChange(v) {
			console.log(v);
		},
		/**
		 * 分页查询
		 * @method handleCurrentChange
		 * @param { Number } val page值
		 * @return void
		 * */
		handleCurrentChange(val) {
			this.pageJson.page = val;
			this.getRoleList();
		},
		/**
		 * 获取当前用户的权限列表
		 * @method getPerms
		 * @return void
		 * */
		getPerms () {
			this.axios.get(url_perms).then(res => {
				setLocal('btnKey', res.data.data)
			})
		},
		/**
		 * 创建修改操作
		 * @method create
		 * @return void
		 * */
		create() {
			if (this.isBtnTrue) {
				this.$refs.ruleForm.validate(valid => {
					if (valid) {
						this.isBtnTrue = false;
						this.axios({
							method: this.infoData == 2 ? "post" : "put",
							url: url_role,
							data: this.ruleForm
						}).then(res => {
							if (res) {
								if (this.infoData == 2 || !this.getBtn('Role_Post_user')) {
									this.ruleForm = {
										name: ""
									};
									this.getRoleList();
									this.dialogVisible = false;
									this.isBtnTrue = true;
								} else {
									this.roleMenuLi();
								}
							} else {
								this.isBtnTrue = true;
							}
						}).catch((err) => {
							this.isBtnTrue = true;
						});
					} else {
						return false;
					}
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
				url: url_role + "/" + this.pId
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
			this.getMenuLists(row);
			this.dialogVisible = true;
			this.$nextTick(() => {
				this.$refs.ruleForm.resetFields();
				if (this.infoData == 1) {
					this.dialogTitle = "修改角色";
					this.ruleForm = JSON.parse(JSON.stringify(row));
				} else if(this.infoData == 0){
					this.dialogTitle = "角色详情";
					this.ruleForm = JSON.parse(JSON.stringify(row));
				} else {
					this.dialogTitle = "创建角色";
					this.ruleForm = {
						name: ""
					};
				}
			})
		},
		/**
		 * roleList列表
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
				url: url_roleList,
				params
			}).then(res => {
				let dataJson = res.data.data;
				// this.menuIdArr = []
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
		.enum_block {
			text-align: center;
			margin-top: 20px;
		}
		.menu-top{
			margin-bottom: 15px;
		}
		.contentBox{
			height: calc(100% - 100px);
		}
	}
	
	.reference_selc {
		display: none !important;
	}
	.menu_show_list{
		max-height: 300px;
		overflow-y: auto;
		display: inline-block;
	}
</style>
<style>
/* .select-tree-popover .el-select-dropdown{
	display: none!important;
} */
.reference_selc{
	visibility: hidden!important;
	display: none!important;
}
.el-cascader-menu__wrap{
	max-height: 360px!important;
	height: 360px!important;

}
</style>