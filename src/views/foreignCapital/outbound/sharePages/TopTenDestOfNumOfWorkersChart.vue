<template>
<!-- 中国对外劳务合作---12月末在外各类劳务人员前10位国家chart -->
  <div class="topTenDest-of-numOfWorkersChart">
    <div class="echart-block">topTenDest-of-numOfWorkersChart</div>
    <div class="select-block"></div>
  </div>
</template>

<script>
export default {
  name: "topTenDestOfNumOfWorkersChart",
  data() {
    return {};
  },
  methods: {}
};
</script>

<style lang="less" scoped>
.topTenDest-of-numOfWorkersChart {
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
