<template>
  <el-container class="home-container">
    <el-header>
      <div>
        <img height="50px" src="../assets/logo.png" alt />
        <span>后台管理系统</span>
      </div>
      <div>
        <el-select v-model="currentRoleId" placeholder="请选择" @change="changeRoleId">
          <el-option
            v-for="item in loginUserInfo.roleList"
            :key="item.roleId"
            :label="item.roleName"
            :value="item.roleId"
          ></el-option>
        </el-select>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <el-container>
      <!-- 侧边栏菜单 -->
      <el-aside :width="isCollapse ?'64px':'200px'">
        <div class="toggle-button" @click="toggleCollapse">|||</div>
        <el-menu
          background-color="#333744"
          text-color="#fff"
          active-text-color="#409eff"
          unique-opened
          :collapse="isCollapse"
          :collapse-transition="false"
          router
          :default-active="activePath"
        >
          <!-- 一级菜单 -->
          <el-submenu :index="item.id +''" v-for="item in resourceList" :key="item.id">
            <!-- 一级菜单模板 -->
            <template slot="title">
              <i class="el-icon-menu"></i>
              <span>{{ item.name }}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item
              :index="subItem.path"
              v-for="subItem in item.childList"
              :key="subItem.id"
              @click="saveNavState(subItem.path)"
            >
              <template slot="title">
                <i class="el-icon-location"></i>
                <span>{{ subItem.name }}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 主体页面 -->
      <el-main>
        <!-- 路由占位符 -->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>
<script>
export default {
  data() {
    return {
      resourceList: [],
      // 侧边栏是否折叠，默认不折叠
      isCollapse: false,
      // 被激活的地址
      activePath: '',
      // 当前登录用户的信息
      loginUserInfo: {},
      currentRoleId: ''
    }
  },
  created() {
    this.loginUserInfo = window.JSON.parse(
      window.sessionStorage.getItem('loginUserInfo')
    )
    this.setDefaultRoleId()
    this.getResource()
    this.activePath = window.sessionStorage.getItem('activePath')
  },
  methods: {
    // 刷新页面时，设置当前角色为默认角色
    setDefaultRoleId() {
      var roleList = this.loginUserInfo.roleList
      for (let index = 0; index < roleList.length; index++) {
        const element = roleList[index]
        if (element.defaultFlag === 1) {
          this.currentRoleId = element.roleId
          window.sessionStorage.setItem('currentRoleId', this.currentRoleId)
        }
      }
    },
    // 修改当前角色，并重新获取资源列表
    changeRoleId(roleId) {
      this.currentRoleId = roleId
      window.sessionStorage.setItem('currentRoleId', this.currentRoleId)
      this.getResource()
    },
    logout() {
      // 调用后端退出接口将当前boToken加入黑名单
      // 先清空缓存数据中的boToken
      window.sessionStorage.clear()
      // 重定向到登录页面
      this.$router.push('/login')
    },
    async getResource() {
      const { data: res } = await this.$http.get(
        '/auth/getResource?roleId=' + this.currentRoleId
      )
      if (res.code !== '0') {
        return this.$message.error('获取资源失败:' + res.msg)
      }
      this.resourceList = res.dataResult
    },
    toggleCollapse() {
      this.isCollapse = !this.isCollapse
    },
    saveNavState(activePath) {
      // 点击二级菜单时，将被激活的地址保存到sessionStorage中
      window.sessionStorage.setItem('activePath', activePath)
      this.activePath = activePath
    }
  }
}
</script>

<style lang="less" scoped>
.home-container {
  height: 100%;
}

.el-header {
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  padding-left: 0;
  align-items: center;
  color: #fff;
  font-size: 20px;
  > div {
    display: flex;
    align-items: center;
    span {
      margin-left: 15px;
    }
  }
}

.el-aside {
  background-color: #333744;
}

.el-main {
  background-color: #eaedf1;
}

.el-menu {
  border-right: none;
}
.toggle-button {
  background-color: #4a5064;
  font-size: 10px;
  line-height: 24px;
  color: #fff;
  text-align: center;
  letter-spacing: 0.2em;
  cursor: pointer;
}
</style>
