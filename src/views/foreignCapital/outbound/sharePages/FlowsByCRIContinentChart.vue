<template>
<!-- 中国对外直接投资流量按各洲内国家/地区统计chart -->
  <div class="flows-by-CRI-continent-chart">
    <div class="echart-block">flows-by-CRI-continent-chart</div>
    <div class="select-block"></div>
  </div>
</template>

<script>
export default {
  name: "flowsByCRIContinentChart",
  data() {
    return {};
  },
  methods: {}
};
</script>

<style lang="less" scoped>
.flows-by-CRI-continent-chart {
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
