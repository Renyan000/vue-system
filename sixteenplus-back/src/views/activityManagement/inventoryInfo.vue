<template>
  <div class="inventoryInfo">
    <div style="text-align: right;padding: 0 20px;height: 0">
      <el-button size="mini" type="primary" @click="submitAll" class="submitBtn" v-if="type!='check'">提交</el-button>
    </div>
    <el-row style="padding: 0 20px">
      <el-tabs type="card"  v-model="activeName">
        <el-tab-pane :label="key" :name="key" v-for="(value,key,index) in dataList" :key="index">
          <el-row v-for="(item,j) in value" class="myRow" :key="j">
            <el-col :span="12">
              <ul>
                <li><h4>总项：</h4>{{`${item.totalItemName}`}}</li>
                <li v-if="item.totalItemName != '项目亮点'"><h4>分项：</h4>{{`${item.subitemName}`}}</li>
              </ul>
              <p class="pText">{{item.checksName}}</p>
              <p class="pText" v-if="!!item.checkpointsName" v-html="item.checkpointsName.replace(/\n|\r\n/g, '<br>')"></p>
            </el-col>
            <el-col :span="12">
              <el-form label-width="100px">
                <el-form-item label="检查结果：" v-if="item.totalItemName != '项目亮点'">
                  <el-radio-group v-model="item.checkResult">
                    <el-radio :label="1">是</el-radio>
                    <el-radio :label="2">否</el-radio>
                    <el-radio :label="3">部分符合</el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item label="问题描述：" class="myLabel">
                  <el-input type="textarea" v-model="item.problemDesc" :rows="4" style="width: 100%"></el-input>
                </el-form-item>
                <el-form-item label="问题图片：">
                  <el-upload
                    action="/address/uploadFiles"
                    :on-success="handleAvatarSuccess"
                    :before-upload="beforeAvatarUpload"
                    multiple :show-file-list="false">
                    <el-row style="text-align: left">
                      <el-col> <el-button size="small" type="info" @click="getObj(item)">点击上传</el-button></el-col>
                      <el-col>
                        <img :src="url" alt="" :preview-src-list='url.split(",")' v-if="!!item.problemImg" v-for="(url,key) in item.problemImg.split(',')" :key="key" height="100px">
                      </el-col>
                    </el-row>
                  </el-upload>
                </el-form-item>
              </el-form>
            </el-col>
          </el-row>
          <el-row>
            <el-col style="text-align: right;margin-top: 10px">
              <el-button size="small" type="primary" @click="saveForm(key)" v-if="type!='check'">保存</el-button>
              <el-button size="small" @click="goBack">返回</el-button>
            </el-col>
          </el-row>
        </el-tab-pane>
      </el-tabs>
    </el-row>
  </div>
</template>

<script>
	import {Row,Col,Button,Form,FormItem,Input,Radio,Select,Option,Loading} from 'element-ui'
	import ElRow from "element-ui/packages/row/src/row";
	import ElCol from "element-ui/packages/col/src/col";
// @ is an alias to /src
export default {
	components: {
		ElCol,
		ElRow,
		Row,Col,Button,Form,FormItem,Input,Radio,Select,Option,Loading},
	name: 'inventoryInfo',
	data: function() {
		return {
			managerId: this.$utils.getCookie('managerId'),
			companyId: '',
			projectId: '',
			id:'',
			type: this.$route.query.type,
			activeName: '',
      keys: [],
			loadingInstance: '',
      imgObj: {},
			dataList: [],
			summaryId:''
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
		  if(!this.imgObj.problemImg){this.imgObj.problemImg = ''}
    },
		handleAvatarSuccess(res, file) {
			if(this.imgObj.problemImg){
				this.imgObj.problemImg += ','
      }
			this.imgObj.problemImg += res.data;
		},
		beforeAvatarUpload(file) {
				return true;
		},
		loading(){
			let parm = {
				companyId: this.$route.query.companyId,
				projectId: this.$route.query.projectId,
				managerId: this.managerId
			}
			this.$http({method:'post', url:'/checklist/startCheck', data:parm}).then((result) => {
				let data = result.data;
				if(data.successful && (data.status==200)){
					this.keys = Object.keys(data.data);
					this.activeName = this.keys[0];
					this.dataList = data.data;
					this.summaryId =this.dataList[this.activeName][0].summaryId;
          this.$nextTick(() =>{
	          this.loadingInstance.close();
          })
				}else{
					this.$message.error('查询失败');
				}
			},(error) => {
				this.$message.error('查询失败');
			});
    },
		loadingOne(){
			let parm = {
				id: this.$route.query.id
			}
			this.$http({method:'post', url:'/checklist/getOne', data:parm}).then((result) => {
				let data = result.data;
				if(data.successful && (data.status==200)){
//					this.keys = Object.keys(data.data);
					let keys = ['one','two','third'];
					this.keys = ['运营管理','使用监督','其他']
					this.activeName = this.keys[0];
					let lists = [data.data[keys[0]],data.data[keys[1]],data.data[keys[2]]];
					this.dataList = lists;
					this.summaryId =this.dataList[this.activeName][0].summaryId;
					this.$nextTick(() =>{
						this.loadingInstance.close();
					})
				}else{
					this.$message.error('查询失败');
				}
			},(error) => {
				this.$message.error('查询失败');
			});
		},
		saveForm(key){
			let parm = this.dataList[key];
			let acility = true;
			for(let i =0; i< parm.length;i++){
      	if(!parm[i].checkResult){
          this.$message.error('第'+(i +1)+'条问题没有选择检查结果')
		      acility = false
          break;
        }
      }
      if(!acility){
				return false
      }
			this.$http({method:'post', url:'/checklist/save', data:parm}).then((result) => {
				let data = result.data;
				if(data.successful && (data.status==200)){
					this.$message({
						type: 'success',
						message: "保存成功！"
          })
				}else{
					this.$message.error('查询失败');
				}
			},(error) => {
				this.$message.error('查询失败');
			});
    },
		//提交
		submitAll(){
			console.log("222")
			let parm = {summaryId: this.summaryId,status : 2,managerId : this.$utils.getCookie('managerId')}
			this.$http({method:'post', url:'/checklist/submit', data:parm}).then((result) => {
				let data = result.data;
				if(data.successful && (data.status==200)){
					this.$message({
						type: 'success',
						message: "提交成功！",
						onClose : function () {
              this.$router.go(-1)
						}
					})
				}else{
					this.$message.error('提交失败');
				}
			},(error) => {
				this.$message.error('提交失败');
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
  .inventoryInfo ul{
    margin: 0;
  }
  .inventoryInfo ul li{
    display: inline-block;
    width: 49%;
  }
  .inventoryInfo h4{
    display: inline-block;
  }
  .inventoryInfo p.pText{
    padding-left: 40px;
  }
  .inventoryInfo .myRow{
    border-bottom: 1px solid #b4b4b4;
  }
  .inventoryInfo .myLabel label{
    line-height: 1;
  }
</style>