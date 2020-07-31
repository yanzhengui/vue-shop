<template>
  <div>
    <el-button type="info" @click="logout">退出</el-button>
  </div>
</template>
<script>
export default {
  data() {
    return {}
  },
  methods: {
    logout() {
      // 调用后端退出接口将当前boToken加入黑名单
      // 先清空缓存数据中的boToken
      window.sessionStorage.clear()
      // 重定向到登录页面
      this.$router.push('/login')
    }
  }
}
</script>

<style lang="less" scoped>
</style>
