<template>
  <div class="login">
    <div class="bg-image"></div>
    <div class="content">
      <div class="title">
        <div class="title-en">CHINA ECONOMIC DATA TRACKER</div>
        <div class="title-ch">中国对外经济数据追踪器</div>
      </div>
      <a-form id="loginForm" :form="form" class="login-form" @submit="handleSubmit">
        <a-form-item>
          <a-input
            allowClear
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
        <!-- <a-form-item>
          <a-input
            allowClear
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
        </a-form-item> -->


        <!-- 输入手机号获取验证码 -->
        <a-form-item>
          <a-row :gutter="8">
          <a-col :span="16">
          <a-input
           allowClear
            class="phone"
            v-decorator="[
              'phone',
              {
                rules: [{ required: true, message: '请输入手机号' },{validator:valiPhoneNumber}]
              }
            ]"
            type="text"
            placeholder="手机号 Cell-phone number"
          >
            <a-icon slot="prefix" type="phone" style="color: rgba(0,0,0,.25)" />
          </a-input>
          </a-col>
          <a-col :span="8">
              <a-button type="link" @click="getCode" v-if="issend">获取验证码</a-button>
              <a-button disabled type="link" v-if="!issend">{{ count }}s后可重新发送</a-button>
            </a-col>
              
          </a-row>
        </a-form-item>

        <a-form-item>
          <a-input
           allowClear
            v-decorator="[
              'code',
              {
                rules: [{ required: true, message: '请输入验证码' }]
              }
            ]"
            type="text"
            placeholder="验证码 Captcha"
          >
            <a-icon slot="prefix" type="api" style="color: rgba(0,0,0,.25)" />
          </a-input>
        </a-form-item>

        <a-form-item>
          <a-button type="primary" html-type="submit" class="login-form-button">登录 Log in</a-button>
        </a-form-item>
        <div class="bottom-btn">
          <span class="go-back" @click="goBack">返回数据页面</span>
        <span class="forget-pwd" @click="forgetPwd">忘记密码</span>
        </div>
      </a-form>
    </div>
  </div>
</template>

<script>
import Parse from "@/request/user.js";
import storage from '@/storage/storage'
export default {
  name: "Login",
  data() {
    return {
      count: 30,
      issend: true,
      reg_phone:/^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/
    };
  },
  beforeCreate() {
    let currentUser=storage.getItem(`Parse/${process.env.VUE_APP_ID}/currentUser`);
    if(currentUser&&currentUser.sessionToken){
      Parse.becomeLogin(currentUser.sessionToken).then((res)=>{
      this.$router.push({path: this.$route.query.redirect?this.$route.query.redirect:'/' });
      }).catch(async (err)=>{
            Parse.logOut();
            this.$storage.clear();
            this.$store.commit('setUserInfo',{});
      });
    }
    this.form = this.$form.createForm(this, { name: "loginForm" });
  },
  mounted() {},
  methods: {
    valiPhoneNumber(rule,val,callback) {
        if(!!val&&!this.reg_phone.test(val)){
          callback('手机号不正确')
        }
        callback();
    },
    getCode(){
      // let phone=this.form.getForm().getFieldValue('phone');
         this.form.validateFields(['phone'],async (err,value)=>{
               if(err){
                  return;
               }else{
                 const TIME_COUNT = 30;
                if (!this.timer) {
                  //这里可以插入调用后台接口
                  let rescode=await Parse.getSMSCode(value);
                     if(rescode.code==200){
                            this.count = TIME_COUNT;
                            this.issend = false;
                             this.timer = setInterval(() => {
                              if (this.count > 1 && this.count <= TIME_COUNT) {
                                this.count--;
                              } else {
                                this.issend = true;
                                clearInterval(this.timer);
                                this.timer = null;
                              }
                            }, 1000);
                     }else{
                       this.$message.error({content:rescode.data.data.error_response.sub_msg,duration:2});
                     }
                }
               }
         });
    },
    handleSubmit(e) {
      e.preventDefault();   //'password',
      this.form.validateFields(['userName','code'],async (err, values) => {
        if (!err) {
          // try {
          //   let user = await Parse.logIn(values);
          //   this.$store.commit("setUserInfo", user);
          //   Parse.becomeLogin(user.sessionToken)
          //   this.$store.dispatch('buryPoint',{
          //     username:user.username,
          //     type:'login',
          //     exec_time:new Date()
          //   });
          //   this.$router.push({path: this.$route.query.redirect?this.$route.query.redirect:'/' });
          // } catch (error) {
          //   this.$message.warning({
          //     content: "用户名或密码错误",
          //     duration: 2
          //   });
          // }
         let user = await Parse.logIn(values);
             if(user.code==200){
                  user=user.message;
                  this.$store.commit("setUserInfo", user);
                  await Parse.becomeLogin(user.sessionToken)
                  this.$store.dispatch('buryPoint',{
                    username:user.username,
                    type:'login',
                    exec_time:new Date()
                  });
                  this.$router.push({path: this.$route.query.redirect?this.$route.query.redirect:'/' });
             }else{
               this.$message.error({content:user.message,duration:2});
             }
        }
      });
    },
    goBack() {
      this.$router.push({
        path: this.$route.query.redirect ? this.$route.query.redirect : "/"
      });
    },
    forgetPwd() {
        this.$info({
        title: (<p>
            <span>Reminder</span>
            <p>温馨提示</p>
          </p>),
        content: (
          <div>
            <span>Please contact the system administrator.</span>
            <p>请与系统管理员联系。</p>
          </div>
          ),
        onOk() {

        },
      });
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
  justify-content: center;
  align-items: center;
  width: 75%;
  padding: 1.041667rem 0 1.377083rem 0;
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
      &:nth-child(5) {
        margin-bottom: 0.052083rem;
      }
    }
    &/deep/ .ant-input {
      height: 0.260417rem;
    }
    .phone{
      // padding-right: .78125rem;
    }
    .login-form-button {
      width: 100%;
      height: 0.260417rem;
      border: none;
      background: #446b90;
      // background: rgb(68, 107, 144);
    }
    .bottom-btn{
      position: relative;
    }
    .go-back {
      position: absolute;
      left: 0;
      cursor: pointer;
      font-size: 0.072917rem;
      color: rgb(68, 107, 144);
    }
    .forget-pwd{
      position: absolute;
      right: 0;
       cursor: pointer;
      font-size: 0.072917rem;
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
