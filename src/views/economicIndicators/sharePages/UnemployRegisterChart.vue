
<template>
  <!-- 登记失业率 chart-->
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
    </div>
  </div>
</template>

<script>
import dayjs from "dayjs";
import TimeFrame from "@/components/timeFrame/TimeFrame";
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
    BarLineMix,
    TableChart
  },
  name: "TradeByCommodity",
  data() {
    return {
      totalData: {
        title: {
          ch: "城镇登记失业率",
          en: "Urban registered unemployment rate"
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
      USD: {
        id: "USD",
        dataSources: this.describeData,
        yPosition:['left','right'],
        yLabel:[true,true],
        yName: { ch: "亿元人民币", en: "100 mln RMB" },
        yName2: { ch: "失业率", en: "100%" },
        title: {
          ch: "城镇登记失业率",
          en: "Urban registered unemployment rate"
        },
        xData: [],
        grid: {
          bottom: "10%",
          enGapch: this.$fz(0.4) //数据来源中英文间距
        },
        // hideLegend: true,
        series: [],
        updatedDate: ""
      },
      options: {
        yearly: {
          ch: "年度",
          en: "Yearly",
          list: {
            start: {
              ch: "开始",
              en: "Start",
              frame: "2016_2020",
              value: "2018"
            },
            end: {
              ch: "结束",
              en: "End",
              frame: "2016_2020",
              value: "2018"
            }
          }
        },
        quarterly: {
          ch: "季度",
          en: "Quarterly",
          list: {
            start: {
              ch: "开始",
              en: "Start",
              frame: "",
              value: ""
            },
            end: {
              ch: "结束",
              en: "End",
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
        console.log(resoult);
        this.$set(this.totalData, "tableData", resoult);
      },
      deep: true
    }
  },
  async created() {
    let Yearres = await this.getMaxMinDate("Unemployment");
    let res = await this.getMaxMinDate("UnemploymentQuarter");
    let Yarrmaxmin = Yearres.split("_");
    let arrmaxmin = res.split("_");
    this.options.yearly.list.start.value = Yarrmaxmin[0];
    this.options.yearly.list.end.value = Yarrmaxmin[1];
    // 初始化日期月度季度赋值
    let QMDefaultTime = await chartDataFun.getQMDefaultTime(arrmaxmin[1], 1);
    console.log(QMDefaultTime);
    this.options.quarterly.list.start.value = QMDefaultTime.Q.start;
    this.options.quarterly.list.end.value = QMDefaultTime.Q.end;
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
    async mainGetChartsData(type) {
      //条件改变时获取数据
      let { start, end } = this.options[type].list;
      if (type == "yearly") {
        await this.getChartsData({
          type,
          start: Number(start.value),
          end: Number(end.value),
          noMonth: true
        });
      } else if (type == "quarterly" || type == "monthly") {
        let startTimeArr = start.value.split("-");
        let endTimeArr = end.value.split("-");
        let quarterStart = parseInt(startTimeArr[0]);
        let quarterStartMonth = parseInt(startTimeArr[1]) / 3;
        let quarterEnd = parseInt(endTimeArr[0]);
        let quarterEndMonth = parseInt(endTimeArr[1]) / 3;
        console.log(quarterEndMonth);
        await this.getChartsData({
          type,
          start: quarterStart,
          end: quarterEnd,
          startQuarter: quarterStartMonth,
          endQuarter: quarterEndMonth
        });
      }
    },
    async getMaxMinDate(tableName) {
      // 获取最大年最小年
      let res = await chartDataFun.getMaxMinDate(tableName);
      console.log(res)
      for (let key in this.options) {
        let obj = JSON.parse(JSON.stringify(this.options[key]));
        for (let k in obj.list) {
          obj.list[k].frame = res;
        }
        if (tableName == "Unemployment" && key == "yearly") {
          this.$set(this.options, "yearly", obj);
        } else if (tableName == "UnemploymentQuarter" && key != "yearly") {
          this.$set(this.options, key, obj);
        }
      }
      this.showTimeFrame = true;
      console.log(res);
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
      console.log(resoult)
      return resoult;
    },
    // 获取当前页面的每条线数据（按年度 季度 月度分）
    async getItemCategoryData(res, XNameAttr, dataAttr, range) {
      console.log(res, XNameAttr, dataAttr, range);
      //
      let data = await this.getItemData(res, XNameAttr, dataAttr, range);
      console.log(data);
      if (XNameAttr == "year") {
        this.USD.yName= { ch: "亿元人民币", en: "100 mln RMB" },
        this.USD.yPosition=['left','right'],
        this.USD.yLabel=[true,true],
        this.USD.series = [
          {
            type: "bar",
            yAxisIndex: 0, //数值
            name: "城镇登记失业人数_Urban registered unemployment",
            color: "#61a0a8",
            data: data.unemployment
          },
          {
            type: "line",
            yAxisIndex: 1, //百分比
            name: "城镇登记失业率_Urban registered unemployment rate",
            color: "red",
            data: data.unemploymentRate,
            percent: true
          }
        ];
      } else {
        this.USD.yName= { ch: "", en: "" },
        this.USD.yPosition=['right','left'],
        this.USD.yLabel=[false,true],
        this.USD.series = [
          {
            type: "line",
            yAxisIndex: 1, //百分比
            name: "城镇登记失业率_Urban registered unemployment rate",
            color: "#333",
            data: data.unemploymentRate,
            percent: true
          }
        ];
      }
    },
    async getChartsData(aug) {
      await this.setTableConfig(aug);
      //改变横轴 获取数据
      let { res } = await request.getUnemployRegisterChartsData(
        aug.type == "yearly" ? "Unemployment" : "UnemploymentQuarter",
        aug
      );

      // 完整的区间
      let range = await chartDataFun.getXRangeMC(aug);
      console.log(range);
      // 要换取纵轴数据的字段属性
      let dataAttr =
        aug.type == "yearly"
          ? ["unemployment", "unemploymentRate"]
          : [
              "unemploymentRate"
            ];
      let XNameAttr = "year";
      this.USD.xData = range;
      this.USD.updatedDate = this.$store.getters.latestTime;
      this.totalData.updatedDate = this.$store.getters.latestTime;
      //   //添加额外的Q和M属性
      await chartDataFun.addOtherCategoryMC(res);

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
            text: "年度_Year",
            width: "20%"
          },
          unemployment: {
            text: "城镇登记失业人数_Urban registered unemployment",
            width: "40%",
            formatNum: true
          },
          unemploymentRate: {
            text: "城镇登记失业率_Urban registered unemployment rate",
            width: "40%",
            formatPer: true
          }
        };
      } else {
        this.totalData.tableTitle = {
          year: {
            text: "年份_Year",
            width: "15%"
          },
          quarter: {
            text: "季度_Quarter",
            width: "20%"
          },
          unemploymentRate: {
            text: "城镇登记失业率_Urban registered unemployment rate",
            width: "60%",
            formatNum: true
          }
        };
      }
    },
    // 时间范围组件 update and change
    update(activeKey, value) {
      // console.log(activeKey, value, "666");
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
  }
}
</style>
