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
    <div :class="$store.state.fullScreen.isFullScreen==false?'fullselect-block':'select-block'">
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
          // ch: "中国对" + this.selectOption.value.ch + "直接投资的主要行业",
          // en:
          //   "China's investment in " +
          //   this.selectOption.value.en +
          //   " by industry"
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
            width: "10%"
          },
          economiesEn: {
            text: "经济体（英文）_Economies",
            width: "30%"
          },
          economies: {
            text: "经济体_Economies",
            width: "30%"
          },
          industryEN: {
            text: "行业（英文）_Industry",
            width: "30%"
          },
          industry: {
            text: "行业_Industry",
            width: "30%"
          },
          outflowsMillion: {
            text: "中国对外直接投资流量_China's FDI outflows",
            width: "30%",
            formatNum: true
          }
        },
        tableData: [],
        updatedDate: ""
      },
      timer: null,
      randomColor: [
        "#61a0a9",
        "#c68821",
        "#b8a597",
        "#72a083",
        "#c96470",
        "#a65783",
        "#2b4659",
        "#d38265",
        "#d2da90",
        "#6e6e70",
        "#c2cdd3",
        "#c03838",
        "#9d9930",
        "#9a8ccc",
        "#d4a04d",
        "#ca849f",
        "#b7d9bc",
        "#dfdc90"
      ],
      showTimeFrame: false,
      chartBar: {
        dataSources: this.describeData,
        yName: { ch: "百万美元", en: "USD mln" },
        title: {
          text: "",
          subtext: ""
        },
        xData: [2020],
        grid: {
          top: "22%",
          left: "8%",
          bottom: "10%",
          enGapch: this.$fz(0.4) //数据来源中英文间距
        },
        series: [
          {
            name:'',
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
        en: "Economies",
        value: {
          id: 1,
          ch: "中国香港",
          en: "Hong Kong, China"
        },
        op: [
          {
            id: 1,
            ch: "中国香港",
            en: "Hong Kong, China"
          },
          {
            id: 2,
            ch: "东盟",
            en: "ASEAN"
          },
          {
            id: 3,
            ch: "欧盟",
            en: "European Union"
          },
          {
            id: 4,
            ch: "美国",
            en: "United States"
          },
          {
            id: 5,
            ch: "澳大利亚",
            en: "Australia"
          },
          {
            id: 6,
            ch: "俄罗斯",
            en: "Russia"
          }
        ]
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
        console.log(resoult);
        this.$set(this.totalData, "tableData", resoult);
      },
      deep: true
    },
    option: {
      handler() {
        this.totalData.title.ch = this.chartBar.title.text = `${this.option.value}年中国对${this.selectOption.value.ch}直接投资的主要行业`;
        this.totalData.title.en = this.chartBar.title.subtext = `China's investment in ${this.selectOption.value.en} by industry in ${this.option.value}`;
      },
      deep: true
    },
    selectOption: {
      handler() {
        this.totalData.title.ch = this.chartBar.title.text = `${this.option.value}年中国对${this.selectOption.value.ch}直接投资的主要行业`;
        this.totalData.title.en = this.chartBar.title.subtext = `${this.option.value} China's investment in ${this.selectOption.value.en} by industry`;
      },
      deep: true
    }
  },
  async created() {
    let res = await this.getMaxMinDate();
    console.log(res);
    let arrmaxmin = res.Y.split("_");
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
      this.$set(this.option, "frame", res.Y);
      this.showTimeFrame = true;
      return res;
    },
    async getChartsData(aug) {
      //年份 获取数据
      let { res } = await request.getFDIMajorEconomiesIndustry(aug);
      this.chartBar.updatedDate = this.$store.getters.latestTime;
      this.totalData.updatedDate = this.$store.getters.latestTime;
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
  .fullselect-block {
    width: 1.74667rem;
    height: auto;
    background-color: #f0f0f0;
    border: 2px solid #cacaca;
    border-left: none;
  }
  .select-block {
    width: 1.385rem;
    height: auto;
    background-color: #f0f0f0;
    border: 2px solid #cacaca;
    border-left: none;
  }
  .frame {
    padding: 0.104167rem;
    border-bottom: 1.5px solid #cacaca;
  }
  .status {
    padding: 0.052083rem 0.104167rem;
  }
}
</style>
