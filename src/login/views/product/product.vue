<template>
    <div class="productBox">
        <el-row class="contentBox" :gutter="40">
            <el-col :span="8" class="product_list">
                <div class="product_title">平台产品<i v-if='getBtn("PlatformProduct_Post")' @click='handleClick(null, 2)' class="el-icon-circle-plus addIcon"></i></div>
                <ul class="product_data">
                    <li v-for="(item,i) in productData" :key='i' @click="showBtn(item)">
                        <div><i class="el-icon-document"></i><span >{{item.title}}</span></div>
                        <div class="product_icon">
                            <i class="el-icon-edit-outline" v-if='getBtn("PlatformProduct_Put")' @click.stop='handleClick(item, 1)' style="color:#0071e6;"></i>
                            <i class="el-icon-circle-close" v-if='getBtn("PlatformProduct_Delete")' @click.stop="deleteClick(item)" style="color:#f00"></i>
                        </div>
                    </li>
                </ul>
            </el-col>
            <el-col :span="16" class="product_content">
                <tinymce-text
                v-show='infoData'
                id="tinymce"
                :isEditor="infoData"
                :productForm="productForm"
                :content="productForm.content"
                :contenteditable="infoData?true:false"
                :isBtnTrue="isBtnTrue"
                @release="productCreat"
                @goback="clearEditor"
                ></tinymce-text>
                <div v-html="productForm.content" v-show='getBtn("Product_info_view") && !infoData' class="showHtml" style="border:1px solid #ccc;"></div>
            </el-col>
        </el-row>
        <el-dialog
        :close-on-click-modal="false"
        title="提示"
        :visible.sync="deletBool"
        width="30%">
            <span>确定删除此条数据？</span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="deletBool = false">取 消</el-button>
                <el-button type="primary" @click="deletProduct">确 定</el-button>
            </span>
        </el-dialog>
        <div class="enum_block">
            <el-pagination
            :hide-on-single-page="!productData"
            background
            layout="prev, pager, next"
            :total="total"
            @current-change="handleCurrentChange"
            ></el-pagination>
        </div>
    </div>
</template>

