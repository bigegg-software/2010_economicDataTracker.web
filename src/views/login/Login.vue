<template>
  <div class="login">
    <div class="bg-image"></div>
    <div class="content">
      <div class="title">
        <div class="title-en">CHINA ECONOMIC DATA TRACKER</div>
        <div class="title-ch">中国对外经济数据追踪器</div>
      </div>
      <a-form
        id="loginForm"
        :form="form"
        class="login-form"
        @submit="handleSubmit"
      >
        <a-form-item>
          <a-input
            v-decorator="[
              'userName',
              {
                rules: [{ required: true, message: '请输入账号/用户名' }]
              }
            ]"
            placeholder="账号 Username"
          >
            <a-icon slot="prefix" type="user" style="color: rgba(0,0,0,.25)" />
          </a-input>
        </a-form-item>
        <a-form-item>
          <a-input
            v-decorator="[
              'password',
              {
                rules: [{ required: true, message: '请输入密码' }]
              }
            ]"
            type="password"
            placeholder="密码 Password"
          >
            <a-icon slot="prefix" type="lock" style="color: rgba(0,0,0,.25)" />
          </a-input>
        </a-form-item>
        <a-form-item>
          <a-button type="primary" html-type="submit" class="login-form-button">
            登录 Log in
          </a-button>
        </a-form-item>
        <div class="go-back" @click="goBack">
          返回数据页面
        </div>
      </a-form>
    </div>
  </div>
</template>

<script>
import Parse from "@/request/user.js";
export default {
  name: "Login",
  data() {
    return {};
  },
  beforeCreate() {
    this.form = this.$form.createForm(this, { name: "loginForm" });
  },
  mounted() {},
  methods: {
    handleSubmit(e) {
      e.preventDefault();
      this.form.validateFields(async (err, values) => {
        if (!err) {
          try {
            let user = await Parse.logIn(values);
            this.$store.commit('setUserInfo',user);
            this.$router.push({path:this.$route.query.redirect});
          } catch (error) {
            this.$message.warning({
              content: "用户名或密码错误",
              duration: 2
            });
          }
        }
      });
    },
    goBack() {
      this.$router.push({path:this.$route.query.redirect?this.$route.query.redirect:'/'});
    }
  }
};
</script>

<style lang="less" scoped>
.login {
  display: flex;
  width: 100%;
  height: 100%;
}
.content {
  display: flex;
  flex-flow: column nowrap;
  justify-content: space-between;
  align-items: center;
  width: 75%;
  padding: 1.460417rem 0 1.377083rem 0;
  box-sizing: border-box;
  .title {
    text-align: center;
    color: #333;
    font-weight: bold;
    margin-bottom: 0.416667rem;
    .title-en {
      font-size: 40px;
    }
    .title-ch {
      font-size: 0.104167rem;
      letter-spacing: 0.041667rem;
    }
  }
  .login-form {
    width: 2.265625rem;
    .ant-form-item {
      &:nth-child(3) {
        margin-bottom: 0.052083rem;
      }
    }
    &/deep/ .ant-input {
      height: 0.260417rem;
    }
    .login-form-button {
      width: 100%;
      height: 0.260417rem;
      border: none;
      background: rgb(68, 107, 144);
    }
    .go-back {
      cursor: pointer;
      font-size: 14px;
      color: rgb(68, 107, 144);
    }
  }
}
.bg-image {
  width: 25%;
  height: 100%;
  background: url("../../assets/img/login_bg.jpg") center/cover no-repeat;
}
</style>
