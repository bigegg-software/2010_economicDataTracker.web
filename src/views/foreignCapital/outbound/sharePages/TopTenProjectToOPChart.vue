<template>
  <!-- 中国对外承包工程前十项目chart -->
  <div class="topTenProject-To-OPChart">
    <div class="echart-block">中国对外承包工程前十项目chart</div>
    <div class="select-block"></div>
  </div>
</template>

<script>
export default {
  name: "topTenProjectToOPChart",
  data() {
    return {};
  },
  methods: {}
};
</script>

<style lang="less" scoped>
.topTenProject-To-OPChart {
  display: flex;
  .echart-block {
    width: 77%;
    height: 664px;
    background-color: #fff;
    border: 2px solid #cacaca;
    border-right: none;
  }
  .select-block {
    width: 23%;
    height: 664px;
    background-color: #f0f0f0;
    border: 2px solid #cacaca;
  }
}
</style>
