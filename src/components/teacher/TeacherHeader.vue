<template>
  <div class="m-content">
    <h3>欢迎来到河北地质大学の在线课堂</h3>
    <div class="block">
      <el-avatar :size="50" :src="teacher.avatar" v-show="teacherlogin"></el-avatar>
      <div v-show="teacherlogin">{{ teacher.teacher_name }}</div>
    </div>

    <div class="maction">
      <span><el-link href="/teacher/blogs">主页</el-link></span>
      <el-divider direction="vertical"></el-divider>
      <span><el-link type="info" href="/teacher/lives">直播主页</el-link></span>
      <el-divider direction="vertical"></el-divider>
      <span><el-link type="primary" href="/live/add" :disabled="!teacherlogin">创建直播</el-link></span>
      <el-divider direction="vertical"></el-divider>
      <span><el-link type="success" href="/teacher/blog/add" :disabled="!teacherlogin">通知公告</el-link></span>
      <el-divider direction="vertical"></el-divider>
      <span v-show="!teacherlogin"><el-link type="danger" href="/login">登录</el-link></span>

      <span v-show="teacherlogin" ><el-link type="danger" @click="logout">退出</el-link></span>
    </div>

  </div>
</template>

<script>
  export default {
    name: "TeacherHeader",
    data() {
      return {
        
        teacher: {
          teacher_name: '请先登录教师账号',
          avatar: 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'
        },
        teacherlogin: false
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
          
          _this.$store.commit("REMOVE_INFOT")
          _this.$router.push("/login")

        }).catch(function(error) {
          _this.$router.push("/login")
        })
      }
    },
    created() {
      
      if(this.$store.getters.getTeacher.teacher_name) {
        this.teacher.teacher_name = this.$store.getters.getTeacher.teacher_name
        this.teacher.avatar = this.$store.getters.getTeacher.avatar
        
        this.teacherlogin = true
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