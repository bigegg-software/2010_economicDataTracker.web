<template>
<!-- 中国对外直接投资流量chart-->
  <div class="outflows-chart">
    <div class="echart-block">outflows-chart</div>
    <div class="select-block"></div>
  </div>
</template>

<script>
export default {
  name: "outflowsChart",
  data() {
    return {};
  },
  methods: {}
};
</script>

<style lang="less" scoped>
.outflows-chart {
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
