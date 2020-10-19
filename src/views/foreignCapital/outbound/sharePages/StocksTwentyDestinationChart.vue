<template>
<!-- 中国对外直接投资存量按历年前20位国家chart -->
  <div class="stocks-twenty-destination-chart">
    <div class="echart-block">stocks-twenty-destination-chart</div>
    <div class="select-block"></div>
  </div>
</template>

<script>
export default {
  name: "stocksTwentyDestinationChart",
  data() {
    return {};
  },
  methods: {}
};
</script>

<style lang="less" scoped>
.stocks-twenty-destination-chart {
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
