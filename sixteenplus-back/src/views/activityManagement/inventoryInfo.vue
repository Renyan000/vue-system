<template>
  <div class="inventoryInfo">
      <div style="text-align: left;padding: 0 20px 10px;">
          <span style="font-weight: bold">{{`项目名称： ${projectName}`}}</span>
      </div>
    <div style="text-align: right;padding: 0 20px;height: 0">
      <el-button size="mini" type="primary" @click="submitAll" class="submitBtn" v-if="type!='check'">提交</el-button>
    </div>
    <el-row style="padding: 0 20px">
      <el-tabs type="card"  v-model="activeName">
        <el-tab-pane :label="name" :name="name" v-for="(name,key) in keys" :key="key">
          <el-row v-for="(item,j) in dataList[key]" class="myRow" :key="j">
            <el-col :span="12">
              <ul>
                <li style="width: 30%"><h4>序号：</h4>{{`${item.index}`}}</li>
                <li style="width: 70%"><h4>分项：</h4>{{`${item.totalItemName != '项目亮点'?item.subitemName: '项目亮点'}`}}</li>
                <li v-if="item.totalItemName != '项目亮点'" style="width: 100%"><h4 style="vertical-align: top;margin-top: 0">检查内容：</h4><p class="pText">{{item.checksName}}</p></li>
                <li v-if="item.totalItemName != '项目亮点'" style="width: 100%"><h4 style="vertical-align: top;margin-top: 0">检查要点：</h4><p class="pText" v-if="!!item.checkpointsName" v-html="item.checkpointsName.replace(/\n|\r\n/g, '<br>')"></p></li>
              </ul>
            </el-col>
            <el-col :span="12">
              <el-form label-width="100px">
                <el-form-item label="检查结果：" v-if="item.totalItemName != '项目亮点'">
                  <el-radio-group v-model="item.checkResult" label="" :disabled="type=='check'">
                    <el-radio :label="1">是</el-radio>
                    <el-radio :label="2">否</el-radio>
                    <el-radio :label="3">部分符合</el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item label="检查情况描述：" class="myLabel">
                  <el-input type="textarea" v-model="item.problemDesc" :rows="4" style="width: 100%" :disabled="type=='check'"></el-input>
                </el-form-item>
                <el-form-item label="检查图片：">
                  <el-row style="text-align: left">
                  <el-upload
                    action="/address/uploadFiles"
                    :on-success="handleAvatarSuccess"
                    :before-upload="beforeAvatarUpload"
                    :accept="'image/*'"
                    multiple :show-file-list="false">
                      <el-col> <el-button size="small" type="text" @click="getObj(item)" v-if="status!='3' && type!='check'">点击上传</el-button></el-col>
                  </el-upload>
                    <el-col>
                        <div class="imgbox"  v-for="(url,i) in item.problemImg" :key="i">
                          <el-image  :src="url" alt="" :preview-src-list='url.split(",")' v-if="!!item.problemImg" class="imgShow"></el-image>
                          <i class="el-icon-error" v-if="!!item.problemImg && type!='check'" @click.stop="deleteImg(item,i)"
                             style="color: red;font-size: 24px;text-align: center;width: 24px;cursor: pointer;display: inline-block;position: absolute;
                            top: -12px;right: -12px"
                             ></i>
                            <!--style="color: red;font-size: 24px;text-align: center;width: 60px;cursor: pointer;margin-right: 8px;display: inline-block"-->
                      </div>
                    </el-col>
                  </el-row>
                </el-form-item>
                  <el-form-item>
                      <el-row>
                          <el-col style="text-align: right">
                              <el-button size="small" type="success" @click="saveItem(item)"  v-if="type!='check'">保存</el-button>
                          </el-col>
                      </el-row>
                  </el-form-item>
              </el-form>
            </el-col>
          </el-row>
          <el-row>
            <el-col style="text-align: right;margin-top: 10px">
              <!--<el-button size="small" type="primary" @click="saveForm(key)" v-if="type!='check'">保存</el-button>-->
              <el-button size="small" @click="goBack">返回</el-button>
            </el-col>
          </el-row>
        </el-tab-pane>
      </el-tabs>
    </el-row>
  </div>
