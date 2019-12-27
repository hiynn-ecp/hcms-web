<!--
 * @Author: your name
 * @Date: 2019-10-21 14:39:25
 * @LastEditTime: 2019-10-31 14:33:48
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \ysgz_webc:\developer\own-system\src\login\views\management.vue
 -->
<template>
	<div id="index">
		<el-container>
			<el-aside width="250px">
					<p class="industry_title"><img src="../assets/images/hy.png" alt=""><span>云豹系统</span></p>
						<el-menu class="left_menu" :router="true" :default-active="defaultActive">
							<template v-for="(item,i) in listData">
								<el-menu-item v-if='!item.ChildExist' :key="item.text" :index="item.uri">
									<img class="iconBtn" :src='"../assets/images/icons/"+(routerUrl == item.uri?"on":"")+(i+1)+".png"' alt="">
									<span class="text" style="padding-left:20px;">{{item.name}}</span>
								</el-menu-item>
								<el-submenu v-else :index="item.name" :key="item.text">
									<template slot="title">
										<img class="iconBtn" :src="iconList[i]" alt="">
										<span class="text" style="padding-left:20px;">{{item.name}}</span>
									</template>
									<el-menu-item v-for="(data, ins) in item.menuChild" :key='ins' :index="data.uri" >
										<span class="text" style="padding-left:38px;">{{data.name}}</span>
									</el-menu-item>
								</el-submenu>
							</template>
						</el-menu>
				</el-aside>
			
			<el-container>
				<el-header height="70px">
					<div class="header">
						<el-row class="loginMan">
							<el-col :span="10" class="loginName">{{userInfo.userName}}</el-col>
							<el-col :span="14" class="loginImg">
							<el-dropdown trigger="click" @command="handleCommand">
								<el-button class="dropDownBtn">
								<img :src="baseURL + '/img/' + userInfo.picture" />
								<!-- <span class="el-dropdown-link">
									<i class="el-icon-arrow-down el-icon-caret-bottom"></i>
								</span> -->
								</el-button>
								<el-dropdown-menu slot="dropdown" class="dropdown">
									<el-dropdown-item command="editorPas">修改密码</el-dropdown-item>
									<el-dropdown-item command="out">退出</el-dropdown-item>
								</el-dropdown-menu>
							</el-dropdown>
							</el-col>
						</el-row>
					</div>
				</el-header>
					<el-main>
						<router-view></router-view>
					</el-main>
				</el-container>
			</el-container>
			<el-dialog :close-on-click-modal="false" title="修改密码" :visible.sync="dialogVisible" width="30%" @close="resetForm">
				<el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
					<el-form-item label="密码" prop="pass">
						<el-input type="password" v-model="ruleForm.pass" autocomplete="off"></el-input>
					</el-form-item>
					<el-form-item label="确认密码" prop="checkPass">
						<el-input type="password" v-model="ruleForm.checkPass" autocomplete="off"></el-input>
					</el-form-item>
					<el-form-item>
						<el-button type="primary" @click="submitForm('ruleForm')">修改</el-button>
						<el-button @click="resetForm">重置</el-button>
					</el-form-item>
				</el-form>
			</el-dialog>
	</div>
