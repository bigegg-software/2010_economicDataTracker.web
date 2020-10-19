<template>
<!-- 中国对主要经济体投资按行业统计chart -->
  <div class="economy-by-industry-chart">
    <div class="echart-block">economy-by-industry-chart</div>
    <div class="select-block"></div>
  </div>
</template>

<script>
export default {
  name: "economyByIndustryChart",
  data() {
    return {};
  },
  methods: {}
};
</script>

<style lang="less" scoped>
.economy-by-industry-chart {
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
