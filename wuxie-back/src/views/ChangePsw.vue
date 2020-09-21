<template>
  <div id="app">
    <el-form :model="userInfo" :rules="rules" ref="userInfo" label-width="100px" >
      <el-form-item label="原密码" prop="oldPassword">
        <el-input v-model="userInfo.oldPassword" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="新密码" prop="newPassword">
        <el-input v-model="userInfo.newPassword" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="确认密码" prop="configPassword">
        <el-input v-model="userInfo.configPassword" autocomplete="off"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" style="padding-left: 100px" class="dialog-footer">
      <el-button size="small" type="primary" @click="addUser('userInfo')">提交</el-button>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import {Dropdown,DropdownMenu,DropdownItem,Menu,Submenu,MenuItem} from 'element-ui'
export default {
  name: 'changePsw',
	components: {
		Dropdown,DropdownMenu,DropdownItem,Menu,Submenu,MenuItem
	},
	data: function() {
		return {
			userInfo: {
				oldPassword: '',
				newPassword: '',
				configPassword: ''
			},
			rules: {
				oldPassword: [
					{ required: true, message: '请输入原密码', trigger: 'blur' }
				],
				newPassword: [
					{ required: true, message: '请输入新密码', trigger: 'blur' }
				],
				configPassword: [
					{ required: true, message: '请输入确认密码', trigger: 'blur' }
				]
			}
    }
	},
	created(){
	},
	methods: {
		addUser(formName){
			var vm = this;
			this.$refs[formName].validate((valid) => {
				if (valid) {
					var parm = {id:this.$utils.getCookie("managerId"),newPassword:vm.userInfo.newPassword,oldPassword:vm.userInfo.oldPassword}
					this.$http({method:'post', url:'/user/password/update', data:parm}).then((result) => {
						var data = result.data;
						if(data.successful && (data.status==200)){
							this.$message.success("密码修改成功，请重新登录！");
							setTimeout(() => {
								this.$router.push({
                  path:'/',
									name: 'login',
									component: () => import(`@/views/login/Login.vue`)
                })
							}, 2000);
						}else{
							this.$message.error(data.resultCode.message);
						}
					},(error) => {
						this.$message.error('修改失败');
					});
				}
			});
		}
	}
}
</script>
<style scoped lang="sass">

</style>