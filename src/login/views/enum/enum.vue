<template>
    <div class="padding_box">
        <el-row class="enum_top">
            <el-col class="enum_top_btn">
                <el-button v-if="getBtn('Enum_Post_insert')" type="primary" @click="handleClick(null, 2)">创建枚举</el-button>
            </el-col>
        </el-row>
        <el-row  class="contentBox">
            <el-table :data="enumData" border style="width: 100%" height="100%">
			    <el-table-column align="center" type="index" width="60" label="序号"></el-table-column>
                <el-table-column align="center" prop="id" label="枚举ID"></el-table-column>
                <el-table-column align="center" prop="value" label="枚举名称"></el-table-column>
                <el-table-column align="center" prop="key" label="枚举key值"></el-table-column>
                <el-table-column align="center" prop="type" label="枚举类型"></el-table-column>
                <el-table-column align="center" label="操作" width="220" v-if="getBtn('Enum_Get_id')||getBtn('Enum_Put_update')||getBtn('Enum_Delete')">
                <template slot-scope="scope">
                    <el-button v-if="getBtn('Enum_Get_id')" @click="handleClick(scope.row, 0)" size="small" type="success">详情</el-button>
                    <el-button v-if="getBtn('Enum_Put_update')" @click="handleClick(scope.row, 1)" size="small" type="primary">编辑</el-button>
                    <el-button v-if="getBtn('Enum_Delete')" @click="deleteClick(scope.row)" type="danger" size="small">删除</el-button>
                </template>
                </el-table-column>
            </el-table>
        </el-row>
        <div class="enum_block">
            <el-pagination
            :hide-on-single-page="!enumData"
            background
            layout="prev, pager, next"
            :total="total"
            @current-change="handleCurrentChange"
            ></el-pagination>
        </div>
        <el-dialog :close-on-click-modal="false" :before-close="cancelFun" :title="dialogTitle" :visible.sync="dialogVisible" width="30%">
            <div class="form">
                <el-form :rules="rules" ref="ruleForm" :model="enumForm" label-width="90px">
                    <el-form-item  label="名称:" :prop='infoData ?"value":""'>
                        <span v-if="infoData == 0">{{enumForm.value}}</span>
                        <el-input v-else v-model="enumForm.value"></el-input>
                    </el-form-item>
                    <el-form-item  label="key值:" :prop='infoData ?"key":""'>
                        <span v-if="infoData == 0">{{enumForm.key}}</span>
                        <el-input v-else v-model.number="enumForm.key"></el-input>
                    </el-form-item>
                    <el-form-item  label="类别:" :prop='infoData ?"type":""'>
                        <span v-if="infoData == 0">{{enumForm.type}}</span>
                        <el-input v-else v-model="enumForm.type"></el-input>
                    </el-form-item>
                    <el-form-item  label="描述:" :prop='infoData ?"description":""'>
                        <span v-if="infoData == 0">{{enumForm.description}}</span>
                        <el-input v-else v-model="enumForm.description"></el-input>
                    </el-form-item>
                </el-form>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="cancelFun">取 消</el-button>
                <el-button type="primary" @click="enumCreat" :loading="!isBtnTrue" v-if="infoData == 2">创 建</el-button>
                <el-button type="primary" @click="enumCreat" :loading="!isBtnTrue" v-if="infoData == 1">修改</el-button>
            </span>
        </el-dialog>
        <el-dialog
        :close-on-click-modal="false"
        title="提示"
        :visible.sync="deletBool"
        width="30%">
            <span>确定删除此条数据？</span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="deletBool = false">取 消</el-button>
                <el-button type="primary" @click="deletEnum">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import { url_enum,url_enum_list,url_enum_type } from "../../../common/requestUrl/requestUrl";
import {getLocal} from "../../../common/js/common";

