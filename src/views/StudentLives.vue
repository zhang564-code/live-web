<template>
    
    <div id="vs">
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
      <span><el-link type="primary" href="/student/live/add" :disabled="studentlogin">创建直播</el-link></span>
      <el-divider direction="vertical"></el-divider>
      <span><el-link type="success" href="/student/blog/add" :disabled="studentlogin">通知公告</el-link></span>
      <el-divider direction="vertical"></el-divider>
      <span v-show="!studentlogin"><el-link type="danger" href="/login">登录</el-link></span>

      <span v-show="studentlogin" ><el-link type="danger" @click="logout">退出</el-link></span>
    </div>

  </div>
        <div class="block">
          <!-- <Player></Player> -->
          <!-- <itcastvideo src='http://192.168.228.4:8081/live/livestream.flv'></itcastvideo> -->
      <el-timeline>

        <el-timeline-item :timestamp="live.date" placement="top" v-for="live in lives" :key=live.liveId>
          <el-card>
            <el-row>
              <el-col :span="11"><div><h4>
               <!-- <router-link :to="{name: 'LiveDetail', params: {liveId: live.id}}">  -->
                {{live.livename}}
               <!-- </router-link>  -->
            </h4>
            <h4>{{live.userName}}</h4>
                <!-- <div class="player-container">
                    <video-player class="video-player vjs-custom-skin" :playsinline="true" :options="playerOptions"></video-player>
                </div> -->
                
                <video id="my-video"
                      class="video-js vjs-default-skin"
                      controls
                      preload="auto"
                      width="900px">
                      <source :src=val type="application/x-mpegURL" />
                </video></div></el-col>
              <el-col :span="13"><div class="fontChat"><Chating></Chating></div></el-col>
            </el-row>
            
                
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
//import LiveChat from "../components/chat/LiveChat";
//import FontChat from "../components/chat/FontChat";
import Chating from "../components/chat/Chating";
//引入video样式
import 'video.js/dist/video-js.css'
import videojs from "video.js";
import 'vue-video-player/src/custom-theme.css'
import 'videojs-contrib-hls'
//import "videojs-flash"
//import itcastvideo from 'myzhangvideo'
//import Player from 'xgplayer'
// const player = new Player({
//   id: 'vs',
//   url: 'http://192.168.228.4:8081/live/livestream.flv'
// })
export default {
    name: "StudentLives",
    components: {Footer,Chating},
    data() {
      return {
        lives: {},
        student: {
          student_name: '请先登录学生账号',
          avatar: 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png',
          class_name: this.$store.getters.getStudent.class_name
        },
        class_name: this.$store.getters.getStudent.class_name,
        studentlogin: false,
        currentPage: 1,
        total: 0,
        temp: 0,
        pageSize: 5,
        val: ""
        // playerOptions: {
        //   playbackRates: [0.7, 1.0, 1.5, 2.0], //播放速度
        //   autoplay: true, //如果true,浏览器准备好时开始回放。
        //   controls: true, //控制条
        //   preload: 'auto', //视频预加载
        //   muted: false, //默认情况下将会消除任何音频。
        //   loop: false, //导致视频一结束就重新开始。
        //   language: 'zh-CN',
        //   //techOrder: ['flash'],
        //   aspectRatio: '16:9', // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
        //   fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
        //   sources: [{
        //     type: 'application/x-mpegURL',
        //     src: 'http://192.168.228.4:8081/live/livestream.m3u8'//你所放置的视频的地址，最好是放在服务器上
        //   }],
        //   poster: "https://img2.baidu.com/it/u=2164794023,1537310268&fm=26&fmt=auto&gp=0.jpg", //你的封面地址（覆盖在视频上面的图片）
        //   width: document.documentElement.clientWidth,
        //   notSupportedMessage: '此视频暂无法播放，请稍后再试' //允许覆盖Video.js无法播放媒体源时显示的默认信息。
        // }
      }
    },
    methods: {
      page(currentPage) {
        const _this = this
        _this.$axios.get("/lives?currentPage=" + currentPage).then(res => {
          
          _this.temp = res.data.data.total
          _this.val= "http://192.168.228.4:8081/live/livestream/" + _this.temp+".m3u8"

        })
        _this.$axios.get("/classroom/lives?currentPage=" + currentPage,{params:{class_name:this.$store.getters.getStudent.class_name}}).then(res => {
          console.log(res)
          _this.lives = res.data.data.records
          _this.currentPage = res.data.data.current
          _this.total = res.data.data.total
          _this.pageSize = res.data.data.size
           _this.class_name = this.$store.getters.getStudent.class_name
          
          console.log(_this.val)
        })
      },
      getVideo() {
	      videojs(
	       "my-video",
	       {
	           bigPlayButton: false,
	           textTrackDisplay: false,
	           posterImage: true,
	           errorDisplay: false,
	           controlBar: true
	       },
	       function() {
	           this.play();
	       }
	   );
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
    mounted() {
    this.getVideo();
              },
    created() {
        
      let _that = this;
setTimeout(() => {
	 _that.getVideo();
}, 1000);
      this.page(1)
      if(this.$store.getters.getStudent.student_name) {
        this.student.student_name = this.$store.getters.getStudent.student_name
        this.student.avatar = this.$store.getters.getStudent.avatar
        this.student.class_name = this.$store.getters.getStudent.class_name
        this.studentlogin = true}
        console.log(this.student.class_name)
      
    },
    destroyed () {
    this.player.dispose()
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

  .fontChat {
    margin-top: 100px;
    margin-right: 2px;
    float:right;
  }

</style>