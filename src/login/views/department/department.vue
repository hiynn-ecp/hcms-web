<template>
  <div class="menu department">
    <div class="ment_row">
        <div :span="4" class="ment_box" v-for="(item,i) in userInfoList" :key="i">
            <div @click="imgBtn(i)">
                <img :src="item.picture ? baseUrl + '/img/' + item.picture : userBg" alt="">
            </div>
            <h6>{{item.userName}} - {{item.phone}}</h6>
        </div>
    </div>
    <el-dialog
        :visible.sync="dialogVisible"
        top="12vh"
        width="70%">
        <!-- <el-row class="imgMaxBox" style="text-align: center;">
            <img :src="showIndex" alt="">
        </el-row> -->
        <div class="swiper-container">
            <div class="swiper-wrapper">
                <div class="swiper-slide" v-for="(item,i) in userInfoList" :key="i">
                    <p>{{item.userName}}</p>
                    <img :src="item.picture ? baseUrl + '/img/' + item.picture : userBg" alt="图片无法加载">
                </div>
            </div>
            <div class="swiper-pagination"></div>
            <div class="swiper-button-prev"></div><!--左箭头。如果放置在swiper-container外面，需要自定义样式。-->
            <div class="swiper-button-next"></div><!--右箭头。如果放置在swiper-container外面，需要自定义样式。-->
        </div>
    </el-dialog>
  </div>
</template>
<script>
import Swiper from 'swiper';
import { url_userList } from "../../../common/requestUrl/requestUrl";
import userBg from '../../assets/images/userBg.jpg';
export default {
    data() {
        return {
            dialogVisible: false,
            userInfoList: [],
            baseUrl: window.baseURL,
            showIndex: '',
            userBg: userBg
        };
    },
    mounted() {
        this.getUser()
    },
    watch: {
        dialogVisible (newVal, oldVal) {
            if (newVal) {
                this.$nextTick(() => {
                    setTimeout(() => {
                        var mySwiper = new Swiper('.swiper-container', {
                            initialSlide: this.showIndex,
                            loop : true,
                            pagination: {
                                el: '.swiper-pagination',
                                dynamicBullets: true,
                                clickable :true,
                            },
                            navigation: {
                                nextEl: '.swiper-button-next',
                                prevEl: '.swiper-button-prev',
                            }
                        })
                    }, 0)
                })                
            }
        }
    },
    methods: {
         /**
         * 获取user列表
         * @method getUser
         * @return void
         * */
        getUser () {
            this.axios.get(`${url_userList}`).then(res => {
                console.log(res)
                this.userInfoList = res.data.data.list;
            })
        },
        /**
         * 获取user列表
         * @method imgBtn
         * @param { String } p img路径
         * @return void
         * */
        imgBtn(index) {
            this.showIndex = index;
            this.dialogVisible = true;
        }
    },

};
</script>
<style lang="scss">
.menu {
    position: absolute;
    height: calc(100% - 40px);
    width: 100%;
    margin-top: 20px;
    padding: 0 20px;
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
.ment_row{
    overflow-y: auto;
    height: 100%;
}
.ment_box {
    padding: 0 6px 10px 6px;
    text-align: center;
    width: 20%;
    float: left;
    div{
        cursor: pointer;
        width: 100%;
        height: 198px;
        border: 1px solid #e9e9e9;
    }
    img {
        cursor: pointer;
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
    h6 {
        color: rgb(153, 153, 153);
        line-height: 40px;
        font-size: 18px;
        font-weight: normal;
        border-bottom: 3px solid #ebeff6;
    }
}
.ment_box:hover {
    img {
        opacity: 0.6;
    }
}
.imgMaxBox{
    height: 600px;
    img{
        object-fit: contain;
        max-width: 100%;
        max-height: 600px;
    }
}
.swiper-container{
    padding-top: 40px;
    height: 660px;
    box-shadow: border-box;
    text-align: center;
    --swiper-pagination-color: #00ff33!important;/* 两种都可以 */
    --swiper-navigation-color: #fff;
    img{
        object-fit: contain;
        width: 100%;
        height: 620px;
    }
    p{
        position: absolute;
        top:-40px;
        text-align: center;
        left: 50%;
        transform: translateX(-50%);
        color: #fff;
        line-height: 40px;
        font-size: 16px;
        opacity: .8;
    }
    .swiper-slide{
        width: 100%!important;
    }
}
.swiper-pagination-bullet-active{
    opacity: 1;
    background: #00ff33!important;
}
.swiper-pagination-bullet{
    background: #fff;
    opacity: .7;
}
.department {
    .el-dialog__header{
        display: none;
    }
    .el-dialog__body{
        background: #333;
        border: 1px solid #000;
        padding-top: 0;
        padding-bottom: 20px
    }
}
</style>