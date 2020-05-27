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
                    <label for="">邮箱</label>
                    <el-input v-model="email" clearable></el-input>
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
            <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">
                <div class="formSearch">
                    <label for="">审核状态</label>
                    <el-select v-model="userStatus" placeholder="请选择">
                        <el-option v-for="item in userStatusOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                </div>
            </el-col>
            <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">
                <div class="formSearch">
                    <label for="">是否可用</label>
                    <el-select v-model="inUse" placeholder="请选择">
                        <el-option key="" label="请选择" value=""></el-option>
                        <el-option key="1" label="是" value="1"></el-option>
                        <el-option key="0" label="否" value="0"></el-option>
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
                    <el-table-column fixed prop="name" label="姓名" width="120"></el-table-column>
                    <el-table-column prop="email" label="邮箱" width="220"></el-table-column>
                    <el-table-column prop="roleName" label="角色" width=""> </el-table-column>
                    <el-table-column prop="departmentName" label="所在部门" width="180"> </el-table-column>
                    <el-table-column prop="userStatusText" label="审核状态" width="80"> </el-table-column>
                    <el-table-column prop="inUseText" label="是否可用" width="80"> </el-table-column>
                    <el-table-column fixed="right" label="操作" width="230">
                        <template slot-scope="scope">
                            <el-button v-if="(scope.row.userStatus == '2'||scope.row.userStatus == '3')&&btnArr.indexOf('btn92')>=0" @click="handleClick(scope.row)" size="mini" id="btn92">修改</el-button>
                            <el-button v-if="(scope.row.userStatus == '2'||scope.row.userStatus == '3')&&btnArr.indexOf('btn93')>=0" size="mini" type="danger" @click="deleteUser(scope.row)" id="btn93">删除</el-button>
                            <el-button v-if="scope.row.userStatus == '2'&&btnArr.indexOf('btn94')>=0" size="mini" type="success" @click="auditUser(scope.row)" id="btn94">审核</el-button>
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
                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="userInfo.email" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="角色" prop="roles">
                    <el-select v-model="userInfo.roles" multiple :multiple-limit="limit" placeholder="请选择角色（可多选）">
                        <el-option v-for="item in roleIdOptions" :label="item.label" :value="item.value" :key="item.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="所在部门" prop="departmentIds">
                    <el-cascader v-model="userInfo.departmentIds" :options="departOptions" :show-all-levels="false"></el-cascader>
                </el-form-item>
                <el-form-item label="描述">
                    <el-input type="textarea" v-model="userInfo.desc"></el-input>
                </el-form-item>
                <el-form-item label="是否可用">
                    <el-radio v-model="userInfo.inUse" :label="1">是</el-radio>
                    <el-radio v-model="userInfo.inUse" :label="0">否</el-radio>
                </el-form-item>
                <el-form-item label="头像">
                    <el-upload
                    class="_avatar-uploader"
                    action="/address/uploadFiles"
                    :show-file-list="false"
                    :on-success="handleAvatarSuccess"
                    :before-upload="beforeAvatarUpload">
                    <img v-if="userInfo.imageUrl" :src="userInfo.imageUrl" class="avatar">
                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button size="small" @click="cancel('userInfo')">取 消</el-button>
                <el-button size="small" type="primary" @click="addUser('userInfo')">确 定</el-button>
            </div>
        </el-dialog>
        <el-dialog title="用户审核" :visible.sync="dialogFormAudit" :modal-append-to-body='false'>
            <el-form :model="auditInfo" ref="auditInfo" label-width="100px" >
                <el-form-item label="审核">
                    <el-select v-model="auditInfo.userStatus" placeholder="请选择">
                        <el-option key="1" label="通过" value="1"></el-option>
                        <el-option key="2" label="打回" value="3"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button size="small" @click="cancelConfirm('auditInfo')">取 消</el-button>
                <el-button size="small" type="primary" @click="auditConfirm('auditInfo')">确 定</el-button>
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
			limit: 3,
			roleIdOptions: [{value: '',label: '请选择'}],
			departOptions: [{value: '',label: '请选择', children: []}],
			userStatusOptions:[
				{value: '',label: '请选择'},
				{value: '1',label: '通过'},
				{value: '2',label: '待审核'},
				{value: '3',label: '打回'},
			],
			tableData3: [],
			dialogFormVisible: false,
			dialogFormAudit: false,
			currentPage:1,
			totalItemsCount:0,
			userInfo: {
				imageUrl:'',
				name: '',
				email: '',
				roles: [],
				departmentIds: [],
				desc: '',
				inUse: 1
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
				email: [
					{ required: true, message: '请输入邮箱', trigger: 'blur' }
				],
				roles: [
					{  type: 'array',required: true, message: '请选择角色', trigger: 'blur' }
				],
				departmentIds: [
					{  type: 'array',required: true, message: '请选择所在部门', trigger: 'blur' }
				]
			}
        }
    },
    created(){
		this.loading(1);
		this.loadRole();
		this.loadOrgan();
		this.btnControl();
	},
	methods: {
		handleAvatarSuccess(res, file) {
			this.userInfo.imageUrl = res.data;
		},
		beforeAvatarUpload(file) {
			return true;
		},
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
					var ids = parm.departmentIds[parm.departmentIds.length - 1];
					parm.departmentId = ids;
					if(!this.userInfo.managerId){//新增
						url = '/backstage/add';
					}else{//修改
						parm.managerId = this.userInfo.managerId;
						url = '/backstage/modify';
					}
					this.$http({method:'post', url:url, data:parm}).then((result) => {
						var data = result.data;
						if(data.successful && (data.status==200)){
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
			this.userInfo.imageUrl = "";
			this.userInfo.name = "";
			this.userInfo.email = "";
			this.userInfo.roles = [];
			this.userInfo.departmentIds = [];
			this.userInfo.desc = '';
			this.userInfo.inUse = 1;
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
			this.userInfo.imageUrl = row.imageUrl;
			this.userInfo.managerId = row.managerId;
			this.userInfo.name = row.name;
			this.userInfo.email = row.email;
			this.userInfo.roles = row.roles.map(Number);
			this.userInfo.departmentIds = JSON.parse(row.depart);
			this.userInfo.desc = row.desc;
			this.userInfo.inUse = row.inUse;
		},
		//加载所在单位
		loadOrgan(){
            var vm = this;
			this.$http({method:'post', url:'/depart/queryChildren', data:{}}).then((result) => {
				var data = result.data;
				if(data.successful && data.status == "200"){
					if(!!data.data){
						var departInfo = data.data;
						departInfo.value = departInfo.id;
						vm.departOptions = [data.data];
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
						if(this.tableData3[i].userStatus == "2"){
							this.tableData3[i].userStatusText = "待审核";
						}else if(this.tableData3[i].userStatus == "1"){
							this.tableData3[i].userStatusText = "通过";
						}else if(this.tableData3[i].userStatus == "3"){
							this.tableData3[i].userStatusText = "打回";
						}
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
		        }).catch(() => {
//			          this.$message({type: 'info',message: '已取消'});          
		        });
		},
		//审核
		auditUser(row){
			this.dialogFormAudit = true;
			this.auditInfo.managerId = row.managerId;
		},
		auditConfirm(formName){
			var vm = this;
			var data ={managerId:vm.auditInfo.managerId,userStatus:vm.auditInfo.userStatus,auditMessage:""}
			this.$http({method:'post', url:'/backstage/audit', data:data}).then((result) => {
				var data = result.data;
				if(data.successful && (data.status==200)){
					vm.$message('审核成功');
					vm.loading(1);
					vm.dialogFormAudit = false;
				}else{
					vm.$message.error('审核失败');
				}
			},(error) => {
				vm.$message.error('审核失败');
			});
		},
		cancelConfirm(formName){
			this.$refs[formName].resetFields();
			this.dialogFormAudit = false;
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