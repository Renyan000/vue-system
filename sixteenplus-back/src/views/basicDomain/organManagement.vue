<template>
    <div class="home">
        <el-row style="padding: 0 20px;height:100%;">
            <el-col :span="4" style="height: 100%;">
                <el-scrollbar style="height: 100%">
                    <el-menu :default-active="selectKey" @open="handleOpen" @close="handleClose" class="el-menu-vertical-demo">
                        <el-submenu :index="organTree.id+''">
                            <template slot="title">
                                <i class="el-icon-location"></i>
                                <span>{{organTree.departmentName}}</span>
                            </template>
                            <el-submenu v-for="secondItem in organTree.departmentList" :index="secondItem.id+''" :key="secondItem.id">
                                <template slot="title">{{secondItem.departmentName}}</template>
                                <el-menu-item  v-for="thirdItem in secondItem.departmentList" :index="thirdItem.id+''" :key="thirdItem.id">{{thirdItem.departmentName}}</el-menu-item>
                            </el-submenu>
                        </el-submenu>
                    </el-menu>
                </el-scrollbar>
            </el-col>
            <el-col :span="20" >
                <div style="text-align: right">
                    <el-button type="primary" size="small" @click="addOrgan">添加</el-button>
                </div>
                <el-scrollbar style="height: 100%">
                    <el-table :data="tableData3" style="width: 100%">
                        <el-table-column fixed prop="departmentName" label="组织名称" width=""></el-table-column>
                        <el-table-column prop="orderNum" label="排序" width="100"></el-table-column>
                        <el-table-column prop="fatherNodeName" label="上级组织" width=""> </el-table-column>
                        <el-table-column prop="isNodeText" label="是否叶子节点" width="140"> </el-table-column>
                        <el-table-column fixed="right" label="操作" width="150">
                            <template slot-scope="scope">
                                <el-button @click="editOrgan(scope.row)" size="mini">修改</el-button>
                                <el-button size="mini" type="danger" @click="deleteOrgan(scope.row)">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-scrollbar>
            </el-col>
        </el-row>
        <el-dialog title="部门信息" :visible.sync="dialogFormVisible" width="500px" :modal-append-to-body='false'>
            <el-form :model="userInfo" :rules="rules" ref="userInfo" label-width="150px" >
                <el-form-item label="组织机构名称" prop="departmentName">
                    <el-input v-model="userInfo.departmentName" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="组织机构描述" prop="departmentDesc">
                    <el-input v-model="userInfo.departmentDesc" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="是否叶子节点">
                    <el-radio v-model="userInfo.isNode" :label="1">是</el-radio>
                    <el-radio v-model="userInfo.isNode" :label="0">否</el-radio>
                </el-form-item>
                <el-form-item label="排序号" prop="orderNum">
                    <el-input type="number" v-model="userInfo.orderNum"></el-input>
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
import {Dialog,Form,FormItem,Input,Row,Col,Button,Table,TableColumn,Scrollbar,Menu,Submenu} from 'element-ui'
export default {
    name: 'organManagement',
    components: {
        Dialog,Form,FormItem,Input,Row,Col,Button,Table,TableColumn,Scrollbar,Menu,Submenu
    },
    data() {
        return {
            tableData3: [],
			organTree: {departmentName:"华夏航空",},
			dialogFormVisible: false,
			fatherNodeId:"1",
			fatherNodeName:"",
			selectKey:"1",
			userInfo: {
				departmentName: '',
				departmentDesc: '',
				orderNum: '',
				isNode: '1',
				parentId:'1',
				isUse: '1'
			},
			rules: {
				departmentName: [
					{ required: true, message: '请输入组织机构名称', trigger: 'blur' }
				],
				departmentDesc: [
					{ required: true, message: '请输入组织机构描述', trigger: 'blur' }
				],
				orderNum: [
					{ required: true, message: '请输入排序号', trigger: 'blur' }
				],
			}
        }
    },
    created(){
		this.loadingOrgan();
	},
	methods: {
		addUser(formName){
			this.$refs[formName].validate((valid) => {
				if (valid) {
					let vm = this;
					var url ="";
					var data ={};
					vm.userInfo.parentId = vm.selectKey;
					data =vm.userInfo;
					//新增
					if(!vm.userInfo.id){
						url ="/depart/add";
						delete vm.userInfo.id;
					}else{//修改
						url ="/depart/modify";
					}
					this.$http({method:'post', url:url, data:data}).then((result) => {
						this.dialogFormVisible = false;
						this.$message.success('保存成功！');
						this.loadingOrgan();
						this.loading(this.selectKey);
						this.dialogFormVisible = false;
					}).catch(function (error) {
						this.$message.error('保存失败');
					})
				} else {
					console.log('error submit!!');
					return false;
				}
			});
		},
		cancel(formName){
			this.$refs[formName].resetFields();
			this.dialogFormVisible = false
		},
		//初始化列表
		loading(id){
			this.$http({method:'post', url:'/depart/queryById', data:{id:id}}).then((result) => {
				var data = result.data;
				if(data.successful && data.status == "200"){
					this.tableData3 = data.data;
					for(var i =0;i < data.data.length;i++){
						this.tableData3[i].fatherNodeName = this.fatherNodeName;
						if(data.data[i].isNode == "1"){
							this.tableData3[i].isNodeText = "是";
						}else{
							this.tableData3[i].isNodeText = "否";
						}
					}
				}else{
					this.$message.error('查询失败');
				}
			}).catch(function (error) {
				this.$message.error('查询失败');
			})
		},
		//初始化组织树
		loadingOrgan(){
			this.$http({method:'post', url:'/depart/query', data:{}}).then((result) => {
				var data = result.data;
				if(data.successful && data.status == "200"){
					if(!!data.data){
						this.organTree = data.data;
						if(this.selectKey == "1"){
							this.loading(data.data.id);
						}else{
							this.loading(this.selectKey);
						}
					}
				}else{
					this.$message.error('查询失败');
				}
			}).catch(function (error) {
				this.$message.error('查询失败');
			})
		},
		//编辑按钮
		editOrgan(row){
			this.dialogFormVisible = true;
			this.userInfo.departmentName = row.departmentName;
			this.userInfo.orderNum = row.orderNum;
			this.userInfo.departmentDesc = row.departmentDesc;
			this.userInfo.isNode = row.isNode;
			this.userInfo.id = row.id;
		},
		//删除按钮
		deleteOrgan(row){
			this.$confirm('确定删除吗?', '提示', {
		          confirmButtonText: '确定',
		          cancelButtonText: '取消',
		          type: 'warning'
		        }).then(() => {
					this.$http({method:'post', url:'/depart/remove', data:{id:row.id}}).then((result) => {
						var data = result.data;
						if(data.successful && data.status == "200"){
							this.$message.success('删除成功');
							this.loadingOrgan();
							this.loading(this.selectKey);
						}else{
							this.$message.error('删除失败');
						}
					},(error) => {
						this.$message.error('删除失败');
					});
		        }).catch(() => {
//			          this.$message({type: 'info',message: '已取消'});          
		        });
		},
		//根据organId获取组织下的二级组织
		handleOpen(key, keyPath){
			this.loading(key);
			this.selectKey = key;
		},
		handleClose(key, keyPath){
			this.loading(key);
			this.selectKey = key;
		},
		//新增
		addOrgan(){
			this.dialogFormVisible = true;
			this.userInfo.departmentName = "";
			this.userInfo.orderNum = "";
			this.userInfo.departmentDesc = "";
			this.userInfo.isNode = 1;
			delete this.userInfo.id;
		}
	}
}
</script>
<style>
	.el-col-20 {
		height: 100%;
	}
</style>