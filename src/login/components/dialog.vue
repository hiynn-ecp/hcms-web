<template>
    <div id="dialog" v-if="dialogVisible">
        <el-dialog :close-on-click-modal="false" title="" :modal-append-to-body="false" :visible.sync="dialogVisible" :close-on-click-modall="false">
            <p class="dialog_title">标题</p>
            <div class="dialogContent">
                内容
            </div>
        </el-dialog>
    </div>
</template>

<script>
export default {
    name: 'dialog',
    data() {
        return {
            dialogVisible: false
        }
    },
    methods: {

    }
}
</script>

<style lang='scss' scoped>
/*基于elementui弹框样式上调整样式，符合产品2.0弹框样式*/
#dialog {
    .el-dialog {
        width: 929px !important;
        height: 633px !important;
        background: url('../assets/images/dialogBg.png') no-repeat;
        margin: 0 auto 0!important;
        margin-top: 14px!important;
        position: relative;
    }

    .el-dialog__body {
        height: 100%;
    }

    .dialog_title {
        color: #fff;
        font-size: 24px;
        position: absolute;
        top: -6px;
        left: 2px;
        width: 274px;
        font-weight: 800;
    }

    .dialogContent {
        padding: 10px;
    }

    .el-dialog__headerbtn {
        background: url('../assets/images/close.png') no-repeat;
        width: 18px;
        height: 18px;
        top: 44px;
        z-index: 9;
    }

    .el-dialog__headerbtn i {
        display: none;
    }
}
</style>
