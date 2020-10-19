<template>
<!-- 中国对外直接投资存量按国家和地区统计chart -->
  <div class="stocks-by-destination-chart">
    <div class="echart-block">stocks-by-destination-chart</div>
    <div class="select-block"></div>
  </div>
</template>

<script>
export default {
  name: "stocksByDestinationChart",
  data() {
    return {};
  },
  methods: {}
};
</script>

<style lang="less" scoped>
.stocks-by-destination-chart {
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
