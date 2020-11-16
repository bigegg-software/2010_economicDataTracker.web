<template>
  <!-- 中国主要经济体投资按行业统计chart-->
  <div class="economy-ByIndustry-chart">
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
      <SelectRadio
        class="status"
        :option="selectOption"
        :value="selectOption.value"
        @change="changeRadioSelect($event)"
      ></SelectRadio>
    </div>
  </div>
</template>

<script>
import {outflowsByIndustryDescribe} from '@/utils/describe.js'
import ChartBar from "@/components/charts/ChartBar";
import Year from "@/components/timeFrame/Year";
import SelectRadio from "@/components/select/SelectRadio";
import request from "@/request/outBound/outBound";
import chartDataFun from "@/utils/chartDataFun";
import TableChart from "@/components/charts/TableChart";

export default {
  name: "economyByIndustryChart",
  data() {
    return {
      totalData: {
        title: {
          ch: "中国对主要经济体投资按行业统计",
          en: "XXXXXXXXXXX"
        },
        unit: {
          ch: "百万美元",
          en: "USD min"
        },
        tableTitle: {
          year: {
            text: "年份_Year",
            width: "10%"
          },
          economies: {
            text: "经济体_Economies",
            width: "20%"
          },
          industry: {
            text: "行业_industry",
            width: "20%"
          },
          outflowsMillion: {
            text: "中国对外直接投资流量_China's FDI outflows",
            width: "20%"
          }
        },
        tableData: [],
        updatedDate: ""
      },
      timer: null,
      randomColor: [
        "#8DC32E",
        "#FF800C",
        "#0CF6FF",
        "#DB9800",
        "#8D6CE3",
        "#FFBD0C",
        "#111BFF",
        "#FF0CC5",
        "#2992AE",
        "#0C9AFF",
        "#C4D225",
        "#E39145",
        "#0CFFCB",
        "#CF90FF",
        "#FF0000",
        "#101010",
        "#D04747",
        "#7B0CFF"
      ],
      showTimeFrame: false,
      chartBar: {
        dataSources:outflowsByIndustryDescribe.dataSources,
        yName: { ch: "百万美元", en: "USD min" },
        title: {
          text: "中国对东盟直接投资的主要行业",
          subtext: "XXXXXXXXXXXXXXXXXXXXXX"
        },
        xData: [2020],
        series: [
          {
            // name:'存量_xxxxx',
            color: [],
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
      },
      selectOption: {
        ch: "经济体",
        en: "xxxxxx",
        value: {
          id: 1,
          ch: "中国香港",
          en: "aaaaa"
        },
        op: [
          {
            id: 1,
            ch: "中国香港",
            en: "aaaaa"
          },
          {
            id: 2,
            ch: "东盟",
            en: "bbb"
          },
          {
            id: 3,
            ch: "欧盟",
            en: "ccc"
          },
          {
            id: 4,
            ch: "美国",
            en: "ddd"
          },
          {
            id: 5,
            ch: "澳大利亚",
            en: "eee"
          },
          {
            id: 6,
            ch: "俄罗斯联邦",
            en: "fff"
          }
        ]
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
  async created() {
    let res = await this.getMaxMinDate();
    console.log(res)
    let arrmaxmin = res.split("_");
    this.option.value = arrmaxmin[1];
    await this.getChartsData({
      equalTo: {
        economies: this.selectOption.value.ch
      },
      year: Number(arrmaxmin[1])
    });
  },
  mounted() {
    this.$EventBus.$on("downLoadImg", () => {
      this.$refs.barChart.downloadFile();
    });
  },
  beforeDestroy() {
    this.$EventBus.$off("downLoadImg");
  },
  components: { ChartBar, Year, SelectRadio, TableChart },
  methods: {
    async getMaxMinDate() {
      // 获取最大年最小年
      let res = await chartDataFun.getMaxMinDate("FDIMajorEconomiesIndustry");
      this.$set(this.option, "frame", res);
      this.showTimeFrame = true;
      return res;
    },
    async getChartsData(aug) {
      //年份 获取数据
      let { res } = await request.getFDIMajorEconomiesIndustry(aug);
      this.chartBar.updatedDate=this.$store.getters.latestTime;
      this.totalData.updatedDate=this.$store.getters.latestTime;
      let Xname = [];
      let outflows = [];
      let colors = [];
      res.forEach((item, i) => {
        Xname.push(item.industryEN + "\n" + item.industry);
        outflows.push(item.outflowsMillion);
        colors.push(this.randomColor[i]);
      });
      this.chartBar.xData = Xname;
      this.chartBar.series[0].color = colors;
      this.chartBar.series[0].data = outflows;
    },
    async yearChange(year) {
      this.option.value = year;
      await this.getChartsData({
        equalTo: {
          economies: this.selectOption.value.ch
        },
        year: Number(year)
      });
    },
    //选择经济体
    async changeRadioSelect(item) {
      this.selectOption.value = item;
      await this.getChartsData({
        equalTo: {
          economies: this.selectOption.value.ch
        },
        year: Number(this.option.value)
      });
      this.chartBar.title = {
        text: this.selectOption.value.ch,
        subtext: this.selectOption.value.en
      };
    }
  }
};
</script>

<style lang="less" scoped>
.economy-ByIndustry-chart {
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
      border-bottom: 1.5px solid #cacaca;
    }
    .status {
      padding: 0.052083rem 0.104167rem;
    }
  }
}
</style>
