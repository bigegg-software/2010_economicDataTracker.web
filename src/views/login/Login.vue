<template>
  <div class="loginPage">
    <img class="login_bg" src="../../assets/img/login_bg.jpg" alt />
    <div class="login_content">
      <div class="title">
        <div class="title_en">CHINA ECONOMIC DATA TRACKER</div>
        <div class="title_ch">中国对外经济数据追踪器</div>
      </div>
      <div class="login_input">
        <input type="text" class="username" v-model="loginForm.username" placeholder="账号 Username" />
        <input type="password" class="pwd" v-model="loginForm.password" placeholder="密码 Password" />
        <a-button class="submitBtn" @click="checking">登录 Login</a-button>
        <div class="backData">返回数据页面</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Login",
  components: {},
  data() {
    return {
      loginForm:{
        username:"",
        password:""
      }
    };
  },
  mounted() {},
  methods: {
    checking() {
      if (this.loginForm.username === '' || this.loginForm.password === '') {
        this.$message.info('账号或密码不能为空');
      } else {
        this.$message.info('账号或密码错误');
      }
    },
  }
};
</script>

<style lang="less" scoped>
.loginPage {
  display: flex;
  width: 100%;
  height: 100%;
  .login_bg {
    width: 2.8125rem;
    height: 100%;
  }
  .login_content {
    flex: 1;
    display: flex;
    flex-flow: column nowrap;
    justify-content: space-between;
    align-items: center;
    padding: 1.52rem 0;
    box-sizing: border-box;
    .title {
      text-align: center;
      color: #333;
      font-weight: bold;
      .title_en {
        font-size:0.135417rem;
      }
      .title_ch {
        font-size: 0.072917rem;
        letter-spacing: 0.041667rem;
      }
    }
    .login_input {
      display: flex;
      flex-flow: column nowrap;
      width: 1.6rem;
      .username,
      .pwd {
        height: 0.2rem;
        margin-bottom: 0.1rem;
        padding: 0 0.05rem;
        box-sizing: border-box;
        border: 1px solid #ddd;
      }
      .username:focus,
      .pwd:focus{
        outline: 0;
      }
      .submitBtn {
        height: 0.2rem;
        margin: 0.06rem 0 0.03rem;
        background: rgb(68, 107, 144);
        outline: none;
        border: none;
        color: #fff;
      }
      .backData {
        font-size: 0.0625rem;
        color: rgb(68, 107, 144);
      }
    }
  }
}
</style>
