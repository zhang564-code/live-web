<template>
    <div id="vs">
        <TeacherHeader></TeacherHeader>
        <div class="block">
          <!-- <Player></Player> -->
          <!-- <itcastvideo src='http://192.168.228.4:8081/live/livestream.flv'></itcastvideo> -->
      <el-timeline>

        <el-timeline-item :timestamp="live.date" placement="top" v-for="live in lives" :key=live.liveId>
          <el-card>
            <h4>
              <router-link :to="{name: 'LiveDetail', params: {liveId: live.id}}">
                {{live.livename}}
              </router-link>
            </h4>
                <!-- <div class="player-container">
                    <video-player class="video-player vjs-custom-skin" :playsinline="true" :options="playerOptions"></video-player>
                </div> -->
                <video id="my-video"
                      class="video-js vjs-default-skin"
                      controls
                      preload="auto"
                      width="1000px">
                      <source src="http://192.168.228.4:8081/live/livestream.m3u8" type="application/x-mpegURL" />
                </video>
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
import TeacherHeader from '../components/teacher/TeacherHeader'
import Footer from "../components/Footer";
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
    name: "TeacherLives",
    components: {Footer,TeacherHeader},
    data() {
      return {
        lives: {},
        currentPage: 1,
        total: 0,
        pageSize: 5,
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
          console.log(res)
          _this.lives = res.data.data.records
          _this.currentPage = res.data.data.current
          _this.total = res.data.data.total
          _this.pageSize = res.data.data.size

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
	}
    },
    mounted() {
    this.getVideo();
              },
    created() {
      let _that = this;
setTimeout(() => {
	 _that.getVideo();
}, 500);
      this.page(1)
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

</style>