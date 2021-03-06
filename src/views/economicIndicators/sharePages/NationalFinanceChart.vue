<template>
  <!-- 国家财政收支 chart-->
  <div class="goodstotal-chart">
    <div class="echart-block">
      <div v-if="isShowTable" class="table-block">
        <TableChart :totalData="totalData"></TableChart>
      </div>
      <div :class="$store.state.fullScreen.isFullScreen==false?'fullContainer':'container'">
        <bar-line-mix v-if="!isShowTable" ref="barLine" :options="USD"></bar-line-mix>
      </div>
    </div>
    <div class="select-block">
      <div class="frame">
        <time-frame
          v-if="showTimeFrame"
          :options="options"
          @change="change"
          @update="update"
          @changeActiveKey="changeActiveKey"
        ></time-frame>
      </div>
      <SelectRadio
        v-if="monthScreen"
        class="status"
        :option="selectOption"
        :value="selectOption.value"
        @change="changeRadioSelect($event)"
      ></SelectRadio>
    </div>
  </div>
</template>

<script>
import dayjs from "dayjs";
import TimeFrame from "@/components/timeFrame/TimeFrame";
import SelectRadio from "@/components/select/SelectRadio";
import BarLineMix from "@/components/charts/BarLineMix";
import request from "@/request/economicIndicators/economicIndicators";
import chartDataFun from "@/utils/chartDataFun";
import TableChart from "@/components/charts/TableChart";

