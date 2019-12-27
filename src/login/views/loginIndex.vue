<!--
 * @Author: your name
 * @Date: 2019-10-21 13:57:55
 * @LastEditTime: 2019-10-31 15:17:59
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \ysgz_webc:\developer\own-system\src\login\views\loginIndex.vue
 -->
<template>
  <div id="index" @keyup.space="pageEvent">
    <div class="login-head">
      <div class="logo">
        <div class="logo-img" />

        <h1 class="logo-name">云豹系统</h1>
        <p class="logo-text">
          <span>分享生活</span>
          <span>留下感动</span>
        </p>
      </div>
    </div>
    <transition name="slide-fade">
      <div class="form animated fast" v-show="showForm">
        <div class="formTitle">帐号密码登录</div>
        <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" class="demo-ruleForm">
          <el-form-item prop="userName">
            <el-input v-model="ruleForm.userName" autofocus placeholder="用户名"></el-input>
          </el-form-item>
          <el-form-item prop="pass" placeholder="密码">
            <el-input v-model="ruleForm.pass" type="password" placeholder="密码" @keyup.enter.native="loginEnter"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button class="loginButton" type="primary" @click="submitForm('ruleForm')">登录</el-button>
          </el-form-item>
        </el-form>
      </div>
    </transition>
    <div class="foot">
      <ul>
        <li>
          <span v-for="(item, i) in departmentPeople['up']" class="name" :key='i'>{{item}}</span>
        </li>
        <li>
          <span v-for="(item, i) in departmentPeople['down']" class="name"  :key='i'>{{item}}</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { url_login } from "../../common/requestUrl/requestUrl";
import QS from "qs";
import {setLocal} from "../../common/js/common";

export default {
  name: "index",
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        if (this.ruleForm.pass !== "") {
          // this.$refs.ruleForm.validateField("pass");
        }
        callback();
      }
    };
    var validateName = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入用户名"));
      } else {
        if (this.ruleForm.userName !== "") {
          // this.$refs.ruleForm.validateField("validateName");
        }
        callback();
      }
    };
    return {
      showForm: false,
      departmentPeople: {
        up: [
          "刘红雁",
          "崔振宇",
          "詹吉安",
          "常瑞",
          "李辰晗",
          "张朋",
          "郑傲然",
          "郭喜峰",
          "董晓波",
          "刘增岳",
          "李明威",
          "原县军",
          "朱艳龙",
          "徐锡坦",
          "马元朋",
          "乔培国"
        ],
        down: ["田甜甜", "查爱平", "杨善明", "曹培", "郭奥阁"]
      },
      ruleForm: {
        pass: "",
        userName: ""
      },
      rules: {
        pass: [{ validator: validatePass, trigger: "blur" }],
        userName: [{ validator: validateName, trigger: "blur" }]
      }
    };
  },
  created() {},
  mounted() {
    //监听键盘按键事件
    let self = this;
    this.$nextTick(function() {
      document.addEventListener("keyup", function(e) {
        //此处填写你的业务逻辑即可
        if (e.keyCode == 32) {
          self.pageEvent();
        }
        if (e.keyCode == 13 && self.showForm) {
          self.submitForm('ruleForm');
        }
      });
    });
  },
  methods: {
    pageEvent() {
      this.showForm = !this.showForm;
    },
    loginEnter() {
      this.submitForm("ruleForm");
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          var data = {
            account: this.ruleForm.userName,
            password: this.ruleForm.pass
          };
          this.axios.post(url_login, QS.stringify(data)).then(res => {
            {
              if (res) {
                var endRes = res.data.data || "";
                if (endRes) {
                      this.$store.commit("upSessionId", endRes);
                      localStorage.setItem("sessionId", endRes);
                      this.axios.defaults.headers.common["Authorization"] = endRes;
                  	this.axios.get(window.baseURL + '/sys/menu/perms').then(res => {
                      setLocal('btnKey', res.data.data)
                      setTimeout(() => {
                        this.$router.replace({ path: "/product" });
                      }, 100)
                    })
                  
                }
              }
            }
          });
        } else {
          console.log("提交失败");
          return false;
        }
      });
    }
  }
};
</script>
<style lang="scss" scoped>
#index {
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: url(../assets/images/use1.png) no-repeat center center;
  background-size: 100% auto;
  position: relative;
  clear: both;
  background-color: #409eff;
  .login-head {
    width: 100%;
    height: 100px;
    position: fixed;
    top: 100px;
    .logo {
      width: 880px;
      height: 100px;
      // position: absolute;
      // left: 100px;
      // top: 0;
      margin: 0 auto;
    }
    .logo-img {
      display: inline-block;
      width: 60px;
      height: 60px;
      // background: url(https://goss.veer.com/creative/vcg/veer/800water/veer-165286732.jpg)
      //   no-repeat center center;
      background-color: #fff;
      background-image: url(../assets/images/hylogo.png);
      background-repeat: no-repeat;
      background-position: center center;
      background-size: 65px 65px;
      border-radius: 50%;
      vertical-align: bottom;
    }
    .logo-name {
      display: inline-block;
      color: #fff;
      font-size: 40px;
      font-weight: 530;
      line-height: 70px;
      margin-left: 10px;
    }
    .logo-text {
      color: #fff;
      font-size: 20px;
      line-height: 40px;
      width: 100%;
      span {
        margin-right: 30px;
      }
    }
  }
  .form {
    width: 414px;
    height: 312px;
    background-color: #fff;
    margin: 0 auto;
    padding: 20px;
    padding-top: 30px;
    position: absolute;
    right: 20%;
    top: 20%;
    border-radius: 5px;
    .formTitle {
      width: 100%;
      text-align: center;
      font-size: 20px;
      color: #333333;
      margin: 0 0 36px;
    }
    .loginButton {
      width: 268px;
      height: 40px;
    }
  }
  .foot {
    width: 100%;
    position: fixed;
    bottom: 60px;
    text-align: center;
    ul > li {
      line-height: 40px;
    }
    .name {
      color: #ffffff;
      display: inline-block;
      text-indent: 10px;
    }
  }
  // 更改elment form 表单的内容
  .el-form {
    .el-form-item {
      width: 268px;
      height: 40px;
      margin-left: 0;
      margin: 0 auto;
      margin-bottom: 30px;
      .el-form-item__content {
        margin-left: 0 !important;
      }
    }
    .el-form-item__label {
      width: 76px;
      text-align: left !important;
      font-weight: bold;
    }
  }
}
.slide-fade-enter-active {
  transition: all .3s ease;
}
.slide-fade-leave-active {
  transition: all .3s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}
.slide-fade-enter, .slide-fade-leave-to
/* .slide-fade-leave-active for below version 2.1.8 */ {
  transform: translateX(500px);
  opacity: 0;
}
</style>


