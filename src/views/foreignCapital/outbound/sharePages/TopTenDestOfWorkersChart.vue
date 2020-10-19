<template>
<!-- 中国对外劳务合作---年度派出各类劳务人员前10位目的地国家chart -->
  <div class="topTenDest-of-workersChart">
    <div class="echart-block">topTenDest-of-workersChart</div>
    <div class="select-block"></div>
  </div>
</template>

<script>
export default {
  name: "topTenDestOfWorkersChart",
  data() {
    return {};
  },
  methods: {}
};
</script>

<style lang="less" scoped>
.topTenDest-of-workersChart {
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
