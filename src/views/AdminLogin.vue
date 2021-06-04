<template>
    <div :style="backgroundDiv">
        <el-container>
          
      <el-header>
        
        <hr>
      </el-header>
      <el-header></el-header>
      <el-header></el-header>
      <h1 class="title">欢迎来到在线教学直播系统后台！</h1>
      
      <el-main>
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
          <el-form-item label="管理员账号" prop="username">
            <el-input v-model="ruleForm.username" @keydown.enter.native="submitForm"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input type="password" v-model="ruleForm.password" @keydown.enter.native="submitForm"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="success" @click="submitForm('ruleForm')">立即登录</el-button>
            <el-button type="info" v-on:click="toStudentLogin">学生登录</el-button>
            <el-button type="info" v-on:click="toTeacherLogin">教师登录</el-button>
            <!-- <el-button type="info" v-on:click="registerForm">立即注册</el-button> -->
            <!-- <el-button @click="resetForm('ruleForm')">取消</el-button> -->
          </el-form-item>
        </el-form>

      </el-main>
      <el-header></el-header>
      <el-header></el-header>
      <el-header></el-header>
      <el-header></el-header>
      <el-header></el-header>
      
    </el-container>
    </div>
</template>
<script>
export default {
    name: "Login",
    data() {
      return {
        ruleForm: {
          username: '请选择身份，进行登录',
          password: '111111'
        },
        backgroundDiv : {
        backgroundImage : 'url(' + require("../assets/img3.webp") + ')',
        backgroundRepeat : 'repeat',
        backgroundSize : '45vh 15vw',
      },
        rules: {
          username: [
            { required: true, message: '请输入管理员账号', trigger: 'blur' },
            { min: 3, max: 15, message: '长度在 3 到 15 个字符', trigger: 'blur' }
          ],
          password: [
            { required: true, message: '请输入密码', trigger: 'change' }
          ]
        }
      };
    },
    methods: {
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            const _this = this
            this.$axios.post('/admin/login', this.ruleForm).then(res => {

              console.log(res.data)
              const jwt = res.headers['authorization']
              const userInfo = res.data.data

              // 把数据共享出去
              _this.$store.commit("SET_TOKEN", jwt)
              _this.$store.commit("SET_USERINFO", userInfo)

              // 获取
              console.log(_this.$store.getters.getUser)

              _this.$router.push("/admin")
              this.$message.success('登录成功')
            })

          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      registerForm() {
            const _this = this
            _this.$router.push("/register")
      },
      toStudentLogin() {
            const _this = this
            _this.$router.push("/student/login")
      },
      toTeacherLogin() {
            const _this = this
            _this.$router.push("/teacher/login")
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      }
    }
}
</script>
<style scoped>
  .el-header, .el-footer {
    color: #333;
    text-align: center;
    line-height: 200px;
  }

  .el-aside {
    background-color: #D3DCE6;
    color: #333;
    text-align: center;
    line-height: 200px;
  }

  .el-main {
    /*background-color: #E9EEF3;*/
    float: left;
    color: #333;
    text-align: center;
    line-height: 360px;
  }

  body > .el-container {
    margin-bottom: 40px;
  }

  .title {
    text-align: center;
    color: yellow;
  }

  .el-container:nth-child(5) .el-aside,
  .el-container:nth-child(6) .el-aside {
    line-height: 260px;
  }

  .el-container:nth-child(7) .el-aside {
    line-height: 320px;
  }

  .demo-ruleForm {
    margin-top: 60px;
    max-width: 500px;
    margin: 0 auto;
  }

</style>
