<template>
    <div>
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
      <span><el-link type="success" href="/student/blog/add" :disabled="studentlogin">通知公告</el-link></span>
      <el-divider direction="vertical"></el-divider>
      <span v-show="!studentlogin"><el-link type="danger" href="/login">登录</el-link></span>

      <span v-show="studentlogin" ><el-link type="danger" @click="logout">退出</el-link></span>
    </div>

  </div>
        <div class="block">
      <el-timeline>

        <el-timeline-item :timestamp="blog.created" placement="top" v-for="blog in blogs" :key=blog.blogId>
          <el-card>
            <h4>
              <router-link :to="{name: 'BlogDetail', params: {blogId: blog.id}}">
                {{blog.title}}
              </router-link>
            </h4>
            <p>简介：{{blog.desription}}</p>
            <p>作者：{{blog.userName}}</p>
          </el-card>
        </el-timeline-item>

      </el-timeline>

      <el-pagination class="mpage"
                     background
                     layout="prev, pager, next"
                     :current-page="currentPage"
                     :page-size="pageSize"
                     :total="total"
                     @current-change=page>
      </el-pagination>

    </div>
    <Footer></Footer>
    </div>
</template>
<script>
import Footer from "../components/Footer";
export default {
    name: "StudentBlogs",
    components: {Footer},
    data() {
      return {
        blogs: {},
        currentPage: 1,
        total: 0,
        pageSize: 5,
        student: {
          student_name: '请先登录学生账号',
          avatar: 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'
        },
        studentlogin: false,
      }
    },
    methods: {
      page(currentPage) {
        const _this = this
        _this.$axios.get("/blogs?currentPage=" + currentPage).then(res => {
          console.log(res)
          _this.blogs = res.data.data.records
          _this.currentPage = res.data.data.current
          _this.total = res.data.data.total
          _this.pageSize = res.data.data.size

        })
      },
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
      this.page(1)

      if(this.$store.getters.getStudent.student_name) {
        this.student.student_name = this.$store.getters.getStudent.student_name
        this.student.avatar = this.$store.getters.getStudent.avatar
        this.studentlogin = true
    }
    }
}
</script>
<style scoped>

  .mpage {
    margin: 0 auto;
    text-align: center;
  }

    .m-content {
    max-width: 960px;
    margin: 0 auto;
    text-align: center;
  }
  .maction {
    margin: 10px 0;
  }

</style>