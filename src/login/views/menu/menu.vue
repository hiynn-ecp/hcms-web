<template>
	<div class="menu">
		<el-row class="menu-top">
			<el-button type="primary" @click="handleClick(null, 2)" v-if="getBtn('Menu_Post')">菜单创建</el-button>
		</el-row>
		<el-row class="contentBox">
			<el-table :data="menuData" border style="width: 100%" height="100%" row-key="id" :tree-props="{children: 'child', hasChildren: 'hasChildren'}">
				<el-table-column align="center" prop="name" label="菜单名称" width="300"></el-table-column>
				<el-table-column align="center" prop="perms" label="授权"></el-table-column>
				<el-table-column align="center" prop="typeName" label="类型" width="120"></el-table-column>
				<el-table-column align="center" prop="uri" label="菜单uri"></el-table-column>
				<el-table-column align="center" prop="ordered" label=" 排序字段" width="120"></el-table-column>
				<el-table-column align="center" label="操作" width="220" v-if="getBtn('Menu_Get_id')||getBtn('Menu_Put')||getBtn('Menu_Delete')">
				<template slot-scope="scope">
					<el-button v-if="getBtn('Menu_Get_id')" @click="handleClick(scope.row, 0)" size="small" type="success">详情</el-button>
					<el-button v-if="getBtn('Menu_Put')" @click="handleClick(scope.row, 1)" size="small" type="primary">编辑</el-button>
					<el-button v-if="getBtn('Menu_Delete')" @click="deleteClick(scope.row)" type="danger" size="small">删除</el-button>
				</template>
				</el-table-column>
			</el-table>
		</el-row>
		<el-dialog :close-on-click-modal="false" :title="dialogTitle" :visible.sync="dialogVisible" width="30%">
		<div class="form">
			<el-form ref="form" :model="form" label-width="100px">
			<el-form-item label="父菜单名称:" class="par_tree_data">
				<span v-if="infoData == 0">{{form.name}}</span>
				<el-popover
				v-else
				class="select-tree"
				ref="popovera"
				placement="bottom-start"
				popper-class="select-tree-popover"
				trigger="click"
				@show="onShowPopover"
				@hide="onHidePopover">
				<el-tree
					:expand-on-click-node="false"
					ref="tree"
					class="select_tree_box left_bordr"
					:data="treeData"
					:props="defaultProps"
					:default-expanded-keys="['0']"
					@node-click="onClickNode"
					>
					<span  slot-scope="{ node, data }" >
						{{ data.name }}
					</span>
					</el-tree>
				<el-select
					slot="reference"
					ref="input"
					clearable
					v-model="nodeValue"
					placeholder="--请选择--"
					popper-class="reference_selc"
					class=""
					suffix-icon="el-icon-arrow-down"
					></el-select>
			</el-popover>
			</el-form-item>
			<el-form-item label="菜单名称:">
				<span v-if="infoData == 0">{{form.name}}</span>
				<el-input v-model="form.name" v-else></el-input>
			</el-form-item>
			<el-form-item label="排序字段:">
				<span v-if="infoData == 0">{{form.ordered}}</span>
				<el-input v-model="form.ordered" type="number" v-else></el-input>
			</el-form-item>
			<el-form-item label="授权:">
				<span v-if="infoData == 0">{{form.perms}}</span>
				<el-input v-model="form.perms" v-else></el-input>
			</el-form-item>
			<el-form-item label="类型:">
				<span v-if="infoData == 0">{{formType}}</span>
				<el-select v-model="formType"  placeholder="请选择类型" v-else>
				<!-- 类型 0：目录 1：菜单 2：按钮,Integer , -->
				<el-option v-for="item in optionList" :key="item.key" :label="item.value" :value="item.key"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="菜单uri:">
				<span v-if="infoData == 0">{{form.uri}}</span>
				<el-input v-model="form.uri" v-else></el-input>
			</el-form-item>
			</el-form>
		</div>
		<span slot="footer" class="dialog-footer">
			<el-button @click="dialogVisible = false">取 消</el-button>
			<el-button type="primary" @click="createMenu" :loading="!isBtnTrue" v-if="infoData == 2">创 建</el-button>
			<el-button type="primary" @click="createMenu" :loading="!isBtnTrue" v-if="infoData == 1">修 改</el-button>
		</span>
		</el-dialog>
		<el-dialog
		title="提示"
		:visible.sync="deletBool"
		width="30%">
		<span>确定删除此条数据？</span>
		<span slot="footer" class="dialog-footer">
			<el-button @click="deletBool = false">取 消</el-button>
			<el-button type="primary" @click="deletMenu">确 定</el-button>
		</span>
		</el-dialog>
	</div>
