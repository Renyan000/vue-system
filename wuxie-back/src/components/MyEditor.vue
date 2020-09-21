<template>
    <div class="quill_box">
        <quill-editor
            v-model="content"
            ref="myTextEditor"
            class="ql-editor-class"
            :options="editorOption"
            @blur="onEditorBlur($event)"
            @focus="onEditorFocus($event)"
            @change="onEditorChange($event)"
        >
            <div :id="id" slot="toolbar">
                <select class="ql-size">
                    <option value="small">小</option>
                    <option selected>常规</option>
                    <option value="large">大</option>
                    <option value="huge">特大</option>
                </select>
                <!-- Add subscript and superscript buttons -->
                <span class="ql-formats">
                    <button type="button" class="ql-bold"></button>
                </span>
                <span class="ql-formats">
                    <select class="ql-color">
                        <option selected="selected"></option>
                        <option value="#e60000"></option>
                        <option value="#ff9900"></option>
                        <option value="#ffff00"></option>
                        <option value="#008a00"></option>
                        <option value="#0066cc"></option>
                        <option value="#9933ff"></option>
                        <option value="#ffffff"></option>
                        <option value="#facccc"></option>
                        <option value="#ffebcc"></option>
                        <option value="#ffffcc"></option>
                        <option value="#cce8cc"></option>
                        <option value="#cce0f5"></option>
                        <option value="#ebd6ff"></option>
                        <option value="#bbbbbb"></option>
                        <option value="#f06666"></option>
                        <option value="#ffc266"></option>
                        <option value="#ffff66"></option>
                        <option value="#66b966"></option>
                        <option value="#66a3e0"></option>
                        <option value="#c285ff"></option>
                        <option value="#888888"></option>
                        <option value="#a10000"></option>
                        <option value="#b26b00"></option>
                        <option value="#b2b200"></option>
                        <option value="#006100"></option>
                        <option value="#0047b2"></option>
                        <option value="#6b24b2"></option>
                        <option value="#444444"></option>
                        <option value="#5c0000"></option>
                        <option value="#663d00"></option>
                        <option value="#666600"></option>
                        <option value="#003700"></option>
                        <option value="#002966"></option>
                        <option value="#3d1466"></option>
                    </select>
                </span>
                <span class="ql-formats">
                  <select class="ql-background">
                    <option value="#000000"></option>
                    <option value="#e60000"></option>
                    <option value="#ff9900"></option>
                    <option value="#ffff00"></option>
                    <option value="#008a00"></option>
                    <option value="#0066cc"></option>
                    <option value="#9933ff"></option>
                    <option selected="selected"></option>
                    <option value="#facccc"></option>
                    <option value="#ffebcc"></option>
                    <option value="#ffffcc"></option>
                    <option value="#cce8cc"></option>
                    <option value="#cce0f5"></option>
                    <option value="#ebd6ff"></option>
                    <option value="#bbbbbb"></option>
                    <option value="#f06666"></option>
                    <option value="#ffc266"></option>
                    <option value="#ffff66"></option>
                    <option value="#66b966"></option>
                    <option value="#66a3e0"></option>
                    <option value="#c285ff"></option>
                    <option value="#888888"></option>
                    <option value="#a10000"></option>
                    <option value="#b26b00"></option>
                    <option value="#b2b200"></option>
                    <option value="#006100"></option>
                    <option value="#0047b2"></option>
                    <option value="#6b24b2"></option>
                    <option value="#444444"></option>
                    <option value="#5c0000"></option>
                    <option value="#663d00"></option>
                    <option value="#666600"></option>
                    <option value="#003700"></option>
                    <option value="#002966"></option>
                    <option value="#3d1466"></option>
                  </select>
                </span>
                <span class="ql-formats">
                  <button type="button" class="ql-italic"></button>
                </span>
                <span class="ql-formats">
                  <button type="button" class="ql-underline"></button>
                </span>
                <span class="ql-formats">
                  <button type="button" class="ql-strike"></button>
                </span>
                <span class="ql-formats">
                  <button type="button" class="ql-blockquote"></button>
                </span>
                <span class="ql-formats">
                  <button type="button" class="ql-list" value="ordered"></button>
                </span>
                <span class="ql-formats">
                  <button type="button" class="ql-list" value="bullet"></button>
                </span>
                <span class="ql-formats">
                  <button type="button" class="ql-link"></button>
                </span>
                <span class="ql-formats">
                  <button type="button" @click="imgClick" style="outline:none">
                    <svg viewBox="0 0 18 18" style="vertical-align: top">
                      <rect class="ql-stroke" height="10" width="12" x="3" y="4"/>
                      <circle class="ql-fill" cx="6" cy="7" r="1"/>
                      <polyline class="ql-even ql-fill" points="5 12 5 11 7 9 8 10 11 7 13 9 13 12 5 12"/>
                    </svg>
                  </button>
                </span>
            </div>
        </quill-editor>
    </div>
