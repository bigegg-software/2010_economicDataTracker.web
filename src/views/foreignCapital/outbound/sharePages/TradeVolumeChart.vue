<template>
<!-- 中国对外劳务合作派出人数chart -->
  <div class="trade-volume-Chart">
    <div class="echart-block">trade-volume-Chart</div>
    <div class="select-block"></div>
  </div>
</template>

<script>
export default {
  name: "tradeVolumeChart",
  data() {
    return {};
  },
  methods: {}
};
</script>

<style lang="less" scoped>
.trade-volume-Chart {
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
