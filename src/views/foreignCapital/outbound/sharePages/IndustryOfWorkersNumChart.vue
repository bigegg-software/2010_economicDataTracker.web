<template>
  <!-- 中国对外劳务合作---派出人数主要行业chart -->
  <div class="industry-of-workersNumChart">
    <div class="echart-block">
      <PieChart :totalData="totalData"></PieChart>
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
        updatedDate:{
          ch:"2020-10-23",
          en:"October 23,2020"
        }
      }
    };
  },
  props: {
    isShowTable: {}
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
    padding: 0.052083rem;
    box-sizing: border-box;
  }
}
</style>