</template>
<script>
	/*import { imgUpload } from "../../http/api";*/

	// 富文本编辑器
//	import VueQuillEditor from "vue-quill-editor";
	import { quillEditor } from 'vue-quill-editor'
	// require styles 引入样式
	import "quill/dist/quill.core.css";
	import "quill/dist/quill.snow.css";
	import "quill/dist/quill.bubble.css";

	export default {
		name: 'myQuill',
		components: {
			quillEditor
		},
		data() {
			let _this = this;
			return {
				content: "",
				editorOption: {
					placeholder: "请在此处编辑富文本",
					modules: {
						toolbar: '#'+_this.id
					}
				}
			};
		},
		computed: {
			editor() {
				return this.$refs.myTextEditor.quill;
			}
		},
		props: {
			id:'',
			//默认内容
			contentDefault: {
				type: String,
				default: ""
			},
            /*上传图片的地址*/
			uploadUrl: {
				type: String,
				default: "/"
			},
            /*上传图片的file控件name*/
			fileName: {
				type: String,
				default: "file"
			}
		},
		watch: {
			contentDefault: function() {
				this.content = this.contentDefault;
			}
		},
		mounted: function() {
			this.content = this.contentDefault;
		},
		methods: {
			onEditorBlur() {
				//失去焦点事件
				// console.log('失去焦点');
			},
			onEditorFocus() {
				//获得焦点事件
				// console.log('获得焦点事件');
			},
			onEditorChange() {
				//内容改变事件
//				 console.log(this.content);
				this.$emit("getcode", this.content);
			},

            /*点击上传图片按钮*/
			imgClick() {
				// if (this.uploadUrl=='/') {
				//   console.log('no editor uploadUrl');
				//   return;
				// };
                /*内存创建input file*/
				var input = document.createElement("input");
				input.type = "file";
				input.name = this.fileName;
				input.accept = "image/jpeg,image/png,image/jpg,image/gif";
				input.onchange = this.onFileChange;
				input.click();
			},
            /*选择上传图片切换*/
			onFileChange(e) {
				var fileInput = e.target;
				if (fileInput.files.length === 0) {
					return;
				}
				this.editor.focus();
				if (fileInput.files[0].size > 1024 * 1024 * 2) {
					this.$message.error("图片不能大于2M", "图片尺寸过大");
				}
				this.uploadFilePic(fileInput.files[0]);
			},
			// 上传图片到服务器
			uploadFilePic: function(imgSource) {
				console.log(imgSource);

				let formData = new FormData();
				formData.append("file", imgSource);
                this.$http.post('/address/uploadFiles',formData).then((result) => {
	                console.log(result);
                    // 获取光标所在位置
                    let length = this.editor.getSelection().index;
                    this.editor.insertEmbed(length, 'image',result.data.data);
                    // 调整光标到最后
                    this.editor.setSelection(length + 1)
                },(error) => {

                })
			}
		}
	};
</script>

<style scoped>
    /*.ql-editor-class {*/
        /*-webkit-box-sizing: border-box;*/
        /*box-sizing: border-box;*/
        /*line-height: 1.42;*/
        /*height: 100%;*/
        /*outline: none;*/
        /*padding: 0 !important;*/
        /*tab-size: 4;*/
        /*-moz-tab-size: 4;*/
        /*text-align: left;*/
        /*word-wrap: break-word;*/
    /*}*/
    .quill_box .select{outline: none;}
    .quill_box .ql-toolbar.ql-snow {
        border-color: #dcdfe6;
    }
    .ql-container {
        height: 200px !important;
        border-color: #dcdfe6;
    }
    .ql-snow .ql-color-picker .ql-picker-label svg,
    .ql-snow .ql-icon-picker .ql-picker-label svg {
        position: relative;
        top: -6px;
    }
    .ql-color{padding-top:3px;}
    .ql-background{padding-top:2px;}
    .ql-size{height:30px;line-height:30px;}
    .ql-size[data-v-2eccf42e]{
      height: 40px;
      line-height: 40px;
    }
</style>
<style>
  .ql-color,.ql-background{
    padding-top: 0!important;
  }
  .ql-color svg,.ql-background svg{
    vertical-align: top!important;
  }
</style>