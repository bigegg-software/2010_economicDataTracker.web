<template>
  <!-- 主要对华投资国家/地区-国家和地区对华投资比重chart-->
  <div class="investProportion-in-China-chart">
    <div class="echart-block">
      <div v-if="isShowTable" class="table-block">
        <TableChart :totalData="totalData"></TableChart>
      </div>
      <div :class="$store.state.fullScreen.isFullScreen==false?'fullContainer':'container'">
        <treemap-chart v-if="!isShowTable" ref="treemapChart" :totalData="totalDatas"></treemap-chart>
      </div>
    </div>
    <div class="select-block">
      <div class="year-select">
        <Yearly v-if="showTimeFrame" :option="option" :value="option.value" @change="yearChange"></Yearly>
      </div>
    </div>
  </div>
</template>

<script>
import TreemapChart from "@/components/charts/Treemap";
import Yearly from "@/components/timeFrame/Year";
import request from "@/request/inBound/inBound";
import chartDataFun from "@/utils/chartDataFun";
import TableChart from "@/components/charts/TableChart";

export default {
  components: {
    TreemapChart,
    Yearly,
    TableChart
  },
  props: {
    isShowTable: {},
    describeData: {}
  },
  name: "investProportionInChinaChart",
  data() {
    return {
      totalData: {
        title: {
          ch: "",
          en: ""
        },
        tableTitle: {
          year: {
            text: "年份_Year",
            width: "100px"
          },
          continent: {
            text: "区域_xxxxxx",
            width: "200px"
          },
          country: {
            text: "国家/地区_Country/Region",
            width: "20%"
          },
          enterpriseNumber: {
            text: "企业数_Number of enterprises",
            width: "20%",
            formatNum:true
          },
          enterprisePercent: {
            text: "比重_Share of foreign investment enterprises",
            width: "20%",
            formatPer:true
          },
          FDIInflowsMillion: {
            text: "实际投入外资金额_FDI inflows to China",
            width: "20%",
            formatNum:true
          },
          inflowsPercent: {
            text: "比重_Share of total FDI inflows to China",
            width: "20%",
            formatPer:true
          }
        },
        tableData: [],
        updatedDate: ""
      },
      showTimeFrame: false,
      totalDatas: {
        dataSources: this.describeData,
        title: {
          ch: "",
          en: ""
        },
        yName: {
          ch: "百万美元",
          en: "USD min"
        },
        seriesData: {
          all: "全部_ALL",
          data: []
        },
        updatedDate: ""
      },
      option: {
        ch: "年度",
        en: " Yearly",
        frame: "",
        value: ""
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
          this.totalData.title.ch=this.totalDatas.title.ch=`${this.option.value}年国家/地区对华投资比重`;
          this.totalData.title.en=this.totalDatas.title.en=`${this.option.value} Proportion of national and regional investment in China`;
      },
      deep:true
    }
  },
  mounted() {
    this.$EventBus.$on("downLoadImg", () => {
      this.$refs.treemapChart.downloadFile();
    });
  },
  beforeDestroy() {
    this.$EventBus.$off("downLoadImg");
  },
  async created() {
    let res = await this.getMaxMinDate();
    let arrmaxmin = res.split("_");
    await this.getChartsData({
      year: Number(arrmaxmin[1])
    });
    this.option.value = Number(arrmaxmin[1]);
  },
  methods: {
    async getMaxMinDate() {
      // 获取最大年最小年
      let res = await chartDataFun.getMaxMinDate("MajorInvestors");
      this.$set(this.option, "frame", res);
      this.showTimeFrame = true;
      return res;
    },
    async getChartsData(aug) {
      //年份 获取数据
      let { res } = await request.getMajorInvestors(aug);
      this.totalData.updatedDate=this.$store.getters.latestTime;
      this.totalDatas.updatedDate=this.$store.getters.latestTime;
      this.totalDatas.seriesData.data = [];
      res.forEach((item, index) => {
        this.$set(this.totalDatas.seriesData.data, index, {
          name: item.country + "_"+item.countryEn,
          actual: "实际投入外资金额_FDI inflows",
          value: item.FDIInflowsMillion,
          proportion: "金额比重_Share of China's FDI inflows",
          proportionValue: (item.inflowsPercent).toFixed(1)
        });
      });
    },
    async yearChange(year) {
      this.option.value = year;
      await this.getChartsData({
        year: Number(year)
      });
    }
  }
};
</script>

<style lang="less" scoped>
.investProportion-in-China-chart {
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
      background-color: #fff;
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
    padding: 0.078125rem;
    box-sizing: border-box;
    .year-select {
      margin-bottom: 0.078125rem;
    }
  }
}
</style>
