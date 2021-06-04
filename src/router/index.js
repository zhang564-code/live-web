import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/Login.vue'
import LoginStar from '../views/LoginStar.vue'
import Admin from '../views/Admin.vue'
import AdminLogin from '../views/AdminLogin.vue'
import StudentLogin from '../views/StudentLogin.vue'
import TeacherLogin from '../views/TeacherLogin.vue'
import Register from '../views/Register.vue'
import StudentRegister from '../views/StudentRegister.vue'
import TeacherRegister from '../views/TeacherRegister.vue'
import Blogs from '../views/Blogs.vue'
import StudentBlogs from '../views/StudentBlogs.vue'
import TeacherBlogs from '../views/TeacherBlogs.vue'
import Lives from '../views/Lives.vue'
import StudentLives from '../views/StudentLives.vue'
import TeacherLives from '../views/TeacherLives.vue'
import LiveDetail from '../views/LiveDetail.vue'
import LiveEdit from '../views/LiveEdit.vue'
import BlogEdit from '../views/BlogEdit.vue'
import StudentAddBlog from '../views/StudentAddBlog.vue'
import TeacherAddBlog from '../views/TeacherAddBlog.vue'
import BlogDetail from '../views/BlogDetail.vue'
import Welcome from '../components/Welcome.vue'
import Students from '../components/student/Students.vue'
import Teachers from '../components/teacher/Teachers.vue'
import ManageLives from '../components/live/ManageLives.vue'
import ManageMenus from '../components/menu/ManageMenus.vue'
import ManageBlogs from '../components/blog/ManageBlogs.vue'
import Report from '../components/report/Report.vue'
import Chat from '../components/chat/Chat.vue'
import Denglu from '../views/Denglu.vue'
import index from '../views/index.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Index',
    redirect: {name: "Blogs"}
  },
  {
    path: '/blogs',
    name: 'Blogs',
    component: Blogs
  },
  {
    path: '/student/blogs',
    name: 'StudentBlogs',
    component: StudentBlogs
  },
  {
    path: '/teacher/blogs',
    name: 'TeacherBlogs',
    component: TeacherBlogs
  },
  {
    path: '/lives',
    name: 'Lives',
    component: Lives,
    meta: {
      requireAuth: true
    }
  },
  {
    path: '/teacher/lives',
    name: 'TeacherLives',
    component: TeacherLives,
    meta: {
      requireAuth: true
    }
  },
  {
    path: '/student/lives',
    name: 'StudentLives',
    component: StudentLives,
    meta: {
      requireAuth: true
    }
  },
  {
    path: '/register',
    name: 'Register',
    component: Register
  },
  {
    path: '/student/register',
    name: 'StudentRegister',
    component: StudentRegister
  },
  {
    path: '/teacher/register',
    name: 'TeacherRegister',
    component: TeacherRegister
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/loginStar',
    name: 'LoginStar',
    component: LoginStar
  },
  {
    path: '/student/login',
    name: 'StudentLogin',
    component: StudentLogin
  },
  {
    path: '/teacher/login',
    name: 'TeacherLogin',
    component: TeacherLogin
  },
  {
    path: '/live/add',
    name: 'LiveAdd',
    component: LiveEdit,
    meta: {
      requireAuth: true
    }
  },
  {
    path: '/blog/add',
    name: 'BlogAdd',
    component: BlogEdit,
    meta: {
      requireAuth: true
    }
  },
  {
    path: '/student/blog/add',
    name: 'StudentAddBlog',
    component: StudentAddBlog,
    meta: {
      requireAuth: true
    }
  },
  {
    path: '/teacher/blog/add',
    name: 'TeacherAddBlog',
    component: TeacherAddBlog,
    meta: {
      requireAuth: true
    }
  },
  {
    path: '/blog/:blogId',
    name: 'BlogDetail',
    component: BlogDetail
  },
  {
    path: '/live/livestream/:liveId',
    name: 'LiveDetail',
    component: LiveDetail
  },
  {
    path: '/blog/:blogId/edit',
    name: 'BlogEdit',
    component: BlogEdit,
    meta: {
      requireAuth: true
    }
  },
    {
      path: '/live/:liveId/edit',
      name: 'LiveEdit',
      component: LiveEdit,
      meta: {
        requireAuth: true
      }
  },
  {
    path: '/admin/login',
    name: 'AdminLogin',
    component: AdminLogin
  },
  {
    path: '/test',
    name: 'Denglu',
    component: Denglu
  },
  {
    path: '/index',
    name: 'index',
    component: index
  },
  {
    path: '/admin',
    name: 'Admin',
    component: Admin,
    redirect: '/welcome',
    children: [
      {path: '/welcome',component: Welcome},
      {path: '/admin/user/student',component: Students},
      {path: '/admin/user/teacher',component: Teachers},
      {path: '/admin/live',component: ManageLives},
      {path: '/admin/menu',component: ManageMenus},
      {path: '/admin/blog',component: ManageBlogs},
      {path: '/admin/data',component: Report},
      {path: '/admin/chat',component: Chat}
    ]
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
