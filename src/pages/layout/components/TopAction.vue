<template>
    <div class="top-container">
        <div class="title">{{sysTitle||'应急广播系统'}}</div>
        <div class="right-menu">
            <error-log class="errLog-container right-menu-item"></error-log>
            <el-tooltip effect="dark" content="全屏" placement="bottom">
                <screenfull class="screenfull right-menu-item"></screenfull>
            </el-tooltip>
            <el-dropdown class="avatar-container right-menu-item" trigger="click">
                <div class="avatar-wrapper">
                <img class="user-avatar" :src="imgs">
                <i class="el-icon-caret-bottom"></i>
                </div>
                <el-dropdown-menu slot="dropdown">
                <router-link to="/">
                    <el-dropdown-item>
                    个人中心
                    </el-dropdown-item>
                </router-link>
                <el-dropdown-item divided>
                    <span @click="logout" style="display:block;">退出</span>
                </el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
        </div>
        
    </div>
</template>

<script type="text/ecmascript-6">
import { mapGetters } from 'vuex';
import ErrorLog from '@/components/ErrorLog';
import Screenfull from '@/components/Screenfull';
import imgs from '@/assets/images/man.png';
export default {
    data () {
        return {
            imgs
        };
    },
    mounted () {
    },
    methods: {
        logout () {
            this.$confirm('确定要退出吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
                center: true
            }).then(() => {
                this.$store.dispatch('logout').then(() => {
                    location.reload(); // In order to re-instantiate the vue-router object to avoid bugs
                });
            });
        }
    },
    computed: {
        ...mapGetters([
            'sysTitle'
        ])
    },
    components: {
        ErrorLog,
        Screenfull
    }
};
</script>

<style scoped lang="scss">
.top-container {
  height: 70px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: linear-gradient(90deg, #2c5dab, #299dd4);
  .title {
    padding-left: 10px;
    color: #ece4d9;
    font: 700 20px "Comic Sans MS";
    text-shadow: 0 0 10px #ec5e0c, 0px 0 10px #da9606, 0px 0 10px #886e65;
  }
  .right-menu {
    height: 100%;
    display: flex;
    align-items: center;
    &:focus {
      outline: none;
    }
    .errLog-container {
      display: inline-block;
      vertical-align: top;
    }
    .right-menu-item {
      display: inline-block;
      margin: 0 8px;
    }
    .screenfull {
      height: 20px;
    }
    .international {
      vertical-align: top;
    }
    .theme-switch {
      vertical-align: 15px;
    }
    .avatar-container {
      height: 50px;
      margin-right: 30px;
      .avatar-wrapper {
        cursor: pointer;
        margin-top: 5px;
        position: relative;
        .user-avatar {
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }
        .el-icon-caret-bottom {
          position: absolute;
          color: #fff;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
