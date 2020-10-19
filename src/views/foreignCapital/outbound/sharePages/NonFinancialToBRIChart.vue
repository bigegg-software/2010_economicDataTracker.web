<template>
<!-- 中国对“一带一路”沿线国家非金融类直接投资情况chart -->
  <div class="non-financial-to-BRI-chart">
    <div class="echart-block">non-financial-to-BRI-chart</div>
    <div class="select-block"></div>
  </div>
</template>

<script>
export default {
  name: "nonFinancialToBRIChart",
  data() {
    return {};
  },
  methods: {}
};
</script>

<style lang="less" scoped>
.non-financial-to-BRI-chart {
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
