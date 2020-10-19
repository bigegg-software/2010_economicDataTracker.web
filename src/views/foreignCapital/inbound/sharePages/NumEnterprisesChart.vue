<template>
<!-- 外商直接投资主要行业-开办企业数chart-->
  <div class="num-enterprises-chart">
    <div class="echart-block">num-enterprises-chart</div>
    <div class="select-block"></div>
  </div>
</template>

<script>
export default {
  name: "numEnterprisesChart",
  data() {
    return {};
  },
  methods: {}
};
</script>

<style lang="less" scoped>
.num-enterprises-chart {
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
