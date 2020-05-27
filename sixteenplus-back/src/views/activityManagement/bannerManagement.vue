<template>
    <div class="home">
        <el-row style="padding: 0 20px">
            <el-col :span="24" style="text-align: right">
                <el-button type="primary" size="small" @click="addBannerBtn">添加</el-button>
            </el-col>
        </el-row>
        <el-row style="padding: 0 20px">
            <el-table :data="tableData3" style="width: 100%" v-loading="loadingIcon">
                <el-table-column fixed prop="name" label="标题" width="250"></el-table-column>
                <el-table-column label="图片" width="">
                    <template slot-scope="scope">
                        <el-image style="width: 100px;height:100px" :src="scope.row.imgUrl" :preview-src-list="scope.row.imgUrl.split(',')"></el-image>
                    </template>
                </el-table-column>
                <el-table-column fixed="right" label="操作" width="230">
                    <template slot-scope="scope">
                        <el-button @click="deleteBanner(scope.row)" size="mini" type="danger">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-row>
        <el-dialog title="banner信息" :visible.sync="dialogFormVisible" :modal-append-to-body='false'>
            <el-form :model="userInfo" :rules="rules" ref="userInfo" label-width="100px" >
				<el-form-item label="类目">
					<el-cascader  :options="categoryOptions" @change="changeCategory" placeholder="请选择类目"></el-cascader>
				</el-form-item>
				<el-form-item label="商品">
					<el-select v-model="userInfo.products" placeholder="请选择商品">
						<el-option v-for="(item,index) in productList" :label="item.goodsName" :value="item.goodsId"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="标题" prop="name">
                    <el-input v-model="userInfo.name" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="活动图片" prop="imgUrl">
                    <el-upload
                    class="avatar-uploader"
                    action="/address/uploadFiles"
                    :show-file-list="false"
                    :on-success="handleAvatarSuccess"
                    :before-upload="beforeAvatarUpload">
                    <img v-if="userInfo.imgUrl" :src="userInfo.imgUrl" class="avatar">
                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button size="small" @click="cancel('userInfo')">取 消</el-button>
                <el-button size="small" type="primary" @click="addUser('userInfo')">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import {Dialog,Button,Form,FormItem,Input,Upload,TableColumn,Table,Row,Col} from 'element-ui';
export default {
    name: 'bannerManagement',
    components: {
        Dialog,Button,Form,FormItem,Input,Upload,TableColumn,Table,Row,Col
    },
    data() {
        return {
			loadingIcon: true,
            tableData3: [],
			dialogFormVisible: false,
			userInfo: {
				products: '',
				imgUrl:'',
				name: '',
				description: '',
			},
			categoryOptions:[],//类目
			productList: [],
			categories: '',
			rules: {
				imgUrl: [
					{ required: true, message: '请选择活动图片', trigger: 'blur' }
				],
				name: [
					{ required: true, message: '请输入活动名称', trigger: 'blur' }
				]
			}
        }
    },
    created(){
		this.loading();
	},
	methods: {
		handleAvatarSuccess(res, file) {
			this.userInfo.imgUrl = res.data;
		},
		beforeAvatarUpload(file) {
			return true;
		},
		addUser(formName){
			this.$refs[formName].validate((valid) => {
				if (valid) {
					var parm = this.userInfo;
					this.$http({method:'post', url:'/implement/add', data:parm}).then((result) => {
						var data = result.data;
						if(data.successful && (data.status==200)){
							this.loading();
							this.dialogFormVisible = false;
							this.userInfo = '';
							this.$message({
								type: 'success',
								message: "banner设置成功"
							})
						}else{
							this.$message.error(data.resultCode.message);
						}
					},(error) => {
						this.$message.error('保存失败');
					});
				} else {
					console.log('error submit!!');
					return false;
				}
			});
		},
		//新增按钮
		addBannerBtn(){
			this.userInfo.imgUrl = "";
			this.userInfo.name = "";
			this.userInfo.products = '';
			this.dialogFormVisible = true;
			this.queryType();
		},
		//关闭新增
		cancel(formName){
			this.$refs[formName].resetFields();
			this.dialogFormVisible = false
		},
		//初始化列表
		loading(){
			var vm = this;
			var parm={}
			this.$http({method:'post', url:'/implement/getList', data:parm}).then((result) => {
				var data = result.data;
				this.loadingIcon = false;
				if(data.successful && (data.status==200)){
					this.tableData3 = data.data;
				}else{
					vm.$message.error('查询失败');
				}
			},(error) => {
				vm.$message.error('查询失败');
			});
		},
		deleteBanner(row){
			this.$confirm('确定删除吗?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			}).then(() => {
				this.$http({method:'get', url:'/implement/delete?id='+row.id}).then((result) => {
						var data = result.data;
						if(data.successful && (data.status==200)){
							this.loading();
							this.$message({
								type: 'success',
								message: "banner删除成功"
							})
						}else{
							this.$message.error(data.resultCode.message);
						}
					},(error) => {
						this.$message.error('保存失败');
					});
			}).catch(() => {
				
			});
		},
		queryType() {
				this.$http({method: 'post', url: '/goodsType/query', data: {}}).then((result) => {
					let data = result.data;
					if (data.successful && (data.status == 200)) {
						if (data.data) {
							let menuList = data.data;
							for (let item of menuList) {
								item.value = item.id;
								item.label = item.typeDesc;
								for (let item2 of item.children) {
									item2.value = item2.id;
									item2.label = item2.typeDesc;
									if (item2.children.length > 0) {
										for (let item3 of item2.children) {
											item3.value = item3.id;
											item3.label = item3.typeDesc;
										}
									} else {
										delete item2.children
									}
								}
							}
							this.categoryOptions = menuList;
							let goodsId = this.$route.query.goodsId;
						}
					} else {
						this.$message.error('查询失败');
					}
				}, (error) => {
					this.$message.error('查询失败');
				});
			},
			getJson(arr){
				let newJson = [];
				for (let i in arr) {
					let obj = {value: i, label: arr[i]}
					newJson.push(obj)
				}
				return newJson;
			},
			//根据类目查询维度
			changeCategory(value){
				this.categories = value[value.length -1];
				this.$http.get('/dictionary/getList?category=' + value[0]).then((result) => {
					let data = result.data;
					if (data.successful) {
						for (let item of data.data) {
							switch (item.type) {
								case 'certificate'://证书
									this.certificationOptions = this.getJson(item.values);
									break;
								case 'terms_of_payment'://付款方式
									this.paymentOptions = this.getJson(item.values);
									break;
								case 'trade_terms'://运输方式
									this.shipingModeOptions = this.getJson(item.values);
									break;
								case '':
									break;
							}
						}
						console.log(this.shapeOptions)
					}
				}, (error) => {

				}),
                this.$http({method: 'post',url: '/goods/getListPageByType',data:{category:value[value.length -1],status:1,pageNumber:1,pageSize:9999}}).then((result) => {
                    this.productList = result.data.data.list;
					this.productList.map((item,index) => {
						this.userInfo.description = item.goodsId;
					})
                })
			},
	}
}
</script>

<style>
    .avatar-uploader .el-upload {
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
    }
    .avatar-uploader .el-upload:hover {
        border-color: #409EFF;
    }
    .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 50px;
        height: 50px;
        line-height: 50px;
        text-align: center;
    }
    .avatar {
        width: 50px;
        height: 50px;
        display: block;
    }
</style>