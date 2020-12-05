<template>
  <div class="foreignCapital">
    <!-- 左侧导航栏 -->
    <div class="slide" v-if="$store.state.fullScreen.isFullScreen">
      <menu-component :navList="navList"></menu-component>
    </div>
    <!-- 右侧内容 -->
    <div class="main">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import { foreignCapitalMenuLists } from "@/utils/menuSearchConfigs.js";

import MenuComponent from "@/components/MenuComponent";
export default {
  name: "ForeignCapital",
  components: {
    MenuComponent
  },
  data() {
    return { navList: foreignCapitalMenuLists };
  },
  methods: {}
};
</script>

<style lang="less" scoped>
.foreignCapital {
  display: flex;
  justify-content: space-between;
  width: 100%;
}
// .slide{
//   display: none;
// }
</style>
