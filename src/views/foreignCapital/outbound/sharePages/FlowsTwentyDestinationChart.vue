<template>
<!-- 中国对外直接投资流量按历年前20位国家chart -->
  <div class="flows-twenty-destination-chart">
    <div class="echart-block">flows-twenty-destination-chart</div>
    <div class="select-block"></div>
  </div>
</template>

<script>
export default {
  name: "flowsTwentyDestinationChart",
  data() {
    return {};
  },
  methods: {}
};
</script>

<style lang="less" scoped>
.flows-twenty-destination-chart {
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
