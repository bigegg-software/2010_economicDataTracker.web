<template>
<!--"一带一路"沿线国家对华投资情况-企业数chart-->
  <div class="num-enterprises-BRI-chart">
    <div class="echart-block">num-enterprises-BRI-chart</div>
    <div class="select-block"></div>
  </div>
</template>

<script>
export default {
  name: "numEnterprisesBRIChart",
  data() {
    return {};
  },
  methods: {}
};
</script>

<style lang="less" scoped>
.num-enterprises-BRI-chart {
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
