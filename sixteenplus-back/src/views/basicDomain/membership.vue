<template>
    <div class="home">
        <el-row style="padding: 0 20px">
            <el-col :span="24" style="text-align: right">
                <el-button type="primary" id="btn501" size="small" @click="addMenuBtn" v-if="btnArr.indexOf('btn501')>=0">添加</el-button>
            </el-col>
        </el-row>
        <el-row style="padding: 0 20px">
            <el-scrollbar style="height: 100%">
                <el-table :data="userList" style="width: 100%" :row-class-name="isFatherColor">
                    <el-table-column fixed prop="memberName" label="用户" width=""></el-table-column>
                    <el-table-column prop="managerName" label="上级领导" width=""></el-table-column>
                    <el-table-column fixed="right" label="操作" width="">
                        <template slot-scope="scope">
                            <el-button size="mini" id="btn3" @click="deleteMenu(scope.row)" type="danger">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-scrollbar>
        </el-row>
        <el-dialog title="添加" :visible.sync="dialogFormVisible" :modal-append-to-body='false'>
            <el-form :model="userInfo" ref="userInfo" label-width="100px" >
                <el-form-item label="用户" prop="managerId">
                    <el-select v-model="userInfo.managerId" filterable multiple placeholder="请选择">
                        <el-option 
                        v-for="(item,index) in userIdOptions"
                        :key="index"
                        :label="item.name"
                        :value="item.managerId">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="是否总经理">
                    <el-radio @click.native="clickitem(1)" v-model="userInfo.isManager" label="1">是</el-radio>
                    <el-radio @click.native="clickitem(0)" v-model="userInfo.isManager" label="0">否</el-radio>
                </el-form-item>
                <el-form-item label="上级领导">
                    <el-select v-model="userInfo.parentId" filterable placeholder="请选择" :disabled="isFather" autocomplete="off">
                        <el-option 
                        v-for="(item,index) in leaderOptions"
                        :key="index"
                        :label="item.memberName"
                        :value="item.managerId">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button size="small" type="primary" @click="submit('userInfo')">提 交</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import {Dialog,Form,FormItem,Select,Option,Radio,Table,TableColumn,Button,Row,Col,Scrollbar} from 'element-ui'
export default {
    name: 'membership',
    components: {
        Dialog,Form,FormItem,Select,Option,Radio,Table,TableColumn,Button,Row,Col,Scrollbar
    },
    data() {
        return {
            menuList: [],
            userList:[],
			dialogFormVisible: false,
            fatherOptions:[{id:"#",name:"#"}],
            userIdOptions: [{value: '',label: '请选择'}],
            leaderOptions: [{value: '',label: '请选择'}],
			isFather:true,
			btnArr:[],
			userInfo: {
                managerId:[],
				isManager: '1',
				parentId: ''
			}
		}
    },
    created(){
        this.loading();
		this.loadUser();
		this.loadLeader();
		this.btnControl();
	},
	methods: {
		btnControl(){
			// let btnStr = this.$route.query.btnStr;
			// if(!!btnStr){
			// 	this.btnArr = btnStr.split("-");
			// }
			if(window.location.href.indexOf('?')>=0){
				let btnStr =window.location.href.split('?')[1].split('=')[1];
				console.log(btnStr)
				if(!!btnStr){
					this.btnArr = btnStr.split("-");
				}
			}
		},
		isJSON(str) {
		    if (typeof str == 'string') {
		        try {
		            var obj=JSON.parse(str);
		            if(typeof obj == 'object' && obj ){
		                return true;
		            }else{
		                return false;
		            }

		        } catch(e) {
		            console.log('error：'+str+'!!!'+e);
		            return false;
		        }
		    }else{
		    	return false;
		    }
		},
		//新增成员
		submit(formName){
            var parm = this.userInfo;
			parm.managerId = parm.managerId.join(',');
			if(parm.parentId==''){
				parm.parentId = '';
			}
			this.$http({method:'post', url:'/team/add', data:parm}).then((result) => {
				var data = result.data;
				if(data.successful && (data.status==200)){
					this.loading();
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
		getFatherName(id){
			for(var i =0;i<this.menuList.length;i++){
				if(id == this.menuList[i].id){
					return this.menuList[i].name
				}
			}
        },
        //加载用户下拉
		loadUser(){
            var vm = this;
            var parm={name:"",email:"",roleId:"",userStatus:"",inUse:"",pageSize:100000,pageNumber:1}
			this.$http({method:'post', url:'/backstage/managerList', data:parm}).then((result) => {
                var data = result.data;
				if(data.successful && (data.status==200)){
                    vm.userIdOptions = data.data.list;
				}else{
					vm.$message.error('查询失败');
				}
			},(error) => {
				vm.$message.error('查询失败');
			});
		},
		// 上级领导下拉
		loadLeader() {
			var vm = this;
            var parm={parentId:""}
			this.$http({method:'post', url:'/team/getMemberList', data:parm}).then((result) => {
                var data = result.data;
				if(data.successful && (data.status==200)){
					vm.leaderOptions = data.data;
				}else{
					vm.$message.error('查询失败');
				}
			},(error) => {
				vm.$message.error('查询失败');
			});
		},
		//初始化列表
		loading(){
			var vm = this;
			var parm={parentId:""}
			this.$http({method:'post', url:'/team/getMemberList', data:parm}).then((result) => {
				var data = result.data;
				if(data.successful && (data.status==200)){
                    this.userList = data.data;
				}else{
					vm.$message.error('查询失败');
				}
			},(error) => {
				vm.$message.error('查询失败');
			});
		},
		//删除
		deleteMenu(row){
			var vm = this;
			this.$confirm('确定删除吗?', '提示', {
		          confirmButtonText: '确定',
		          cancelButtonText: '取消',
		          type: 'warning'
		        }).then(() => {
		        	var parm = {id:row.id};
					this.$http.get('/team/delete?id='+ parm.id).then((result) => {
						var data = result.data;
						if(data.successful && (data.status==200)){
							vm.$message.success('删除成功');
							vm.loading();
						}
					},(error) => {
						vm.$message.error('删除失败');
					});
		        }).catch(() => {
//			          this.$message({type: 'info',message: '已取消'});          
		        });
			
		},
		//是否父节点点击
		clickitem(id){
			if(id == "1"){
				this.isFather=true;
				this.userInfo.parentId = ""
			}else{
				this.isFather=false;
			}
		},
		isFatherColor(row){
			if(row.row.parentId == "0"){
				return "father-row"
			}
		},
		addMenuBtn(formName){
			this.loadLeader();
            this.userInfo.managerId = [];
			this.userInfo.isManager = "1";
            this.userInfo.parentId = "";
            
			delete this.userInfo.id;
			this.dialogFormVisible = true;
		}
	}
}
</script>
<style>

</style>