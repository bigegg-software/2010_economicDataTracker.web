<template>
<!-- 中国对外劳务合作---派出人数主要行业chart -->
  <div class="industry-of-workersNumChart">
    <div class="echart-block">industry-of-workersNumChart</div>
    <div class="select-block"></div>
  </div>
</template>

<script>
export default {
  name: "industryOfWorkersNumChart",
  data() {
    return {};
  },
  methods: {}
};
</script>

<style lang="less" scoped>
.industry-of-workersNumChart {
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
