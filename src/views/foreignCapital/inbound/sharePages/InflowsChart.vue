<template>
<!-- 实际使用外资-实际使用外资chart-->
  <div class="inflows-chart">
    <div class="echart-block">inflows-chart</div>
    <div class="select-block"></div>
  </div>
</template>

<script>
export default {
  name: "inflowsChart",
  data() {
    return {};
  },
  methods: {}
};
</script>

<style lang="less" scoped>
.inflows-chart {
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
