<template>
    <div>
      
        <el-row>
          <el-col :span="12">
              <div class="mlive">
            <h2> {{ live.livename }}</h2>
            <el-link icon="el-icon-edit" v-if="ownLive">
              <router-link :to="{name: 'LiveEdit', params: {liveId: live.id}}" >
              编辑
              </router-link>
            </el-link>
            <div v-if="val===''">
              视频播放失败
            </div>
            <video v-else id="my-video"
                            class="video-js vjs-default-skin"
                            controls autoplay
                            preload="auto"
                            width="700px">
                            <source :src=val type="application/x-mpegURL" />
                      </video>
            <el-divider></el-divider>
            
          串流地址:rtmp://192.168.228.4/live/livestream
          密钥：{{live.id}}
          
            </div></el-col>
            <el-col :span="12"><div class="fontChat"><Chating></Chating></div></el-col>
          </el-row>
          
      <Footer></Footer>
    </div>
</template>
<script>
import 'github-markdown-css'
//import TeacherHeader from '../components/teacher/TeacherHeader'
import Footer from "../components/Footer";
// import LiveChat from "../components/chat/LiveChat";
//import FontChat from "../components/chat/FontChat";
import Chating from "../components/chat/Chating";
//引入video样式
import 'video.js/dist/video-js.css'
import videojs from "video.js";
import 'vue-video-player/src/custom-theme.css'
import 'videojs-contrib-hls'
export default {
    name: "LiveDetail",
    components: {Footer,Chating},
    data() {
      return {
        live: {
          id: "",
          livename: ""
        },
        ownLive: false,
        val: ""//`http://192.168.228.4:8081/live/livestream/${live.userId}.m3u8`
      }
    },
    methods: {
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
	}
    },
    mounted() {
    this.getVideo();
    window.location.reload();
              },
    created() {
      
      const liveId = this.$route.params.liveId
      console.log(liveId)
      const _this = this
      this.$axios.get('/live/livestream/' +liveId).then(res => {
        const live = res.data.data
        _this.live.id = live.id
        console.log(_this.live.id)
        _this.live.livename = live.livename
        _this.val = "http://192.168.228.4:8081/live/livestream/" + _this.live.id + ".m3u8"
        
        
        let _that = this;
        setTimeout(() => {
	 _that.getVideo();
}, 600);
      })
    },
    destroyed () {
    this.player.dispose()
}
}
</script>
<style scoped>
  .mlive {
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    width: 100%;
    min-height: 700px;
    padding: 20px 15px;
  }
  .fontChat {
    margin-top: 100px;
    margin-right: 200px;
    float:right;
    
    
  }

</style>