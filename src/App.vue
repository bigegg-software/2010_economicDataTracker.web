<template>
  <div id="app">
    <!-- <router-link to="/about">About</router-link> -->
    <router-view />
  </div>
</template>
<script>
import user from '@/request/user'
export default {
  data() {
    return {

    }
  },
  async created() {
    localStorage.removeItem(`Parse/${process.env.VUE_APP_ID}/currentUser`);
    if(this.$storage.getItem('user')){
      let u=this.$storage.getItem('user');
      let user= new this.$Parse.Query('User');
          user.equalTo('objectId',u.objectId);
      let res=await user.first();
      if(res){
        localStorage.setItem(`Parse/${process.env.VUE_APP_ID}/currentUser`,sessionStorage.getItem('user'));
      }else{
        this.$storage.removeItem('user');
        localStorage.removeItem(`Parse/${process.env.VUE_APP_ID}/currentUser`);
      }
    }
    window.addEventListener('beforeunload',()=>{
         if(this.$store.getters.userInfo.sessionToken){
           this.$storage.setItem('user',this.$store.getters.userInfo);
         }
    });
    window.addEventListener('load',()=>{
         if(this.$storage.getItem('user')){
           this.$store.commit('setUserInfo',this.$storage.getItem('user'));
           this.$storage.removeItem('user');
         }
    });
  }
}
</script>
<style lang="less">
* {
  margin: 0;
  padding: 0;
}
html,
body,
#app {
  width: 100%;
  height:100%;
  margin: 0;
  padding: 0;
  // font-family:Arial,"Microsoft Yahei";
  font-family: Calibri,"黑体"
}
::-webkit-scrollbar {
  width: 8px;
}
::-webkit-scrollbar {
  height: 8px;
}
::-webkit-scrollbar-track {
  background-color: #eee;
} // 后背景
::-webkit-scrollbar-thumb {
  background-color: #aab0b8;
} // 原前背景aab0b8
::-webkit-scrollbar-thumb:hover {
  background-color: #143257;
} //鼠标放上
::-webkit-scrollbar-thumb:active {
  background-color: #aab0b8;
} // 选中前背景
</style>
