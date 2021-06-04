<template>
<div>
    <el-row>
        
        <el-col :span="12">
        <div class="block">
        <el-carousel height="350px">
            <el-carousel-item v-for="item in imgList" :key="item.id">
             <img :src="item.src" style="height:100%;width:100%" alt="轮播图">
            </el-carousel-item>
        </el-carousel>
        </div>
        
    </el-col>

    <el-col :span="12">
            <div class="calendar">
                <el-calendar v-model="value">
                </el-calendar>
            </div>
        </el-col>
    </el-row>
</div>
</template>


<script>
  export default {
    data() {
      return {
        value: new Date(),
        imgList: [{
            id: 1,
            src: require("@/assets/img1.jpg")
        },
        {
            id: 2,
            src: require("@/assets/img2.jpg")
        },{
            id: 3,
            src: require("@/assets/img3.jpg")
        },{
            id: 4,
            src: require("@/assets/img4.jpg")
        }]
      }
    }
  }
</script>
<style>

</style>