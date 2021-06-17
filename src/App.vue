<template>
  <div id="app">
    <!-- <router-link to="/about">About</router-link> -->
    <router-view />
  </div>
</template>
<script>
import Parse from '@/request/user'
export default {
  data() {
    return {

    }
  },
  async created() {
    let tthis=this;
    let currentUser=`Parse/${process.env.VUE_APP_ID}/currentUser`;
    let current=this.$storage.getItem(currentUser);
    if(current){
      this.vali();
    }else{
      Parse.logOut();
      this.$store.commit('setUserInfo',{});
      this.$storage.clear();
    }
    window.removeEventListener("storage",()=>{
      return null;
    });
    window.addEventListener("storage",  async(e)=> {
      let current=this.$storage.getItem(currentUser);
      if(current){
          tthis.vali();
      }else{
        Parse.logOut();
        this.$store.commit('setUserInfo',{});
        this.$storage.clear();
      }
    })
  },
  methods:{
    async vali() {
      let currentUser=`Parse/${process.env.VUE_APP_ID}/currentUser`;
      let u=this.$storage.getItem(currentUser);
        let user= new this.$Parse.Query('User');
            user.equalTo('objectId',u.objectId);
        let res=await user.first();
      if(res){
        try{
          let res=await this.$Parse.User.become(u.sessionToken);
          this.$store.commit('setUserInfo',JSON.parse(JSON.stringify(res)));
        }catch(e) {
            Parse.logOut();
            this.$message.error('登录已失效，请重新登录');
            this.$store.commit('setUserInfo',{});
            this.$storage.clear();
        }
        }else{
          Parse.logOut();
          this.$message.error('登录已失效，请重新登录');
          this.$store.commit('setUserInfo',{});
          this.$storage.clear();
        }
    }
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