<script>
import { url_product,url_product_list } from "../../../common/requestUrl/requestUrl";
import {getLocal} from "../../../common/js/common";
import tinymceText from "../../components/tinymce";
export default {
    name: "index",
    data() {
        return {
            productData: [],
            infoData: null,
            productForm: {
                title: '',
                content: '',
            },
            dialogTitle: '',
            dialogVisible: false,
            total: 0,
            page: 1,
            deletBool: false,
            pId: '',
            productInput: '',
            showData: '', // 当前展示数据
            isBtnTrue: true
        };
    },
    components: {
        tinymceText
    },
    created() {},
    mounted() {
        this.getProductList()
    },
    methods: {
        clearEditor () {
            if (this.infoData == 2) {
                this.productForm = this.showData;
            }
            this.infoData = 0;
        },
        showBtn (item) {
                this.productForm = item;
                this.infoData = 0;
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
         * 枚举列表
         * @method getProductList
         * @return void
         * */
        getProductList () {
            this.axios.get(`${url_product_list}?page=${this.page}&pageSize=10`).then(res => {
                this.productData = res.data.data.list;
                this.total = res.data.data.total;
                this.productForm = this.productData[0];
            })
        },
        /**
         * 枚举操作触发按钮
         * @method handleClick
         * @param { Obj } r 枚举对象
         * @param { Number } n 修改/新建/详情判断值
         * @return void
         * */
        handleClick (r, n) {
            this.infoData = n;
            if (this.infoData == 2) {
                this.dialogTitle = '创建枚举'
                this.showData = this.productForm;
                this.productForm = {
                    title: '',
                    content: '',
                };
            } else {
                this.productInfo(r, n)
                
            }
            this.dialogVisible = true;
        },
        productInfo (r, n) {
            this.axios.get(`${url_product}/${r.id}`).then(res => {
                this.dialogTitle = '修改枚举'
                this.productForm = JSON.parse(JSON.stringify(res.data.data));
            })
        },
        // 分页
        handleCurrentChange (v) {
            this.page = v
            this.getProductList()
        },
        /**
         * 枚举新建/修改
         * @method productCreat
         * @return void
         * */
        productCreat (contentData) {
            if (this.isBtnTrue) {
                this.productForm = contentData;
                if (!this.productForm.title) {
                    this.$message({
                            type: 'error',
                            message:'请填写产品名称'
                        });
                } else {
                    this.isBtnTrue = false;
                    let fd = new FormData();
                    if (this.infoData == 1) {
                        fd.append("id", this.productForm.id);
                    }
                    
                    fd.append("title", this.productForm.title);
                    fd.append("content", this.productForm.content);
                    this.axios({
                        method: this.infoData == 2 ? 'post' : 'put',
                        url: url_product,
                        data: fd
                    }).then(res => {
                        if (res) {
                            this.dialogVisible = false;
                            this.$message({
                                type: 'success',
                                message: this.infoData == 2 ? '创建成功' : '修改成功'
                            });
                            this.productForm = {
                                title: '',
                                content: '',
                            };
                            this.infoData = 0;
                            this.getProductList()                    
                        } else {
                            this.productForm = this.productData[0];
                        }
                        this.isBtnTrue = true;
                    }).catch((err) => {
                        this.isBtnTrue = true;
                    });
                }
            }
        },
        /**
         * 删除枚举触发按钮
         * @method deleteClick
         * @param { Obj } r 枚举对象
         * @return void
         * */
        deleteClick (r) {
            this.pId = r.id
            this.deletBool = true
        },
        /**
         * 删除枚举触发按钮
         * @method deletProduct
         * @param { Obj } r 枚举对象
         * @return void
         * */
        deletProduct () {
            this.axios.delete(`${url_product}/${this.pId}`).then(res => {
                this.$message({
                    type: "success",
                    message: "删除成功"
                });
                this.deletBool = false;
                this.getProductList();
            });
        },
    }
};
</script>
<style lang="scss" scoped>
    .productBox {
        position: absolute;
		height: 100%;
		width: 100%;
        padding: 20px;
        .enum_block {
			text-align: center;
		}
		.enum_top{
			margin-bottom: 15px;
		}
		.contentBox{
			height: calc(100% - 95px);
            overflow-y: auto;
            padding: 0 50px;
            margin-bottom: 70px;
            .product_title{
                width: 100%;
                color: #fff;
                text-align: center;
                background: rgb(217, 84, 89);
                line-height: 50px;
                height: 50px;
                border-radius: 4px;
                font-size: 20px;
                letter-spacing: 10px;
                margin-bottom: 20px;
                position: relative;
                .addIcon{
                    position: absolute;
                    right: 6px;
                    line-height: 50px;
                    font-size: 24px;
                    cursor: pointer;
                }
            }
            .product_list{
                height: 100%;
            }
            .product_data{
                max-height: calc(100% - 70px);
                border: 1px solid #ccc;
                border-radius: 4px;
                li{
                    padding: 0 5px 0 10px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    font-size: 18px;
                    line-height: 50px;
                    color: rgb(153, 153, 153);
                    border-bottom: 1px solid #ccc;
                    cursor: pointer;
                    &:last-child{
                        border-bottom: 0;
                    }
                    &:hover{
                        color: rgb(255, 255, 255);
                        background: rgb(73, 204, 178) !important;
                        i{
                            display: initial;
                            // color: #fff!important;
                        }
                    }
                    span{
                        margin-left: 3px;
                    }
                }
                .product_icon{
                    i{
                        margin-left: 10px;
                        font-size: 22px;
                        display: none;
                        position: relative;
                        z-index: 10;
                    }
                }
            }
            .product_content{
                height: 100%;
                padding: 0!important;
            }
            .showHtml{
                border:1px solid #ccc;
                height: calc(100% - 88px);
                border-radius: 4px;
                box-sizing: border-box;
                padding: 16px;
                overflow-y: auto;
            }
		}
    }
 
</style>


