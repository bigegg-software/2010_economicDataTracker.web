<template>
<!-- 中国对外承包工程完成营业额chart -->
  <div class="amountGrowth-To-OPChart">
    <div class="echart-block">amountGrowth-To-OPChart</div>
    <div class="select-block"></div>
  </div>
</template>

<script>
export default {
  name: "amountGrowthToOPChart",
  data() {
    return {};
  },
  methods: {}
};
</script>

<style lang="less" scoped>
.amountGrowth-To-OPChart {
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
