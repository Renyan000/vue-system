<template>
    <div class="home">
        <el-row :gutter="20">
            <el-col :xs="24" :sm="24" :md="10" :lg="8" :xl="8">
                <div class="formSearch">
                    <label for="">轨迹名称</label>
                    <el-select v-model="trackId" placeholder="请选择">
                        <el-option
                            v-for="item in trackOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </div>
            </el-col>
            <!--<el-col :xs="24" :sm="24" :md="10" :lg="8" :xl="8">-->
                <!--<div class="formSearch">-->
                    <!--<label for="">用户邮箱</label>-->
                    <!--<el-input v-model="email" clearable></el-input>-->
                <!--</div>-->
            <!--</el-col>-->
            <el-col :xs="24" :sm="24" :md="24" :lg="8" :xl="8">
                <div class="formSearch">
                    <label for="">用户姓名</label>
                    <el-input v-model="name" clearable></el-input>
                </div>
            </el-col>
        </el-row>
        <el-row style="padding: 0 20px">
            <el-col :span="24" style="text-align: right">
                <el-button type="primary" size="small" icon="el-icon-search" @click="search()">搜索</el-button>
            </el-col>
        </el-row>
        <el-row style="padding: 0 20px">
            <el-scrollbar style="height: 100%">
                <el-table :data="tableData" style="width: 100%">
                    <!--<el-table-column prop="email" label="用户邮箱" width=""></el-table-column>-->
                    <el-table-column prop="name" label="用户姓名" width=""></el-table-column>
                    <el-table-column prop="trackName" label="轨迹名称" width=""> </el-table-column>
                    <el-table-column prop="createTime" label="时间" width=""> </el-table-column>
                </el-table>
            </el-scrollbar>
        </el-row>
        <el-row class="paggingBox">
            <el-col :span="24" style="text-align: right">
                <el-pagination @current-change="handleCurrentChange" :current-page.sync="currentPage" background layout="prev, pager, next" :total="total"></el-pagination>
            </el-col>
        </el-row>
    </div>
</template>

<script>
import {Row,Col,Select,Option,Input,Button,Table,TableColumn,Pagination} from 'element-ui';
export default {
    name: 'visitPathAudit',
    components: {
        Row,Col,Select,Option,Input,Button,Table,TableColumn,Pagination
    },
    data() {
        return {
            trackOptions: [{value: '',label: '请选择'}],
			trackId:'',
			currentPage:1,
			total:0,
			email:'',
			name:'',
			tableData:[],
        }
    },
    created(){
		this.loading();
		this.loadTable(this.currentPage);
	},
	methods: {
		//初始化列表
		loading(){
			this.trackOptions= [{value: '',label: '请选择'}],
			//加载轨迹名称
			this.$http({method:'post', url:'/userActionLog/queryTrack',data:{methodName:''}}).then((result) => {
				var data = result.data;
				if(data.successful && data.status == "200"){
					for(var i = 0;i < data.data.length;i++){
						this.trackOptions.push({value: data.data[i].id,label: data.data[i].name})
					}
				}else{
					this.$message.error('查询失败');
				}
			}).catch(function (error) {
				this.$message.error('查询失败');
			})
		},
		//加载表格
		loadTable(currentPage){
			let vm = this;
			//加载表格
			this.$http({method:'post', url:'/userActionLog/queryVisitTrail', 
					data:{
						pageNum:currentPage,
						pageSize:10,
						trackId:this.trackId,
						email:this.email,
						name:this.name,
					}
			}).then((result) => {
				var data = result.data;
				if(data.successful && data.status == "200"){
					this.currentPage = data.data.pageNum;
					this.total = parseInt(data.data.total);
					this.tableData = data.data.list;
				}else{
					this.$message.error('查询失败');
				}
			}).catch(function (error) {
				this.$message.error('查询失败');
			})
		},
		//分页触发事件
		handleCurrentChange(val){
			this.loadTable(val)
		},
		//搜索
		search(){
			this.currentPage=1;
			this.loadTable(1);
		}
	}
}
</script>

<style>
    .formSearch {
        margin-top: 15px;
        font-size: 14px;
    }
    .formSearch label {
        width: 120px;
        display: inline-block;
        text-align: right;
        padding-right: 15px;
        line-height: 35px;
        font-weight: 500;
    }
    .el-input {
        width: 180px;
    }
</style>