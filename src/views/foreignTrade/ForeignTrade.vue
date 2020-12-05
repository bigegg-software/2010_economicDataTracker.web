<template>
  <!-- 外贸 -->
  <div class="foreignTrade">
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
import { foreignTradeMenuLists } from "@/utils/menuSearchConfigs.js";
import MenuComponent from "@/components/MenuComponent";

export default {
  name: "ForeignTrade",
  components: {
    MenuComponent
  },
  data() {
    return {
      navList: foreignTradeMenuLists
    };
  },
  methods: {}
};
</script>

<style lang="less" scoped>
.foreignTrade {
  display: flex;
  justify-content: space-between;
  width: 100%;
}
</style>
