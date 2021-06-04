<template>
  <body id="paper">
  <el-form :model="registerForm" :rules="rules" class="login-container" label-position="left"
           label-width="0px" v-loading="loading">
    <h3 class="login_title">学生注册</h3>
    <el-form-item prop="student_name">
      <el-input type="text" v-model="registerForm.student_name"
                auto-complete="off" placeholder="账号"></el-input>
    </el-form-item>
    <el-form-item prop="password">
      <el-input type="password" v-model="registerForm.password"
                auto-complete="off" placeholder="密码"></el-input>
    </el-form-item>
    <el-form-item prop="passwordConfirm">
      <el-input type="password" v-model="registerForm.passwordConfirm"
                auto-complete="off" placeholder="确认密码"></el-input>
    </el-form-item>
    <el-form-item>
      <el-select v-model="registerForm.class_name" auto-complete="off" placeholder="请选择班级">
        <el-option v-for="item in classrooms" :key="item.id" :label="item.className" :value="item.className"></el-option>
      </el-select>
    </el-form-item>

    <el-form-item style="width: 100%">
      <el-button type="primary" style="width: 100%;background: #505458;border: none;" v-on:click="register">立即注册</el-button>
    </el-form-item>
    <el-form-item style="width: 100%">
      <el-button type="primary" style="width: 100%;background: #505458;border: none;" v-on:click="tologin">返回</el-button>
    </el-form-item>
  </el-form>
  </body>
</template>

<script>
export default{
  name: 'Register',
  data () {
    return {
      rules: {
        student_name: [{required: true, message: '用户名不能为空', trigger: 'blur'},
            { min: 3, max: 15, message: '长度在 3 到 15 个字符', trigger: 'blur' }],
        password: [{required: true, message: '密码不能为空', trigger: 'blur'}],
        passwordConfirm: [{required: true, message: '密码不能为空', trigger: 'blur'}]
      },
      checked: true,
      classrooms: [],
      registerForm: {
        student_name: '',
        password: '',
        passwordConfirm: '',
        class_name: ''
      },
      loading: false
    }
  },
  mounted(){
      this.getchioce()
    },
  methods: {
    register () {
      var _this = this
      if (this.registerForm.password !== this.registerForm.passwordConfirm) {
        this.$message({
          message: '两次输入的密码不一致',
          type: 'error'
        })
        return
      }
      this.axios.post("/student/register",{
            student_name:this.registerForm.student_name,
            password:this.registerForm.password,
            class_name:this.registerForm.class_name
          })
        .then(function (response) {
             console.log(response.data.code)
            if(response.data.code === 200){
              //alert("恭喜你，注册成功")
              _this.$message({
              duration:3000,
              message: '恭喜你，注册成功',
              type: 'success'
            })
            _this.$router.push("/student/login")
            }
            else {
              _this.$message({
              message: '该用户名已存在，请更换一个',
              type: 'error'
            })
            }
          })
        .catch(function (error) {
            console.log(error)
          })
    },
    tologin () {
      this.$router.push("/student/login")
    },
    getchioce(){
        this.$http.post('/classroom').then(res =>{
          this.classrooms=res.data.data
        })
      },
//     getItem1(val){
// //val即是传进来的id值，也即value值
//         var obj = {};
//         obj = this.classrooms.find((item) =>{
//           return item.id ===val;
//         });
//         console.log(obj.className)
//         console.log("id的值为："+val)
//       }
  }
}
</script>

<style>
  #paper {
    /*background:url("../assets/img/bg/eva1.jpg") no-repeat;*/
    background-position: center;
    height: 100%;
    width: 100%;
    background-size: cover;
    position: fixed;
  }
  body{
    margin: -5px 0px;
  }
  .login-container {
    border-radius: 15px;
    background-clip: padding-box;
    margin: 160px auto;
    width: 350px;
    padding: 35px 35px 15px 35px;
    background: #fff;
    border: 1px solid #eaeaea;
    box-shadow: 0 0 25px #cac6c6;
  }
  .login_title {
    margin: 0px auto 40px auto;
    text-align: center;
    color: #505458;
  }
  .login_remember {
    margin: 0px 0px 35px 0px;
    text-align: left;
  }
</style>
