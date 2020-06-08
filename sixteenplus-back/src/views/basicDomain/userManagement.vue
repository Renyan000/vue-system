<template>
    <div class="home">
        <el-row :gutter="20">
            <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">
                <div class="formSearch">
                    <label for="">姓名</label>
                    <el-input v-model="name" clearable></el-input>
                </div>
            </el-col>
            <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">
                <div class="formSearch">
                    <label for="">角色</label>
                    <el-select v-model="roleId" placeholder="请选择">
                        <el-option v-for="item in roleIdOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                </div>
            </el-col>
        </el-row>
        <el-row style="padding: 0 20px">
            <el-col :span="24" style="text-align: right">
                <el-button type="primary" size="small" @click="searchUserBtn" icon="el-icon-search">搜索</el-button>
                <el-button type="primary" size="small" @click="addUserBtn" id="btn91" v-if="btnArr.indexOf('btn91')>=0">添加</el-button>
            </el-col>
        </el-row>
        <el-row style="padding: 0 20px">
            <el-scrollbar style="height: 100%">
                <el-table :data="tableData3" style="width: 100%">
                    <el-table-column fixed prop="name" label="姓名" width=""></el-table-column>
                    <el-table-column prop="roleName" label="角色" width=""> </el-table-column>
                    <el-table-column prop="inUseText" label="是否可用" width=""> </el-table-column>
					<el-table-column prop="departmentName" label="所在部门" width=""> </el-table-column>
                    <el-table-column fixed="right" label="操作" width="230">
                        <template slot-scope="scope">
                            <el-button v-if="btnArr.indexOf('btn92')>=0" @click="handleClick(scope.row)" size="mini" id="btn92">修改</el-button>
                            <el-button v-if="btnArr.indexOf('btn93')>=0" size="mini" type="danger" @click="deleteUser(scope.row)" id="btn93">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-scrollbar>
        </el-row>
        <el-row class="paggingBox">
            <el-pagination @current-change="handleCurrentChange" :current-page.sync="currentPage" background layout="prev, pager, next" :total="totalItemsCount"></el-pagination>
        </el-row>
        <el-dialog title="用户信息" :visible.sync="dialogFormVisible" :modal-append-to-body='false'>
            <el-form :model="userInfo" :rules="rules" ref="userInfo" label-width="100px" >
                <el-form-item label="姓名" prop="name">
                    <el-input v-model="userInfo.name" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="角色" prop="roles">
                    <el-select v-model="userInfo.roles" placeholder="请选择角色">
                        <el-option v-for="item in roleIdOptions" :label="item.label" :value="item.value" :key="item.id"></el-option>
                    </el-select>
                </el-form-item>
				<el-form-item label="所在部门" prop="departmentId">
					<el-select v-model="userInfo.departmentId" placeholder="请选择所在部门">
                        <el-option v-for="item in departOptions" :label="item.label" :value="item.value" :key="item.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="是否可用">
                    <el-radio v-model="userInfo.inUse" :label="1">是</el-radio>
                    <el-radio v-model="userInfo.inUse" :label="0">否</el-radio>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button size="small" @click="cancel('userInfo')">取 消</el-button>
                <el-button size="small" type="primary" @click="addUser('userInfo')">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import {Row,Col,Button,Form,FormItem,Input,Select,Option,Table,TableColumn,Pagination,Dialog,Upload,Radio,Scrollbar} from 'element-ui'
