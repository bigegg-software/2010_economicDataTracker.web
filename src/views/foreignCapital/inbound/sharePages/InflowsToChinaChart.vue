<template>
<!-- 外商直接投资主要行业-实际使用外资金额chart-->
  <div class="inflows-to-chinaChart">
    <div class="echart-block">inflows-to-chinaChart</div>
    <div class="select-block"></div>
  </div>
</template>

<script>
export default {
  name: "inflowsToChinaChart",
  data() {
    return {};
  },
  methods: {}
};
</script>

<style lang="less" scoped>
.inflows-to-chinaChart {
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
