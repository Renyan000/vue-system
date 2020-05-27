<template>
  <div class="">
      <quill-editor ref="text" v-model="options" class="myQuillEditor" />
      <!--<el-row style="margin-bottom: 15px"><el-button type="warning" @click="submit" size="small">暂存</el-button></el-row>-->
  </div>
</template>

<script>
    import { quillEditor } from 'vue-quill-editor'
    import 'quill/dist/quill.core.css'
    import 'quill/dist/quill.snow.css'
    import 'quill/dist/quill.bubble.css'
    import ElRow from "element-ui/packages/row/src/row";
export default {
    name: 'QuillEdit',
	components: {
		ElRow,
		quillEditor
	},
    props: {
	    editorOptions: String
    },
	created(){
		this.options = this.editorOptions;
	},
	data() {
		return {
			options:''
		}
	},
	methods:{
	    submit() {
            console.log('提交')
        },
		onEditorChange(editor) {
	    	console.log(editor)
//            this.editorOptions = editor.html
		},
    }
}
</script>
<style>
    .myQuillEditor{
        height: 200px;
    }
    .ql-container{
        height: 140px;
    }
</style>