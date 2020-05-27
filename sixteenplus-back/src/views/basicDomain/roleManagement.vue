<template>
    <div class="home">
        <el-row style="padding: 0 20px">
            <el-col :span="24" style="text-align: right">
                <el-button type="primary" size="small" id="btn71" @click="addBtn" v-if="btnArr.indexOf('btn71')>=0">添加</el-button>
            </el-col>
        </el-row>
        <el-row style="padding: 0 20px">
            <el-scrollbar style="height: 100%">
                <el-table :data="tableData3" style="width: 100%">
                    <el-table-column fixed prop="itemName" label="角色名称" width=""></el-table-column>
                    <el-table-column prop="createTime" label="创建时间" width="200"></el-table-column>
                    <el-table-column fixed="right" label="操作" width="120">
                        <template slot-scope="scope">
                            <el-button @click="handleClick(scope.row)" size="mini">修改</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-scrollbar>
        </el-row>
        <el-dialog title="用户添加" :visible.sync="dialogFormVisible" width="500px" :modal-append-to-body='false'>
            <el-form :model="roleInfo" :rules="rules" ref="roleInfo" label-width="100px" >
                <el-form-item label="角色名称" prop="name">
                    <el-input v-model="roleInfo.name" autocomplete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button size="small" @click="cancel('roleInfo')">取 消</el-button>
                <el-button size="small" type="primary" @click="addUser('roleInfo')">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import {Row,Col,Button,Form,FormItem,Input} from 'element-ui'
export default {
  name:'roleManagement',
  components: {
    Row,Col,Button,Form,FormItem,Input
  },
  data() {
    return {
      tableData3: [],
      dialogFormVisible: false,
      btnArr:[],
      roleInfo: {
        name: '',
        id:''
      },
      rules: {
        name: [
          { required: true, message: '请输入角色名称', trigger: 'blur' }
        ]
      }
    }
  },
  created(){
    this.loading();
    this.btnControl();
  },
  methods: {
    btnControl(){
	    // let btnStr = this.$route.query.btnStr;
      // if(!!btnStr){
      //   this.btnArr = btnStr.split("-");
      // }
      if(window.location.href.indexOf('?')>=0){
				let btnStr =window.location.href.split('?')[1].split('=')[1];
				console.log(btnStr)
				if(!!btnStr){
					this.btnArr = btnStr.split("-");
				}
			}
    },
    addUser(formName){
      this.$refs[formName].validate((valid) => {
        var vm = this;
        if (valid) {
          var url ="";
          var data ={};
          //新增
          if(!vm.roleInfo.id){
            url ="/role/addRoleInfo";
            data ={itemName: vm.roleInfo.name};
          }else{//修改
            url ="/role/updateRoleInfo";
            data ={itemName: vm.roleInfo.name,id: vm.roleInfo.id};
          }
          this.$http({method:'post', url:url, data:data}).then((result) => {
            var data = result.data;
            if(data.successful && (data.status==200)){
              this.loading();
              this.dialogFormVisible = false;
            }else{
              this.$message.error(data.resultCode.message);
            }
          },(error) => {
            this.$message.error('保存失败');
          });
        } else {
          this.$message.error('保存失败');
          return false;
        }
      });
    },
    //取消按钮
    cancel(formName){
      this.$refs[formName].resetFields();
      this.dialogFormVisible = false
    },
    addBtn(){
      this.roleInfo.name = "";
      this.roleInfo.id = "";
      this.dialogFormVisible = true;
    },
    //初始化列表
    loading(){
      this.$http({method:'post', url:'/role/getRoleInfo', data:{}}).then((result) => {
        var data = result.data;
        if(data.successful && (data.status==200)){
          if(data.data){
            this.tableData3 = data.data;
          }
        }else{
          this.$message.error('查询失败');
        }
      },(error) => {
        this.$message.error('查询失败');
      });
    },
    //修改按钮事件
    handleClick(row){
      this.dialogFormVisible = true;
      this.roleInfo.name = row.itemName
      this.roleInfo.id = row.id
    }
  }
}
</script>
<style>
	.el-table td, .el-table th {
		text-align: left !important;
	}
</style>