export default {
    name: 'userManagement',
    components: {
        Row,Col,Button,Form,FormItem,Input,Select,Option,Table,TableColumn,Pagination,Dialog,Upload,Radio,Scrollbar
    },
    data() {
        return {
            name:'',
			email:'',
			roleId:'',
			userStatus:'',
			inUse:"",
			btnArr:[],
			roleIdOptions: [{value: '',label: '请选择'}],
			departOptions: [],
			tableData3: [],
			roleArr: [],
			dialogFormVisible: false,
			dialogFormAudit: false,
			currentPage:1,
			totalItemsCount:0,
			userInfo: {
				name: '',
				roles: '',
				inUse: 1,
				departmentId: ''
			},
			auditInfo: {
				managerId: '',
				auditMessage: '',
				userStatus: '1'
			},
			rules: {
				name: [
					{ required: true, message: '请输入姓名', trigger: 'blur' }
				],
				roles: [
					{ required: true, message: '请选择角色', trigger: 'blur' }
				],
				departmentId: [
					{ required: true, message: '请选择所在部门', trigger: 'blur' }
				]
			}
        }
    },
    created(){
		this.loading(1);
		this.loadRole();
		this.btnControl();
		this.loadOrgan();
	},
	methods: {
		btnControl(){
			if(window.location.href.indexOf('?')>=0){
				let btnStr =window.location.href.split('?')[1].split('=')[1];
				console.log(btnStr)
				if(!!btnStr){
					this.btnArr = btnStr.split("-");
				}
			}
			
			// let btnStr = this.$route.query.btnStr;
			
		},
		addUser(formName){
			this.$refs[formName].validate((valid) => {
				if (valid) {
					var parm = this.userInfo;
					var url = "";
					this.roleArr.map((item,index) => {
						if (parm.roles == item.itemName) {
							parm.roles = item.id;
						}
					})
					parm.roles = (this.userInfo.roles+'').split(',')
					if(!this.userInfo.managerId){//新增
						url = '/backstage/add';
					}else{//修改
						parm.managerId = this.userInfo.managerId;
						url = '/backstage/modify';
					}
					this.$http({method:'post', url:url, data:parm}).then((result) => {
						var data = result.data;
						if(data.successful && (data.status==200)){
							this.$message.success(data.resultCode.message);
							this.loading(1);
							this.dialogFormVisible = false;
						}else{
							this.$message.error(data.resultCode.message);
						}
					},(error) => {
						this.$message.error('保存失败');
					});
				} else {
					console.log('error submit!!');
					return false;
				}
			});
		},
		//新增按钮
		addUserBtn(){
			delete this.userInfo.managerId;
			this.userInfo.name = "";
			this.userInfo.roles = '';
			this.userInfo.inUse = 1;
			this.userInfo.departmentId = '';
			this.dialogFormVisible = true;
		},
		//关闭新增
		cancel(formName){
			this.$refs[formName].resetFields();
			this.dialogFormVisible = false
		},
		//修改
		handleClick(row){
			this.dialogFormVisible = true;
			this.userInfo.managerId = row.managerId;
			this.userInfo.name = row.name;
			this.userInfo.roles = row.roleName;
			this.userInfo.departmentId = row.departmentId;
			this.userInfo.inUse = row.inUse;
		},
		//加载所在单位
		loadOrgan(){
			this.$http({method:'post', url:'/depart/queryChildren', data:{}}).then((result) => {
				var data = result.data;
				if(data.successful && data.status == "200"){
					if(!!data.data){
						this.departOptions = data.data.children;
					}
				}else{
					vm.$message.error('查询失败');
				}
			}).catch(function (error) {
				vm.$message.error('查询失败');
			})
		},
		//加载角色下拉
		loadRole(){
			var vm = this;
			this.$http({method:'post', url:'/role/getRoleInfo', data:{}}).then((result) => {
				var data = result.data;
				if(data.successful && (data.status==200)){
					this.roleArr = data.data;
					for(var i=0;i<data.data.length;i++){
						vm.roleIdOptions.push({value: data.data[i].id,label: data.data[i].itemName})
					}
				}else{
					vm.$message.error('查询失败');
				}
			},(error) => {
				vm.$message.error('查询失败');
			});
		},
		//初始化列表
		loading(pageNum){
			var vm = this;
			var parm={name:vm.name,email:vm.email,roleId:vm.roleId,userStatus:vm.userStatus,inUse:vm.inUse,pageSize:10,pageNumber:pageNum}
			this.$http({method:'post', url:'/backstage/managerList', data:parm}).then((result) => {
				var data = result.data;
				if(data.successful && (data.status==200)){
					this.tableData3 = data.data.list;
					this.totalItemsCount = data.data.total;
					this.currentPage = data.data.pageNum;
					for(var i=0;i<this.tableData3.length;i++){
						if(this.tableData3[i].inUse == "1"){
							this.tableData3[i].inUseText = "是";
						}else{
							this.tableData3[i].inUseText = "否";
						}
					}
				}else{
					vm.$message.error('查询失败');
				}
			},(error) => {
				vm.$message.error('查询失败');
			});
		},
		//分页触发事件
		handleCurrentChange(val){
			this.loading(val)
		},
		//删除
		deleteUser(row){
			var vm = this;
			this.$confirm('确定删除吗?', '提示', {
		          confirmButtonText: '确定',
		          cancelButtonText: '取消',
		          type: 'warning'
		        }).then(() => {
					this.$http.get('/backstage/remove?managerId='+row.managerId).then(function (result) {
						var data = result.data;
						if(result.data.successful){
							vm.$message('删除成功！')
							vm.loading(1);
						}else{
							vm.$message.error('删除失败');
						}
					}).catch(function (error) {
						vm.$message.error('删除失败');
				    });
		        }).catch(() => {});
		},
		//搜索按钮
		searchUserBtn(){
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
    .el-input__inner {
        -webkit-appearance: none;
        background-color: #fff;
        background-image: none;
        border-radius: 4px;
        border: 1px solid #dcdfe6;
        -webkit-box-sizing: border-box;
        box-sizing: border-box;
        color: #606266;
        display: inline-block;
        font-size: inherit;
        outline: 0;
        padding: 0 15px;
        -webkit-transition: border-color .2s cubic-bezier(.645,.045,.355,1);
        transition: border-color .2s cubic-bezier(.645,.045,.355,1);
        width: 100%;
    }
    .el-cascader-menu{
        min-width: 200px!important
    }
	._avatar-uploader .el-upload .avatar-uploader-icon {
		width: 50px;
		height: 50px;
		line-height: 50px;
	}
    ._avatar-uploader .el-upload {
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
    }
    ._avatar-uploader .el-upload:hover {
        border-color: #409EFF;
    }
    .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 50px;
        height: 50px;
        line-height: 50px;
        text-align: center;
    }
    .avatar {
        width: 50px;
        height: 50px;
        display: block;
    }
</style>