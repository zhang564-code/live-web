<template>
    <el-container class="home-container">
        <!-- 头部区域 -->
    <el-header>
        <div  class="textLogo">
            <img src="../assets/heima.png" alt="logo" width="190" height="170">
            <span>在线教学直播系统后台页面</span>
        </div>
        <el-button type="info" @click="quit">退出</el-button>
    </el-header>
    <!-- 内容区 -->
    <el-container>
        <!-- 侧边栏 -- 属性加冒号表示绑定一个值，不加值为字符串如unique-opened可以直接写为unique-opened不加属性值-->
        <el-aside width="190px">
            <el-menu
      background-color="#545c64"
      text-color="#fff"
      active-text-color="#ffd04b"
      :router = "true">
      <!-- 一级菜单 -->
      <el-menu-item :index="item.menuUrl" v-for="item in menulist" :key="item.id">
        <i :class="iconsObj[item.id]"></i>
        <span slot="title">{{item.menuName}}</span>
      </el-menu-item>
      
    </el-menu>
        </el-aside>
        <!-- 右边内容区 -->
        <el-main>
            <!-- 路由占位符 -->
            <router-view></router-view>
        </el-main>
    </el-container>

    <Footer class="foot"></Footer>
</el-container>
</template>

<script>
import Footer from "../components/Footer";
export default {
    components: {Footer},
    created(){
        this.getMenuList()
    },
    data:function(){
        return {
            // 左侧菜单数据
            menulist:[],
            menuName: '',
            item:'',
            // 一级菜单图标对象
            iconsObj:{
                '1':'el-icon-video-camera',
                '2':'el-icon-s-management',
                '3':'el-icon-s-check',
                '4':'el-icon-s-custom',
                '6':'el-icon-s-data',
                '5':'el-icon-s-opportunity',
                '9':'el-icon-star-on',
                '12':'el-icon-bell',
                '13':'el-icon-message-solid',
                '14':'el-icon-turn-off',
                '15':'el-icon-attract',
                '16':'el-icon-paperclip',
                '17':'el-icon-folder-checked',
            },
            // 菜单栏是否水平折叠
            iscollapse:false,
            // 当前激活的路径（第二级菜单栏）
            activepath:'',
        }
    },
    methods:{
        quit:function(){
            // 退出功能主要是利用清除token的原理来实现
            // 清除token
            window.sessionStorage.clear();
            // 退出后回到登录页面
            this.$router.push('/login');
            // 显示退出成功
            this.$message.success('退出成功');
        },
        //获取所有的菜单
        async getMenuList() {
            const {data: res} = await this.$http.get('menu')
            if (res.code !== 200) return this.$message.error(res.msg)
            this.menulist = res.data
            console.log(res.data)
        }
    }
}
</script>

<style lang="less" scoped>
.el-container {
    height: 100%;
}
.el-header {
    background-color:#373D41;
    // 项目位于各行之间留有空白的容器内
    display: flex;
    justify-content: space-between;
    padding-left:0;
    color:#fff;
    font-size: 35px;
    // 纵向居中
    align-items: center;
    div {
        display:flex;
        align-items:center;
        span {
            margin-left: 15px;
        }
    }
}
.el-aside {
    background-color:#333744;
    padding-bottom: 1cm;
    
}
.el-main {
    background-color:#eaedf1;
}
.foot{
    font-size: 20px;
    margin-top: 10px;
}
.textLogo{
    text-align: center;
}

</style>