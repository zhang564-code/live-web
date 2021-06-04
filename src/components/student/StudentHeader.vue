<template>
  <div class="m-content">
    <h3>欢迎来到河北地质大学の在线课堂</h3>
    <div class="block">
      <el-avatar :size="50" :src="student.avatar" v-show="studentlogin"></el-avatar>
      <div v-show="studentlogin">{{ student.student_name }}</div>
    </div>

    <div class="maction">
      <span><el-link href="/student/blogs">主页</el-link></span>
      <el-divider direction="vertical"></el-divider>
      <span><el-link type="info" href="/student/lives">直播主页</el-link></span>
      <el-divider direction="vertical"></el-divider>
      <span><el-link type="primary" href="/live/add" :disabled="studentlogin">创建直播</el-link></span>
      <el-divider direction="vertical"></el-divider>
      <span><el-link type="success" href="/student/blog/add" :disabled="!studentlogin">课堂笔记</el-link></span>
      <el-divider direction="vertical"></el-divider>
      <span v-show="!studentlogin"><el-link type="danger" href="/login">登录</el-link></span>

      <span v-show="studentlogin" ><el-link type="danger" @click="logout">退出</el-link></span>
    </div>

  </div>
</template>

<script>
  export default {
    name: "StudentHeader",
    data() {
      return {
        student: {
          student_name: '请先登录学生账号',
          avatar: 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'
        },
        studentlogin: false,
      }
    },
    methods: {
      logout() {
        const _this = this
        _this.$axios.get("/logout", {
          headers: {
            "Authorization": localStorage.getItem("token")
          }
        }).then(res => {
         
          _this.$store.commit("REMOVE_INFOS")
          _this.$router.push("/login")

        }).catch(function(error) {
          _this.$router.push("/login")
        })
      }
    },
    created() {
    
      if(this.$store.getters.getStudent.student_name) {
        this.student.student_name = this.$store.getters.getStudent.student_name
        this.student.avatar = this.$store.getters.getStudent.avatar
        this.studentlogin = true
      }

    }
  }
</script>

<style scoped>

  .m-content {
    max-width: 960px;
    margin: 0 auto;
    text-align: center;
  }
  .maction {
    margin: 10px 0;
  }

</style>