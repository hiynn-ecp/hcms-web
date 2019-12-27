<template>
  <div class="tinymceContent">
    <el-row v-if="isEditor" style="margin-bottom:10px;">
        <el-col :span="10" style="margin-right:10px">
              <el-form style="margin-bottom:0">
                  <el-form-item label="产品名称:" label-width="80px">
                    <el-input v-model="formData.title"></el-input>
                  </el-form-item>
              </el-form>
        </el-col>
        <el-col :span="8">
            <el-button type="primary" class="custom" :loading="!isBtnTrue" @click="release">{{isEditor == 2?"创建": "修改"}}</el-button>
            <el-button class="custom" @click="goback">取消</el-button>
        </el-col>
    </el-row>
    <textarea :id="id" :content="content"></textarea>
    <!--<Editor :id="id" v-model="content" :init="init"></Editor>-->
    <!-- <div class="btns-wrap" v-if="contenteditable">
      <el-button type="primary" class="custom" @click="preview">预览</el-button>
      <el-button type="primary" class="custom" @click="release">{{infoData == 2?"保存": "修改"}}</el-button>
      <el-button class="custom" @click="goback">取消</el-button>
    </div> -->

     <!-- <div class="btns-wrap" v-else style="left:50%;">
      <el-button class="custom" @click="goback">返回</el-button>
    </div> -->
  </div>
</template>

<script>
import tinymce from "tinymce/tinymce";
import "tinymce/themes/silver/theme";
import 'tinymce/skins/ui/oxide/skin.css'
// import Editor from '@tinymce/tinymce-vue'

//这下面是tinymce的插件
import "tinymce/plugins/image";
import "tinymce/plugins/link";
import "tinymce/plugins/code";
import "tinymce/plugins/table";
import "tinymce/plugins/lists";
import "tinymce/plugins/contextmenu";
import "tinymce/plugins/wordcount";
import "tinymce/plugins/colorpicker";
import "tinymce/plugins/textcolor";
import "tinymce/plugins/preview";
import "tinymce/plugins/print";

//这里写你自己存放语言包的路径
import "../../../public/zh_CN.js";
export default {
  name: "tinymceText",
  props: {
    id: String,
    content: String,
    contenteditable: Boolean,
    infoData: Number,
    productForm: Object,
    isEditor: Number,
    isBtnTrue: Boolean
  },
  // components: {Editor},
  data() {
    return {
      init: {
        selector: "#" + this.id,
        language: "zh_CN",
        // skin_url: "skins/ui/oxide",
        // height: 668,
        statusbar: false, //禁止编辑器拉伸大小
        menubar:this.contenteditable ? 'file edit insert view format table':false,
        //插件
        plugins: this.contenteditable ? 
          "link lists image code table colorpicker textcolor contextmenu preview print" : false,
        //工具栏
        toolbar: this.contenteditable ? 
          "bold italic underline strikethrough | fontsizeselect | forecolor backcolor | alignleft aligncenter alignright alignjustify | bullist numlist | outdent indent blockquote | undo redo | link unlink image code | removeformat" : false,
        //隐藏tinymce的标识
        branding: false,
        init_instance_callback: function(editor) {
        },
        readonly:this.contenteditable ? 0 : 1
      },
      formData: {
        title: '',

      }
    };
  },
  methods: {
    preview() {
      tinymce.get(this.id).execCommand("mcePreview");
    },
    release() {
      this.formData.content = tinymce.activeEditor.getContent();
      this.$emit("release", this.formData);
    },
    goback() {
      this.$emit("goback");
    }
  },
  mounted() {
    tinymce.init(this.init);
    this.$nextTick(() => {
      if (!this.contenteditable) {
        tinymce.activeEditor.getBody().setAttribute("contenteditable", false);
      }
    });
  },
  watch: {
    productForm: {
      handler(newVal, oldVal) {
        this.formData = newVal;
      },
      deep: true
    },
    content(newVal, oldVal) {
        if (newVal) {
          tinymce.activeEditor.setContent(newVal);
        } else {
          tinymce.activeEditor.setContent("");
        }
    },
    contenteditable(newVal, oldVal) {
      this.init.menubar = this.contenteditable ? 'file edit insert view format table':false;
        //插件
        this.init.plugins = this.contenteditable ? "link lists image code table colorpicker textcolor contextmenu preview print" : false;
        this.init.toolbar = this.contenteditable ? 
          "bold italic underline strikethrough | fontsizeselect | forecolor backcolor | alignleft aligncenter alignright alignjustify | bullist numlist | outdent indent blockquote | undo redo | link unlink image code | removeformat" : false;
        this.init.readonly = this.contenteditable ? 0 : 1;
        tinymce.get(this.id).destroy();
        tinymce.init(this.init);
        this.$nextTick(() => {
          if (!this.contenteditable) {
            tinymce.activeEditor.getBody().setAttribute("contenteditable", false);
          }
        });
    }
  },
  beforeDestroy() {
    tinymce.get(this.id).destroy();
  }
};
</script>

<style lang="scss">
.tinymceContent{
  height: calc(100% - 88px)!important;
  width: 100%;
  .el-form-item{
    margin-bottom:20px;
  }
}
.tox-tinymce{
  height: 100%!important;
  border-radius: 4px;
}
.btns-wrap{
  margin-top: 5px;
  text-align: right;
  position: relative;
  top:20px; 
}
.tox .tox-edit-area{
  border:0!important;
}
.tox-tinymce{
  border-radius: 4px!important;
}
#tinymce_ifr{
  /* 滚动条 */
  *::-webkit-scrollbar-track {
    -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.2)!important;
    background-color: #ffffff!important;
    border-radius: 4px!important;
  }
  
  *::-webkit-scrollbar {
    width: 4px;height:4px!important;
    background-color: #ffffff!important;
    border-radius: 4px!important;
  }
  
  *::-webkit-scrollbar-thumb {
    border-radius: 5px!important;
    background: #dddee0!important;
  }
}

</style>
