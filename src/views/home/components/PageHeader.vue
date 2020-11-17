<template>
  <div class="pageHeader">
    <div class="logo">
      <img class="logo-img" src="../../../assets/img/logo.png" alt="" />
    </div>
    <div class="action">
      <div class="latest-data" @click="showDataList">
        <div class="icon-block">
          <div class="iconfont icon-msg">&#xe60a;</div>
          <div class="data-num" v-if="dataList&&dataList.allreadySetMenus">{{ dataList.allreadySetMenus.length }}</div>
        </div>
        <div class="text-block">
          <div class="text-english">Latest data</div>
          <div class="text-chinese">最新数据</div>
        </div>
      </div>
      <div class="user-actions" v-if="reload">
        <div class="user-info">
          <img src="../../../assets/img/avatar.png" class="user-avatar" />
          <div class="user-name">{{ userInfo.nickname?userInfo.nickname:userInfo&&!userInfo.nickname&&userInfo.username?userInfo.username:''}}</div>
        </div>
        <div class="line"></div>
        <div class="logout" v-if="userInfo.sessionToken" @click="logout">
          <div  class="iconfont icon-logout">
            &#xe620;
          </div>
          <div class="logout-text">退出</div>
        </div>
        <div v-if="!userInfo.sessionToken" class="logout-text" @click="logInfo">登录</div>
      </div>
      <!-- 下拉框 -->
      <div v-if="show" class="data-list" @mouseleave="hiddenDataList">
        <div v-for="item in dataList" :key="item.activityTime">
          <div class="list-time">{{ item.activityTime }}</div>
          <div class="list-text-block">
            <div
              v-for="data in item.menus"
              :key="data.name"
              class="list-text"
              @click="jumpPage(data)"
            >
              <div>{{ data.en }}</div>
              <div>{{ data.ch }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import user from '@/request/user'
export default {
  name: "PageHeader",
  data() {
    return {
      reload:true,
      show: false
    };
  },
  mounted() {
  },
  computed:{
     userInfo() {
       return this.$store.getters.userInfo;
     },
     dataList() {
       return this.$store.getters.latestNews;
     }
  },
  methods: {
    showDataList() {
      this.show = !this.show;
    },
    hiddenDataList() {
      this.show = false;
    },
    jumpPage(data) {
      this.$router.push({name:data.name});
      // console.log(data, "最新数据");
      this.show = false;
    },
    logout() {
      let tthis=this;
      this.$confirm({
        title: '确认要退出吗?',
        onOk() {
          // 退出后删除所有信息
          user.logOut();
          tthis.$storage.clear();
          tthis.$store.commit('setUserInfo',{});
        },
        okText: '确定',
        okType: 'danger',
        cancelText: '取消',
        onCancel() {
          
        }
      });
    },
    logInfo() {
      console.log(this.$route)
      this.$router.push({
        path:'/login',
        query:{redirect:this.$route.fullPath}
      });
    }
  }
};
</script>

<style lang="less" scoped>
@keyframes fadeIn {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
// header
.pageHeader {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 0.53125rem;
  padding: 0 0.416667rem;
  box-sizing: border-box;
}
.logo {
  width: 50%;
  .logo-img{
    width: 1.838542rem;
  }
}
.data-list {
  position: absolute;
  right: 1.2rem;
  top: 110px;
  z-index: 10;
  max-height: 4rem;
  overflow: auto;
  // width: 1.53125rem;
  padding: 0.020833rem 0;
  box-shadow: darkgrey 0px 0px 5px 1px;
  color: rgba(153, 153, 153, 1);
  font-size: 0.072917rem;
  background-color: #fff;
  animation: fadeIn 0.5s ease-in-out;
  .list-time {
    padding: 0.041667rem 0.057292rem;
    border-bottom: 1.5px solid #efefef;
    color: #333;
    font-size: 0.072917rem;
    font-family: SimHei,'黑体';
  }
  .list-text-block {
    padding: 0.114583rem 0.083333rem 0.072917rem;
    :hover {
      color: #186496;
    }
    .list-text {
      cursor: pointer;
      margin-bottom:0.09375rem; 
      font-size: 0.083333rem;
      font-family: Calibri;
      &:last-child {
        margin-bottom: 0;
      }
      div:last-child{
        font-size: 0.072917rem;
        font-family: SimHei,'黑体';
      }
      div {
        line-height: 0.104167rem;
      }
    }
  }
}
.action {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  width: 50%;
  color: #999999;
  //  最新数据
  .latest-data {
    display: flex;
    align-items: center;
    font-size: 0.09375rem;
    cursor: pointer;
    .icon-block {
      position: relative;
      padding: 0.052083rem;
      &:hover {
        cursor: pointer;
      }
      .icon-msg {
        font-size: 0.135417rem;
      }
      .data-num {
        position: absolute;
        right: 0.052083rem;
        top: 0.0625rem;
        width: 0.094rem;
        height: 0.094rem;
        border-radius: 50%;
        text-align: center;
        font-size: 0.0625rem;
        line-height: 0.094rem;
        color: #fff;
        background-color: #df2323;
      }
    }
    .text-block {
      font-size: 0.104167rem;
      div {
        line-height: 0.125rem;
      }
      .text-chinese{
        font-size: 0.072917rem;
      }
    }
  }
  //  用户操作
  .user-actions {
    display: flex;
    align-items: center;
    margin-left: 0.208333rem;
    .user-info {
      display: flex;
      align-items: center;
      .user-avatar {
        width: 0.130208rem;
        height: 0.130208rem;
      }
      .user-name {
        margin-left: 0.0625rem;
        font-size: 0.083333rem;
      }
    }
    .line {
      width: 0.010417rem;
      height: 0.140625rem;
      margin: 0 0.130208rem;
      background-color: #d1d1d1;
    }
    .logout {
      display: flex;
      align-items: center;
      &:hover {
        cursor: pointer;
      }
      .icon-logout {
        transform: rotateZ(180deg);
        font-size: 0.09375rem;
        margin-right: 0.041667rem;
      }
    }
    .logout-text{
      cursor: pointer;
    }
  }
}
</style>
