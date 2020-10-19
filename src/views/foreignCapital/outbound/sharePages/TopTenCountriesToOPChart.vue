<template>
<!-- 中国对外承包工程前十国别（市场）chart -->
  <div class="topTenCountries-To-OPChart">
    <div class="echart-block">topTenCountries-To-OPChart</div>
    <div class="select-block"></div>
  </div>
</template>

<script>
export default {
  name: "topTenCountriesToOPChart",
  data() {
    return {};
  },
  methods: {}
};
</script>

<style lang="less" scoped>
.topTenCountries-To-OPChart {
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
