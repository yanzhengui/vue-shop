<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片内容 -->
    <el-card>
      <!-- 搜索框 -->
      <el-row :gutter="20">
        <el-col :span="9">
          <el-input placeholder="请输入账号" v-model="queryInfo.username" clearable @clear="getUserList">
            <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible = true">添加用户</el-button>
        </el-col>
      </el-row>
      <!-- 用户列表区域 -->
      <el-table :data="userList" style="width: 100%" border stripe>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="username" label="账号" width="180"></el-table-column>
        <el-table-column prop="realname" label="姓名" width="180"></el-table-column>
        <el-table-column prop="email" label="邮箱"></el-table-column>
        <el-table-column prop="mobile" label="手机"></el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.status"
              :active-value="1"
              :inactive-value="0"
              @change="changeUserStatus2(scope.row)"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="220">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" content="修改" placement="top" :enterable="false">
              <el-button
                type="primary"
                size="mini"
                icon="el-icon-edit"
                @click="showEditDialog(scope.row)"
              ></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="删除" placement="top">
              <el-button
                size="mini"
                icon="el-icon-delete"
                type="danger"
                @click="deleteUser(scope.row)"
              ></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="分配角色" placement="top">
              <el-button
                size="mini"
                icon="el-icon-setting"
                type="warning"
                @click="handleDelete(scope.$index, scope.row)"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pageNum"
        :page-sizes="[1, 5, 10, 20]"
        :page-size="queryInfo.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>
    <!-- 添加用户对话框 -->
    <el-dialog title="添加用户" :visible.sync="addDialogVisible" width="50%" @close="addDialogClose">
      <el-form
        :model="addForm"
        status-icon
        :rules="addFormRules"
        ref="addFormRef"
        label-width="80px"
      >
        <el-form-item label="用户名" prop="username">
          <el-input type="text" v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="真实姓名" prop="realname">
          <el-input type="text" v-model="addForm.realname"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input type="password" v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="passwordConfirm">
          <el-input type="password" v-model="addForm.passwordConfirm"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input type="text" v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input type="text" v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog title="修改用户" :visible.sync="editDialogVisible" width="50%">
      <el-form
        :model="editForm"
        status-icon
        :rules="editFormRules"
        ref="editFormRef"
        label-width="80px"
        @close="editDialogClose"
      >
        <el-form-item label="用户名">
          <el-input type="text" v-model="editForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="真实姓名" prop="realname">
          <el-input type="text" v-model="editForm.realname"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input type="text" v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input type="text" v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUserInfo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    // 自定义邮箱正则校验
    var validEmail = (rule, value, callback) => {
      const reg = /^\w[-\w.+]*@([A-Za-z0-9][-A-Za-z0-9]+\.)+[A-Za-z]{2,14}/
      if (reg.test(value)) {
        return callback()
      }
      callback(new Error('请输入合法的邮箱'))
    }
    // 自定义手机号正则校验
    var validMobile = (rule, value, callback) => {
      const reg = /^1[0-9]{10}/
      if (reg.test(value)) {
        return callback()
      }
      callback(new Error('请输入合法的手机号'))
    }
    // 自定义确认密码校验
    var validPassword = (rule, value, callback) => {
      if (this.addForm.password === this.addForm.passwordConfirm) {
        return callback()
      }
      callback(new Error('两次密码不一致'))
    }
    return {
      queryInfo: {
        username: '',
        pageNum: 1,
        pageSize: 5
      },
      userList: [],
      total: 0,
      // 控制添加用户对话框显示
      addDialogVisible: false,
      // 控制修改用户对话框显示
      editDialogVisible: false,
      // 添加用户数据
      addForm: {
        username: '',
        realname: '',
        password: '',
        passwordConfirm: '',
        emial: '',
        mobile: ''
      },
      // 修改用户信息
      editForm: {
        username: '',
        realname: '',
        emial: '',
        mobile: ''
      },
      // 添加用户表彰校验规则
      addFormRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 10, message: '长度为3到10之间', trigger: 'blur' }
        ],
        realname: [
          { required: true, message: '请输入真实姓名', trigger: 'blur' },
          { min: 2, max: 10, message: '长度为2到10之间', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 16, message: '长度为6到16之间', trigger: 'blur' }
        ],
        passwordConfirm: [
          { required: true, message: '请输入确认密码', trigger: 'blur' },
          { min: 6, max: 16, message: '长度为6到16之间', trigger: 'blur' },
          { validator: validPassword, trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: validEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: validMobile, trigger: 'blur' }
        ]
      },
      editFormRules: {
        realname: [
          { required: true, message: '请输入真实姓名', trigger: 'blur' },
          { min: 2, max: 10, message: '长度为2到10之间', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: validEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: validMobile, trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getUserList()
  },
  methods: {
    async getUserList() {
      const { data: res } = await this.$http.post(
        '/user/getUserList',
        this.queryInfo
      )
      if (res.code !== '0') return this.$message.error('获取用户列表失败')
      this.userList = res.dataResult.records
      this.total = res.dataResult.total
    },
    handleSizeChange(newSize) {
      this.queryInfo.pageSize = newSize
      this.getUserList()
    },
    handleCurrentChange(newPageNum) {
      this.queryInfo.pageNum = newPageNum
      this.getUserList()
    },
    async changeUserStatus(userInfo) {
      const { data: res } = await this.$http.post('/user/changeUserStatus', {
        userId: userInfo.id,
        status: userInfo.status
      })
      if (res.code !== '0') {
        userInfo.status = !userInfo.status
        return this.$message.error(res.msg)
      }
      this.$message.success('更新用户状态成功')
    },
    changeUserStatus2(userInfo) {
      this.$http
        .post('/user/changeUserStatus', {
          userId: userInfo.id,
          status: userInfo.status
        })
        .then(res => {
          if (res.data.code !== '0') {
            return this.$message({
              message: res.data.msg,
              type: 'error'
            })
          }
          this.$message({
            message: '更新用户状态成功',
            type: 'success'
          })
        })
        .catch(err => {
          userInfo.status = !userInfo.status
          this.$message({
            message: '更新失败：' + err,
            type: 'error'
          })
        })
    },
    // 添加用户对话框关闭事件
    addDialogClose() {
      this.$refs.addFormRef.resetFields()
    },
    addUser() {
      this.$refs.addFormRef.validate(async valid => {
        // 校验失败，直接return
        if (!valid) return
        // 校验成功，调用添加用户接口
        const { data: res } = await this.$http.post(
          '/user/addUser',
          this.addForm
        )
        if (res.code !== '0') {
          return this.$message.error(res.msg)
        }
        this.$message.success('添加用户成功')
        this.addDialogVisible = false
        this.getUserList()
      })
    },
    // 修改用户对话框
    async showEditDialog(user) {
      this.editForm = user
      this.editDialogVisible = true
    },
    // 修改用户对话框关闭事件
    editDialogClose() {
      this.$refs.editFormRef.resetFields()
    },
    // 提交修改用户信息
    editUserInfo() {
      this.$refs.editFormRef.validate(async valid => {
        // 校验不通过，直接return
        if (!valid) return
        // 校验通过，发起用户修改接口请求
        const { data: res } = await this.$http.post('/user/changeUserInfo', {
          userId: this.editForm.userId,
          realname: this.editForm.realname,
          email: this.editForm.email,
          mobile: this.editForm.mobile
        })
        if (res.code !== '0') {
          return this.$message.error(res.msg)
        }
        this.$message.success('用户信息修改成功')
        this.editDialogVisible = false
        this.getUserList()
      })
    },
    // 删除用户操作
    deleteUser(user) {
      this.$confirm(
        '是否确认永久删除用户【' + user.username + '】?',
        '删除用户提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'danger'
        }
      )
        .then(async () => {
          const { data: res } = await this.$http.post(
            '/user/deleteUser/' + user.id
          )
          console.log(res)
          if (res.code !== '0') return this.$message.error(res.msg)
          // 删除成功，则重新获取列表数据，并弹出提示信息
          this.getUserList()
          this.$message({
            type: 'success',
            message: '用户删除成功!'
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除操作'
          })
        })
    }
  }
}
</script>

<style>
</style>
