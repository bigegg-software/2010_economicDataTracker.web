<template>
  <!-- 中国对外劳务合作---12月末派出各类劳务人员前10位国家chart -->
  <div class="topTenDest-ofNumof-workersChart">
    <div class="echart-block">
      <div v-if="isShowTable" class="table-block">
        <TableChart :totalData="totalData"></TableChart>
      </div>
      <div :class="$store.state.fullScreen.isFullScreen==false?'fullContainer':'container'">
        <chart-bar v-if="!isShowTable" ref="barChart" :chartBarData="chartBar"></chart-bar>
      </div>
    </div>
    <div class="select-block">
      <div class="frame">
        <year v-if="showTimeFrame" :option="option" :value="option.value" @change="yearChange"></year>
      </div>
    </div>
  </div>
</template>

<script>
import ChartBar from "@/components/charts/ChartBar";
import Year from "@/components/timeFrame/Year";
import request from "@/request/outBound/outBound";
import chartDataFun from "@/utils/chartDataFun";
import TableChart from "@/components/charts/TableChart";

export default {
  name: "topTenDestOfWorkersChart",
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
          destinationEn: {
            text:
              "12月末在外各类劳务人员国家/地区（英文）_Top 10 desinations of total number of workers overseas",
            width: "40%"
          },
          destinations: {
            text:
              "12月末在外各类劳务人员国家/地区_Top 10 desinations of total number of workers overseas",
            width: "40%"
          },
          variousTypesPerNumMillion: {
            text: "12月末在外各类劳务人员人数_Total number of workers overseas",
            width: "25%",
            formatNum: true
          },
          destinationPercent: {
            text:
              "12月末在外各类劳务人员比重_Share of total number of workers by destinations",
            width: "25%",
            formatPer: true
          }
        },
        tableData: [],
        updatedDate: ""
      },
      showTimeFrame: false,
      chartBar: {
        dataSources: this.describeData,
        yName: { ch: "万人", en: "10,000 persons" },
        title: {
          text: "",
          subtext: ""
        },
        grid: {
          top: "23%",
          left: "6%",
          bottom: "11%",
          enGapch: this.$fz(0.4) //数据来源中英文间距
        },
        xData: [],
        series: [
          {
            name:'',
            color: ["#71a6c2"],
            data: []
          }
        ],
        updatedDate: ""
      },
      option: {
        ch: "年度",
        en: "Yearly",
        frame: "",
        value: ""
      }
    };
  },
  props: {
    isShowTable: {
      type: Boolean,
      default: false
    },
    describeData: {}
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
         
        this.$set(this.totalData, "tableData", resoult);
      },
      deep: true
    },
    option: {
      handler() {
        this.totalData.title.ch = this.chartBar.title.text = `${this.option.value}年12月末在外各类劳务人员前10位国家/地区`;
        this.totalData.title.en = this.chartBar.title.subtext = `Year-end number of workers in top 10 destinations in ${this.option.value}`;
      },
      deep: true
    }
  },
  mounted() {
    this.$EventBus.$on("downLoadImg", () => {
      this.$refs.barChart.downloadFile();
    });
  },
  beforeDestroy() {
    this.$EventBus.$off("downLoadImg");
  },
  async created() {
    let res = await this.getMaxMinDate();
    let arrmaxmin = res.Y.split("_");
    this.option.value = arrmaxmin[1];
    await this.getChartsData({
      type: 2,
      descending: "variousTypesPerNum", //比重destinationPercent
      limit: 10,
      year: Number(arrmaxmin[1])
    });
  },
  beforeDestroy() {
    this.$EventBus.$off("downLoadImg");
  },

  components: { ChartBar, Year, TableChart },
  methods: {
    async getMaxMinDate() {
      // 获取最大年最小年
      let res = await chartDataFun.getMaxMinDate("LaborServiceTop10AnnualRank");
      this.$set(this.option, "frame", res.Y);
      this.showTimeFrame = true;
      return res;
    },
    async getChartsData(aug) {
      //年份 获取数据
      let { res } = await request.getLaborServiceTop10AnnualRankChart(aug);
      this.totalData.updatedDate = this.$store.getters.latestTime;
      this.chartBar.updatedDate = this.$store.getters.latestTime;
      let Xname = [];
      // 年度派出各类劳务人员人数
      let variousTypesPerNum = [];
      res.forEach(item => {
        Xname.push(item.destinationEn + "\n" + item.destinations);
        variousTypesPerNum.push(item.variousTypesPerNumMillion);
      });
      this.chartBar.xData = Xname;
      this.chartBar.series[0].data = variousTypesPerNum;
    },
    async yearChange(year) {
      this.option.value = year;
      await this.getChartsData({
        type: 2,
        descending: "variousTypesPerNum",//destinationPercent
        limit: 10,
        year: Number(year)
      });
    }
  }
};
</script>

<style lang="less" scoped>
.topTenDest-ofNumof-workersChart {
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
      background: #fff;
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
