<template>
  <div class="about login-content">
    <div class="lc-block" :style="status=='1'?'z-index: 10;height: 250px;float:left;padding-top:30px;':'display: none'">
		<div class="n_logo">
			<img src="../../assets/logo.png" alt="">
		</div>
		<div style="width: 60%;margin: 0 auto">
			<!--<h1 class="lean">医脉达电商平台</h1>-->
			<div class="input-group m-b-20" style="margin-top: 40px;">
					<span class="input-group-addon">
						<i class="zmdi zmdi-account"></i>
					</span>
				<div class="fg-line">
				<input type="text" class="form-control" placeholder="手机号" v-model="login_username"/>
				</div>
			</div>
			<div class="input-group m-b-20">
					<span class="input-group-addon">
						<i class="zmdi zmdi-male"></i>
					</span>
				<div class="fg-line">
				<input type="password" class="form-control" placeholder="密码" v-model="login_password" @keyup.enter="login"/>
				</div>
			</div>
			<a href="javascript:;" class="btn btn-login btn-danger btn-float" @click="login">
				<i class="zmdi zmdi-arrow-forward"></i>
			</a>
			</div>
      <!-- <ul class="login-navigation">
        <li class="bgm-orange" @click="status = 2">忘记密码?</li>
      </ul> -->
    </div>

    <div class="lc-block" :style="status=='2'?'z-index: 10;height: 250px;':'display: none'">
      <h1 class="lean">密码找回</h1>
      <div class="input-group m-b-20" style="margin-top:70px;">
        <span class="input-group-addon"><i class="zmdi zmdi-email"></i></span>
        <div class="fg-line">
          <input type="text" class="form-control" v-model="email" placeholder="邮箱" />
        </div>
      </div>
      <a href="" class="btn btn-login btn-danger btn-float" id="getPassword">
        <i class="zmdi zmdi-arrow-forward"></i>
      </a>

      <ul class="login-navigation">
        <li class="bgm-green" @click="status = 1">返回登录</li>
      </ul>
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
				// let reg = new RegExp("^[a-z0-9A-Z]+[- | a-z0-9A-Z . _]+@([a-z0-9A-Z]+(-[a-z0-9A-Z]+)?\\.)+[a-z]{2,}$");
				let reg = /^[1][3,4,5,7,8][0-9]{9}$/;
				if(!this.login_username){
					this.$message.error("手机号不能为空")
					return ;
				}
				else if(!reg.test(this.login_username)){
					this.$message.error("请输入正确的手机号")
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
		}
	};
</script>
<style scoped>
  @import "./css/material-design-iconic-font/css/material-design-iconic-font.min.css";
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
