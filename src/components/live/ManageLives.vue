<template>
    <div>
        <!-- 面包屑导航区域 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/admin' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>直播管理</el-breadcrumb-item>
            <el-breadcrumb-item>直播列表</el-breadcrumb-item>
        </el-breadcrumb>


        <!-- 卡片视图区域 -->
        <el-card>
            
            <el-row :gutter="20">
                <el-col :span="8">
                    <!-- 搜索与添加 -->
                    <el-input placeholder="请输入内容" v-model="query.query" clearable @clear="getLiveList">
                    <el-button slot="append" icon="el-icon-search" @click="search"></el-button></el-input>
                </el-col>
                <el-col :span="4">
                    <el-button type="primary" disabled>添加直播</el-button>
                </el-col>
            </el-row>
        </el-card>

        <!-- 用户列表区域 -->
        <el-table :data="livelist" border stripe :header-cell-style="headClass">
            <el-table-column type="index" align="center"></el-table-column>
            <el-table-column label="直播名称" prop="livename" align="center"></el-table-column>
            <el-table-column label="直播教师" prop="userName" align="center"></el-table-column>
            <el-table-column label="直播日期" prop="date" align="center"></el-table-column>
            <el-table-column label="班级名称" prop="className" align="center"></el-table-column>
            <el-table-column label="操作" align="center">
                <template slot-scope="scope">
                    <el-tooltip effect="dark" content="编辑直播" placement="top-start" :enterable="false">
                        <el-button type="primary" icon="el-icon-edit" size="mini"  @click="showEditDialog(scope.row.id)"></el-button>
                    </el-tooltip>
                    <el-tooltip effect="dark" content="删除直播" placement="top-start" :enterable="false">
                        <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeLiveById(scope.row.id)"></el-button>
                    </el-tooltip>
                </template>
            </el-table-column>
        </el-table>

        <!-- 分页区域 -->
        <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryinfo.currentPage"
      :page-sizes="[3, 4, 5, 6]"
      :page-size="queryinfo.currentSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total" align="center">
    </el-pagination>

    <!-- 修改直播的对话框 -->
    <el-dialog
  title="修改直播信息"
  :visible.sync="editDialogVisible"
  width="50%">
  <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="90px">
  <el-form-item label="直播名称" prop="livename">
    <el-input v-model="editForm.livename"></el-input>
  </el-form-item>
  <el-form-item label="直播教师" prop="userName">
    <el-input v-model="editForm.userName"></el-input>
  </el-form-item>
  <el-form-item label="班级">
      <el-select v-model="editForm.className" auto-complete="off" placeholder="请选择班级">
        <el-option v-for="item in classrooms" :key="item.id" :label="item.className" :value="item.className"></el-option>
      </el-select>
    </el-form-item>
  </el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="editDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="editLiveInfo">确 定</el-button>
  </span>
</el-dialog>
    </div>
</template>

<script>
export default {
    data() {
        return {
            queryinfo: {
                currentPage: 1,
                currentSize: 5
            },
            livelist: [],
            total: 0,
            classrooms: [],
            query: {
                currentPage: 1,
                currentSize: 5,
                query: ''
            },
            editDialogVisible: false,
            editForm: {},
            editFormRules: {
          userName: [
            { required: true, message: '教师姓名不能为空', trigger: 'blur' },
            { min:3, max: 15, message:'教师姓名的长度在3~15之间', trigger: 'blur'}
          ],
          livename: [
            { required: true, message: '直播名称不能为空', trigger: 'blur' }
          ],
        }
        }
    },
    created() {
        this.getLiveList()
    },
    methods: {
        async getLiveList() {
            const { data : res} = await this.$http.get('lives',{ params: this.queryinfo})
            if(res.code !== 200) {
                return this.$message.error('获取直播列表失败！');
            }
            this.livelist = res.data.records
            this.total = res.data.total
            
            console.log(this.queryinfo.query + "+++++++++++++")
        },
        headClass() { //表头居中显示
            return "text-align:center"
            },
        handleSizeChange(newSize) {//监听pagesize改变的事件
            // console.log(newSize)
            this.queryinfo.currentSize = newSize
            this.query.currentSize = newSize
            this.getLiveList()
        },
        handleCurrentChange(newPage) {//监听 页码值 改变的事件
            // console.log(newPage)
            this.queryinfo.currentPage = newPage
            this.query.currentPage = newPage
            this.getLiveList()
        },
        async search() {
            const { data : res} = await this.$http.get('livesearch',{ params: this.query})
            if(res.code !== 200) {
                return this.$message.error('获取直播列表失败！');
            }
            this.livelist = res.data.records
            this.queryinfo.currentPage = res.data.current
            this.queryinfo.currentSize = res.data.size
            this.total = res.data.total
            
            console.log(this.query + "+++++++++++++")
        },
        async showEditDialog(id) {
            const { data : res} = await this.$http.get('live/' + id)
            if(res.code !== 200){
                return this.$message.error('获取直播列表失败！');
            }
            this.editForm = res.data
             
            this.editDialogVisible = true

        },
        //修改直播信息并提交
        editLiveInfo() {
            this.$refs.editFormRef.validate(async valid=> {
                if(!valid) return
                //发起修改直播信息的数据请求
                const {data: res} = await this.$http.put('live/' + this.editForm.id,{livename:
                this.editForm.livename,userName:
                this.editForm.userName,className:
                this.editForm.className
                })
                
                if(res.code !==200) {
                    return this.$message.error('更新直播信息失败！')
                }

                //关闭对话框
                this.editDialogVisible = false
                //刷新数据列表
                this.getLiveList()
                //提示修改成功
                this.$message.success('更新直播信息成功！')
            })
        },
        async removeLiveById(id) {
            //弹框询问  是否删除数据
            const confirmResult = await this.$confirm('此操作将永久删除该直播信息, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err => {
            return err
        })
        //如果确认删除，则返回字符串 confirm
        //如果取消删除，则返回字符串 cancel
        // console.log(confirmResult)
        if(confirmResult !== 'confirm') {
            return this.$message.info('已取消删除')
        }
        const {data : res} = await this.$http.delete('live/' + id)
        if(res.code !== 200) {
            return this.$message.error('删除直播失败！')
        }

        this.$message.success('删除直播成功！')
        this.getLiveList()

        },

        getchioce(){
        this.$http.post('/classroom').then(res =>{
          this.classrooms=res.data.data
        })
      },
    },
    mounted(){
      this.getchioce()
    },

}
</script>

<style lang="less" scoped>
.el-breadcrumb{
    margin-bottom: 20px;
    font-size: 15px;
}
.el-table{
    font-size: 15px;
}
.el-pagination{
    margin-top: 15px;
    
}
</style>
