<template>
<div>
  <!--面包屑导航区域-->
  <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/admin' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>数据统计</el-breadcrumb-item>
      <el-breadcrumb-item>数据报表</el-breadcrumb-item>
  </el-breadcrumb>
  <!--卡片视图区域-->
<el-card>
    <!-- 2.为ECharts准备一个具备大小（宽高）的Dom -->
    <div id="main" style="width: 900px;height:500px;"></div>
</el-card>
</div>
</template>

<script>
// 1.导入 echarts
import * as echarts from 'echarts'
export default {
  // 此时页面上的元素，已经被渲染完毕
  mounted() {
    // 3.基于准备好的dom，初始化echarts实例
    var myChart = echarts.init(document.getElementById('main'))

    // const { data: res } = await this.$http.get('report/data/1')
    // if (res.code !== 200) {
    //   return this.$message.error('获取折线图数据失败')
    // }
    // console.log(res)

    // 4.指定图表的配置项和数据
    var option = {
      title: {
        text: '学生直播在线人数统计'
      },
      tooltip: {},
      legend: {
        data: ['销量']
      },
      xAxis: {
        data: ['数据库', '计算机原理', '数据结构', '操作系统', '计算机网络', '编译原理']
      },
      yAxis: {},
      series: [{
        name: '学生人数',
        type: 'bar',
        data: [51, 53, 57, 55, 50, 49]
      }]
    }

    // 5.使用刚指定的配置项和数据显示图表。
    myChart.setOption(option)
  }
}
</script>
<style lang="less" scoped>
.el-breadcrumb{
    margin-bottom: 20px;
    font-size: 15px;
}

</style>