<template>
    <div class="home">
        <el-row style="padding: 0 20px">
            <el-col :span="24">
                <el-tabs v-model="activeName" @tab-click="changeRoles">
                    <el-tab-pane v-for="item in tabList" :label="item.itemName" :name="item.id+''" :key="item.id">{{item.itemName}}</el-tab-pane>
                </el-tabs>
            </el-col>
        </el-row>
        <el-row style="padding: 0 20px">
            <el-tree
                :data="tableData3"
                v-loading="loadingIcon"
                show-checkbox
                node-key="id"
                default-expand-all
                ref="menuTree"
                :default-checked-keys="checkedKeys">
            </el-tree>
        </el-row>
        <el-row style="padding: 20px">
            <el-col :span="24" style="text-align: right">
                <el-button type="primary" size="small" @click="save">保存</el-button>
            </el-col>
        </el-row>
    </div> 
</template>

<script>
import {Row,Col,Button,Tabs,TabPane,Tree} from 'element-ui'
export default {
    name: 'roleMenuManagement',
    components: {
        Row,Col,Button,Tabs,TabPane,Tree
    },
    data() {
        return {
            tabList:[],
			tableData3: [],
			activeName:'',
			checkedKeys:[],
			loadingIcon: true,
			dialogFormVisible: false,
			multipleSelection: []
        }
    },
    created(){
		this.loading()
	},
	methods: {
		cancel(formName){
			this.$refs[formName].resetFields();
			this.dialogFormVisible = false
		},
		changeRoles(tab, event){
			this.getMenuByRole(this.activeName)
		},
		//初始化列表
		loading(){
			//查询角色
			this.$http({method:'post', url:'/role/getRoleInfo', data:{}}).then((result) => {
				var data = result.data;
				if(data.successful && (data.status==200)){
					if(data.data){
						this.tabList = data.data;
						this.activeName = data.data[0].id+'';
						this.getMenuByRole(data.data[0].id);
					}
				}else{
					this.$message.error('查询失败');
				}
			},(error) => {
				this.$message.error('查询失败');
			});
			
		},
		getMenuByRole(roleId){
			//查询菜单
			this.$http({method:'post', url:'/menu/query', data:{managerId:this.$utils.getCookie("managerId")}}).then((result) => {
				var data = result.data;
				if(data.successful && (data.status==200)){
					if(data.data){
						var menuList = [];
						var lists = data.data;
						this.checkedKeys = [];
						//写入一级菜单
						for(var i=0;i<lists.length;i++){
							lists[i].label = lists[i].name;
							if(lists[i].parentId == "0"){
								menuList.push(lists[i])
							}
						}
						for(var j=0;j<menuList.length;j++){
							for(var i=0;i<lists.length;i++){
								if(lists[i].parentId == menuList[j].id){
									//将按钮数组写入二级菜单的children里面
									if(!!lists[i].buttonId){
										lists[i].children = JSON.parse(lists[i].buttonId);
										/*for(var m = 0;m < lists[i].children.length;m++){
											if(lists[i].children[m].type == "1"){
												this.checkedKeys.push(lists[i].children[m].id)
											}
										}*/
									}else{
										/*if(lists[i].type == "1"){
											this.checkedKeys.push(lists[i].id)
										}*/
									}
									//将二级菜单写入一级菜单
									if(!menuList[j].children){
										menuList[j].children = [];
									}
									menuList[j].children.push(lists[i]);
								}
							}
						}
						for(var k=0;k<menuList.length;k++){
							if(!menuList[k].children){
								menuList.splice(1,k);
							}
						}
						this.tableData3 = menuList;
						this.getRoleMenuRelation();
					}
				}else{
					this.$message.error('查询失败');
				}
			},(error) => {
				this.$message.error('查询失败');
			});
		},
		getRoleMenuRelation(){
			this.$http({method:'post', url:'/menu/queryrel', data:{roleId:this.activeName}}).then((result) => {
				var data = result.data;
				this.checkedKeys = [];
				this.loadingIcon = false;
				if(data.successful && (data.status==200)){
					if(data.data){
						var list = data.data;
						for(var i = 0;i < list.length;i++){
							if(list[i].parentId == "0"){
								continue
							}
							if(!!list[i].buttonId){
								var havaChild = false;//判断是否有选中按钮
								var buttons = JSON.parse(list[i].buttonId);
								for(var j =0;j < buttons.length;j++){
									if(buttons[j].type == "1"){
										havaChild = true;
										this.checkedKeys.push(buttons[j].id)
									}
								}
								if(buttons.length > 1){
								}else{
									if(havaChild){
										this.checkedKeys.push(list[i].menuId)
									}
								}
								
							}else{
								this.checkedKeys.push(list[i].menuId)
							}
						}
					}
					console.log(this.checkedKeys)
				}else{
					this.$message.error('查询失败');
				}
			},(error) => {
				this.$message.error('查询失败');
			});
		},
		save(){
			var menuIdListArr1 = this.$refs.menuTree.getCheckedKeys();//选中的所有节点
			var menuIdListArr2 = this.$refs.menuTree.getHalfCheckedKeys();//半选中的所有节点
			var menuIdListArr = menuIdListArr2.concat(menuIdListArr1)
			console.log(menuIdListArr2)
			var menuIdList = [];
			var tableData3 = this.tableData3;
			for(var i =0;i<tableData3.length;i++){
				if(!!tableData3[i].children){
					for(var j =0;j<tableData3[i].children.length;j++){
						if(menuIdListArr.indexOf(tableData3[i].children[j].id) >= 0){
							var menuObj = new Object();
							if(!!tableData3[i].children[j].buttonId){
								menuObj = {"parentMenuId":tableData3[i].children[j].parentId,"menuId":tableData3[i].children[j].id,"buttonId":JSON.parse(tableData3[i].children[j].buttonId)};
								if(!tableData3[i].children[j].children){
									
								}else{
									for(var k = 0;k < tableData3[i].children[j].children.length;k++){
										if(menuIdListArr.indexOf(tableData3[i].children[j].children[k].id) >= 0){
											menuObj.buttonId[k].type="1";//按钮选中状态
										}else{
											menuObj.buttonId[k].type="0";//按钮未选中状态
										}
									}
									menuObj.buttonId = JSON.stringify(menuObj.buttonId);
								}
							}else{
								menuObj = {"parentMenuId":tableData3[i].children[j].parentId,"menuId":tableData3[i].children[j].id,"buttonId":""};
							}
							menuIdList.push(menuObj);
						}
					}
				}
			}
			
			/*return false;*/
			this.$http({method:'post', url:'/menu/addrel', data:{roleId:this.activeName,menuIdList:menuIdList}}).then((result) => {
				var data = result.data;
				if(data.successful && (data.status==200)){
					this.$message.success('保存成功');
					// this.loading();
					window.location.reload();
				}else{
					this.$message.error('保存失败');
				}
			},(error) => {
				this.$message.error('保存失败');
			});
		}
	}
}
</script>
<style>
    .el-tabs__content{
        display: none!important
    }
</style>