</template>

<script>
	import {Loading} from 'element-ui'
	import ElFormItem from "../../../node_modules/element-ui/packages/form/src/form-item";
export default {
	components: {
		ElFormItem,
		Loading},
	name: 'inventoryInfo',
	data: function() {
		return {
			managerId: this.$utils.getCookie('managerId'),
			companyId: '',
			projectId: '',
			id:'',
			type: this.$route.query.type,
			activeName: '',
            keys: ['运营管理','使用监督','技防应用','社会化管理','社区沟通','项目亮点'],
			loadingInstance: '',
            imgObj: {},
			dataList: [],
			summaryId:'',
            projectName: this.$route.query.projectName,
			status: this.$route.query.status
		}
	},
	created(){
		if(this.type == 'add'){
			this.loading();
		}else{
			this.loadingOne();
    }
  	let options = {
		  lock: true,
		  text: 'Loading',
		  spinner: 'el-icon-loading'
    }
		this.loadingInstance = Loading.service(options);
	},
	methods: {
		getObj(item){
		  this.imgObj = item;
        },
		handleAvatarSuccess(res, file) {
			this.imgObj.problemImg.push(res.data)
		},
		beforeAvatarUpload(file) {
            return true;
		},
		loading(){
			let vm = this;
			let parm = {
				companyId: this.$route.query.companyId,
				projectId: this.$route.query.projectId,
				managerId: this.managerId
			}
			this.$http({method:'post', url:'/checklist/startCheck', data:parm}).then((result) => {
				let data = result.data;
				if(data.successful && (data.status==200)){
					let keys = ['one','two','third','four','five','six'];
					vm.activeName = vm.keys[0];
					let lists = [data.data[keys[0]],data.data[keys[1]],data.data[keys[2]],data.data[keys[3]],data.data[keys[4]],data.data[keys[5]]];
					vm.dataList = lists;
					vm.summaryId =vm.dataList[0][0].summaryId;
					let index = 1;
					for (let i =0;i <vm.dataList.length;i++){
						for (let j =0;j <vm.dataList[i].length;j++){
							if(!!vm.dataList[i][j].problemImg){
								vm.dataList[i][j].problemImg = vm.dataList[i][j].problemImg.split(',')
							}else{
								vm.dataList[i][j].problemImg = []
							}
							vm.dataList[i][j].index = index;
							index++
						}
					}
					vm.$nextTick(() =>{
						vm.loadingInstance.close();
					})
				}else{
					this.$message.error('查询失败');
				}
			},(error) => {
				this.$message.error('查询失败');
			});
        },
		deleteImg(item,i){
			item.problemImg.splice(i,1)
        },
		loadingOne(){
			let parm = {
				id: this.$route.query.id
			}
			let vm = this;
			vm.$http({method:'post', url:'/checklist/getOne', data:parm}).then((result) => {
				let data = result.data;
				if(data.successful && (data.status==200)){
					let keys = ['one','two','third','four','five','six'];
					vm.activeName = vm.keys[0];
					vm.dataList = [data.data[keys[0]],data.data[keys[1]],data.data[keys[2]],data.data[keys[3]],data.data[keys[4]],data.data[keys[5]]];
					vm.summaryId =vm.dataList[0][0].summaryId;
					let index = 1;
					for (let i =0;i <vm.dataList.length;i++){
						for (let j =0;j <vm.dataList[i].length;j++){
							if(!!vm.dataList[i][j].problemImg){
								vm.dataList[i][j].problemImg = vm.dataList[i][j].problemImg.split(',')
							}else{
								vm.dataList[i][j].problemImg = []
							}
							vm.dataList[i][j].index = index;
							index++
						}
					}
					vm.$nextTick(() =>{
						vm.loadingInstance.close();
					})
				}else{
					vm.$message.error('查询失败');
				}
			},(error) => {
				vm.$message.error('查询失败');
			});
		},
		saveItem(item){
			let acility = true;
			let vm = this;
			let parm = JSON.parse(JSON.stringify(item))
			if(parm.totalItemName !== '项目亮点'){
				if(!parm.checkResult){
					vm.$message.error('请选择检查结果！')
					acility = false
				}
			}
			if(!acility) return false;
			parm.imgs =parm.problemImg;
			parm.problemImg = '';
			vm.$http({method:'post', url:'/checklist/save', data:[parm]}).then((result) => {
				let data = result.data;
				if(data.successful && (data.status==200)){
					vm.$message({
						type: 'success',
						message: "保存成功！",
						showClose: true,
						duration: 2000,
						onClose: function () {
//							window.location.reload()
						}
					})

				}else{
					vm.$message.error('保存失败');
				}
			},(error) => {
				vm.$message.error('保存失败');
			});
        },
//		saveForm(key){
//			let parm = this.dataList[key];
//			let acility = true;
//			let vm = this;
//			for(let i =0; i< parm.length;i++){
//				if(parm[i].totalItemName === '项目亮点'){
//					continue
//                 }
//                if(!parm[i].checkResult){
//                    vm.$message.error('第'+(i +1)+'条问题没有选择检查结果')
//                    acility = false
//                    break;
//                }
//            }
//            if(!acility){
//                return false
//            }
//			for (let i =0;i <vm.dataList.length;i++){
//				for (let j =0;j <vm.dataList[i].length;j++){
//					vm.dataList[i][j].imgs =vm.dataList[i][j].problemImg;
//					vm.dataList[i][j].problemImg = ''
////					if(!!vm.dataList[i][j].problemImg){
////						vm.dataList[i][j].problemImg = vm.dataList[i][j].problemImg.join(',')
////					}else{
////						vm.dataList[i][j].problemImg = ''
////					}
//				}
//			}
//			vm.$http({method:'post', url:'/checklist/save', data:parm}).then((result) => {
//				let data = result.data;
//				if(data.successful && (data.status==200)){
//					vm.$message({
//						type: 'success',
//						message: "保存成功！",
//						showClose: true,
//						duration: 2000,
//            onClose: function () {
//	            window.location.reload()
//            }
//          })
//
//				}else{
//					vm.$message.error('保存失败');
//				}
//			},(error) => {
//				vm.$message.error('保存失败');
//			});
//    },
		//提交
		submitAll(){
			let vm = this;
			let parm = {summaryId: this.summaryId,status : 2,managerId : this.$utils.getCookie('managerId')}
			vm.$http({method:'post', url:'/checklist/submit', data:parm}).then((result) => {
				let data = result.data;
				if(data.successful && (data.resultCode.code=='SUCCESS')){
					vm.$message({
						type: 'success',
						message: "提交成功！",
						onClose : function () {
							vm.$router.go(-1)
						}
					})
				}else{
					vm.$message.error(data.resultCode.message);
				}
			},(error) => {
				vm.$message.error('提交失败');
			});
    },
		goBack(){
			this.$router.go(-1)
    }
	}
}
</script>
<style>
  .inventoryInfo .submitBtn{
    margin-top: 5px;
    float: right;
    position: relative;
    z-index: 999;
  }
  .inventoryInfo .el-form{
    margin-top: 10px;
  }
  .inventoryInfo .el-icon-circle-close{
    color: #fff;
  }
  .inventoryInfo .imgbox{
    /*height: 30px;*/
      display: inline-block;
      width: 60px;
      position: relative;
    margin-top: 6px;
      margin-right: 20px;
      vertical-align: top;
  }
  .imgShow{
      height: 60px;width: auto;
    vertical-align: middle;
  }
  .inventoryInfo ul{
    margin: 0;
  }
  .inventoryInfo ul li{
    display: inline-block;
  }
  .inventoryInfo h4{
    display: inline-block;
  }
  .inventoryInfo p.pText{
      display: inline-block;
      max-width: calc(100% - 70px);
    /*padding-left: 40px;*/
  }
  .inventoryInfo .myRow{
    border-bottom: 1px solid #b4b4b4;
  }
  .inventoryInfo .myLabel label{
    line-height: 1;
  }
</style>