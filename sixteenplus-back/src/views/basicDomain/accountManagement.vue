<template>
    <div class="home">
        <el-row style="padding: 0 20px 0 0;height:100%;">
            <el-col :span="5" style="height: 100%;">
                <el-scrollbar style="height: 100%">
                    <el-menu default-active="2" @open="handleOpen" @close="handleClose" class="el-menu-vertical-demo">
                        <el-submenu index="1" >
                            <template slot="title"  >
                                <i class="el-icon-location"></i>
                                <span>{{rootDepart}}</span>
                            </template>
                            <el-submenu v-for="item in departmentList" :index="item.id+''" :key="item.id">
                                <template slot="title" :index="item.id+''">{{item.departmentName}}</template>
                                <el-menu-item v-for="departList in item.departmentList" :index="departList.id+''" :key="departList.id" @click.native="getOrgin(departList.id)">{{departList.departmentName}}</el-menu-item>
                            </el-submenu>
                        </el-submenu>
                    </el-menu>
                </el-scrollbar>
            </el-col>
            <el-col :span="19" >
                <!--<div class="formSearch">
                    <label for="">账号</label>
                    <el-input v-model="email" clearable></el-input>
                </div>-->
                <!--<div style="text-align: right">
                    <el-button type="primary" size="small" @click="search" icon="el-icon-search">搜索</el-button>
                </div>-->
                <el-scrollbar style="height: 100%">
                    <el-table :data="tableData3" style="width: 100%;">
                        <!--<el-table-column fixed prop="email" label="登录邮箱" width=""></el-table-column>-->
                        <el-table-column prop="name" label="姓名" width=""></el-table-column>
                        <el-table-column prop="inUseText" label="是否停用" width=""> </el-table-column>
                    </el-table>
                    <el-row class="paggingBox">
                        <el-pagination @current-change="handleCurrentChange" :current-page.sync="currentPage" background layout="prev, pager, next" :total="total"></el-pagination>
                    </el-row>
                </el-scrollbar>
            </el-col>
        </el-row>
    </div>
</template>
<script>
import {Row,Col,Scrollbar,Table,TableColumn,Input,Button,Menu,Submenu,MenuItem} from 'element-ui'
export default {
  name: 'accountManagement',
  components: {
    Row,Col,Scrollbar,Table,TableColumn,Input,Button,Menu,Submenu,MenuItem
  },
  data() {
    return {
      tableData3: [],
      departmentList:[],
      selectKey:'1',
      rootDepart:'',
      departmentId:'',
      dialogFormVisible: false,
      currentPage:1,
      total:0,
      email: ''
    }
  },
  created(){
    this.loading();
	},
	methods: {
		cancel(formName){
			this.$refs[formName].resetFields();
			this.dialogFormVisible = false
		},
		//初始化列表
		loading(){
			let vm = this;
			//加载左侧组织机构
			this.$http({method:'post', url:'/depart/query', data:{}}).then((result) => {
				var data = result.data;
				if(data.successful && data.status == "200"){
					this.rootDepart = data.data.departmentName;
					this.departmentList = data.data.departmentList;
					this.loadTable(this.selectKey,1)
				}else{
					this.$message.error('查询失败');
				}
			},(error) => {
				this.$message.error('查询失败');
			});
		},
		loadTable(departmentId,currentPage){
			let vm = this;
			//加载表格
			this.$http({method:'post', url:'/depart/userDepart', data:{email:vm.email,departmentId:departmentId,pageNumber:currentPage,pageSize:10}}).then((result) => {
				var data = result.data;
				if(data.successful && data.status == "200"){
					this.tableData3 = data.data.list;
					this.currentPage = data.data.pageNum;
					this.total = parseInt(data.data.total);
					for(var i =0;i< this.tableData3.length;i++){
						if(this.tableData3[i].inUse == "1"){
							this.tableData3[i].inUseText = "否";
						}else{
							this.tableData3[i].inUseText = "是";
						}
					}
				}else{
					this.$message.error('查询失败');
				}
			}).catch(function (error) {
				this.$message.error('查询失败');
			})
		},
		//分页触发事件
		handleCurrentChange(val){
			this.loadTable(this.selectKey,val)
		},
		//根据organId获取组织下的二级组织
		getOrgin(key){
			this.loadTable(key,1);
			this.selectKey = key;
		},
		handleOpen(key, keyPath){
			console.log(key)
			this.loadTable(key,1);
			this.selectKey = key;
		},
		handleClose(key, keyPath){
			this.loadTable(key,1);
			this.selectKey = key;
		},
		//搜索按钮
		search(){
			this.loadTable(this.selectKey,1)
		}
	}
}
</script>

<style>
 	.home {
		 height: 100%;
	}
	.el-table td, .el-table th {
		text-align: left;
	}
	.paggingBox {
		padding-top: 20px;
	}
  .el-input {
      width: 180px;
  }
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
	.el-col-19 {
		height:100%;
	}
</style>