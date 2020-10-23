<template>
  <!-- 中国对外劳务合作---派出人数主要行业chart -->
  <div class="industry-of-workersNumChart">
    <div class="echart-block">
      <div v-if="isShowTable" class="table-block"></div>
      <div class="container">
        <PieChart :totalData="totalData"></PieChart>
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
        title: {
          ch: "派出人数主要行业",
          en: "Main industries"
        },
        seriesData: [
          {
            value: 335,
            name: "信息传输、软件和信息技术服务业_Information tech"
          },
          { value: 310, name: "制造业_zhizaoye" },
          { value: 234, name: "住宿和餐饮业_zscdxzc" },
          { value: 135, name: "视频广告_zhizaoye" },
          { value: 1548, name: "搜索引擎_zhizaoye" }
        ],
        updatedDate: "2020-10-23"
      }
    };
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
