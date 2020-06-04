<template>
  <div class="home">
    <el-row :gutter="20">
      <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">
        <div class="formSearch">
          <label for="">项目名称</label>
          <el-input v-model="projectName" clearable></el-input>
        </div>
      </el-col>
    </el-row>
    <el-row style="padding: 0 20px">
      <el-col :span="24" style="text-align: right">
        <el-button type="primary" id="btn1" size="small" @click="addMenuBtn">添加</el-button>
        <el-button type="primary" size="small" icon="el-icon-search" @click="searchList">搜索</el-button>
      </el-col>
    </el-row>
    <el-row style="padding: 0 20px">
      <el-scrollbar style="height: 100%">
        <el-table :data="menuList" style="width: 100%" v-loading="loadingIcon">
          <el-table-column prop="projectName" label="项目名称" width=""></el-table-column>
          <el-table-column prop="companyNames" label="单位名称" width=""></el-table-column>
          <el-table-column fixed="right" label="操作" width="200">
            <template slot-scope="scope">
              <el-button size="mini" id="btn2" @click="editMenu(scope.row)">修改</el-button>
              <el-button size="mini" id="btn3" @click="deleteMenu(scope.row)" type="danger">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-scrollbar>
    </el-row>
    <el-dialog title="添加" :visible.sync="dialogFormVisible" :modal-append-to-body='false' width="500px">
      <el-form :model="userInfo" ref="userInfo" label-width="100px" >
        <el-form-item label="项目名称">
          <el-input v-model="userInfo.projectName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="单位">
          <el-select v-model="userInfo.companyIds" multiple clearable placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.id"
              :label="item.companyName"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="cancel('userInfo')" >取 消</el-button>
        <el-button size="small" type="primary" @click="addMenu('userInfo')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
// @ is an alias to /src
import {Row,Col,Button,Form,FormItem,Input,Radio,Select,Option} from 'element-ui'
export default {
  name: 'projectManagement',
	components: {
		Row,Col,Button,Form,FormItem,Input,Radio,Select,Option
	},
	data: function() {
		return {
			loadingIcon: true,
			menuList: [],
			dialogFormVisible: false,
			projectName: '',
			options: [],
			userInfo: {
				projectName: '',
				companyIds: []
			}
		}
	},
	created(){
		this.loadingList();
	},
	methods: {
		//新增
		addMenu(formName){
			let parm = this.userInfo;
			let url = "";
      if(!this.userInfo.projectName){
        this.$message.error('请填写项目名称！');
        return false;
      }
      if(!this.userInfo.companyIds || this.userInfo.companyIds.length<=0){
        this.$message.error('请选择单位！');
        return false;
      }
			this.userInfo.companyIds = this.userInfo.companyIds.toString();
			if(!this.userInfo.id){//新增
				url = '/project/add';
			}else{
				parm.id = this.userInfo.id;
				url = '/project/update';
			}
			this.$http({method:'post', url:url, data:parm}).then((result) => {
				let data = result.data;
				if(data.successful && (data.status==200)){
					this.loading(1);
					this.$message.success("保存成功！");
					this.dialogFormVisible = false;
				}else{
					this.$message.error(data.resultCode.message);
				}
			},(error) => {
				this.$message.error('查询失败');
			});
			this.dialogFormVisible = false;
		},
		//清空表单并关闭
		cancel(formName){
			this.userInfo = {
				projectName: '',
					companyIds: []
			};
			this.dialogFormVisible = false;
		},
		//加载公司下拉
		loadingList(){
			let parm = {
				pageSize: 1000,
				companyName: '',
				pageNumber: 1
			}
			this.$http({method:'post', url:'/company/getListPage', data:parm}).then((result) => {
				let data = result.data;
				if(data.successful && (data.status==200)){
					this.options = data.data.list;
					this.loading(1)
				}else{
					this.$message.error('查询失败');
				}
			},(error) => {
				this.$message.error('查询失败');
			});
		},
		//初始化列表
		loading(pageNum){
			let parm = {
				pageSize: 10,
				projectName: this.projectName,
				pageNumber: pageNum
			}
			this.$http({method:'post', url:'/project/getListPage', data:parm}).then((result) => {
				let data = result.data;
				this.loadingIcon = false;
				if(data.successful && (data.status==200)){
          let menuList = data.data.list;
          for(let i = 0;i < menuList.length;i++){
          	let item = menuList[i];
	          item.companyNames = '';
	          for(let comp of item.listCompany){
		          if(item.companyNames){
			          item.companyNames += ','
		          }
		          item.companyNames += comp.companyName
	          }
          }
          this.menuList = menuList;
				}else{
					this.$message.error('查询失败');
				}
			},(error) => {
				this.$message.error('查询失败');
			});
		},
		//删除
		deleteMenu(row){
			let vm = this;
			this.$confirm('确定删除吗?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			}).then(() => {
				let parm = {id:row.id};
				this.$http({method:'post', url:'/project/del', data:parm}).then((result) => {
					let data = result.data;
					if(data.successful && (data.status==200)){
						this.$message.success('删除成功');
						this.loading(1);
					}
				},(error) => {
					this.$message.error('删除失败');
				});
			}).catch(() => {
//			          this.$message({type: 'info',message: '已取消'});
			});

		},
		//修改
		editMenu(row){
			this.dialogFormVisible = true;
			this.userInfo.id = row.id;
			this.userInfo.projectName = row.projectName;
			this.userInfo.companyIds = row.companyIds.split(',');
		},
		addMenuBtn(formName){
			this.userInfo.projectName = "";
			this.userInfo.companyIds = [];
			this.dialogFormVisible = true;
		},
		searchList(){
			this.loading(1)
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
  .el-scrollbar__wrap {
    overflow-x: hidden;
  }
  .el-scrollbar__view{
    height: 100%;
  }
  .iframeBox{
    width: 100%;
    height: calc(100% - 40px);
    overflow-x: hidden;
  }
  .el-badge__content.is-fixed{
    top: 20px;
  }
  .redPoit{
    position: relative;
    display: inline-block;
    height: 10px;
    width: 10px;
    background-color: red;
    border-radius: 10px;
    top: -8px;
    left: -11px;
  }
  .el-scrollbar__wrap{
    overflow-x: hidden;
  }
  .el-menu-item, .el-submenu__title,.el-submenu .el-menu-item{
    height: 40px;
    line-height: 40px;
    font-size: 14px
  }
  .el-submenu .el-icon-menu{
    margin-right: 10px;
  }
  .el-scrollbar__wrap {
	  margin-bottom: 10px !important;
  }
</style>