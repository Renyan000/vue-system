<template>
  <div class="home">
    <el-row :gutter="20">
      <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">
        <div class="formSearch">
          <label for="">单位名称</label>
          <el-input v-model="companyName" clearable></el-input>
        </div>
      </el-col>
    </el-row>
    <el-row style="padding: 0 20px">
      <el-col :span="24" style="text-align: right">
        <el-button type="primary" size="small" @click="addMenuBtn">添加</el-button>
        <el-button type="primary" size="small" icon="el-icon-search" @click="searchList">搜索</el-button>
      </el-col>
    </el-row>
    <el-row style="padding: 0 20px">
      <el-scrollbar style="height: 100%">
        <el-table :data="menuList" style="width: 100%" v-loading="loadingIcon">
          <el-table-column prop="companyName" label="单位名称" width=""></el-table-column>
		      <el-table-column prop="groupName" label="检查组" width=""></el-table-column>
          <el-table-column fixed="right" label="操作" width="200">
            <template slot-scope="scope">
              <el-button size="mini" id="btn2" @click="editMenu(scope.row)">修改</el-button>
              <el-button size="mini" id="btn3" @click="deleteMenu(scope.row)" type="danger">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-scrollbar>
    </el-row>
    <el-row class="paggingBox">
      <el-col :span="24">
        <el-pagination @current-change="handleCurrentChange" :current-page.sync="currentPage" background layout="prev, pager, next" :total="totalItemsCount"></el-pagination>
      </el-col>
    </el-row>
    <el-dialog title="添加" :visible.sync="dialogFormVisible" :modal-append-to-body='false' width="500px">
      <el-form :model="userInfo" ref="userInfo" label-width="100px" >
        <el-form-item label="单位名称">
          <el-input v-model="userInfo.companyName" autocomplete="off"></el-input>
        </el-form-item>
		<el-form-item label="检查组">
          <el-select v-model="userInfo.managerIds" clearable placeholder="请选择">
            <el-option
              v-for="item in groupOption"
              :key="item.id"
              :label="item.departmentName"
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
  name: 'companyManagement',
	components: {
		Row,Col,Button,Form,FormItem,Input,Radio,Select,Option
	},
	data: function() {
		return {
			loadingIcon: true,
			menuList: [],
			dialogFormVisible: false,
			companyName: '',
			groupName: '',
			groupOption: [],
			userInfo: {
				companyName: '',
				managerIds: '',
				groupName: ''
			},
			currentPage:1,
			totalItemsCount:0,
		}
	},
	created(){
		this.loading(1);
		this.loadingGroup();
	},
	methods: {
		// 组查询
		loadingGroup() {
			this.$http({method:'post',url:'/depart/query',data:{}}).then((result) => {
				if (result.data.status == 200) {
					this.groupOption = result.data.data.departmentList;
				}
			})
		},
		//新增
		addMenu(formName){
			let parm = this.userInfo;
			let url = "";
			if(!this.userInfo.companyName){
				this.$message.error('请填写单位名称！');
				return false;
			}
			if(!this.userInfo.managerIds){
				this.$message.error('请选择检查组！');
				return false;
			}
			this.groupOption.map((item,index) => {
				if (this.userInfo.managerIds == item.id) {
					this.userInfo.groupName = item.departmentName
				}
			})
			if(!this.userInfo.id){//新增
				url = '/company/add';
			}else{
				parm.id = this.userInfo.id;
				url = '/company/update';
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
			this.$refs[formName].resetFields();
			this.dialogFormVisible = false;
		},
		//初始化列表
		loading(pageNum){
			let parm = {
				pageSize: 10,
				companyName: this.companyName,
				pageNumber: pageNum
			}
			this.$http({method:'post', url:'/company/getListPage', data:parm}).then((result) => {
				let data = result.data;
				this.loadingIcon = false;
				if(data.successful && (data.status==200)){
          this.menuList = data.data.list;
					this.totalItemsCount = data.data.total;
					this.currentPage = data.data.pageNum;
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
				this.$http({method:'post', url:'/company/del', data:parm}).then((result) => {
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
			this.userInfo.companyName = row.companyName;
			this.userInfo.managerIds = item.managerIds;
			this.userInfo.groupName = item.groupName;
		},
		addMenuBtn(formName){
			this.userInfo = {
				companyName: '',
				managerIds: ''
      }
			this.dialogFormVisible = true;
		},
		searchList(){
			this.loading(1)
    },
		//分页触发事件
		handleCurrentChange(val){
			this.loading(val)
		},
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