<template>
  <div class="about login-content">
	<div>
		<span style="position: absolute;font-size: 40px;color: rgb(255, 222, 0);left: 200px;top: 150px;">北京市公共租赁住房检查系统</span>
	<div>
		<span style="position: absolute;left: 200px;top: 210px;font-size: 18px;color: rgb(234, 55, 55);">BEIJING PUBLIC RENTAL HOUSING INSPECTION SYSTEM</span>
	</div>
	</div>
    <div class="lc-block" :style="status=='1'?'z-index: 10;height: 450px;left: 25%;':'display: none'">
      <h1 class="lean">
		  <img src="../../assets/logo.png" alt="" height="125px" width="125px">
	  </h1>
      <div class="input-group m-b-20" style="margin-top: 40px;">
    		<span class="input-group-addon">
    			<i class="iconfont" style="color:rgb(255, 222, 0);font-size: 20px;">&#xe681;</i>
    		</span>
        <div class="fg-line">
          <input type="text" class="form-control" placeholder="用户名" v-model="login_username"/>
        </div>
      </div>
      <div class="input-group m-b-20">
    		<span class="input-group-addon">
    			<i class="iconfont" style="color:rgb(255, 222, 0);font-size: 18px;">&#xe62a;</i>
    		</span>
        <div class="fg-line">
          <input type="password" class="form-control" placeholder="密码" v-model="login_password" @keyup.enter="login"/>
        </div>
      </div>
	  <div class="login" @click="login">
		登录
	  </div>
    </div>
  </div>
</template>
<script>
	import qs from 'qs';
	export default {
		name: "Login",
		data(){
			return {
				login_username:'',
				login_password:'',
				email:'',
				status: 1,
			}
    },
		methods:{
			login(){
				if(!this.login_username){
					this.$message.error("用户名不能为空")
					return ;
				}
				if(!this.login_password){
					this.$message.error("密码不能为空")
					return ;
				}
				this.$http({
					  method:'post',
						url:'/user/login/submit',
					  headers: { 'content-type': 'application/x-www-form-urlencoded' },
					  data: qs.stringify({'userName': this.login_username,'password': this.login_password})
        }).then(res => {
          let data = res.data;
					let resCode = data.resultCode.code;
					let resMsg = data.resultCode.message;
					if(resCode == 'REJECT'){
						let managerId = data.data.managerId;
						this.$message.error("您的账号申请被退回，请联系管理员")
					}else if(resCode == 'PWD_ERROR'){
						this.$message.error('账号密码错误，请重新填写');
					}else if(resCode == 'DISABLE'){
						this.$message.error('您的账号被禁用，已被禁止登陆');
					}else if(resCode == 'ACCOUNT_NULL'){
						this.$message.error('您输入的账号不存在，请重新输入');
					}else if(resCode == 'SUCCESS'){
            this.$utils.removeCookie('managerId');
						this.$utils.removeCookie('userName');
						this.$utils.removeCookie('roleId');
						this.$utils.removeCookie('imageUrl');
						let newData = data.data;
						this.$utils.setCookie('managerId',newData.managerId,300);
						localStorage.setItem('managerId',newData.managerId)
						this.$utils.setCookie('userName',newData.name,300);
						if(!!newData.type){
							this.$utils.setCookie('type',newData.type,300);
						}else{
							this.$utils.setCookie('type',-1,300);
						}
						this.$utils.setCookie('roleId',newData.roleString,300);
						this.$router.push({
							path:'/index'   //跳转的路径
            })
					}else{
						this.$message.error(resMsg);
					}
        }).catch(err => {//请求失败后的处理函数
					console.log(err)
				})
			},
			forget(){
				if(!this.email){
					this.$message.error("邮箱不能为空")
					return ;
				}
				var data = new Object();
				data.email = this.email;
				this.$http({
					method:'post',
					url:'/user/password/forget',
					headers: {'dataType':'json', 'content-type': 'application/json' },
					data: data
				}).then(res => {
					let rs = res.data;
          if(rs.resultCode.code != 'SUCCESS'){
	          this.$message.error(rs.resultCode.message);
          }else{
	          this.$message.success(rs.resultCode.message)
          }
				}).catch(err => {//请求失败后的处理函数
					console.log(err)
				})
      }
		}
	};
</script>
<style scoped>
  @import "./css/app.min.1.css";
  .about{
    font-weight: 400;
    padding-top: 65px;
    padding-bottom: 110px;
    position: relative;
  }
  .login-content{
    min-height: 100vh;
    display: flex;
  }
</style>
