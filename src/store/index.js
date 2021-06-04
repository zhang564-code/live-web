import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    token: '',
    userInfo: JSON.parse(sessionStorage.getItem("userInfo")),
    studentInfo: JSON.parse(sessionStorage.getItem("studentInfo")),
    teacherInfo: JSON.parse(sessionStorage.getItem("teacherInfo"))
  },
  mutations: {
    // set
    SET_TOKEN: (state, token) => {
      state.token = token
      localStorage.setItem("token", token)
    },
    SET_USERINFO: (state, userInfo) => {
      state.userInfo = userInfo
      sessionStorage.setItem("userInfo", JSON.stringify(userInfo))
    },
    SET_STUDENTINFO: (state, studentInfo) => {
      state.studentInfo = studentInfo
      sessionStorage.setItem("studentInfo", JSON.stringify(studentInfo))
    },
    SET_TEACHERINFO: (state, teacherInfo) => {
      state.teacherInfo = teacherInfo
      sessionStorage.setItem("teacherInfo", JSON.stringify(teacherInfo))
    },
    REMOVE_INFO: (state) => {
      state.token = ''
      state.userInfo = {}
      localStorage.setItem("token", '')
      sessionStorage.setItem("userInfo", JSON.stringify(''))
    },
    REMOVE_INFOS: (state) => {
      state.token = ''
      state.studentInfo = {}
      localStorage.setItem("token", '')
      sessionStorage.setItem("studentInfo", JSON.stringify(''))
    },
    REMOVE_INFOT: (state) => {
      state.token = ''
      state.teacherInfo = {}
      localStorage.setItem("token", '')
      sessionStorage.setItem("teacherInfo", JSON.stringify(''))
    },

  },
  getters: {
    // get
    getUser: state => {
      return state.userInfo
    },
    getStudent: state => {
      return state.studentInfo
    },
    getTeacher: state => {
      return state.teacherInfo
    },

  },
  actions: {
  },
  modules: {
  }
})
