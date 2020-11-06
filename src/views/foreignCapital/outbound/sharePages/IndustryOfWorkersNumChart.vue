<template>
  <!-- 中国对外劳务合作---派出人数主要行业chart -->
  <div class="industry-of-workersNumChart">
    <div class="echart-block">
      <div v-if="isShowTable" class="table-block"></div>
      <div class="container">
        <PieChart ref="pie" :totalData="totalData" :value="option.value"></PieChart>
      </div>
    </div>
    <div class="select-block">
      <Yearly v-if="showTimeFrame" :option="option" :value="option.value" @change="changeValue"></Yearly>
    </div>
  </div>
</template>

<script>
import PieChart from "@/components/charts/PieChart";
import Yearly from "@/components/timeFrame/Year";
import request from "@/request/outBound/outBound";
import chartDataFun from "@/utils/chartDataFun";
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
      showTimeFrame:false,
      option: {
        ch: "年度",
        en: "Yearly",
        frame: "",
        value: ""
      },
      totalData: {
        dataSources: "中国人民网",
        title: {
          ch: "年度派出人数主要行业",
          en: "Overseas workers by industry"
        },
        seriesData: [
          // {
          //   value: 5.3,
          //   name: "农林牧渔业_xxxxxxx"
          // },
          // { value: 15.8, name: "制造业_xxxxxxx" },
          // { value: 42.5, name: "建筑业_xxxxxxx" },
          // { value: 13.5, name: "交通运输业_xxxxxxx" },
          // { value: 0.3, name: "计算机服务和软件业_xxxxxxx" },
          // { value: 5.5, name: "住宿和餐饮业_xxxxxxx" },
          // { value: 0.8, name: "科教文卫体业_xxxxxxx" },
          // { value: 14.2, name: "其他行业_xxxxxxx" }
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
 async created() {
    let res = await this.getMaxMinDate();
    let arrmaxmin = res.split("_");
    await this.getChartsData({
      year: Number(arrmaxmin[1])
    });
 },
  beforeDestroy() {
    this.$EventBus.$off("downLoadImg");
  },
  methods: {
    async getMaxMinDate() {
      // 获取最大年最小年
      let res = await chartDataFun.getMaxMinDate("LaborServiceIndustry");
        this.$set(this.option, 'frame', res);
      this.showTimeFrame = true;
      return res;
    },
    async getChartsData(aug) {  //年份 获取数据
      let {res} = await request.getIndustryOfWorkersNumChart(aug);
      let Xname=[];
          res.forEach(item => {
              Xname.push({value:item.variousTypesPerNumMillion,name:item.industry});
          });
          this.totalData.seriesData=Xname;
    },
    async changeValue(value) {
      this.option.value = value;
      await this.getChartsData({
            year: Number(value)
          });
    }
  }
};
</script>

<style lang="less" scoped>
.industry-of-workersNumChart {
  display: flex;
  .echart-block {
    position: relative;
    background-color: #fff;
    border: 2px solid #cacaca;
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
    width: 5.875rem;
    height: 3.916667rem;
    }
  }
  .select-block {
    width: 1.40625rem;
    height: auto;
    background-color: #f0f0f0;
    border: 2px solid #cacaca;
    border-left: none;
    padding: 0.102083rem;
    box-sizing: border-box;
  }
}
</style>
