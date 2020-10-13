<template>
  <!-- 中国对外直接投资流量与存量 -->
  <div class="container">
    <tab-component :tabList="tabList"></tab-component>
    <div class="content">
      <div class="echart-block"></div>
      <div class="select-block"></div>
    </div>
    <actions-component></actions-component>
  </div>
</template>

<script>
import TabComponent from "@/components/TabComponent";
import ActionsComponent from "@/components/ActionsComponent";
export default {
  name: "FlowsAndStocks",
  components: {
    TabComponent,
    ActionsComponent
  },
  data() {
    return {
      tabList: [
        {
          chinese: "中国对外直接投资流量",
          english: "China's FDI outflows"
        },
        {
          chinese: "中国对外直接投资流量行业",
          english: "XXXXXXXXXXX"
        }
      ]
    };
  },
  methods: {
    changeTab(key) {}
  }
};
</script>

<style lang="less" scoped>
.container {
  width: 6.09375rem;
}
.content {
  display: flex;
  .echart-block {
    width: 77%;
    height: 664px;
    background-color: #fff;
    border-left: 2px solid #cacaca;
    border-top: 2px solid #cacaca;
  }
  .select-block {
    width: 23%;
    height: 664px;
    background-color: #f0f0f0;
    border: 2px solid #cacaca;
    border-bottom: none;
  }
}
</style>
