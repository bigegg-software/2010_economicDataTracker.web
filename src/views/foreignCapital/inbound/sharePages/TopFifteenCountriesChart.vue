<template>
  <!-- 主要对华投资国家前15位国家/地区chart -->
  <div class="topFifteen-CountriesChart">
    <div class="echart-block">
      <div v-if="isShowTable" class="table-block"></div>
      <div :class="$store.state.fullScreen.isFullScreen==false?'fullContainer':'container'">
        <chart-bar ref="barChart" :chartBarData="chartBar"></chart-bar>
      </div>
    </div>
    <div class="select-block">
      <div class="frame">
        <year v-if="showTimeFrame" :option="option" :value="option.value" @change="yearChange"></year>
      </div>
      <div class="status">
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
import ChartBar from "@/components/charts/ChartBar";
import Year from "@/components/timeFrame/Year";
import CheckBox from "@/components/select/selectCheckBox/CheckBox";
import request from "@/request/inBound/inBound";
import chartDataFun from "@/utils/chartDataFun";
export default {
  name: "topFifteenCountriesChart",
  data() {
    return {
      showTimeFrame: false,
      chartBar: {
        watermark: false,
        unit2Symbol:'',
        yearOnYear: false, //通过修改这个值来显示同比
        dataSources: "中国人民网",
        yName: { ch: "百万美元", en: "USD min" },
        y2Name: { ch: "单位：家", en: "unit:xxxx" },
        title: {
          text: "前15位国家/地区",
          subtext: "XXXXXXXXXX"
        },
        xData: [
          // "蒙古\nMongolia"
        ],
        series: [
          {
            // name:'存量_xxxxx',
            color: ["#0C9AFF"],
            data: [],
            yearOnYear:[]
          }
        ],
        updatedDate:"2020-11-6"
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
          ch: "企业数",
          en: "xxx"
        }
      ]
    };
  },
  props: {
    isShowTable: {
      type: Boolean,
      default: false
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
    let arrmaxmin = res.split("_");
    this.option.value=arrmaxmin[1];
    await this.getChartsData({
      descending: "inflowsPercent", //比重降序
      limit: 15,
      year: Number(arrmaxmin[1])
    });
  },
  components: { ChartBar, Year,CheckBox },
  methods: {
    async getMaxMinDate() {
      // 获取最大年最小年
      let res = await chartDataFun.getMaxMinDate("MajorTop15Investors");
      this.$set(this.option, "frame", res);
      this.showTimeFrame = true;
      return res;
    },
    async getChartsData(aug) {
      //年份 获取数据
      let { res } = await request.getTopFifteenCountriesChart(aug);
      let Xname = [];
      // 金额
      let FDIInflows = [];
      let FDIInflowsYOY = [];
      res.forEach(item => {
        console.log(item)
        Xname.push(item.country);
        FDIInflows.push(item.FDIInflowsMillion);
        FDIInflowsYOY.push(item.enterpriseNumber);
      });
      this.chartBar.xData = Xname;
      this.chartBar.series[0].data = FDIInflows;
      this.chartBar.series[0].yearOnYear = FDIInflowsYOY;
    },
    async yearChange(year) {
      this.option.value = year;
      await this.getChartsData({
        descending: "inflowsPercent",
        limit: 15,
        year: Number(year)
      });
    },
     // 复选框
    changeSelect(index) {
      this.status[index].checked = !this.status[index].checked;
      if (index == 0) {
        this.status[index].checked
          ? this.chartBar.yearOnYear=true
          : this.chartBar.yearOnYear=false
      }
    }
  }
};
</script>

<style lang="less" scoped>
.topFifteen-CountriesChart {
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
      padding: 0.104167rem;
      .checkbox{
        padding: 0;
      }
    }
  }
}
</style>
