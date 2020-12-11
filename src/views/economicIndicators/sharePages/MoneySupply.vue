<template>
  <!-- 货币供应量 (M2) chart-->
  <div class="stocksTwentyDestination-chart">
    <div class="echart-block">
      <div v-if="isShowTable" class="table-block">
        <TableChart :totalData="tableTotalData"></TableChart>
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
  name: "stocksTwentyDestinationChart",
  data() {
    return {
      tableTotalData: {
        title: {
          ch: "",
          en: ""
        },
        unit: {
          ch: "百万美元",
          en: "USD mln"
        },
        tableTitle: {
          year: {
            text: "年份_Year",
            width: "5%"
          },
          rank: {
            text: "排名_Rank",
            width: "5%"
          },
          country: {
            text:
              "中国对外直接投资存量前20位国家（地区）_Top 20 destinations of China's FDI stocks",
            width: "25%"
          },
          stocksMillion: {
            text:
              "中国对外直接投资存量前20位国家（地区）投资额_China's FDI stocks in top 20 destinations",
            width: "25%",
            formatNum: true
          },
          stockPercent: {
            text:
              "中国对外直接投资存量前20位国家（地区）占总额比重_Top 20 destinations' shares of China's FDI stocks",
            width: "35%",
            formatPer: true
          }
        },
        tableData: [],
        updatedDate: ""
      },
      showTimeFrame: false,
      chartBar: {
        watermark: false,
        dataSources: this.describeData,
        yName: { ch: "百万美元", en: "USD mln" },
        title: {
          text: "",
          subtext: ""
        },
        grid: {
          top: "23%",
          left: "1%",
          bottom: "10%",
          enGapch: this.$fz(0.2) //数据来源中英文间距
        },
        xData: [],
        series: [
          {
            name: "",
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
  async created() {
    let res = await this.getMaxMinDate();
    let arrmaxmin = res.split("_");
    this.option.value = arrmaxmin[1];
    await this.getChartsData({
      ascending: "rank", //排名升序
      limit: 20,
      year: Number(arrmaxmin[1])
    });
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
          this.tableTotalData.tableTitle,
          this.$store.getters.chartInfo.tableData
        );
        this.$set(this.tableTotalData, "tableData", resoult);
      },
      deep: true
    },
    option: {
      handler() {
        this.chartBar.title.text = this.tableTotalData.title.ch = `${this.option.value}年中国对外直接投资存量前20位国家/地区`;
        this.chartBar.title.subtext = this.tableTotalData.title.en = `${this.option.value} top 20 destinations of China's FDI stocks`;
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
  components: { ChartBar, Year, TableChart },
  methods: {
    async getMaxMinDate() {
      // 获取最大年最小年
      let res = await chartDataFun.getMaxMinDate("FDITop20Stock");
      this.$set(this.option, "frame", res);
      this.showTimeFrame = true;
      return res;
    },
    async getChartsData(aug) {
      //年份 获取数据
      let { res } = await request.getStocksTwentyDestinationChart(aug);
      this.tableTotalData.updatedDate = this.$store.getters.latestTime;
      this.chartBar.updatedDate = this.$store.getters.latestTime;
      let Xname = [];
      // 金额
      let stocks = [];
      res.forEach(item => {
        Xname.push(item.countryEN + "\n" + item.country);
        stocks.push(item.stocksMillion);
      });
      this.chartBar.xData = Xname;
      this.chartBar.series[0].data = stocks;
    },
    async yearChange(year) {
      this.option.value = year;
      await this.getChartsData({
        ascending: "rank",
        limit: 20,
        year: Number(year)
      });
    }
  }
};
</script>

<style lang="less" scoped>
.stocksTwentyDestination-chart {
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
    // border-right: none;
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
    .frame {
      padding: 0.104167rem;
    }
  }
}
</style>
