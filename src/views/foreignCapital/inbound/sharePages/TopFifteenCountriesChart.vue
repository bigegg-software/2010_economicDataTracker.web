<template>
<!-- 主要对华投资国家/地区-前15位国家/地区chart-->
  <div class="topFifteenCountries-chart">
    <div class="echart-block">topFifteenCountries-chart</div>
    <div class="select-block"></div>
  </div>
</template>

<script>
export default {
  name: "TopFifteenCountriesChart",
  data() {
    return {};
  },
  methods: {}
};
</script>

<style lang="less" scoped>
.topFifteenCountries-chart {
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
