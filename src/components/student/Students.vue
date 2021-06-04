<template>
    <div>
        <!-- 面包屑导航区域 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/admin' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>学生管理</el-breadcrumb-item>
            <el-breadcrumb-item>学生列表</el-breadcrumb-item>
        </el-breadcrumb>


        <!-- 卡片视图区域 -->
        <el-card>
            
            <el-row :gutter="20">
                <el-col :span="8">
                    <!-- 搜索与添加 -->
                    <el-input placeholder="请输入内容" v-model="query.query" clearable @clear="getStudentList">
                    <el-button slot="append" icon="el-icon-search" @click="search"></el-button></el-input>
                </el-col>
                <el-col :span="4">
                    <el-button type="primary" @click="addDialogVisible = true">添加学生</el-button>
                </el-col>
            </el-row>
        </el-card>

        <!-- 学生列表区域 -->
        <el-table :data="studentlist" border stripe :header-cell-style="headClass">
            <el-table-column type="index" align="center"></el-table-column>
            <el-table-column label="学生姓名" prop="studentName" align="center"></el-table-column>
            <el-table-column label="头像" prop="avatar" align="center" show-overflow-tooltip></el-table-column>
            <el-table-column label="邮箱" prop="email" align="center"></el-table-column>
            <el-table-column label="班级" prop="className" align="center"></el-table-column>
            <el-table-column label="创建日期" prop="created" align="center"></el-table-column>
            <el-table-column label="最近登录" prop="lastLogin" align="center"></el-table-column>
            <el-table-column label="操作" align="center">
                <template slot-scope="scope">
                    <el-tooltip effect="dark" content="编辑学生信息" placement="top-start" :enterable="false">
                        <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.id)"></el-button>
                    </el-tooltip>
                    <el-tooltip effect="dark" content="删除" placement="top-start" :enterable="false">
                        <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeStudentById(scope.row.id)"></el-button>
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
    <!-- 添加学生的对话框 -->
    <el-dialog
        title="添加学生"
        :visible.sync="addDialogVisible"
        width="50%" @close="addDialogClosed">
        <!-- 内容主体区域 -->
    <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="70px">
        <el-form-item label="账号" prop="studentName">
        <el-input v-model="addForm.studentName"></el-input>
        </el-form-item>
    <el-form-item label="密码" prop="password">
        <el-input v-model="addForm.password"></el-input>
        </el-form-item>
    <el-form-item label="头像" prop="avatar">
        <el-input v-model="addForm.avatar"></el-input>
    </el-form-item>
    <el-form-item label="邮箱" prop="email">
        <el-input v-model="addForm.email"></el-input>
    </el-form-item>
    <el-form-item label="班级" prop="className">
      <el-select v-model="addForm.className" auto-complete="off" placeholder="请选择班级">
        <el-option v-for="item in classrooms" :key="item.id" :label="item.className" :value="item.className"></el-option>
      </el-select>
    </el-form-item>
    </el-form>
    <!-- 底部区域 -->
  <span slot="footer" class="dialog-footer">
    <el-button @click="addDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="addStudent">确 定</el-button>
  </span>
</el-dialog>

    <!-- 修改学生的对话框 -->
    <el-dialog
  title="修改学生信息"
  :visible.sync="editDialogVisible"
  width="50%">
  <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="70px">
  <el-form-item label="学生姓名">
    <el-input v-model="editForm.studentName" disabled></el-input>
  </el-form-item>
  <el-form-item label="邮箱" prop="email">
    <el-input v-model="editForm.email"></el-input>
  </el-form-item>
  <el-form-item label="头像" prop="avatar">
    <el-input v-model="editForm.avatar"></el-input>
  </el-form-item>
  <el-form-item label="班级" prop="className">
      <el-select v-model="editForm.className" auto-complete="off" placeholder="请选择班级">
        <el-option v-for="item in classrooms" :key="item.id" :label="item.className" :value="item.className"></el-option>
      </el-select>
    </el-form-item>
  </el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="editDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="editStudentInfo">确 定</el-button>
  </span>
</el-dialog>
    </div>
</template>