export default {
    name: "index",
    data() {
        var keyNumber = (rule, value, callback) => {
            console.log(typeof(value) !== 'number',(value+'').length, value)
            if (value === '') {
            callback(new Error('请输入key值'));
            } else if (typeof(value) !== 'number' || (value+'').length>2) {
            callback(new Error('key值为数字类型并且不能大于100'));
            } else {
            callback();
            }
        };
        return {
            enumData: [],
            infoData: null,
            enumForm: {
                description: '',
                id: '',
                key: '',
                type: '',
                value: ''
            },
            dialogTitle: '',
            dialogVisible: false,
            total: 0,
            page: 1,
            deletBool: false,
            pId: '',
            enumInput: '',
            isBtnTrue: true,
            rules: {
				value: [
					{ required: true, message: "请输入名称", trigger: "blur" },
					{ min: 1, max: 200, message: "长度在 1 到 200 个字符", trigger: "blur" }
				],
				key: [
                    { validator: keyNumber, trigger: "blur" },
				],
				type: [
					{ required: true, message: "请输入类别", trigger: "blur" },
					{ min: 1, max: 200, message: "长度在 1 到 200 个字符", trigger: "blur" }
				],
				description: [{ required: true, message: "请输入描述", trigger: "blur" },
					{ min: 1, max: 200, message: "长度在 1 到 200 个字符", trigger: "blur" }
				]
			},
        };
    },
    created() {},
    mounted() {
        this.getEnumList()
    },
    methods: {
        cancelFun () {
            if (this.infoData) {
                this.$refs.ruleForm.resetFields();
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
         * 枚举类型查询
         * @method searchEnum
         * @return void
         * */
        searchEnum () {
            this.axios.get(`${url_enum_type}?type=${this.enumInput}`).then(res => {
                this.enumData = res.data.data.list
                this.total = res.data.data.total
            })
        },
        /**
         * 枚举列表
         * @method getEnumList
         * @return void
         * */
        getEnumList () {
            this.axios.get(`${url_enum_list}?page=${this.page}&pageSize=10`).then(res => {
                if (res) {
                    this.enumData = res.data.data.list;
                    this.total = res.data.data.total;
                }
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
            this.infoData = n
                if (this.infoData == 2) {
                     this.dialogTitle = '创建枚举'
                    this.enumForm = {
                        description: '',
                        key: '',
                        type: '',
                        value: ''
                    };
                } else {
                    this.enumInfo(r, n)
                   
                }
                this.dialogVisible = true;
        },
        enumInfo (r, n) {
            this.axios.get(`${url_enum}/${r.id}`).then(res => {
                if (this.infoData == 1) {
                    this.dialogTitle = '修改枚举'
                } else {
                    this.dialogTitle = '枚举详情'
                }
                res.data.data.key=Number(res.data.data.key)
                this.enumForm = JSON.parse(JSON.stringify(res.data.data));
            })
        },
        // 分页
        handleCurrentChange (v) {
            this.page = v
            this.getEnumList()
        },
        /**
         * 枚举新建/修改
         * @method enumCreat
         * @return void
         * */
        enumCreat () {
            this.$refs.ruleForm.validate((valid) => {
                if (valid) {
                    this.isBtnTrue = false;
                    this.axios({
                        method: this.infoData == 2 ? 'post' : 'put',
                        url: url_enum,
                        data: this.enumForm
                    }).then(res => {
                        if (res) {
                            this.$message({
                                type: 'success',
                                message: this.infoData == 2 ? '创建成功' : '修改成功'
                            });
                            this.getEnumList();
                            this.isBtnTrue = true;
                            this.$refs.ruleForm.resetFields();
                            this.dialogVisible = false;             
                        } else {
                            this.isBtnTrue = true;
                        }
                    }).catch((err) => {
                        this.isBtnTrue = true;
                    });
                }
            })
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
         * @method deleteClick
         * @param { Obj } r 枚举对象
         * @return void
         * */
        deletEnum () {
            this.axios.delete(`${url_enum}/${this.pId}`).then(res => {
                this.$message({
                    type: "success",
                    message: "删除成功"
                });
                this.deletBool = false
                this.getEnumList();
            });
        },
    }
};
</script>
<style lang="scss" scoped>
    .padding_box {
        position: absolute;
		height: 100%;
		width: 100%;
        padding: 20px;
        .enum_top {
            margin-bottom: 15px;
            .enum_top_input {
                width: 400px !important;
            }
            .enum_top_btn {
                width: 100px !important;
            }
        }
        .contentBox{
            height: calc(100% - 100px);
            overflow-y: auto;
        }
    }
    .enum_block {
        text-align: center;
        margin-top: 20px;
    }
</style>


