<template>
  <div class="login_container">
    <div class="login_box">
      <div class="avatar_box">
        <img src="../assets/logo.png" alt />
      </div>
      <el-form
        ref="loginFormRef"
        :model="loginForm"
        :rules="loginFormRules"
        label-width="0px"
        class="login_form"
      >
        <!-- 账号 -->
        <el-form-item prop="username">
          <el-input v-model="loginForm.username">
            <i slot="prefix" class="el-input__icon el-icon-loading"></i>
          </el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input v-model="loginForm.password" placeholder="请输入密码" type="password">
            <i slot="prefix" class="el-input__icon el-icon-goods"></i>
          </el-input>
        </el-form-item>
        <!-- 按钮 -->
        <el-form-item class="btns">
          <a href="/pdf/hrrqPdf?dm=2339634784">下载</a>
          <el-button type="primary" @click="login2">登录</el-button>
          <el-button type="info" @click="resetLoginForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      loginForm: {
        username: 'admin',
        password: '123456'
      },
      loginFormRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    resetLoginForm() {
      this.$refs.loginFormRef.resetFields()
    },
    login() {
      this.$refs.loginFormRef.validate(async valid => {
        if (!valid) return false
        const { data: res } = await this.$http.post(
          '/api/open/login',
          this.loginForm
        )
        if (res.code !== '0') {
          return this.$message.error('登录失败:' + res.msg)
        }
        this.$message.success('登录成功')
      })
    },
    login2() {
      this.$refs.loginFormRef.validate(valid => {
        if (!valid) return false
        this.$http
          .post('/api/open/login', this.loginForm)
          .then(res => {
            if (res.data.code !== '0') {
              return this.$message({
                message: '登录失败',
                type: 'error'
              })
            }
            this.$message({
              message: '登录成功',
              type: 'success'
            })
            window.sessionStorage.setItem(
              'boToken',
              res.data.dataResult.boToken
            )
            this.$router.push('/home')
          })
          .catch(err => {
            this.$message({
              message: '登录失败：' + err,
              type: 'error'
            })
          })
      })
    }
  }
}
</script>
<style lang='less' scoped>
.login_container {
  background-color: #2b4b6b;
  height: 100%;
}
.login_box {
  width: 450px;
  height: 300px;
  background-color: #fff;
  border-radius: 3px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  .avatar_box {
    height: 130px;
    width: 130px;
    border: 1px solid#eee;
    border-radius: 50%;
    padding: 10px;
    box-shadow: 0 0 10px #eee;
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #fff;
    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background-color: #eee;
    }
  }
}
.btns {
  display: flex;
  justify-content: flex-end;
}
.login_form {
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
}
</style>