<script>
export default {
    data() {
        //验证邮箱的规则
        var checkEmail = (rule, value, cb) => {
            //验证邮箱的正则表达式
            const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/

            if(regEmail.test(value)) {
                return cb()
            }
            cb(new Error('请输入合法的邮箱'))
        }
        return {
            queryinfo: {
                currentPage: 1,
                currentSize: 4
            },
            classrooms: [],
            studentlist: [],
            total: 0,
            query: {
                currentPage: 1,
                currentSize: 5,
                query: ''
            },
            //控制添加学生对话框的显示与隐藏
            addDialogVisible: false,
            //添加学生的表单数据
            addForm: {
                studentName: '',
                avatar: '',
                email: '',
                className: '',
                password: ''
            },
            //添加表单的验证规则
            addFormRules:{
                studentName: [
                    { required: true, message:'请输入学生姓名', trigger: 'blur'},
                    { min:3, max: 15, message:'学生姓名的长度在3~15之间', trigger: 'blur'}
                ],
                avatar: [
                    { required: true, message: '头像不能为空', trigger: 'blur' }
                ],
                email: [
                    { required: true, message: '请输入邮箱', trigger: 'blur' },
                    { validator:checkEmail,trigger: 'blur'}
                ],
                className: [
                    { required: true, message: '班级名称不能为空', trigger: 'blur' }
                ],
                password: [
                    { required: true, message: '密码不能为空', trigger: 'blur' }
                ]
            },
            //展示编辑学生对话框显示与否
            editDialogVisible: false,
            //查询到的学生信息对象保存
            editForm: {},
            //修改表单的验证规则
            editFormRules: {
          email: [
            { required: true, message: '请输入邮箱', trigger: 'blur' },
            { validator:checkEmail,trigger: 'blur'}
          ],
          avatar: [
            { required: true, message: '头像不能为空', trigger: 'blur' }
          ],
          className: [
            { required: true, message: '班级名称不能为空', trigger: 'blur' }
          ]
        }
        }
    },
    created() {
        this.getStudentList()
    },
    methods: {
        async getStudentList() {
            const { data : res} = await this.$http.get('students',{ params: this.queryinfo})
            if(res.code !== 200) {
                return this.$message.error('获取学生列表失败！');
            }
            this.studentlist = res.data.records
            this.total = res.data.total
            
            console.log(this.res + "+++++++++++++")
        },
        headClass() { //表头居中显示
            return "text-align:center"
            },
        handleSizeChange(newSize) {//监听pagesize改变的事件
            // console.log(newSize)
            this.queryinfo.currentSize = newSize
            this.query.currentSize = newSize
            this.getStudentList()
        },
        handleCurrentChange(newPage) {//监听 页码值 改变的事件
            // console.log(newPage)
            this.queryinfo.currentPage = newPage
            this.query.currentPage = newPage
            this.getStudentList()
        },
        async search() {
            const { data : res} = await this.$http.get('studentsearch',{ params: this.query})
            if(res.code !== 200) {
                return this.$message.error('获取直播列表失败！');
            }
            this.studentlist = res.data.records
            this.queryinfo.currentPage = res.data.current
            this.queryinfo.currentSize = res.data.size
            this.total = res.data.total
            
        },
        async showEditDialog(id) {
            const { data : res} = await this.$http.get('student/' + id)
            if(res.code !== 200){
                return this.$message.error('获取学生列表失败！');
            }
            this.editForm = res.data
             
            this.editDialogVisible = true

        },
        //修改学生信息并提交
        editStudentInfo() {
            this.$refs.editFormRef.validate(async valid=> {
                if(!valid) return
                //发起修改学生信息的数据请求
                const {data: res} = await this.$http.put('student/' + this.editForm.id,{email:
                this.editForm.email,avatar:this.editForm.avatar,className:
                this.editForm.className
                })
                
                if(res.code !==200) {
                    return this.$message.error('更新学生信息失败！')
                }

                //关闭对话框
                this.editDialogVisible = false
                //刷新数据列表
                this.getStudentList()
                //提示修改成功
                this.$message.success('更新学生信息成功！')
            })
        },
        //根据ID删除学生信息
        async removeStudentById(id) {
            //弹框询问  是否删除数据
            const confirmResult = await this.$confirm('此操作将永久删除该学生信息, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err => {
            return err
        })
        //如果学生确认删除，则返回字符串 confirm
        //如果学生取消删除，则返回字符串 cancel
        // console.log(confirmResult)
        if(confirmResult !== 'confirm') {
            return this.$message.info('已取消删除')
        }
        const {data : res} = await this.$http.delete('student/' + id)
        if(res.code !== 200) {
            return this.$message.error('删除学生失败！')
        }

        this.$message.success('删除学生成功！')
        this.getStudentList()

        },
        //监听添加学生对话框的关闭事件
        addDialogClosed() {
            this.$refs.addFormRef.resetFields()
        },
        addStudent() {
            this.$refs.addFormRef.validate(async valid => {
                if(!valid) return
                //可以发起真正的添加学生的网络请求
                const {data: res} = await this.$http.post('student',this.addForm)
                if(res.code !== 201) {
                    this.$message.error('添加学生失败！')
                }
                this.$message.success('添加学生成功！')
                //隐藏添加学生的对话框
                this.addDialogVisible = false
                this.getStudentList()
            })
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

<style scoped>
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
