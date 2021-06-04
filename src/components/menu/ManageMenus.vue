<template>
    <div>
        <!-- 面包屑导航区域 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/admin' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>菜单管理</el-breadcrumb-item>
            <el-breadcrumb-item>菜单列表</el-breadcrumb-item>
        </el-breadcrumb>


        <!-- 卡片视图区域 -->
        <el-card>
            
            <el-row :gutter="20">
                <el-col :span="8">
                    <!-- 搜索与添加 -->
                    <el-input placeholder="请输入内容" v-model="query.query" clearable @clear="getMenuList">
                    <el-button slot="append" icon="el-icon-search" @click="search"></el-button></el-input>
                </el-col>
                <el-col :span="4">
                    <el-button type="primary" @click="addDialogVisible = true">添加菜单</el-button>
                </el-col>
            </el-row>
        </el-card>

        <!-- 用户列表区域 -->
        <el-table :data="menulist" border stripe :header-cell-style="headClass">
            <el-table-column type="index" align="center"></el-table-column>
            <el-table-column label="菜单名称" prop="menuName" align="center"></el-table-column>
            <el-table-column label="菜单地址栏" prop="menuUrl" align="center"></el-table-column>
            <el-table-column label="菜单日期" prop="created" align="center"></el-table-column>
            <el-table-column label="操作" align="center">
                <template slot-scope="scope">
                    <el-tooltip effect="dark" content="编辑菜单" placement="top-start" :enterable="false">
                        <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.id)"></el-button>
                    </el-tooltip>
                    <el-tooltip effect="dark" content="删除菜单" placement="top-start" :enterable="false">
                        <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeMenuById(scope.row.id)"></el-button>
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
    
    <!-- 添加菜单的对话框 -->
    <el-dialog
        title="添加左侧菜单"
        :visible.sync="addDialogVisible"
        width="50%" @close="addDialogClosed">
        <!-- 内容主体区域 -->
    <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="80px">
        <el-form-item label="菜单名称" prop="menuName">
        <el-input v-model="addForm.menuName"></el-input>
        </el-form-item>
    <el-form-item label="菜单地址" prop="menuUrl">
        <el-input v-model="addForm.menuUrl"></el-input>
        </el-form-item>
    </el-form>
    <!-- 底部区域 -->
  <span slot="footer" class="dialog-footer">
    <el-button @click="addDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="addMenu">确 定</el-button>
  </span>
</el-dialog>

    <!-- 修改菜单的对话框 -->
    <el-dialog
  title="修改菜单栏信息"
  :visible.sync="editDialogVisible"
  width="50%">
  <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="70px">
  <el-form-item label="菜单名称" prop="menuName">
    <el-input v-model="editForm.menuName"></el-input>
  </el-form-item>
  <el-form-item label="地址栏" prop="menuUrl">
    <el-input v-model="editForm.menuUrl"></el-input>
  </el-form-item>
  </el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="editDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="editMenuInfo">确 定</el-button>
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
            //添加菜单的表单数据
            addForm: {
                menuName: '',
                menuUrl: ''
            },
            //控制添加菜单栏对话框的显示与隐藏
            addDialogVisible: false,
            //添加表单的验证规则
            addFormRules:{
                menuName: [
                    { required: true, message:'请输入左侧菜单栏名称', trigger: 'blur'}
                ],
                menuUrl: [
                    { required: true, message: '菜单地址栏不能为空', trigger: 'blur' }
                ]
            },
            menulist: [],
            editDialogVisible: false,
            editForm: {},
            editFormRules: {
          MenuName: [
            { required: true, message: '请输入菜单名称', trigger: 'blur' }
          ],
          MenuUrl: [
            { required: true, message: '菜单地址不能为空', trigger: 'blur' }
          ]
        },
            total: 0,
            query: {
                currentPage: 1,
                currentSize: 5,
                query: ''
            }
        }
    },
    created() {
        this.getMenuList()
    },
    methods: {
        async getMenuList() {
            const { data : res} = await this.$http.get('menus',{ params: this.queryinfo})
            if(res.code !== 200) {
                return this.$message.error('获取菜单列表失败！');
            }
            this.menulist = res.data.records
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
            this.getMenuList()
        },
        handleCurrentChange(newPage) {//监听 页码值 改变的事件
            // console.log(newPage)
            this.queryinfo.currentPage = newPage
            this.query.currentPage = newPage
            this.getMenuList()
        },
        async search() {
            const { data : res} = await this.$http.get('menusearch',{ params: this.query})
            if(res.code !== 200) {
                return this.$message.error('获取菜单列表失败！');
            }
            this.menulist = res.data.records
            this.queryinfo.currentPage = res.data.current
            this.queryinfo.currentSize = res.data.size
            this.total = res.data.total
            
            console.log(this.query + "+++++++++++++")
        },
        async showEditDialog(id) {
            const { data : res} = await this.$http.get('menu/' + id)
            if(res.code !== 200){
                return this.$message.error('获取菜单列表失败！');
            }
            this.editForm = res.data
             
            this.editDialogVisible = true

        },
        //修改菜单信息并提交
        editMenuInfo() {
            this.$refs.editFormRef.validate(async valid=> {
                if(!valid) return
                //发起修改菜单信息的数据请求
                const {data: res} = await this.$http.put('menu/' + this.editForm.id,{menuName:
                this.editForm.menuName,menuUrl:this.editForm.menuUrl
                })
                
                if(res.code !==200) {
                    return this.$message.error('更新菜单信息失败！')
                }

                //关闭对话框
                this.editDialogVisible = false
                //刷新数据列表
                this.getMenuList()
                //提示修改成功
                this.$message.success('更新菜单信息成功！')
                location.reload();
            })
        },
        //监听添加学生对话框的关闭事件
        addDialogClosed() {
            this.$refs.addFormRef.resetFields()
        },
        addMenu() {
            this.$refs.addFormRef.validate(async valid => {
                if(!valid) return
                //可以发起真正的添加菜单栏的网络请求
                const {data: res} = await this.$http.post('menu',this.addForm)
                if(res.code !== 200) {
                    this.$message.error('添加菜单栏失败！')
                }
                this.$message.success('添加菜单栏成功！')
                //隐藏添加菜单栏的对话框
                this.addDialogVisible = false
                this.getMenuList()
                location.reload();
            })
        },
        //根据ID删除菜单信息
        async removeMenuById(id) {
            //弹框询问  是否删除数据
            const confirmResult = await this.$confirm('此操作将永久删除该菜单信息, 是否继续?', '提示', {
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
        const {data : res} = await this.$http.delete('menu/' + id)
        if(res.code !== 200) {
            return this.$message.error('删除菜单失败！')
        }

        this.$message.success('删除菜单成功！')
        this.getMenuList()
        location.reload();

        },
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
