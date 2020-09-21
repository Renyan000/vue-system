<template>
  <div class="home">
    <el-row :gutter="20">
      <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">
        <div class="formSearch">
          <label for="">单位名称</label>
          <el-select v-model="companyId" clearable filterable placeholder="请选择" @change="choseCom1">
            <el-option v-for="item in companyOptions" :key="item.id" :label="item.companyName" :value="item.id"></el-option>
          </el-select>
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">
        <div class="formSearch">
          <label for="">项目名称</label>
          <el-select v-model="projectId" clearable filterable placeholder="请选择">
            <el-option v-for="item in projectOptions1" :key="item.projectId" :label="item.projectName" :value="item.projectId"></el-option>
          </el-select>
        </div>
      </el-col>
    </el-row>
    <el-row style="padding: 10px 20px 0">
      <el-col :span="24" style="text-align: right">
        <el-button size="small" icon="el-icon-download" @click="downLoadDoc">下载</el-button>
        <el-button type="primary" size="small" icon="el-icon-search" @click="searchList">查询</el-button>
        <el-button type="primary" id="btn1" size="small" @click="addMenuBtn">填写</el-button>
      </el-col>
    </el-row>
    <el-row style="padding: 0 20px">
      <el-scrollbar style="height: 100%">
        <el-table :data="menuList" style="width: 100%" v-loading="loadingIcon">
          <el-table-column prop="companyName" label="单位名称" width=""></el-table-column>
          <el-table-column prop="projectName" label="项目名称" width=""></el-table-column>
          <el-table-column prop="createTime" label="检查时间" width="100"></el-table-column>
          <el-table-column prop="statusText" label="状态" width=""></el-table-column>
          <el-table-column fixed="right" label="操作" width="">
            <template slot-scope="scope">
              <el-button size="mini" type="text" @click="goto(scope.row,'check')" style="margin-left: 10px">查看</el-button>
              <el-button size="mini" type="text" v-if="scope.row.status=='1'||scope.row.status=='5'" @click="goto(scope.row,'edit')">修改</el-button>
              <el-button size="mini" type="text" v-if="btnArr.indexOf('IM1')>=0 && (scope.row.status=='2' || scope.row.status=='5')" id='IM1' @click="editMenu(scope.row,3)">确认</el-button>
              <el-button size="mini" type="text" v-if="btnArr.indexOf('IM2')>=0 && scope.row.status=='3'" id='IM2' @click="editMenu(scope.row,5)">退回</el-button>
              <el-button size="mini" type="text" v-if="btnArr.indexOf('IM3')>=0 && scope.row.status=='3'" id='IM3' @click="showNameUrl(scope.row,4)">归档</el-button>
              <el-button size="mini" type="text" v-if="scope.row.status=='3'|| scope.row.status=='4'" @click="exportInfo(scope.row)">导出</el-button>
              <el-button size="mini" type="text" v-if="scope.row.status=='3'|| scope.row.status=='4'" @click="exportImg(scope.row)">导出图片</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-scrollbar>
    </el-row>
    <el-row class="paggingBox">
      <el-col :span="24">
        <el-pagination @current-change="handleCurrentChange" :current-page.sync="currentPage" background layout="prev, pager, next" :total="totalItemsCount"></el-pagination>
      </el-col>
    </el-row>
    <el-dialog title="添加" :visible.sync="dialogFormVisible" :modal-append-to-body='false' width="500px">
      <el-form :model="userInfo" ref="userInfo" label-width="100px" >
        <el-form-item label="单位名称">
          <el-select v-model="userInfo.companyId" clearable filterable placeholder="请选择" @change="choseCom2">
            <el-option v-for="item in companyOptions" :key="item.id" :label="item.companyName" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="项目名称">
          <el-select v-model="userInfo.projectId" clearable filterable placeholder="请选择">
            <el-option v-for="item in projectOptions2" :key="item.projectId" :label="item.projectName" :value="item.projectId"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="cancel('userInfo')" >取 消</el-button>
        <el-button size="small" type="primary" :loading="loading2" @click="addMenu('userInfo')">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="归档" :visible.sync="dialogFormVisible2" :modal-append-to-body='false' width="500px">
      <el-form :model="info" ref="info" label-width="100px" >
        <el-form-item label="签名照">
          <el-upload
            class="_avatar-uploader"
            action="/address/uploadFiles"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload">
            <img v-if="info.signImg" :src="info.signImg" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon" style="height: 40px;width: 40px;line-height: 40px;border: 1px dashed #333333"> </i>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="cancel2" >取 消</el-button>
        <el-button size="small" type="primary" :loading="loading1" @click="submitName">确 定</el-button>
      </div>
    </el-dialog>
    <a href="javascript: ;" id="exportBtn" target="_blank" @click="exportExcal"></a>
    <router-link :to="path" @click.native="todo" style="opacity: 0"><span ref="goto">跳转</span></router-link>
  </div>
