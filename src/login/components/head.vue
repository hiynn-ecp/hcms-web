<template>
    <div id="top_box">
        <div class="duty_top_img">
            <!-- 产品名称图片 -->
            <img src="../assets/image/zbtitle.png" alt="">
        </div>
        <weatherTimer></weatherTimer>
    </div>
</template>

<script>
import weatherTimer from './weatherTimer.vue';
export default {
    name: 'headModule',
    components: {
        weatherTimer
    }
}
</script>

<style lang='scss' scoped>
// 头部样式
#top_box {
    position: relative;
    width: 1920px;
    height: 90px;
    z-index: 99;
    // 背景图片的底图阴影 可图片 可颜色
    // background: url("../assets/image/title_top_mask.png") 0 0/100% 90px no-repeat;
    &::after{
        content:"";
        position: absolute;
        left:0;
        top:0;
        width:100%;
        height:100%;
        z-index: -1;
        // 背景图片
        // background: url("../assets/image/title_top.png") no-repeat;
    }
    &>div{
        float:left;
    }
    .duty_top_img {
        position:absolute;
        left:50%;
        top:10px;
        transform: translateX(-50%);
    }
}
</style>