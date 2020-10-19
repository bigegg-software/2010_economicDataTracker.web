<template>
<!-- 双向直接投资chart-->
  <div class="outflows-vs-inflows-chart">
    <div class="echart-block">outflows-vs-inflows-chart</div>
    <div class="select-block"></div>
  </div>
</template>

<script>
export default {
  name: "outflowsVsInflowsChart",
  data() {
    return {};
  },
  methods: {}
};
</script>

<style lang="less" scoped>
.outflows-vs-inflows-chart {
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
