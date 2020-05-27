<template>
    <div class="">
        <el-row>
            <el-col><el-button type="primary" icon="el-icon-plus" @click="addRangeForm" size="small">添加</el-button></el-col>
        </el-row>
        <el-table :data="tableData" style="width: 100%">
            <el-table-column prop="picture" label="Picture">
                <template slot-scope="scope">
                    <el-image style="width: 100px; height: 100px" v-if="!!scope.row.imageUrl"
                        :src="scope.row.imageUrl"
                        :preview-src-list="scope.row.imageUrl.split(',')">
                    </el-image>
                    <el-image style="width: 100px; height: 100px" v-else :src="scope.row.imageUrl"></el-image>
                </template>
            </el-table-column>
            <el-table-column prop="certificate" label="Certificate"></el-table-column>
            <el-table-column prop="certificateName" label="Certificate Name"></el-table-column>
            <el-table-column prop="queryLinks" label="Query links"></el-table-column>
            <el-table-column prop="available" label="Available"></el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button type="success" @click="editCert(scope.row)" size="mini" plain>修改</el-button>
                    <el-button type="danger" @click="deleteCert(scope)" size="mini">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-dialog title="信息" :visible.sync="dialogFormVisible" :modal-append-to-body='false'>
            <el-form :model="certificateInfo" ref="certificateInfo" label-width="120px" >
                <el-form-item label="Picture" >
                    <el-upload
                        class="_avatar-uploader"
                        action="/address/uploadFiles"
                        :show-file-list="false"
                        :on-success="handleAvatarSuccess"
                        :before-upload="beforeAvatarUpload">
                        <img v-if="certificateInfo.imageUrl" :src="certificateInfo.imageUrl" class="avatar">
                        <i v-else class="el-icon-plus avatar-uploader-icon" style="height: 40px;width: 40px;line-height: 40px;border: 1px dashed #333333"> </i>
                    </el-upload>
                  <p class="formTips" :style="showTips?'display: block;':'display: none;'">只能上传jpg,jpeg,png,gif等图片文件</p>
                </el-form-item>
                <el-form-item label="Certificate" >
                    <el-input v-model="certificateInfo.certificate" autocomplete="off" placeholder="证书号"></el-input>
                </el-form-item>
                <el-form-item label="Certificate Name" >
                    <el-input v-model="certificateInfo.certificateName" autocomplete="off" placeholder="证书名称"></el-input>
                </el-form-item>
                <el-form-item label="Query links" >
                    <el-input v-model="certificateInfo.queryLinks" autocomplete="off" placeholder="证书验证链接"></el-input>
                </el-form-item>
                <el-form-item label="Available" >
                    <el-input v-model="certificateInfo.available" autocomplete="off" placeholder="证书有效期"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button size="small" @click="cancelConfirm('certificateInfo')">取 消</el-button>
                <el-button size="small" type="primary" @click="addUser">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
	import ElRow from "element-ui/packages/row/src/row";
	import ElCol from "element-ui/packages/col/src/col";
	import ElButton from "../../node_modules/element-ui/packages/button/src/button";
export default {
	components: {
		ElButton,
		ElCol,
		ElRow
    },
	name: 'CertificateList',
    props: {
	    tableData: Array
    },
    data(){
		return{
			dialogFormVisible: false,
			objStr:'',
			showTips:false,
			certificateInfo: {
				imageUrl:'',
				certificate:'',
				certificateName:'',
				queryLinks:'https://euipo.europa.eu',
				available:'',
            }
        }
    },
	methods:{
	    handleAvatarSuccess(res, file) {
        this.certificateInfo.imageUrl = res.data;
	    },
	    beforeAvatarUpload(file) {
	    	if(file.type == 'image/jpeg' ||  file.type == 'image/png' || file.type == 'image/jpg' || file.type == 'image/gif'){
			    return true;
        }else{
	    		this.showTips = true;
			    return false;
        }

	    },
		//取消
		cancelConfirm(formName){
			this.dialogFormVisible = false;
			if(!this.certificateInfo.id){//新增的取消
				this.certificateInfo = {
					imageUrl:'',
					certificate:'',
					certificateName:'',
					queryLinks:'',
					available:'',
				}
			}else{//修改的取消
				this.tableData[this.certificateInfo.id] = JSON.parse(this.objStr)
			}
			this.showTips = false;
		},
		//新增保存
		addUser(){
			if (!this.certificateInfo.id) {
				this.certificateInfo.id = this.tableData.length;
				this.tableData.push(this.certificateInfo);
			} else {
				this.tableData[this.certificateInfo.id] = this.certificateInfo
			}
			this.dialogFormVisible = false;
			this.showTips = false;
			this.certificateInfo = {
				imageUrl: '',
				certificate: '',
				certificateName: '',
				queryLinks: '',
				available: '',
			}
		},
    //添加
		addRangeForm(){
			this.dialogFormVisible = true;
			this.certificateInfo = {
				imageUrl:'',
				certificate:'',
				certificateName:'',
				queryLinks:'https:_euipo.europa.eu',
				available:'',
			}
		},
		//编辑按钮
		editCert(row){
			this.dialogFormVisible = true;
			this.certificateInfo = row;
			this.objStr = JSON.stringify(row)
      console.log(row)
		},
		//删除按钮
		deleteCert(scope){
			console.log(scope)
			this.tableData.splice(scope.$index, '1')
		}
	}
}
</script>

<style scoped>
  .formTips{
    color: red;
    font-size: 12px;
    line-height: 20px;
    margin-top: 0;
  }
</style>
