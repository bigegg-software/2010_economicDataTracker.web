<template>
<!-- 主要对华投资国家/地区-年度部分国家/地区对华直接投资chart-->
  <div class="stateDirectInvest-in-China-chart">
    <div class="echart-block">stateDirectInvest-in-China-chart</div>
    <div class="select-block"></div>
  </div>
</template>

<script>
export default {
  name: "stateDirectInvestInChinaChart",
  data() {
    return {};
  },
  methods: {}
};
</script>

<style lang="less" scoped>
.stateDirectInvest-in-China-chart {
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
