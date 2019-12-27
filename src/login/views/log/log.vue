<template>
    <div class="padding_box">
        <el-row class="art_top" v-if='getBtn("Log_Get_id")'>
            <el-col class="art_top_input">
                 <el-input placeholder="账户名称、用户姓名、产品" v-model="reqData.searchKey" clearable></el-input>
            </el-col>
            <el-col class="art_top_time">
                <el-date-picker
                    clearable
                    v-model="timeArr"
                    @change="pickerChange"
                    type="datetimerange"
                    range-separator="—"
                    :picker-options="pickerOptions"
                    value-format="yyyy/MM/dd HH:mm:ss"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期">
                </el-date-picker>
            </el-col>
            <el-col class="art_top_btn">
                <el-button type="primary" @click="getLogList(1)">查询</el-button>
            </el-col>
        </el-row>
        <el-row class="contentBox">
            <el-table :data="logData" border style="width: 100%" height="100%">
			    <el-table-column align="center" type="index" width="60" label="序号"></el-table-column>
                <el-table-column align="center" prop="userAccount" label="账户"></el-table-column>
                <el-table-column align="center" prop="userName" label="用户姓名"></el-table-column>
                <el-table-column align="center" prop="product" label="产品"></el-table-column>
                <el-table-column align="center" prop="operation" label="操作"></el-table-column>
                <el-table-column align="center" prop="ip" label="ip"></el-table-column>
                <el-table-column align="center" prop="attribution" label="网关"></el-table-column>
                <el-table-column align="center" prop="createTime" label="时间"></el-table-column>
            </el-table>
        </el-row>
        <div class="log_block">
                <el-pagination
                :hide-on-single-page="!logData"
                background
                :current-page="page"
                layout="prev, pager, next"
                :total="total"
                @current-change="handleCurrentChange"
                ></el-pagination>
            </div>
    </div>
</template>

<script>
import { url_log_list, } from "../../../common/requestUrl/requestUrl";
import {getLocal} from "../../../common/js/common";
export default {
    name: "index",
    data() {
        return {
            logData: [],
            total: 0,
            page: 1,
            timeArr: [],
            reqData: {
                searchKey: '',
                startTime: '',
                endTime: '',
            },
            pickerOptions: { //时间禁用状态
				disabledDate (time) {
				return time.getTime() > Date.now();
				}
			},
        };
    },
    created() {},
    mounted() {
        this.getLogList()
    },
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
        /**
         * 时间变化
         * @method pickerChange
         * */
        pickerChange (data) {
            if (data) {
				this.reqData.startTime = data[0];
				this.reqData.endTime = data[1]
			} else {
				this.reqData.startTime = '';
				this.reqData.endTime = ''
			}
        },
        /**
         * 日志列表
         * @method getLogList
         * @return void
         * */
        getLogList (page) {
            if (page) {
                this.page = page;
            }
            let data = {
                page: this.page,
                pageSize: 10
            }
            let newReq = this.reqData;
            for (let i in newReq) {
                if (newReq[i] !== '') {
                    data[i] = newReq[i];
                }
            }
            this.axios({
				method: 'get',
				url: url_log_list,
				params: data
			}).then(res => {
                this.logData = res.data.data.list;
                this.total = res.data.data.total
            })
        },
        /**
		 * 分页查询
		 * @method handleCurrentChange
		 * @param { Number } val page值
		 * @return void
		 * */
        handleCurrentChange (v) {
            this.page = v
            this.getLogList()
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
        .art_top {
            margin-bottom: 15px;
            .art_top_input {
                width: 300px !important;
                margin-right: 15px;
            }
            .art_top_time{
                width: 400px !important;
                margin-right: 15px;
            }
            .art_top_btn{
                width: 80px!important;
            }
        }
		.contentBox{
			height: calc(100% - 100px);
			overflow-y: auto;
		}
        
    }
    .log_block {
        text-align: center;
        margin-top: 20px;
    }
</style>


