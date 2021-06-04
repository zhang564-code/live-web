<template>
  <div>
    <el-row type="flex" class="row-bg" justify="center">
      <el-col :md="8">
        <el-card shadow="always" style="margin-top: 150px;">
          <h3 class="text-center mb-5">webSocket 聊天室</h3>
          <el-form ref="form" :model="form" :inline="true">
            <el-form-item label="用户名">
              <el-input v-model="form.input" @keyup.enter.native="login()"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" style="width: 100%" @click="login()">马上进入</el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import Vue from 'vue'
import {setCookie, getCookie, delCookie} from '../util/util.js';
    export default {
      name: "Denglu",
      data() {
        return {
          form: {
            input: '',
          },
        }
      },
      methods: {
        login() {
          if (this.form.input === '') {
            this.$message.warning('请填写用户名');
          } else {
            let admin = {
              username : this.form.input,
            };
            this.$cookie.setCookie('user', this.form.input);
            this.$router.push({path:'/index'});
          }
        }
      },
      beforeMount () {
    Vue.prototype.$cookie = {
      setCookie,
      getCookie,
      delCookie
    }
  }
    }
</script>

<style scoped>
</style>