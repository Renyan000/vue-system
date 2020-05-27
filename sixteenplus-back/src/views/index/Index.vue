<template>
  <div class="home">
    <header class="main-header">
      <router-link class="logo" @click.native="getTittle('首页','')" to="/index" >后台管理系统</router-link>
      <!--<div class="tips"></div>-->
      <div class="userInfo">
        <!-- <i class="el-icon-bell" style="cursor: pointer;" @click="showPage('./todoList.html','待办列表','')"></i> -->
        <!-- <i class="redPoit"></i> -->
		    <a href="http://customer.xiaomaiyouxuan.com/chat/customer" target="_blank">
            <i class="el-icon-phone-outline" style="margin-right: 20px;font-size: 34px;vertical-align: middle;color: #fff;"></i>
        </a>
        <el-dropdown style="color:#fff">
          <span style="cursor:pointer;">{{userName}}<i class="el-icon-arrow-down el-icon--right" style="margin-right: 15px"></i></span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>
              <router-link @click.native="getTittle('首页','修改密码')" to="/changePsw" >修改密码</router-link>
            </el-dropdown-item>
            <el-dropdown-item @click.native="exitLog">退出</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </header>
    <aside class="menuBox">
      <el-scrollbar style="height: 100%">
        <el-menu default-active="2" class="el-menu-vertical-demo" style="margin-bottom: 30px" background-color="transparent" text-color="#000000" active-text-color="#00bcd4">
          <el-submenu v-for="(item,key) in menuList" :index="key+''" v-if="item.type == '1'">
            <template slot="title">
              <i :class="menuIconList[key]"></i>
              <span>{{item.name}}</span>
            </template>
            <el-menu-item v-for="(childrenItem,childkey) in item.children" :index="key+'-'+childkey" v-if="childrenItem.type == '1'">
              <router-link @click.native="getTittle(item.name,childrenItem.name,childrenItem.buttonId)" :to="childrenItem.path" >
                  {{childrenItem.name}}
              </router-link>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-scrollbar>
    </aside>
    <section class="main">
      <div class="main-top">
        <span>{{tittle}}</span>
      </div>
      <div class="iframeBox">
        <router-view/>
      </div>
    </section>
  </div>
</template>

<script>
	// @ is an alias to /src
	import {Dropdown,DropdownMenu,DropdownItem,Menu,Submenu,MenuItem} from 'element-ui'
	export default {
		name: 'home',
		components: {
			Dropdown,DropdownMenu,DropdownItem,Menu,Submenu,MenuItem
		},
		data: function() {
			return {
				childUrl: "",
				tittle:"首页",
				userName:"",
				managerId:"",
				dataList:[],
				menuList:[],
				menuIconList: ['el-icon-location','el-icon-menu',
					'el-icon-document','el-icon-setting',
					'el-icon-date','el-icon-news','el-icon-view',
					'el-icon-printer','el-icon-share'],
                checkNum: 0,
				newListNum: 0,
				checkListNum: 0,
				reviewAgainListNum: 0,
				reviewCheckNum: 0,
			}
		},
		created(){
			this.loadMenu();
			this.userName = this.$utils.getCookie("userName");
		},
		methods: {
			/*获取页面横条的文字*/
			getTittle(str1,str2,buttonId){
				if(!!str2){
					this.tittle = str1+"-"+str2;
				}else{
					this.tittle = str1;
				}
			},
			//初始化菜单
			loadMenu(){
				let vm = this;
				vm.managerId = this.$utils.getCookie("managerId");
				this.$http({method:'post', url:'/menu/query', data:{managerId:vm.managerId}}).then((result) => {
					let data = result.data;
					if(data.successful && (data.status==200)){
						if(data.data){
							let lists = data.data;
							this.dataList = lists;
							let menuList = [];
							for(let i=0;i<lists.length;i++){
								if(lists[i].parentId == "0" ){
									menuList.push(lists[i])
								}
							}
							let routers = [];
							for(let j=0;j<menuList.length;j++){
								for(let i=0;i<lists.length;i++){
									if(lists[i].parentId == menuList[j].id ){
										/*给持证审核添加待办审核*/
										console.log(lists[i].path)
										if(lists[i].url.indexOf('certificationAudit') >= 0){
											lists[i].checkNum = this.checkNum;
                                        }
										if(!menuList[j].children){
											menuList[j].children = [];
										}
										let name = lists[i].url.split('.html')[0].split('/')[1]
										let path = '/'+lists[i].url.split('.html')[0];
										let comp = 'views/'+lists[i].url.split('.html')[0]+'.vue'
										let buttonId = lists[i].buttonId;
										let btnStr = '';
										/*将按钮控制放入页面路径中*/
										if(!!buttonId){
											let buttonIds = JSON.parse(buttonId);
											for(let j =0;j < buttonIds.length;j++){
												// if(buttonIds[j].type == "1"){
													if(!!btnStr){
														btnStr += "-"
													}
													btnStr += buttonIds[j].id;
												// }
											}
											path += '?btnStr='+btnStr
										}
										lists[i].path = path;
                                        /*this.$store.commit('SET_ROUTEINFO', routers)*/
										menuList[j].children.push(lists[i])
									}
								}
							}
							this.menuList = menuList;
                            console.log(menuList)
						}
					}else{
						this.$message.error('查询失败');
					}
				},(error) => {
					this.$message.error('查询失败');
				});
			},
			//退出
			exitLog(){
				let vm = this;
				this.$http({method:'post', url:'/user/loginOut', data:{managerId:vm.managerId}}).then((result) => {
					let data = result.data;
					if(data.successful && data.status == "200"){
						this.$utils.removeCookie('managerId');
						this.$utils.removeCookie('userName');
						this.$utils.removeCookie('roleId');
						this.$utils.removeCookie('imageUrl');
						this.$router.push({
							'path':'/'
						})
					}
				},(error) => {
					this.$message.error('退出失败');
				});
			},
		}
	}
</script>
<style scoped>
  @import "index.css";
</style>
<style>
    .el-scrollbar__wrap {
        overflow-x: hidden;
    }

    .el-scrollbar__view {
        height: 100%;
    }

    .iframeBox {
        width: 100%;
        height: calc(100% - 40px);
        overflow-x: hidden;
        background: #ffffff;
        padding-top: 20px;
    }

    .el-badge__content.is-fixed {
        top: 20px;
    }

    .redPoit {
        position: relative;
        display: inline-block;
        height: 10px;
        width: 10px;
        background-color: red;
        border-radius: 10px;
        top: -8px;
        left: -11px;
    }

    .el-scrollbar__wrap {
        overflow-x: hidden;
    }

    .el-menu-item, .el-submenu__title, .el-submenu .el-menu-item {
        height: 40px;
        line-height: 40px;
        font-size: 14px
    }

    body {
        background-color: #ffffff;
    }

    .el-submenu .el-icon-menu {
        margin-right: 10px;
    }

    .el-menu-item a {
        color: #2c3e50;
        transition: border-color .3s, background-color .3s, color .3s;
        display: inline-block;
        height: 100%;
        width: 100%;
    }

    .el-menu-item.is-active a {
        color: #501386 !important;
    }

    .el-menu-item:hover a {
        color: #ffffff !important;
    }

    .el-dialog .el-dialog__header {
        text-align: center;
    }
    .el-menu-item .number{
        padding: 0 4px;
        height: 14px;
        background: red;
        color: rgb(255, 255, 255);
        display: inline-block;
        font-size: 12px;
        line-height: 14px;
        text-align: center;
        font-style: normal;
        border-radius: 10px;
        margin-left: 15px;
        position: relative;
        top: -2px;
    }
</style>