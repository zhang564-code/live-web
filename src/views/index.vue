<template>
  <div>
    <el-row type="flex" justify="center">
      <el-col :md="14">
        <div>
          <p class="mb-1 ml-2">点击退出登录</p>
          <p class="mt-1"><i class="el-icon-bottom" style="margin-left: 12px;"></i></p>
        </div>
        <el-card :body-style="{ padding: '10px' }" style="background-color: #E8E8E8; border: 1px solid #DDDDDD; border-bottom: 0;">
          <div style="height: 20px;">
            <div style="width: 20px; height: 20px; background-color: #DF7065; border-radius: 50%; float: left;" @click="webSokcetClose()"></div>
            <div style="width: 20px; height: 20px; background-color: #E6BB46; border-radius: 50%; float: left; margin-left: 10px;"></div>
            <div style="width: 20px; height: 20px; background-color: #5BCC8B; border-radius: 50%; float: left; margin-left: 10px;"></div>
          </div>
        </el-card>
        <el-card :body-style="{ padding: '0' }" style="border: 1px solid #DDDDDD; border-top: 0;">
          <el-row>
            <el-col :md="6" style=" height: 500px; border-right: 2px solid #DDDDDD; overflow: auto;">
              <el-card :body-style="{  'padding-top': '11px', 'padding-bottom': '12px', 'padding-left': '10px', 'padding-right': '12px' }" shadow="never">
                <div>
                  <el-input
                    size="mini"
                    placeholder="请输入内容"
                    v-model="input1">
                  </el-input>
                </div>
              </el-card>
              <div v-for="item in listUser" :key="item">
                <a href="javascript:void(0);" @click="toggleChat(item)">
                  <el-card :body-style="{ padding: '5px 10px' }" shadow="never">
                    <el-row>
                      <el-col :span="7">
                        <el-image
                          style="width: 40px; height: 40px; border-radius: 50%;"
                          src="https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg"
                          fit="cover"></el-image>
                      </el-col>
                      <el-col :span="17">
                        <h4 class="m-0" style="color: #666666; font-size: 15px;">{{item}}</h4>
                        <p style="color: #999999; font-size: 12px; margin: 0; margin-top: 3px;" class="limitTitleDirectory">这个家伙很懒，什么也没有留下。</p>
                      </el-col>
                    </el-row>
                  </el-card>
                </a>
              </div>
            </el-col>
            <el-col :md="18">
              <div v-show="toUser !== '游客'">
                <el-card :body-style="{ padding: '15px' }" shadow="never">
                  <div class="text-center">
                    <p class="m-0">{{toUser}}</p>
                  </div>
                </el-card>
                <el-card :body-style="{ padding: '5px' }" shadow="never">
                  <div v-for="item in this.listUser" :key="item" v-show="toUser === item" :id="item" style="height: 327px; overflow: auto;"></div>
                </el-card>
                <el-input type="textarea" :rows="5" v-model="input" @keyup.enter.native="webSokcetSend()"></el-input>
              </div>
              <div v-show="toUser === '游客'">
                <div style="text-align: center; line-height: 500px; background-color: #f3f3f3;">
                  <p style="margin: 0; font-size: 22px; color: #909399;">没有会话消息</p>
                </div>
              </div>
            </el-col>
          </el-row>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import Vue from 'vue'
