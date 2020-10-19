<template>
<!-- 中国对“一带一路”沿线国家直接投资情况新签合同额chart -->
  <div class="newContractAmount-To-BRIChart">
    <div class="echart-block">newContractAmount-To-BRIChart</div>
    <div class="select-block"></div>
  </div>
</template>

<script>
export default {
  name: "newContractAmountToBRIChart",
  data() {
    return {};
  },
  methods: {}
};
</script>

<style lang="less" scoped>
.newContractAmount-To-BRIChart {
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