</template>
<script>
import {
  url_out,
  url_menusList,
  url_allMenu,
  url_un,
  url_info
} from "../../common/requestUrl/requestUrl";
import icon1 from "../assets/images/icons/1.png";
import icon2 from "../assets/images/icons/2.png";
import icon3 from "../assets/images/icons/3.png";
import icon4 from "../assets/images/icons/4.png";
import icon5 from "../assets/images/icons/5.png";
import icon6 from "../assets/images/icons/6.png";
import icon7 from "../assets/images/icons/7.png";
import icon8 from "../assets/images/icons/8.png";
import icon9 from "../assets/images/icons/9.png";
import icon10 from "../assets/images/icons/10.png";
import {url_user} from "../../common/requestUrl/requestUrl";
export default {
	name: "management",
	components: {
	},
	data() {
		var validatePass = (rule, value, callback) => {
			if (value === '') {
			callback(new Error('请输入密码'));
			} else {
			if (this.ruleForm.checkPass !== '') {
				this.$refs.ruleForm.validateField('checkPass');
			}
			callback();
			}
		};
		var validatePass2 = (rule, value, callback) => {
			if (value === '') {
			callback(new Error('请再次输入密码'));
			} else if (value !== this.ruleForm.pass) {
			callback(new Error('两次输入密码不一致!'));
			} else {
			callback();
			}
		};
		return {
			dialogVisible: false,
			showPage: "菜单管理",
			iconList: [
				icon1,
				icon2,
				icon3,
				icon4,
				icon5,
				icon6,
				icon7,
				icon8,
				icon9,
				icon10,
			],
			ruleForm: {
				pass: '',
				checkPass: ''
			},
			rules: {
				pass: [
					{ validator: validatePass, trigger: 'blur' }
				],
				checkPass: [
					{ validator: validatePass2, trigger: 'blur' }
				],
			},
			listData: [],
			baseURL: window.baseURL,
			userInfo: {},
			routerUrl: this.$route.path
		};
	},

	created() {
		this.getUserProList();
		this.getUserInfo()
	},
	computed: {
		defaultActive: function () {
			var activeMenuName = this.$route.path;
			console.log(activeMenuName)
            return activeMenuName;
		},
	},
	methods: {
		/**
		 * 查询当前用户目录菜单权限
		 * @method getUserProList
		 * @return void
		 * */
		getUserProList() {
			this.axios.get(url_menusList).then(res => {
				if (res) {
					let data = res.data.data;
					// 处理数据
					data.forEach(item => {
						if (item.child && item.child.length) {
							let isTrue = true;
							item.menuChild = [];
							for(let i = 0; i< item.child.length; i++) {
								if (item.child[i].type == 2) {
									if (isTrue) {
										item.ChildExist = true;
										isTrue = false;
									}
									item.menuChild.push(item.child[i]);
								}
							}
						}
					});
					this.listData = data;
				}
			});
		},
		/**
		 * 获取用户详情
		 * @method getUserInfo
		 * @param { Number } n 判断值
		 * @return void
		 * */
		getUserInfo () {
			this.axios.get(url_info).then(res => {
				this.userInfo = res.data.data;
				sessionStorage.setItem("userInfo", res.data.data.id)
			});
		},
		// 右上角按钮功能
		handleCommand(e) {
			if (e == 'out') {
				this.outLogin();
			} else if (e == 'editorPas'){
				this.dialogVisible = true;
			}
		},
		// 退出登录
		outLogin() {
			this.axios.get(url_out).then(res => {
				if (res) {
					window.localStorage.setItem("sessionId", "");
					this.$router.replace({ path: "/" });
				}
			});
		},
		submitForm() {
			this.$refs.ruleForm.validate((valid) => {
			if (valid) {
				let fd = new FormData();
				fd.append("id", this.userInfo.id);
				fd.append("password", this.ruleForm.pass);
				this.axios({
					method: "put",
					url: url_user,
					headers: {
					"Content-Type": "multipart/form-data"
					},
					data: fd
				}).then(res => {
					if (res) {
						this.$refs.ruleForm.resetFields();
						this.dialogVisible = false;
						this.$message({
							type: 'success',
							message: '修改成功'
						})
					}
				});
			} else {
				console.log('error submit!!');
				return false;
			}
			});
		},
		resetForm() {
			this.$refs.ruleForm.resetFields();
		},
	},
	watch:{
		$route(to,from){
			this.routerUrl = to.path;
		}
	}
};
</script>
<style lang="scss" scoped src="../assets/css/management.scss">
</style>
<style lang="scss">
@font-face {
    font-family: "numberFont"; 
    src: url("../assets/font/yzgfFont.ttf");
}
.industry_title {
	line-height: 60px;
	font-size: 28px;
	// text-align: center;
	font-weight: 900;
	background: #d95459;
	color: white;
	letter-spacing: 10px;
	position: relative;
	font-family: numberFont;
	box-shadow: -3px 3px 5px #888;
	margin-bottom: 8px;
	z-index: 10;
	img{
		// display: none;
		position: absolute;
		top: 14px;
		width: 30px;
		height: 30px;
		left: 18px;
	}
	span{
		margin-left: 68px;
	}
}
.el-menu-item, .el-submenu__title{
	line-height: 45px;
	height: 45px;
	color: #8c91a2;
	border-bottom: 1px solid #e9e9e9;
}
.el-submenu.is-active .el-submenu__title{
	border-color: #e9e9e9!important;
}
.el-submenu .el-menu-item{
	line-height: 45px;
	height: 45px;
	color: #8c91a2;
}
.el-menu-item:focus, .el-menu-item:hover{
	background: #d89c9e;
	color: #fff;
	position: relative;
	z-index: 11;
}
.el-submenu__title:hover{
	background: #d89c9e;
	color: #fff;
}
.el-menu-item.is-active{
	color: #fff;
	background: #d95459;
}
.dropdown{
	margin-top: -2px!important;
	text-align: center;
}
.el-dropdown-menu{
	padding: 0!important;
}
.el-main{
	position: relative;
	padding: 0!important;
}
.iconBtn {
	width: 18px;
	height: 18px;
}
</style>
