<template>
  <div class="economicIndicators">
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
import { economicIndicatorsMenuLists } from "@/utils/menuSearchConfigs.js";

import MenuComponent from "@/components/MenuComponentMacro";
export default {
  name: "EconomicIndicators",
  components: {
    MenuComponent
  },
  data() {
    return { navList: economicIndicatorsMenuLists };
  },
  methods: {}
};
</script>

<style lang="less" scoped>
.economicIndicators {
  display: flex;
  justify-content: space-between;
  width: 100%;
}
</style>
