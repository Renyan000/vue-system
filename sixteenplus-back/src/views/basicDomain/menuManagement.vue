<template>
  <div class="home">
    <el-row style="padding: 0 20px">
      <el-col :span="24" style="text-align: right">
        <el-button type="primary" id="btn1" size="small" @click="addMenuBtn" v-if="btnArr.indexOf('btn1')>=0">添加新节点</el-button>
      </el-col>
    </el-row>
    <el-row style="padding: 0 20px">
      <el-scrollbar style="height: 100%">
        <el-table :data="menuList" style="width: 100%" :row-class-name="isFatherColor" v-loading="loadingIcon">
          <el-table-column fixed prop="name" label="导航名称" width=""></el-table-column>
          <el-table-column prop="isParent" label="是否父节点" width="150"></el-table-column>
          <el-table-column prop="parentName" label="父节点名称" width="150"></el-table-column>
          <el-table-column prop="url" label="菜单路径" width=""></el-table-column>
          <el-table-column prop="buttonIdNames" label="按钮名称" width=""></el-table-column>
          <el-table-column fixed="right" label="操作" width="200">
            <template slot-scope="scope">
              <el-button size="mini" id="btn2" @click="editMenu(scope.row)" v-if="btnArr.indexOf('btn2')>=0">修改节点</el-button>
              <el-button size="mini" id="btn3" @click="deleteMenu(scope.row)" type="danger" v-if="btnArr.indexOf('btn3')>=0">删除节点</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-scrollbar>
    </el-row>
    <el-dialog title="添加" :visible.sync="dialogFormVisible" :modal-append-to-body='false'>
      <el-form :model="userInfo" ref="userInfo" label-width="100px" >
        <el-form-item label="导航名称">
          <el-input v-model="userInfo.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="是否父节点">
          <el-radio @click.native="clickitem(1)" v-model="userInfo.isParent" label="1">是</el-radio>
          <el-radio @click.native="clickitem(0)" v-model="userInfo.isParent" label="0">否</el-radio>
        </el-form-item>
        <el-form-item label="父节点名称">
          <el-select v-model="userInfo.parentId" :value="userInfo.parentId" :disabled="isFather" placeholder="请选择父节点">
            <el-option v-for="item in fatherOptions" :label="item.name" :value="item.id" :key="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="导航链接">
          <el-input v-model="userInfo.url" :disabled="isFather" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="按钮">
          <el-input type="textarea" v-model="userInfo.buttonId" autocomplete="off"></el-input>
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
  name: 'menuManagement',
	components: {
		Row,Col,Button,Form,FormItem,Input,Radio,Select,Option
	},
	data: function() {
		return {
			loadingIcon: true,
			menuList: [],
			dialogFormVisible: false,
			fatherOptions:[{id:"#",name:"#"}],
			isFather:false,
			btnArr:[],
			userInfo: {
				name: '',
				isParent: '1',
				parentId: '',
				url: '',
				buttonId: ''
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
					let obj=JSON.parse(str);
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
		//新增菜单
		addMenu(formName){
			let parm = this.userInfo;
			let url = "";
			if(parm.parentId=='#'){
				parm.parentId = '0';
			}
			let buttonId = parm.buttonId;
			if(!!buttonId){
				let isJson = this.isJSON(buttonId);
				if(!isJson){
					this.$message.error('按钮内容填写格式不正确！');
					return false;
				}
			}
			if(!this.userInfo.id){//新增
				url = '/menu/add';
			}else{
				parm.id = this.userInfo.id;
				url = '/menu/modify';
			}
			this.$http({method:'post', url:url, data:parm}).then((result) => {
				let data = result.data;
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
			for(let i =0;i<this.menuList.length;i++){
				if(id == this.menuList[i].id){
					return this.menuList[i].name
				}
			}
		},
		//初始化列表
		loading(){
			let roleId = this.$utils.getCookie("roleId");

			this.$http({method:'post', url:'/menu/query', data:{}}).then((result) => {
				let data = result.data;
				this.loadingIcon = false;
				if(data.successful && (data.status==200)){
					if(data.data){
						this.fatherOptions = [{id:"#",name:"#"}];
						this.menuList = data.data;
						for(let i =0;i<this.menuList.length;i++){
							if(this.menuList[i].children && this.menuList[i].children.length>0){
								for(let j =0;j<this.menuList[i].children.length;j++){
									this.menuList.splice(i+1,0,this.menuList[i].children[j])
								}
							}
							if(this.menuList[i].parentId == "0"){
								this.menuList[i].parentName = "";
							}else{
								this.menuList[i].parentName = this.getFatherName(this.menuList[i].parentId);
							}

						}
						for(let i =0;i<this.menuList.length;i++){
							if(this.menuList[i].parentId !="0"){
								this.menuList[i].isParent = "否";
							}else{
								this.fatherOptions.push({id:data.data[i].id,name:data.data[i].name});
								this.menuList[i].isParent = "是"
							}
							if(!!this.menuList[i].buttonId){
								let buttonIdArr = JSON.parse(this.menuList[i].buttonId);
								this.menuList[i].buttonIdNames = "";
								for(let j = 0;j <buttonIdArr.length;j++){
									if(!this.menuList[i].buttonIdNames == ""){
										this.menuList[i].buttonIdNames +=","
									}
									this.menuList[i].buttonIdNames += buttonIdArr[j].label;
								}
							}
						}
					}
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
				let parm = {id:row.id,name:row.name};
				this.$http({method:'post', url:'/menu/remove', data:parm}).then((result) => {
					let data = result.data;
					if(data.successful && (data.status==200)){
						this.$message.success('删除成功');
						this.loading();
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
			this.userInfo.name = row.name;
			this.userInfo.isParent = row.parentId=="0"?"1":"0";
			this.userInfo.parentId = row.parentId == "0"?"#":row.parentId;
			this.userInfo.url = row.url;
			this.userInfo.buttonId = row.buttonId;
			if(this.userInfo.isParent == "1"){
				this.isFather=true;
			}else{
				this.isFather=false;
			}
		},
		//是否父节点点击
		clickitem(id){
			if(id == "1"){
				this.isFather=true;
				this.userInfo.parentId = "#"
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
			this.userInfo.name = "";
			this.userInfo.isParent = "1";
			this.userInfo.parentId = "#";
			this.userInfo.url = "#";
			this.userInfo.buttonId = "";
			delete this.userInfo.id;
			this.dialogFormVisible = true;
			this.isFather=true;
		}
	}
}
</script>
<style>
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