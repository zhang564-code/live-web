<template>
    <div>
        <TeacherHeader></TeacherHeader>
        <div class="m-content">

      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="笔记名称" prop="title">
          <el-input v-model="ruleForm.title"></el-input>
        </el-form-item>

        <el-form-item label="笔记简介" prop="desription">
          <el-input type="textarea" v-model="ruleForm.desription"></el-input>
        </el-form-item>

        <el-form-item label="笔记内容" prop="content">
          <mavon-editor v-model="ruleForm.content"></mavon-editor>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')">立即创建</el-button>
          <el-button @click="resetForm('ruleForm')">重置</el-button>
        </el-form-item>
      </el-form>

    </div>
    <Footer></Footer>
    </div>
</template>
<script>
import TeacherHeader from '../components/teacher/TeacherHeader'
import Footer from "../components/Footer";
export default {
    name: "TeacherAddBlog",
    components: {Footer,TeacherHeader},
    data() {
      return {
        ruleForm: {
          id: '',
          title: '',
          desription: '',
          content: ''
        },
        rules: {
          title: [
            { required: true, message: '请输入笔记名称', trigger: 'blur' },
            { min: 3, max: 25, message: '长度在 3 到 25 个字符', trigger: 'blur' }
          ],
          desription: [
            { required: true, message: '请输入笔记简介', trigger: 'blur' }
          ],
          content: [
            { trequired: true, message: '请输入笔记内容', trigger: 'blur' }
          ]
        }
      };
    },
    methods: {
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {

            const _this = this
            this.$axios.post('/blog/teacher/edit', this.ruleForm, {
              headers: {
                "Authorization": localStorage.getItem("token")
              }
            }).then(res => {
              console.log(res)
              _this.$alert('操作成功', '提示', {
                confirmButtonText: '确定',
                callback: action => {
                  _this.$router.push("/teacher/blogs")
                }
              });

            })

          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      }
    },
    created() {
      const blogId = this.$route.params.blogId
      console.log(blogId)
      const _this = this
      if(blogId) {
        this.$axios.get('/blog/' + blogId).then(res => {
          const blog = res.data.data
          _this.ruleForm.id = blog.id
          _this.ruleForm.title = blog.title
          _this.ruleForm.desription = blog.desription
          _this.ruleForm.content = blog.content
        })
      }

    }
}
</script>
<style scoped>
  .m-content {
    text-align: center;
  }
</style>