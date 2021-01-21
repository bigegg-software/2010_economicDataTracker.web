<template>
  <!-- 中国对外直接投资流量按历年前20位国家chart -->
  <div class="flows-twenty-destination-chart">
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
  name: "flowsTwentyDestinationChart",
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
          countryEn: {
            text:
              "中国对外直接投资流量前20位国家（地区）英文_Top 20 destinations of China's FDI outflows",
            width: "25%"
          },
          country: {
            text:
              "中国对外直接投资流量前20位国家（地区）_Top 20 destinations of China's FDI outflows",
            width: "25%"
          },
          outflowMillion: {
            text:
              "中国对外直接投资流量前20位国家（地区）投资额_China's FDI outflows in top 20 destinations",
            width: "25%",
            formatNum: true
          },
          outflowPercent: {
            text:
              "中国对外直接投资流量前20位国家（地区）占总额比重_Top 20 destinations' shares of China's FDI outflows",
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
        xData: [],
        grid: {
          top: "23%",
          left: "3%",
          bottom: "11%",
          enGapch: this.$fz(0.4) //数据来源中英文间距
        },
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
          this.tableTotalData.tableTitle,
          this.$store.getters.chartInfo.tableData
        );
        this.$set(this.tableTotalData, "tableData", resoult);
      },
      deep: true
    },
    option: {
      handler() {    
        this.chartBar.title.text = this.tableTotalData.title.ch = `${this.option.value}年中国对外直接投资流量前20位国家/地区`;
        this.chartBar.title.subtext = this.tableTotalData.title.en = `Top 20 destinations of China's FDI outflows in ${this.option.value}`;
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
      ascending: "rank", //排名升序
      limit: 20,
      year: Number(arrmaxmin[1])
    });
  },
  components: { ChartBar, Year, TableChart },
  methods: {
    async getMaxMinDate() {
      // 获取最大年最小年
      let res = await chartDataFun.getMaxMinDate("FDITop20Outflow");
      this.$set(this.option, "frame", res.Y);
      this.showTimeFrame = true;
      return res;
    },
    async getChartsData(aug) {
      //年份 获取数据
      let { res } = await request.getFlowsTwentyDestinationChart(aug);
      this.tableTotalData.updatedDate = this.$store.getters.latestTime;
      this.chartBar.updatedDate = this.$store.getters.latestTime;
      let Xname = [];
      // 金额
      let outflow = [];
      res.forEach(item => {
        console.log(item);
        Xname.push(item.countryEn + "\n" + item.country);
        outflow.push(item.outflowMillion);
      });
      this.chartBar.xData = Xname;
      this.chartBar.series[0].data = outflow;
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
.flows-twenty-destination-chart {
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
    .frame {
      padding: 0.104167rem;
    }
  }
}
</style>
