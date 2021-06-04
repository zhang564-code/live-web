<template>
    <div>
        <TeacherHeader></TeacherHeader>
        <div>

      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="直播名称" prop="livename" label-width="670px">
          <el-input v-model="ruleForm.livename"></el-input>
        </el-form-item>
        <el-form-item label="直播教师" prop="user_name"  label-width="670px">
          <el-input v-model="ruleForm.user_name"></el-input>
        </el-form-item>
        <el-form-item label="直播班级" prop="className"  label-width="670px">
      <el-select v-model="ruleForm.className" auto-complete="off" placeholder="请选择班级">
        <el-option v-for="item in classrooms" :key="item.id" :label="item.className" :value="item.className"></el-option>
      </el-select>
    </el-form-item>
    <div class="m-button" >
      <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')">立即创建</el-button>
          <el-button @click="resetForm('ruleForm')">重置</el-button>
        </el-form-item>
    </div>
        
      </el-form>

    </div>
    <Footer></Footer>
    </div>
</template>
<script>
import TeacherHeader from "../components/teacher/TeacherHeader";
import Footer from "../components/Footer";
export default {
    name: "LiveEdit",
    components: {Footer,TeacherHeader},
    data() {
      return {
        ruleForm: {
          id: '',
          livename: '',
          user_name: '',
          className:''
        },
        classrooms: [],
        rules: {
          livename: [
            { required: true, message: '请输入直播名称', trigger: 'blur' },
            { min: 3, max: 25, message: '长度在 3 到 25 个字符', trigger: 'blur' }
          ],
          user_name: [
            { required: true, message: '请输入教师名称', trigger: 'blur' },
            { min: 3, max: 25, message: '长度在 3 到 25 个字符', trigger: 'blur' }
          ],
          className: [
            { required: true, message: '请输入直播名称', trigger: 'blur' }
          ]
        }
      };
    },
    methods: {
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {

            const _this = this
            this.$axios.post('/live/edit', this.ruleForm, {
              headers: {
                "Authorization": localStorage.getItem("token")
              }
            }).then(res => {
              console.log(res)
              _this.$alert('操作成功', '提示', {
                confirmButtonText: '确定',
                callback: action => {
                  _this.$router.push("/teacher/lives")
                }
              });

            }).catch((e) => {});

          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },
      getchioce(){
        this.$http.post('/classroom').then(res =>{
          this.classrooms=res.data.data
        })
      },
    },
    created() {
      const liveId = this.$route.params.liveId
      console.log(liveId)
      const _this = this
      if(liveId) {
        this.$axios.get('/live/livestream/' + liveId).then(res => {
          const live = res.data.data
          _this.ruleForm.id = live.id
          _this.ruleForm.livename = live.livename
          _this.ruleForm.user_name = live.user_name
          _this.ruleForm.className = live.className
        })
      }

    },
    mounted(){
      this.getchioce()
    },
}
</script>
<style scoped>
   .el-input {
     margin-top: 5px;
    width:250px;
  }
  .m-button{
    text-align: center;
  }
</style>