</template>
<script>
import {url_pageMenu,url_createMenu,url_delMenu,url_allMenu,url_enum_list,url_enum_type} from "../../../common/requestUrl/requestUrl";
import {getLocal} from "../../../common/js/common";
export default {
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
		getEnum () {
			this.axios.get(url_enum_type + '?type=menu_type').then(res => {
				this.optionList = res.data.data
			})
		},
		/**
		 * 获取树
		 * @method getAllMenu
		 * @return void
		 * */
		getAllMenu () {
			this.axios.get(url_allMenu).then(res => {
				this.treeData = res.data.data
				this.menuData = res.data.data
			})
		},
		/**
		 * 下拉显示
		 * @method onShowPopover
		 * @return void
		 * */
		onShowPopover () {
			this.treeBool = true
		},
		/**
		 * 下拉隐藏
		 * @method onHidePopover
		 * @return void
		 * */
		onHidePopover () {
			this.treeBool = false
		},
		/**
		 * 点击节点
		 * @method onClickNode
		 * @param { Obj } v 节点对象
		 * @return void
		 * */
		onClickNode (v) {
			this.nodeValue = v.name
			this.form.menuId = v.id
		},
		/**
		 * 创建修改操作
		 * @method createMenu
		 * @return void
		 * */
		createMenu() {
			var data = this.form
			let da = {
					id: data.id,
					menuId: data.menuId,
					name: data.name,
					type: this.formType,
					ordered: data.ordered,
					perms: data.perms,
					uri: data.uri
				};
			JSON.stringify(da)
			this.isBtnTrue = false;
			this.axios({
				method: this.infoData == 2 ? 'post' : 'put',
				url: url_createMenu,
				data: da,
				headers: {
				"Content-Type": "application/json"
				}
			}).then(res => {
				console.log(res);
				if (res) {
					this.$message({
						type: "success",
						message: "保存成功"
					});
					this.dialogVisible = false;
					this.form = {
						menuId: "",
						name: "",
						ordered: 0,
						perms: "",
						uri: ""
					};
					this.getAllMenu();
					this.isBtnTrue = true;
				} else {
					console.log(11111111111);
					this.isBtnTrue =true;
				}
				
			}).catch((err) => {
				this.isBtnTrue =true;
			});
		},
		/**
		 * 删除前操作
		 * @method deleteClick
		 * @param { String } p id
		 * @return void
		 * */
		deleteClick(p) {
			this.pId = p.id
			this.deletBool = true
		},
		/**
		 * 删除操作
		 * @method deletMenu
		 * @return void
		 * */
		deletMenu () {
			this.axios({
				method: "delete",
				url: url_delMenu + "/" + this.pId
			}).then(res => {
				this.$message({
					type: "success",
					message: "删除成功"
				});
				this.deletBool = false
				this.getAllMenu();
			});
		},
		/**
		 * 操作按钮前
		 * @method handleClick
		 * @param { Obj } row 点击对象
		 * @param { Number } n 判断值
		 * @return void
		 * */
		handleClick(row, n) {
			console.log(row)
			this.getAllMenu()
			this.infoData = n
			this.dialogVisible = true;
			this.editStatus = true;
			if (this.infoData == 0) {
				this.dialogTitle = "菜单详情"
				this.getIdMenu(row)
			} else if (this.infoData == 1) {
				this.dialogTitle = "修改菜单"
				this.getIdMenu(row)
			} else {
				this.dialogTitle = "创建菜单"
				this.nodeValue = ''
				this.form = {
					menuId: "",
					name: "",
					ordered: 0,
					perms: "",
					type: "1",
					uri: ""
				};
			}
		},
		/**
		 * 根据id查询菜单
		 * @method getIdMenu
		 * @param { Obj } row 点击对象
		 * @param { Number } n 判断值
		 * @return void
		 * */
		getIdMenu (i) {
			this.axios.get(`${url_delMenu}/${i.id}`).then(res => {
				console.log(res)
				this.formType = res.data.data.type
				this.form = res.data.data
				if (res.data.data.menuName) {
					this.nodeValue = res.data.data.menuName
				} else {
					this.nodeValue = ''
				}
			})
		},
	},
	mounted() {
		this.getAllMenu()
		this.getEnum()

	},
	data() {
		return {
			nodeValue: '',
			optionList: [{
				id: 1,
				label: '目录'
			}],
			dialogTitle: "创建菜单",
			editStatus: false,
			formType: 1,
			form: {
				menuId: "string",
				name: "string",
				ordered: 0,
				perms: "string",
				type: "1",
				uri: "string"
			},
			dialogVisible: false,
			// pageJson: {
			// 	page: 0,
			// 	pageNum: 0,
			// 	pageSize: 10,
			// 	total: 0
			// },
			menuData: [],
			infoData: null,
			treeData: [{
				id: '一级 1',
				child: [{
					id: '二级 1-1',
					child: [{
					id: '三级 1-1-1'
					}]
				}]
			}],
			defaultProps: {
				children: 'child',
				label: 'id'
			},
			treeBool: false,
			clickBool: true,
			pId: '',
			deletBool: false,
			isBtnTrue: true
		};
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
		.contentBox {
			width: 100%;
			height: calc(100% - 60px);
		}
	}
	.par_tree_data {
		position: relative;
	.tree_data {
		position: absolute;
		z-index: 99;
		width: 100%;
		border: 1px solid #409EFF;
		border-radius: 4px;
	}
	}
	.select_clas {
		display: none !important;
	}
	.reference {
		width: 100%;
	}
	.my-popover .el-button{
		display: block;
		margin-left:0px;
		padding:12px 10px;
	}
	.el-tree-node > .el-tree-node__children{
		overflow: visible;
	}
	.el-popover__reference {
		width: 100% !important;
	}
	.el-popover.el-popper.select-tree-popover {
		z-index: 1000 !important;
		width: 450px;
		overflow: auto;
		max-height: 500px;
		padding: 0;
		border-radius: 8px;
		.select_tree_box {
		position: relative;
		z-index: 100000000;
			margin: 0px;
		}
	}
	.select_tree_box {
		overflow: auto;
	}
	.select_tree_top {
		height: 35px;
		line-height: 35px;
		text-align: center;
		font-size: 16px;
		color: #fff;
		background: #37474f;
	}

	.reference_selc {
		display: none !important;
	}
	.el-popover.el-popper.select-tree-popover {
		z-index: 10000000 !important;
	}
</style>