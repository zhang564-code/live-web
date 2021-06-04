import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Element from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import axios from 'axios'
import VueAxios from 'vue-axios'
import './axios'
import mavonEditor from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'
import './permission'
import VideoPlayer from 'vue-video-player'
import hls from 'videojs-contrib-hls'
import 'video.js/dist/video-js.css'

Vue.config.productionTip = false
Vue.use(Element)
Vue.use(mavonEditor)
Vue.use(VideoPlayer)
Vue.use(hls)
Vue.use(VueAxios,axios)
Vue.prototype.$axios = axios

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
