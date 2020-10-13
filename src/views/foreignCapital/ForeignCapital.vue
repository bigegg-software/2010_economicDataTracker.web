<template>
  <div class="foreignCapital">
    <!-- 左侧导航栏 -->
    <div class="slide">
      <menu-component></menu-component>
    </div>
    <!-- 右侧内容 -->
    <div class="main">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import MenuComponent from "@/components/MenuComponent";
export default {
  name: "ForeignCapital",
  components: {
    MenuComponent
  },
  data() {
    return {};
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
</style>
