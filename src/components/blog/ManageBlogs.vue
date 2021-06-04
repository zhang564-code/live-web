<template>
    <div>
        <!-- 面包屑导航区域 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/admin' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>通知管理</el-breadcrumb-item>
            <el-breadcrumb-item>通知列表</el-breadcrumb-item>
        </el-breadcrumb>


        <!-- 卡片视图区域 -->
        <el-card>
            
            <el-row :gutter="20">
                <el-col :span="8">
                    <!-- 搜索与添加 -->
                    <el-input placeholder="请输入内容" v-model="query.query" clearable @clear="getBlogList">
                    <el-button slot="append" icon="el-icon-search" @click="search"></el-button></el-input>
                </el-col>
                <el-col :span="4">
                    <el-button type="primary" disabled>添加通知</el-button>
                </el-col>
            </el-row>
        </el-card>

        <!-- 用户列表区域 -->
        <el-table :data="bloglist" border stripe :header-cell-style="headClass">
            <el-table-column type="index" align="center"></el-table-column>
            <el-table-column label="通知名称" prop="title" align="center"></el-table-column>
            <el-table-column label="通知描述" prop="desription" align="center"></el-table-column>
            <el-table-column label="通知内容" prop="content" align="center" show-overflow-tooltip></el-table-column>
            <el-table-column label="创建者" prop="userName" align="center"></el-table-column>
            <el-table-column label="操作" align="center">
                <template slot-scope="scope">
                    <el-tooltip effect="dark" content="编辑通知" placement="top-start" :enterable="false">
                        <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.id)"></el-button>
                    </el-tooltip>
                    <el-tooltip effect="dark" content="删除通知" placement="top-start" :enterable="false">
                        <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeBlogById(scope.row.id)"></el-button>
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

    <!-- 修改通知的对话框 -->
    <el-dialog
  title="修改通知信息"
  :visible.sync="editDialogVisible"
  width="50%">
  <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="90px">
  <el-form-item label="通知名称" prop="title">
    <el-input v-model="editForm.title"></el-input>
  </el-form-item>
  <el-form-item label="通知描述" prop="desription">
    <el-input v-model="editForm.desription"></el-input>
  </el-form-item>
  <el-form-item label="通知内容" prop="content">
    <el-input v-model="editForm.content"></el-input>
  </el-form-item>
  <el-form-item label="创建者" prop="userName">
    <el-input v-model="editForm.userName"></el-input>
  </el-form-item>
  </el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="editDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="editBlogInfo">确 定</el-button>
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
            editDialogVisible: false,
            editForm: {},
            bloglist: [],
            total: 0,
            editFormRules: {
          title: [
            { required: true, message: '通知名称不能为空', trigger: 'blur' }
          ],
          desription: [
            { required: true, message: '通知描述不能为空', trigger: 'blur' }
          ],
          content: [
            { required: true, message: '通知内容不能为空', trigger: 'blur' }
          ],
          userName: [
            { required: true, message: '创建者不能为空', trigger: 'blur' }
          ],
        },
            query: {
                currentPage: 1,
                currentSize: 5,
                query: ''
            }
        }
    },
    created() {
        this.getBlogList()
    },
    methods: {
        async getBlogList() {
            const { data : res} = await this.$http.get('blogs',{ params: this.queryinfo})
            if(res.code !== 200) {
                return this.$message.error('获取通知列表失败！');
            }
            this.bloglist = res.data.records
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
            this.getBlogList()
        },
        handleCurrentChange(newPage) {//监听 页码值 改变的事件
            // console.log(newPage)
            this.queryinfo.currentPage = newPage
            this.query.currentPage = newPage
            this.getBlogList()
        },
        async search() {
            const { data : res} = await this.$http.get('blogsearch',{ params: this.query})
            if(res.code !== 200) {
                return this.$message.error('获取通知列表失败！');
            }
            this.bloglist = res.data.records
            this.queryinfo.currentPage = res.data.current
            this.queryinfo.currentSize = res.data.size
            this.total = res.data.total
            
            console.log(this.query + "+++++++++++++")
        },
        async showEditDialog(id) {
            const { data : res} = await this.$http.get('blog/' + id)
            if(res.code !== 200){
                return this.$message.error('获取通知列表失败！');
            }
            this.editForm = res.data
             
            this.editDialogVisible = true

        },
        //修改通知信息并提交
        editBlogInfo() {
            this.$refs.editFormRef.validate(async valid=> {
                if(!valid) return
                //发起修改通知信息的数据请求
                const {data: res} = await this.$http.put('blog/' + this.editForm.id,{title:
                this.editForm.title,desription:
                this.editForm.desription,content: this.editForm.content,
                userName: this.editForm.userName
                })
                
                if(res.code !==200) {
                    return this.$message.error('更新通知信息失败！')
                }

                //关闭对话框
                this.editDialogVisible = false
                //刷新数据列表
                this.getBlogList()
                //提示修改成功
                this.$message.success('更新通知信息成功！')
            })
        },
        //根据ID删除通知信息
        async removeBlogById(id) {
            //弹框询问  是否删除数据
            const confirmResult = await this.$confirm('此操作将永久删除该通知信息, 是否继续?', '提示', {
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
        const {data : res} = await this.$http.delete('blog/' + id)
        if(res.code !== 200) {
            return this.$message.error('删除通知失败！')
        }

        this.$message.success('删除通知成功！')
        this.getBlogList()

        }
    }

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
