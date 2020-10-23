<template>
  <div class="login">
    <img class="login_bg" src="../../assets/img/login_bg.jpg" alt />
    <div class="login_content"></div>
  </div>
</template>

<script>
export default {
  name: "Login",
  components: {},
  data() {
    return {};
  },
  mounted() {},
  methods: {}
};
</script>

<style lang="less" scoped>
.login {
  display: flex;
  width: 100%;
  height: 100%;
  border: 1px solid red;
}
.login_bg {
  width: 2.8125rem;
  height: 100%;
}
</style>
