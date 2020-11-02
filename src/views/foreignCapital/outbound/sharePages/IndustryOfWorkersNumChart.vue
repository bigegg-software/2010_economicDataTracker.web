<template>
  <!-- 中国对外劳务合作---派出人数主要行业chart -->
  <div class="industry-of-workersNumChart">
    <div class="echart-block">
      <div v-if="isShowTable" class="table-block"></div>
      <div class="container">
        <PieChart ref="pie" :totalData="totalData"></PieChart>
      </div>
    </div>
    <div class="select-block">
      <Yearly :option="option" :value="option.value" @change="changeValue"></Yearly>
    </div>
  </div>
</template>

<script>
import PieChart from "@/components/charts/PieChart";
import Yearly from "@/components/timeFrame/Year";

export default {
  components: {
    PieChart,
    Yearly
  },
  props: {
    isShowTable: {}
  },
  name: "industryOfWorkersNumChart",
  data() {
    return {
      option: {
        ch: "年度",
        en: "yearly",
        frame: "1990_2020",
        value: "2020"
      },
      totalData: {
        watermark: false,
        dataSources: "中国人民网",
        title: {
          ch: "年度派出人数主要行业",
          en: "Overseas workers by industry"
        },
        seriesData: [
          {
            value: 5.3,
            name: "农林牧渔业_xxxxxxx"
          },
          { value: 15.8, name: "制造业_xxxxxxx" },
          { value: 42.5, name: "建筑业_xxxxxxx" },
          { value: 13.5, name: "交通运输业_xxxxxxx" },
          { value: 0.3, name: "计算机服务和软件业_xxxxxxx" },
          { value: 5.5, name: "住宿和餐饮业_xxxxxxx" },
          { value: 0.8, name: "科教文卫体业_xxxxxxx" },
          { value: 14.2, name: "其他行业_xxxxxxx" }
        ],
        updatedDate: "2020-10-23"
      }
    };
  },
  mounted() {
    this.$EventBus.$on("downLoadImg", () => {
      this.$refs.pie.downloadFile();
    });
  },
  beforeDestroy() {
    this.$EventBus.$off("downLoadImg");
  },
  methods: {
    changeValue(value) {
      this.option.value = value;
    }
  }
};
</script>

<style lang="less" scoped>
.industry-of-workersNumChart {
  display: flex;
  .echart-block {
    position: relative;
    width: 77%;
    height: auto;
    background-color: #fff;
    border: 2px solid #cacaca;
    border-right: none;
    .table-block {
      position: absolute;
      left: 0;
      top: 0;
      z-index: 3;
      width: 100%;
      height: 100%;
      background-color: #ccc;
    }
    .container {
      width: 100%;
      height: 3.458333rem;
    }
  }
  .select-block {
    width: 23%;
    height: auto;
    background-color: #f0f0f0;
    border: 2px solid #cacaca;
    padding: 0.052083rem;
    box-sizing: border-box;
  }
}
</style>
