<template>
  <!-- 中国对外承包工程--对外承包工程前十国别（市场）chart-->
  <div class="topTenCountriesToOP-chart">
    <div class="echart-block">
      <div v-if="isShowTable" class="table-block">
        <TableChart v-if="selectOption.value.id==1" :totalData="totalData"></TableChart>
        <TableChart v-if="selectOption.value.id==2" :totalData="totalData2"></TableChart>
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
      <div class="status"  v-if="$store.getters.showOperate">
        <check-box
          v-for="(item, index) in status"
          :key="index"
          :option="item"
          @change="changeSelect(index)"
        ></check-box>
      </div>
    </div>
  </div>  
</template>

<script>
import { BeltAndRoadInvestDescribe } from "@/utils/describe.js";
import ChartBar from "@/components/charts/ChartBar";
import Year from "@/components/timeFrame/Year";
import CheckBox from "@/components/select/selectCheckBox/CheckBox";
import SelectRadio from "@/components/select/SelectRadio";
import request from "@/request/outBound/outBound";
import chartDataFun from "@/utils/chartDataFun";
import TableChart from "@/components/charts/TableChart";

export default {
  name: "topTenCountriesToOPChart",
  data() {
    return {
      totalData: {
        title: {
          ch: "中国年度对外承包工程完成营业额前十大国别/地区市场",
          en: "Top 10 market of China's overseas projects by revenue"
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
          rank: {
            text: "排名_Rank",
            width: "20%"
          },
          country: {
            text: "国别_Country/Region",
            width: "35%"
          },
          amount: {
            text: "新签合同额_Total value of new contract ",
            width: "35%",
            formatNum:true
          },
          amountYOY: {
            text: "新签合同额同比_Y-o-y growth of new contract value ",
            width: "35%",
            formatPer:true
          }
        },
        tableData: [],
        updatedDate: ""
      },
      totalData2: {
        title: {
          ch: "中国年度对外承包工程完成营业额前十大国别/地区市场",
          en: "Top 10 market of China's overseas projects by revenue"
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
          rank: {
            text: "排名_Rank",
            width: "20%"
          },
          country: {
            text: "国别_Country/Region",
            width: "35%"
          },
          amount: {
            text: "完成营业额_Revenue of completed contract",
            width: "35%",
            formatNum:true
          },
          amountYOY: {
            text: "完成营业额同比_Y-o-y growth of completed contract revenue",
            width: "35%",
            formatPer:true
          }
        },
        tableData: [],
        updatedDate: ""
      },
      timer: null,
      showTimeFrame: false,
      chartBar: {
        Yearonshow:true,//是否有左柱状图右折线图的展示          
        dataSources: BeltAndRoadInvestDescribe.dataSources,
        yearOnYear: false,
        yName: { ch: "百万美元", en: "USD min" },
        title: {
          text: "中国年度对外承包工程完成营业额前十大国别/地区市场",
          subtext: "Top 10 market of China's overseas projects by revenue"
        },
        xData: [],
        hideLegend:true,
        spliceCon:{// toolTip里面插入同比和同比英文
          ch:'同比',
          en:'year on year'
        },
        series: [
          {
            name:'新签合同额_Total value of new contract',
            color: ["#71a6c2"],
            data: [],
            yearOnYear: []
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
      status: [
        {
          checked: false,
          ch: "同比",
          en: "Year on year"
        }
      ],
      selectOption: {
        ch: "类型",
        en: "xxxxxx",
        value: {
          id: 1,
          ch: "新签合同额",
          en: "Total value of new contract"
        },
        op: [
          {
            id: 1,
            ch: "新签合同额",
            en: "Total value of new contract"
          },
          {
            id: 2,
            ch: "完成营业额",
            en: "Total value of new contract y-o-y growth "
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
          this.selectOption.value.id == 1
            ? this.totalData.tableTitle
            : this.totalData2.tableTitle,
          this.$store.getters.chartInfo.tableData
        );
        if (this.selectOption.value.id == 1) {
          this.$set(this.totalData, "tableData", resoult);
        } else if (this.selectOption.value.id == 2) {
          this.$set(this.totalData2, "tableData", resoult);
        }
      },
      deep: true
    }
  },
  async created() {
    let res = await this.getMaxMinDate();
    let arrmaxmin = res.split("_");
    this.option.value = arrmaxmin[1];
    await this.getChartsData({
      type: 1,
      ascending: "rank",
      limit: 10,
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
  components: { ChartBar, Year, CheckBox, SelectRadio, TableChart },
  methods: {
    async getMaxMinDate() {
      // 获取最大年最小年
      let res = await chartDataFun.getMaxMinDate("ForeignContractAnnualRank");
      this.$set(this.option, "frame", res);
      this.showTimeFrame = true;
      return res;
    },
    async getChartsData(aug) {
      //年份 获取数据
      let { res } = await request.getTopTenCountriesToOPChart(aug);
      this.totalData.updatedDate=this.$store.getters.latestTime;
      this.totalData2.updatedDate=this.$store.getters.latestTime;
      this.chartBar.updatedDate=this.$store.getters.latestTime;
      let Xname = [];
      // 新签合同额,完成营业额，新签合同额同比，完成营业额同比
      let amount = [],
        amountYOY = [];
      res.forEach(item => {
        Xname.push(item.countryEn + "\n" + item.country);
        amount.push(item.amountMillion);
        amountYOY.push(item.amountYOY);
      });
      this.chartBar.xData = Xname;
      this.chartBar.series[0].data = amount;
      this.chartBar.series[0].yearOnYear = amountYOY;
    },
    async yearChange(year) {
      this.option.value = year;
      await this.getChartsData({
        type: this.selectOption.value.id,
        ascending: "rank",
        limit: 10,
        year: Number(year)
      });
    },
    // 复选框
    changeSelect(index) {
      this.status[index].checked = !this.status[index].checked;
      if (index == 0) {
        this.status[index].checked
          ? this.$set(this.chartBar, "yearOnYear", true)
          : this.$set(this.chartBar, "yearOnYear", false);
      }
      if (index == 1) {
        this.status[index].checked
          ? (this.isShowRMB = true)
          : (this.isShowRMB = false);
      }
    },
    //选择类型新签合同额还是完成营业额
    async changeRadioSelect(item) {
      this.selectOption.value = item;
      await this.getChartsData({
        type: item.id,
        ascending: "rank",
        limit: 10,
        year: Number(this.option.value)
      });
      this.chartBar.title = {
        text: this.selectOption.value.ch,
        subtext: this.selectOption.value.en
      };
      this.chartBar.series[0].name = this.selectOption.value.ch+'_'+this.selectOption.value.en;
    }
  }
};
</script>

<style lang="less" scoped>
.topTenCountriesToOP-chart {
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
    width: 1.40625rem;
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