export default {
  props: {
    isShowTable: {},
    describeData: {}
  },
  components: {
    TimeFrame,
    SelectRadio,
    BarLineMix,
    TableChart
  },
  name: "NationalFinanceChart",
  data() {
    return {
      totalData: {
        title: {
          ch: "财政收支情况",
          en: "National revenue and expenditure"
        },
        unit: {
          ch: "亿元人民币",
          en: "100 mln RMB"
        },
        tableTitle: {},
        tableData: [],
        updatedDate: ""
      },
      timer: null,
      showTimeFrame: false,
      monthScreen: false,
      selectedActiveKey: "yearly",
      USD: {
        id: "USD",
        dataSources: this.describeData,
        // yPosition:['left','right'],
        // yLabel:[true,true],
        yName: { ch: "亿元人民币", en: "100 mln RMB" },
        yName2: { ch: "同比", en: "YOY" },
        title: {
          ch: "财政收支情况",
          en: "National revenue and expenditure"
        },
        xData: [],
        // hideLegend: true,
        series: [],
        updatedDate: ""
      },
      selectOption: {
        ch: "月度",
        en: "Monthly",
        value: {
          id: 1,
          ch: "当月",
          en: "Current"
        },
        op: [
          {
            id: 1,
            ch: "当月",
            en: "Current"
          },
          {
            id: 2,
            ch: "月度累计",
            en: "Cumulative"
          }
        ]
      },
      options: {
        yearly: {
          ch: "年度",
          en: "Yearly",
          list: {
            start: {
              ch: "开始",
              en: "From",
              frame: "2016_2020",
              value: "2018"
            },
            end: {
              ch: "结束",
              en: "To",
              frame: "2016_2020",
              value: "2018"
            }
          }
        },
        monthly: {
          ch: "月度",
          en: "Monthly",
          list: {
            start: {
              ch: "开始",
              en: "From",
              frame: "",
              value: ""
            },
            end: {
              ch: "结束",
              en: "To",
              frame: "",
              value: ""
            }
          }
        }
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
        this.$set(this.totalData, "tableData", resoult);
      },
      deep: true
    }
  },
  async created() {
    let Yearres = await this.getMaxMinDate("NationalRevenueExpenditure");
    let res = await this.getMaxMinDate("NationalRevenueExpenditureMonth");
    this.$store.commit('setDBMinMaxDateQM',res);
    let Yarrmaxmin = Yearres.Y.split("_");
    let arrmaxmin = res.Y.split("_");
    let arrmaxminM = res.M.split("_");
    this.options.yearly.list.start.value = Yarrmaxmin[0];
    this.options.yearly.list.end.value = Yarrmaxmin[1];
    // 初始化日期月度季度赋值
    let QMDefaultTime = await chartDataFun.getQMDefaultTime(arrmaxmin[1],arrmaxminM[1], 1);
    this.options.monthly.list.start.value = QMDefaultTime.M.start;
    this.options.monthly.list.end.value = QMDefaultTime.M.end;
    await this.getChartsData({
      type: "yearly",
      start: Number(Yarrmaxmin[0]),
      end: Number(Yarrmaxmin[1]),
      noMonth: true
    });
  },
  mounted() {
    //下载图片
    this.$EventBus.$on("downLoadImg", () => {
      this.$refs.barLine.downloadFile();
    });
  },
  beforeDestroy() {
    this.$EventBus.$off("downLoadImg");
  },
  methods: {
    //选择当月或累计月份
    async changeRadioSelect(item) {
      this.selectOption.value = item;
      this.mainGetChartsData(this.selectedActiveKey);
    },
    async mainGetChartsData(type) {
      //条件改变时获取数据
      let { start, end } = this.options[type].list;
      if (type == "yearly") {
        this.monthScreen = false; //月份选择组件隐藏
        await this.getChartsData({
          type,
          start: Number(start.value),
          end: Number(end.value),
          noMonth: true
        });
      } else if (type == "monthly") {
        if (this.selectOption.value.en == "Current") {
          this.USD.yName2 = "";
        }else{
          this.USD.yName2= { ch: "同比", en: "YOY" }
        }
        this.monthScreen = true; //月份选择组件显示
        let startTimeArr = start.value.split("-");
        let endTimeArr = end.value.split("-");
        let monthStart = parseInt(startTimeArr[0]);
        let startMonth = parseInt(startTimeArr[1]);
        let monthEnd = parseInt(endTimeArr[0]);
        let endMonth = parseInt(endTimeArr[1]);
        await this.getChartsData({
          type,
          monthType: this.selectOption.value.id,
          start: monthStart,
          end: monthEnd,
          startMonth: startMonth,
          endMonth: endMonth
        });
      }
    },
    async getMaxMinDate(tableName) {
      // 获取最大年最小年
      let res = await chartDataFun.getMaxMinDate(tableName);
      for (let key in this.options) {
        let obj = JSON.parse(JSON.stringify(this.options[key]));
        for (let k in obj.list) {
          obj.list[k].frame = res.Y;
        }
        if (tableName == "NationalRevenueExpenditure" && key == "yearly") {
          this.$set(this.options, "yearly", obj);
        } else if (
          tableName == "NationalRevenueExpenditureMonth" &&
          key != "yearly"
        ) {
          this.$set(this.options, key, obj);
        }
      }
      this.showTimeFrame = true;
      return res;
    },
    async getItemData(arrSourceData, Axis, Ayis, range) {
      //根据字段获取数据
      let resoult = {};
      for (let i = 0; i < Ayis.length; i++) {
        let item = Ayis[i];
        // 转换图标数据数组和横轴名称数组
        let dataArr = await chartDataFun.objArrtransArr(
          arrSourceData,
          Axis,
          item
        );
        // 补全数据
        let data = await chartDataFun.completionDate(dataArr, range);
        resoult[item] = data;
      }
      return resoult;
    },
    // 获取当前页面的每条线数据（按年度 季度 月度分）
    async getItemCategoryData(res, XNameAttr, dataAttr, range) {
      //
      let data = await this.getItemData(res, XNameAttr, dataAttr, range);
      if (XNameAttr == "year") {
        this.USD.series = [
          {
            type: "bar",
            yAxisIndex: 0, //数值
            name: "财政收入_Revenue",
            color: "#61a0a8",
            data: data.revenue
          },
          {
            type: "line",
            yAxisIndex: 1, //百分比
            name: "收入同比_YOY revenue",
            color: "#61a0a8",
            data: data.yoyRevenue,
            percent: true
          },
          {
            type: "bar",
            yAxisIndex: 0, //数值
            name: "财政支出_Expenditure",
            color: "#c23531",
            data: data.expenditure
          },
          {
            type: "line",
            yAxisIndex: 1, //百分比
            name: "支出同比_YOY expenditure",
            color: "#c23531",
            data: data.yoyExpenditure,
            percent: true
          }
        ];
      } else {
        if (this.selectOption.value.id == 1) {
          this.USD.series = [
            {
              type: "bar",
              yAxisIndex: 0, //数值
              name: "当月财政收入_Monthly revenue",
              color: "#61a0a8",
              data: data.revenue
            },
            {
              type: "bar",
              yAxisIndex: 0,
              name: "当月财政支出_Monthly expenditure",
              color: "#c23531",
              data: data.expenditure
            }
          ];
        } else {
          this.USD.series = [
            {
              type: "bar",
              yAxisIndex: 0, //数值
              name: "月度累计财政收入_Cumulative monthly revenue",
              color: "#61a0a8",
              data: data.cumulativeRevenue
            },
            {
              type: "line",
              yAxisIndex: 1, //百分比
              name: "月度累计收入同比_YOY cumulative monthly revenue",
              color: "#61a0a8",
              data: data.yoyRevenue,
              percent: true
            },
            {
              type: "bar",
              yAxisIndex: 0, //数值
              name: "月度累计财政支出_Cumulative monthly expenditure",
              color: "#c23531",
              data: data.cumulativeExpenditure
            },
            {
              type: "line",
              yAxisIndex: 1,
              name: "月度累计支出同比_YOY cumulative monthly expenditure",
              color: "#c23531",
              data: data.yoyExpenditure,
              percent: true
            }
          ];
        }
      }

      // this.USD.series[0]["data"] = data.GDP;
      // this.USD.series[1]["data"] = data.yoyGrowth;
      //
    },
    async getChartsData(aug) {
      await this.setTableConfig(aug);
      //改变横轴 获取数据
      let { res } = await request.getNationalFinanceChartsData(
        aug.type == "yearly"
          ? "NationalRevenueExpenditure"
          : "NationalRevenueExpenditureMonth",
        aug
      );

      // 完整的区间
      let range =
        this.selectedActiveKey == "yearly" || this.selectOption.value.id == 1
          ? await chartDataFun.getXRangeMC(aug)
          : await chartDataFun.getXRange(aug);
      // 要换取纵轴数据的字段属性
      let dataAttr =
        aug.type == "yearly"
          ? ["revenue", "yoyRevenue", "expenditure", "yoyExpenditure"]
          : [
              "revenue",
              "cumulativeRevenue",
              "yoyRevenue",
              "expenditure",
              "cumulativeExpenditure",
              "yoyExpenditure"
            ];
      let XNameAttr = "year";
      this.USD.xData = range;
      this.USD.updatedDate = this.$store.getters.latestTime;
      this.totalData.updatedDate = this.$store.getters.latestTime;
      //   //添加额外的Q和M属性
      //  await chartDataFun.addOtherCategoryMC(res);
      if (
        this.selectedActiveKey == "yearly" ||
        this.selectOption.value.id == 1
      ) {
        await chartDataFun.addOtherCategoryMC(res);
      } else {
        await chartDataFun.addOtherCategory(res);
      }
      if (aug.type == "yearly") {
        // 年
        XNameAttr = "year";
      } else if (aug.type == "quarterly") {
        //季度
        XNameAttr = "Q";
      } else if ((aug.type = "monthly")) {
        //月度
        XNameAttr = "M";
      }
      // 获取当前页面所有线
      await this.getItemCategoryData(res, XNameAttr, dataAttr, range);
    },
    async setTableConfig(aug) {
      if (aug.type == "yearly") {
        this.totalData.tableTitle = {
          year: {
            text: "年份_Year",
            width: "20%"
          },
          revenue: {
            text: "财政收入_Revenue",
            width: "20%",
            formatNum: true
          },
          yoyRevenue: {
            text: "收入同比_YOY revenue",
            width: "20%",
            formatPer: true
          },
          expenditure: {
            text: "财政支出_Expenditure",
            width: "20%",
            formatNum: true
          },
          yoyExpenditure: {
            text: "支出同比_YOY expenditure",
            width: "20%",
            formatPer: true
          }
        };
      } else {
        if (this.selectOption.value.id == 1) {
          this.totalData.tableTitle = {
            year: {
              text: "年份_Year",
              width: "15%"
            },
            month: {
              text: "月份_Month",
              width: "15%"
            },
            revenue: {
              text: "当月财政收入_Monthly revenue",
              width: "35%",
              formatNum: true
            },
            expenditure: {
              text: "当月财政支出_Monthly expenditure",
              width: "35%",
              formatNum: true
            }
          };
        } else {
          this.totalData.tableTitle = {
            year: {
              text: "年份_Year",
              width: "8%"
            },
            month: {
              text: "月份_Month",
              width: "4%"
            },
            unit: {
              text: "单位_unit",
              width: "8%"
            },
            cumulativeRevenue: {
              text: "月度累计财政收入_Cumulative monthly revenue",
              width: "20%",
              formatNum: true
            },
            yoyRevenue: {
              text: "月度累计收入同比_YOY cumulative monthly revenue",
              width: "20%",
              formatPer: true
            },
            cumulativeExpenditure: {
              text: "月度累计财政支出_Cumulative monthly expenditure",
              width: "20%",
              formatNum: true
            },
            yoyExpenditure: {
              text: "月度累计支出同比_YOY cumulative monthly expenditure",
              width: "20%",
              formatPer: true
            }
          };
        }
      }
    },
    // 时间范围组件 update and change
    update(activeKey, value) {
      this.options[activeKey].list.start.value = value[0];
      this.options[activeKey].list.end.value = value[1];
      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        // 条件改变时获取数据数据入口  zp
        this.mainGetChartsData(activeKey);
      }, 600);
    },
    change(activeKey, key, value) {
      let list = JSON.parse(JSON.stringify(this.options[activeKey].list));
      let start =
        key == "start" ? dayjs(`${value}`) : dayjs(`${list.start.value}`);
      let end = key == "end" ? dayjs(`${value}`) : dayjs(`${list.end.value}`);
      if (end.isBefore(start)) {
        this.$message.warn("开始时间不得大于结束时间");
        return;
      }
      this.options[activeKey].list[key].value = value;
      // 获取数据入口  zp  开始和结束都有值再去查
      if (
        this.options[activeKey].list["start"].value &&
        this.options[activeKey].list["end"].value
      ) {
        this.mainGetChartsData(activeKey);
      }
    },
    // 改变年度季度月度时：
    async changeActiveKey(ev) {
      this.selectedActiveKey = ev;
      await this.mainGetChartsData(ev);
    }
  }
};
</script>

<style lang="less" scoped>
.goodstotal-chart {
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
      border-bottom: 1.5px solid #cacaca;
    }
    .status {
      padding: 0.104167rem;
    }
  }
}
</style>
