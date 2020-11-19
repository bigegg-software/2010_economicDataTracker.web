<template>
  <!-- 中国对外劳务合作---年度派出各类劳务人员前10位目的地国家chart -->
  <div class="topTenDest-of-workersChart">
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
import {internationalLaborDescribe} from '@/utils/describe.js'
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
          ch: "中国对外直接投资流量",
          en: "China's FDI outflows"
        },
        unit: {
          ch: "万人",
          en: "xxx"
        },
        tableTitle: {
          year: {
            text: "年份_Year",
            width: "10%"
          },
          destinations: {
            text:
              "年度派出各类劳务人员国家_Top 10 destinations of workers sent overseas",
            width: "20%"
          },
          variousTypesPerNumMillion: {
            text: "年度派出各类劳务人员人数_Number of workers sent overseas",
            width: "35%",
            formatNum:true
          },
          destinationPercent: {
            text:
              "年度派出各类劳务人员比重_Share of workers sent overseas by destinations",
            width: "35%",
            formatPer:true
          }
        },
        tableData: [],
        updatedDate: ""
      },
      showTimeFrame: false,
      chartBar: {
        watermark: false,
        dataSources: internationalLaborDescribe.dataSources,
        yName: { ch: "万人", en: "XXXX" },
        title: {
          text: "年度派出各类劳务人员前10位目的地国家",
          subtext: "Top 10 destinations of workers sent overseas"
        },
        xData: [],
        series: [
          {
            // name:'存量_xxxxx',
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
    }
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
    }
  },
  components: { ChartBar, Year, TableChart },
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
    let arrmaxmin = res.split("_");
    this.option.value = arrmaxmin[1];
    await this.getChartsData({
      type: 1,
      descending: "destinationPercent", //比重
      limit: 10,
      year: Number(arrmaxmin[1])
    });
  },
  methods: {
    async getMaxMinDate() {
      // 获取最大年最小年
      let res = await chartDataFun.getMaxMinDate("LaborServiceTop10AnnualRank");
      this.$set(this.option, "frame", res);
      this.showTimeFrame = true;
      return res;
    },
    async getChartsData(aug) {
      //年份 获取数据
      let { res } = await request.getLaborServiceTop10AnnualRankChart(aug);
      this.totalData.updatedDate=this.$store.getters.latestTime;
      this.chartBar.updatedDate=this.$store.getters.latestTime;
      let Xname = [];
      // 年度派出各类劳务人员人数
      let variousTypesPerNum = [];
      res.forEach(item => {
        Xname.push(item.destinationEn+'\n'+item.destinations);
        variousTypesPerNum.push(item.variousTypesPerNumMillion);
      });
      this.chartBar.xData = Xname;
      this.chartBar.series[0].data = variousTypesPerNum;
    },
    async yearChange(year) {
      this.option.value = year;
      await this.getChartsData({
        type: 1,
        descending: "destinationPercent",
        limit: 10,
        year: Number(year)
      });
    }
  }
};
</script>

<style lang="less" scoped>
.topTenDest-of-workersChart {
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
      box-sizing: border-box;
    }
  }
}
</style>