</template>

<script>
// @ is an alias to /src
export default {
  name: 'inventoryManagement',
	data: function() {
		return {
			loadingIcon: false,
			menuList: [],
			dialogFormVisible: false,
			dialogFormVisible2: false,
			projectName: '',
			companyId: '',
			projectId: '',
			companyOptions: [],
			projectOptions1: [],
			projectOptions2: [],
			userInfo: {
				companyId: '',
				projectId: '',
			},
			info: {},
			loading1: false,
			loading2: false,
			signImg: '',//签名照
			parms: '',
			btnArr: [],
			currentPage:1,
			totalItemsCount:0,
			path: '',
			isIE: false
		}
	},
	created(){
  	this.loading(1);
		this.loadingOrgin();
		this.btnControl();
	},
	mounted(){
		if (!!window.ActiveXObject || "ActiveXObject" in window){
			this.isIE = true
			window.addEventListener('hashchange', () => {
				var currentPath = window.location.hash.slice(1)
				if (this.$route.path !== currentPath) {
					this.$router.push(currentPath)
				}
			}, false)
		} else{
			this.isIE = false
		}

  },
	methods: {
		todo() {},
		btnControl(){
			if(window.location.href.indexOf('?')>=0){
				let btnStr =window.location.href.split('?')[1].split('=')[1];
				if(!!btnStr){
					this.btnArr = btnStr.split("-");
				}
			}
		},
		handleAvatarSuccess(res, file) {
			this.info.signImg = res.data;
			this.loading1 = false;
		},
		beforeAvatarUpload(file) {
			this.loading1 = true;
            return true;
		},
		loading(pageNum){
			let parm = {
				pageSize: 10,
				companyId: this.companyId,
				projectId: this.projectId,
				managerId: this.$utils.getCookie('managerId'),
				pageNumber: pageNum
			}
//			if(!this.companyId || !this.projectId){
//				this.$message.error('请先选择单位和项目！')
//        return
//      }
			this.loadingIcon = true;
			this.$http({method:'post', url:'/checklist/getListPage', data:parm}).then((result) => {
				let data = result.data;
				this.loadingIcon = false;
				if(data.successful && (data.status==200)){
					this.menuList = data.data.list;
					this.totalItemsCount = data.data.total;
					this.currentPage = data.data.pageNum;
					//1未提交 2已提交 3 确认 4 归档 5打回
					for(let item of this.menuList){
                    if(item.status === 1){
                        item.statusText = '未提交'
                    }else if(item.status === 2){
                        item.statusText = '已提交'
                    }else if(item.status === 3){
                        item.statusText = '确认'
                    }else if(item.status === 4){
                        item.statusText = '归档'
                    }else if(item.status === 5){
                        item.statusText = '打回'
                    }
                  }
				}else{
					this.$message.error('查询失败');
				}
			},(error) => {
				this.$message.error('查询失败');
			});
        },
		addMenuBtn(){
            this.dialogFormVisible = true;
        },
		selectGet(value) {
			let obj ={}
			obj = this.projectOptions2.find((item)=>{
				return item.projectId === value;
			});
			return obj.projectName
		},
		//新增
		addMenu(formName){
			let vm = this;
			if(!vm.userInfo.companyId || !vm.userInfo.projectId){
				vm.$message.error('请选择项目和单位!');
            }else{
				vm.loading2 = true;
                let projectName = vm.selectGet(vm.userInfo.projectId)
				vm.path = './inventoryInfo?companyId='+vm.userInfo.companyId+'&projectId='+vm.userInfo.projectId+'&type=add&projectName='+projectName;
				let parm = {
					companyId: vm.userInfo.companyId,
					projectId: vm.userInfo.projectId
				}
				vm.$http({method:'post', url:'/checklist/isCan', data:parm}).then((result) => {
					let data = result.data;
					if(!data.successful && (data.resultCode.code=== 'FAIL')){
						vm.$message.error(data.resultCode.message)
					}else if(data.successful && (data.resultCode.code=== 'SUCCESS')){
						 vm.$refs.goto.click()
//							vm.$router.push({
//								"path": './inventoryInfo',
//								"query": {
//									"companyId": vm.userInfo.companyId,
//									"projectId": vm.userInfo.projectId,
//									"type": 'add'
//								}
//							})
					}else{
						vm.$message.error('查询失败');
          }
					vm.loading2 = false;
				},(error) => {
					vm.$message.error('查询失败');
				});
      }
		},
		cancel(){
      this.userInfo= {
				companyId: '',
					projectId: '',
			}
			this.dialogFormVisible = false
    },
		cancel2(){
      this.info.signImg = '';
			this.dialogFormVisible2 = false
    },
		choseCom1(value){
			this.loadProject(value,1)
		},
		choseCom2(value){
			this.loadProject(value,2)
		},
		//加载项目下拉
		loadingOrgin(){
			this.$http({method:'post', url:'/company/getList', data:{managerId: this.$utils.getCookie("managerId")}}).then((result) => {
				let data = result.data;
				if(data.successful && (data.status==200)){
					let obj = [{id:'',companyName:'请选择'}]
					this.companyOptions = obj.concat(data.data)
				}else{
					this.$message.error('查询失败');
				}
			},(error) => {
				this.$message.error('查询失败');
			});
		},
		//根据单位查询项目
		loadProject(id,index){
			this.$http({method:'post', url:'/company/getProjectList', data:{id: id}}).then((result) => {
				let data = result.data;
				if(data.successful && (data.status==200)){
					let obj = [{projectId:'',projectName:'请选择'}]
					if(index === 1){
						this.projectOptions1 = obj.concat(data.data);
					}else{
						this.projectOptions2 = obj.concat(data.data);
          }
          this.projectId = '';
          this.userInfo.projectId = '';
				}else{
					this.$message.error('查询失败');
				}
			},(error) => {
				this.$message.error('查询失败');
			});
    },
		goto(row,type){
          this.$router.push({
            path: '/activityManagement/inventoryInfo',
              query: {
                  id: row.id,
                  type: type,
                  projectName: row.projectName,
	              status: row.status
              }
          })
        },
		submitName(){
      if(!this.info.signImg){
      	this.$message.error('请先上传签名照！')
      }else{
      	this.editMenu(this.info,4);
      	this.dialogFormVisible2 = false;
      }
    },
    //修改
    editMenu(row,index){//4 归档的时候要上传提交签名照片
        let parm = {
            "managerId": this.$utils.getCookie("managerId"),
            "status": index,
            "summaryId": row.id
        }
        if(index === 4){
          parm.signImg = this.info.signImg;
        }else if(index === 3){
	        this.$confirm('是否确认?', '提示', {
		        confirmButtonText: '是',
		        cancelButtonText: '否',
		        type: 'warning'
	        }).then(() => {
                this.saveInfo(parm)
	        }).catch(() => {
	        });
        }else if(index === 5){
	        this.$confirm('是否退回?', '提示', {
		        confirmButtonText: '是',
		        cancelButtonText: '否',
		        type: 'warning'
	        }).then(() => {
		        this.saveInfo(parm)
	        }).catch(() => {
	        });
        }else{
	        this.saveInfo(parm)
        }
    },
    saveInfo(parm){
	    this.$http({method:'post', url:'/checklist/submit', data:parm}).then((result) => {
		    let data = result.data;
		    if(data.successful && (data.status==200)){
			    this.$message.success('操作成功！')
			    this.loading(1);
		    }else{
			    this.$message.error('查询失败');
		    }
	    },(error) => {
		    this.$message.error('查询失败');
	    });
    },
    showNameUrl(row,index){
        this.info = row;
        this.dialogFormVisible2 = true;
    },
		downLoadDoc(){
			this.parms = '/checklist/exportAll?managerId='+this.$utils.getCookie('managerId')
			document.getElementById('exportBtn').click();
    },
		exportInfo(row){
			this.parms = '/pdfExprot/exportPdf?id='+row.id
			document.getElementById('exportBtn').click();
    },
		exportImg(row){
			this.parms = '/checklist/zipImg?id='+row.id
			document.getElementById('exportBtn').click();
    },
		exportExcal() {
			document.getElementById('exportBtn').href = this.parms;
		},
		searchList(){
      this.loading(1)
    },
		//分页触发事件
		handleCurrentChange(val){
			this.loading(val)
		},
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