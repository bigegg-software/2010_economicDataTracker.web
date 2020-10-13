<template>
  <div class="home">
    <!-- header -->
    <page-header></page-header>
    <!-- banner -->
    <page-banner></page-banner>
    <!-- body -->
    <div class="page-body">
      <router-view></router-view>
    </div>
    <!-- footer -->
    <page-footer></page-footer>
  </div>
</template>

<script>
import PageHeader from "./components/PageHeader";
import PageBanner from "./components/PageBanner";
import PageFooter from "./components/PageFooter";
export default {
  name: "Home",
  components: {
    PageHeader,
    PageBanner,
    PageFooter
  },
  data() {
    return {};
  },
  mounted() {
    // console.log(this.$route);
  },
  methods: {}
};
</script>

<style lang="less" scoped>
.home {
  width: 100%;
}
// body
.page-body {
  width: 100%;
  padding: 0.208333rem 1.041667rem 0.135417rem;
  background-color: rgba(247, 247, 247);
}
</style>
