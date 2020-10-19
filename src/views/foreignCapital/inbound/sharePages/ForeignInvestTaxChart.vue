<template>
<!-- 外商投资企业税收统计-外商投资企业税收统计chart-->
  <div class="foreignInvest-TaxChart">
    <div class="echart-block">foreignInvest-TaxChart</div>
    <div class="select-block"></div>
  </div>
</template>

<script>
export default {
  name: "foreignInvestTaxChart",
  data() {
    return {};
  },
  methods: {}
};
</script>

<style lang="less" scoped>
.foreignInvest-TaxChart {
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
