<template>
  <!-- 中国对外劳务合作---派出人数主要行业chart -->
  <div class="industry-of-workersNumChart">
    <div class="echart-block">
      <div v-if="isShowTable" class="table-block">
        <TableChart :totalData="totalData"></TableChart>
      </div>
      <div :class="$store.state.fullScreen.isFullScreen==false?'fullContainer':'container'">
        <PieChart v-if="!isShowTable" ref="pie" :totalData="totalDatas" :value="option.value"></PieChart>
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
import TableChart from "@/components/charts/TableChart";

export default {
  components: {
    PieChart,
    Yearly,
    TableChart
  },
  props: {
    isShowTable: {},
    describeData: {}
  },
  name: "industryOfWorkersNumChart",
  data() {
    return {
      totalData: {
        title: {
          ch: "",
          en: ""
        },
        unit: {
          ch: "万人",
          en: "10,000 persons"
        },
        tableTitle: {
          year: {
            text: "年份_Year",
            width: "10%"
          },
          industry: {
            text: "类别_Industry category",
            width: "30%"
          },
          variousTypesPerNum: {
            text:
              "在外各类劳务人员行业构成人数（万人）_Number of overseas workers by industries",
            width: "30%",
            formatNum:true
          },
          industryPercent: {
            text: "比重_Share of overseas workers by industries",
            width: "30%",
            formatPer:true
          }
        },
        tableData: [],
        updatedDate: ""
      },
      showTimeFrame: false,
      option: {
        ch: "年度",
        en: "Yearly",
        frame: "",
        value: ""
      },
      totalDatas: {
        dataSources: this.describeData,
        title: {
          ch: "",
          en: ""
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
        updatedDate: ""
      }
    };
  },
  computed: {
    tableDatas() {
      return this.$store.getters.chartInfo;
    }
  },
  watch: {
    tableDatas: {
      handler() {
        let resoult = chartDataFun.conversionTable(
          this.totalData.tableTitle,
          this.$store.getters.chartInfo.tableData
        );
        console.log(resoult);
        this.$set(this.totalData, "tableData", resoult);
      },
      deep: true
    },
    option:{
      handler() {
          this.totalData.title.ch=this.totalDatas.title.ch=`${this.option.value}年年度派出人数主要行业`;
          this.totalData.title.en=this.totalDatas.title.en=`${this.option.value} Overseas workers by industry`;
      },
      deep:true
    }
  },
  mounted() {
    this.$EventBus.$on("downLoadImg", () => {
      this.$refs.pie.downloadFile();
    });
  },
  async created() {
    let res = await this.getMaxMinDate();
    let arrmaxmin = res.split("_");
    this.option.value = arrmaxmin[1];
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
      this.$set(this.option, "frame", res);
      this.showTimeFrame = true;
      return res;
    },
    async getChartsData(aug) {
      //年份 获取数据
      let { res } = await request.getIndustryOfWorkersNumChart(aug);
      this.totalData.updatedDate = this.$store.getters.latestTime;
      this.totalDatas.updatedDate = this.$store.getters.latestTime;
      let Xname = [];
      res.forEach(item => {
        Xname.push({
          value: item.variousTypesPerNum,
          name: item.industry + "_" + item.industryEn,
          valueName:"在外各类劳务人员行业构成人数（万人）_Number of overseas workers by industries",
          proportionName:"比重_Share of overseas workers by industries",
          proportion:item.industryPercent
        });
      });
      this.totalDatas.seriesData = Xname;
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
    }
    .container {
      width: 5.875rem;
      height: 3.916667rem;
    }
    .fullContainer {
      width: 7.4rem;
      height: 4.933333rem;
    }
  }
  .select-block {
    width: 1.74667rem;
    height: auto;
    background-color: #f0f0f0;
    border: 2px solid #cacaca;
    border-left: none;
    padding: 0.102083rem;
    box-sizing: border-box;
  }
}
</style>
