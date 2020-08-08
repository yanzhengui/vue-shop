<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片内容 -->
    <el-card>
      <!-- 搜索框 -->
      <el-row :gutter="20">
        <el-col :span="9">
          <el-input
            placeholder="请输入角色名称"
            v-model="queryInfo.roleName"
            clearable
            @clear="getRoleList"
          >
            <el-button slot="append" icon="el-icon-search" @click="getRoleList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible = true">添加角色</el-button>
        </el-col>
      </el-row>
      <!-- 用户列表区域 -->
      <el-table :data="roleList" style="width: 100%" border stripe>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="roleName" label="角色名称" width="180"></el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.status"
              :active-value="1"
              :inactive-value="0"
              @change="changeRoleStatus2(scope.row)"
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
                @click="handleEdit(scope.$index, scope.row)"
              ></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="删除" placement="top">
              <el-button
                size="mini"
                icon="el-icon-delete"
                type="danger"
                @click="handleDelete(scope.$index, scope.row)"
              ></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="分配资源" placement="top">
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
    <!-- 添加角色对话框 -->
    <el-dialog title="添加角色" :visible.sync="addDialogVisible" width="50%" @close="addDialogClose">
      <el-form
        :model="addForm"
        status-icon
        :rules="addFormRules"
        ref="addFormRef"
        label-width="80px"
      >
        <el-form-item label="角色名" prop="roleName">
          <el-input type="text" v-model="addForm.username"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRole">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      queryInfo: {
        roleName: '',
        pageNum: 1,
        pageSize: 5
      },
      roleList: [],
      total: 0,
      // 控制添加用户对话框显示
      addDialogVisible: false,
      // 添加用户表彰数据
      addForm: {
        roleName: ''
      },
      // 添加用户表彰校验规则
      addFormRules: {
        roleName: [
          { required: true, message: '请输入角色名', trigger: 'blur' },
          { min: 3, max: 10, message: '长度为3到10之间', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getRoleList()
  },
  methods: {
    async getRoleList() {
      const { data: res } = await this.$http.post(
        '/role/getRoleList',
        this.queryInfo
      )
      if (res.code !== '0') return this.$message.error('获取角色列表失败')
      this.roleList = res.dataResult.records
      this.total = res.dataResult.total
    },
    handleSizeChange(newSize) {
      this.queryInfo.pageSize = newSize
      this.getRoleList()
    },
    handleCurrentChange(newPageNum) {
      this.queryInfo.pageNum = newPageNum
      this.getRoleList()
    },
    async changeRoleStatus(roleInfo) {
      const { data: res } = await this.$http.post('/role/changeRoleStatus', {
        roleId: roleInfo.id,
        status: roleInfo.status
      })
      if (res.code !== '0') {
        roleInfo.status = !roleInfo.status
        return this.$message.error(res.msg)
      }
      this.$message.success('更新角色状态成功')
    },
    changeRoleStatus2(roleInfo) {
      this.$http
        .post('/role/changeRoleStatus', {
          roleId: roleInfo.id,
          status: roleInfo.status
        })
        .then(res => {
          if (res.data.code !== '0') {
            return this.$message({
              message: res.data.msg,
              type: 'error'
            })
          }
          this.$message({
            message: '更新角色状态成功',
            type: 'success'
          })
        })
        .catch(err => {
          roleInfo.status = !roleInfo.status
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
    addRole() {
      this.$refs.addFormRef.validate(async valid => {
        // 校验失败，直接return
        if (!valid) return
        // 校验成功，调用添加用户接口
        const { data: res } = await this.$http.post(
          '/role/addRole',
          this.addForm
        )
        debugger
        if (res.code !== '0') {
          return this.$message.error(res.msg)
        }
        this.$message.success('添加角色成功')
        this.addDialogVisible = false
        this.getRoleList()
      })
    }
  }
}
</script>

<style>
</style>