import {setCookie, getCookie, delCookie} from '../util/util.js';
    export default {
      name: "index",
      data() {
        return {
          input: '',
          input1: '',
          listUser: [],
          webSocket : null,
          fromUser: '游客',
          toUser: '游客',
        }
      },
      mounted() {
        if (document.cookie === '') {
          this.webSokcetClose();
          this.$router.push({path:'/'});
        } else {
          this.fromUser = this.$cookie.getCookie('user');
        }
        this.webSocket = new WebSocket('ws://localhost:8082/chat/' + this.fromUser);
        this.initWebSocket();
      },
      methods: {
        initWebSocket() {
          this.webSocket.onerror = this.onError;  // 通讯异常
          this.webSocket.onopen = this.onOpen;  // 连接成功
          this.webSocket.onmessage = this.onMessage;  // 收到消息时回调
          this.webSocket.onclose = this.onClose;  // 连接关闭时回调
        },
        onError() {
          /*
          * 通讯异常
          * */
          console.log("通讯异常")
        },
        onOpen() {
          /*
          * 连接成功
          * */
          console.log("通讯开始");
        },
        onMessage(event) {
          /*
          * 收到消息时回调函数
          * */
          let data = JSON.parse(event.data);
          // console.log(data);
          if (data.list !== undefined) {
            let list = data.list;
            for (let i=0; i<list.length; i++) {
              if (list[i] === this.fromUser) {
                list.splice(i, 1);
              }
            }
            this.listUser = list;
          }
          this.messageDiv(event.data);
        },
        onClose() {
          /*
          * 关闭连接时回调函数
          * */
          console.log("通讯关闭");
        },
        webSokcetSend() {
          /*
          * 发送消息
          * */
          let message = JSON.stringify({'fromUser': this.fromUser, 'toUser': this.toUser, 'msg': this.input,});
          this.webSocket.send(message);
          this.input = '';
          this.messageDiv(message)
        },
        webSokcetClose() {
          /*
          * 关闭连接
          * */
          this.webSocket.close();
          this.$cookie.delCookie('user');
          this.$router.push({path:'/'});
        },
        toggleChat(toUser) {
          this.toUser = toUser;
        },
        messageDiv(data1, type) {
          let data = JSON.parse(data1);

          let div = document.createElement('div');
          let p1 = document.createElement('p');
          let p = document.createElement('p');

          p1.innerHTML = data.fromUser;
          p.innerHTML = data.msg;

          if (data.fromUser !== '系统通知') {
            if (data.type !== undefined) {
              /*
              * data.type !== undefined
              * 说明这是接收到消息
              * 把值插到发送者的div
              * */
              let fromUser = document.getElementById(data.fromUser);

              div.style = 'width: 370px; float: left; margin-left: 15px; margin-top: 15px;';
              p1.style = 'font-size: 15px; margin-bottom: 0; margin-top: 0; float: left; font-weight: 500;';
              p.style = 'padding: 10px; background-color: #F1F1F1; margin-top: 25px; margin-bottom: 10px; word-wrap : break-word;';
              div.appendChild(p1);
              div.appendChild(p);

              fromUser.appendChild(div);
              fromUser.scrollTop = fromUser.scrollHeight;
              if (fromUser.style.display === 'none') {
                console.log('有新的消息未查看！');
              }
            } else {
              /*
              * 说明这是发送消息
              * 把值插到接收者的div
              * */
              let toUser = document.getElementById(data.toUser);

              div.style = 'width: 370px; float: right; margin-right: 15px; margin-top: 15px;';
              p1.style = 'font-size: 15px; margin-bottom: 0; margin-top: 0; float: right; font-weight: 500;';
              p.style = 'padding: 10px; background-color: #9FE86C; margin-top: 25px; margin-bottom: 10px; word-wrap : break-word;';
              div.appendChild(p1);
              div.appendChild(p);

              toUser.appendChild(div);
              toUser.scrollTop = toUser.scrollHeight;
            }
          }
        }
      },
      beforeMount () {
    Vue.prototype.$cookie = {
      setCookie,
      getCookie,
      delCookie
    }
  },
      beforeRouteEnter(to, from, next) {
        // 添加背景色
        document.querySelector('body').setAttribute('style', 'background-color: #F9F9F9');
        next()
      },
      beforeRouteLeave(to, from, next) {
        // 去除背景色
        document.querySelector('body').setAttribute('style', '');
        next()
      },
    }
</script>

<style scoped>
  .limitTitleDirectory {
    width: 120px;		/* 限制文本宽度 */
    overflow: hidden;		/* 超出的文本隐藏 */
    text-overflow: ellipsis;	/* 溢出的文本内容用 ... 代替 */
    white-space: nowrap;		/* 溢出不换行*/
  }
  element.style {
    padding-left: 10px;
  }
  .el-menu-item {
    font-size: 14px;
    color: #303133;
    padding: 0 10px;
    cursor: pointer;
    -webkit-transition: border-color .3s,background-color .3s,color .3s;
    transition: border-color .3s,background-color .3s,color .3s;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
  }

  /*定义滚动条高宽及背景 高宽分别对应横竖滚动条的尺寸*/
  ::-webkit-scrollbar
  {
    width: 5px;  /*滚动条宽度*/
    height: 5px;  /*滚动条高度*/
  }

  /*定义滚动条轨道 内阴影+圆角*/
  ::-webkit-scrollbar-track
  {
    /*-webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);*/
    border-radius: 10px;  /*滚动条的背景区域的圆角*/
    /*background-color: red;!*滚动条的背景颜色*!*/
  }

  /*定义滑块 内阴影+圆角*/
  ::-webkit-scrollbar-thumb
  {
    border-radius: 10px;  /*滚动条的圆角*/
    /*-webkit-box-shadow: inset 0 0 6px rgba(0,0,0,.3);*/
    background-color: #b8b8bc;  /*滚动条的背景颜色*/
  }
</style>
