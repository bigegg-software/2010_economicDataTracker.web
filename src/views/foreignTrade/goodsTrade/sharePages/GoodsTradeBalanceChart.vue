<template>
  <!-- 中国货物进出口贸易差额chart -->
  <div class="outflows-chart">
    <div class="echart-block">
      <div v-if="isShowTable" class="table-block">
        <TableChart :totalData="totalData"></TableChart>
      </div>
      <div
        :class="
          $store.state.fullScreen.isFullScreen == false
            ? 'fullContainer'
            : 'container'
        "
      >
        <lines-chart
          v-show="!isShowTable"
          ref="linesChart"
          :options="USD"
        ></lines-chart>
      </div>
    </div>
    <div class="select-block">
      <div class="frame">
        <time-frame
          :options="options"
          @change="change"
          @update="update"
          @changeActiveKey="changeActiveKey"
        ></time-frame>
      </div>
      <SelectRadio
        v-if="activeKey == 'monthly'"
        class="status"
        :option="selectOption"
        :value="selectOption.value"
        @change="changeRadioSelect($event)"
      ></SelectRadio>
    </div>
  </div>
</template>

<script>
// 年度月度两个表
import dayjs from "dayjs";
import TimeFrame from "@/components/timeFrame/TimeFrame";
import LinesChart from "@/components/charts/Lines";
import request from "@/request/goodsTrade/goodsTrade";
import SelectRadio from "@/components/select/SelectRadio";
import chartDataFun from "@/utils/chartDataFun";
import TableChart from "@/components/charts/TableChart";

export default {
  props: {
    isShowTable: {},
    describeData: {}
  },
  components: {
    TimeFrame,
    LinesChart,
    TableChart,
    SelectRadio
  },
  name: "goodsTradeBalance",
  data() {
    return {
      activeKey: "yearly",
      tableName: {
        yearly: "TotalTradeGoods",
        monthly: "TotalTradeGoodsMonth"
      },
      totalData: {
        title: {
         ch: "中国货物进出口贸易差额", en: "China's trade balance"    },
        unit: {
          ch: "百万美元",
          en: "USD mln"
        },
        tableTitle: {},
        tableData: [],
        updatedDate: ""
      },
      timer: null,
      monthScreen: false,
      USD: {
        id: "USD",
        dataSources: this.describeData,
        yName: { ch: "百万美元", en: "USD mln" },
        yearOnYear: false, //通过修改这个值来显示同比
        title: { ch: "中国货物进出口贸易差额", en: "China's trade balance" },
        xData: [],
        hideLegend: true,
        series: [
          {
            name: "贸易差额_Trade balance|",
            color: "#6AA3CD",
            data: [],
            yearOnYear: []
          }
        ],
        updatedDate: ""
      },
      options: {
        yearly: {
          ch: "年度",
          en: "Yearly",
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
        let result = chartDataFun.conversionTable(
          this.totalData.tableTitle,
          this.$store.getters.chartInfo.tableData
        );
        this.$set(this.totalData, "tableData", result);
      },
      deep: true
    }
  },
  async created() {
    await this.getMaxMinDate();
    this.mainGetChartsData();
  },
  async mounted() {
    this.$EventBus.$on("downLoadImg", () => {
      this.$refs.linesChart.downloadFile();
    });
  },
  beforeDestroy() {
    this.$EventBus.$off("downLoadImg");
  },
  methods: {
    async mainGetChartsData() {
      let { start, end } = this.options[this.activeKey].list;
      if (this.activeKey == "yearly") {
        await this.getChartsData({
          tableName: this.tableName[this.activeKey],
          type: this.activeKey,
          start: Number(start.value),
          end: Number(end.value),
          noMonth: true
        });
      }
      if (this.activeKey == "monthly") {
        let startTimeArr = start.value.split("-");
        let endTimeArr = end.value.split("-");
        let quarterStart = parseInt(startTimeArr[0]);
        let quarterStartMonth = parseInt(startTimeArr[1]);
        let quarterEnd = parseInt(endTimeArr[0]);
        let quarterEndMonth = parseInt(endTimeArr[1]);
        await this.getChartsData({
          tableName: this.tableName[this.activeKey],
          type: this.activeKey,
          start: quarterStart,
          end: quarterEnd,
          startMonth: quarterStartMonth,
          endMonth: quarterEndMonth,
          dataType: this.selectOption.value.id // 1当月 / 2累计
        });
      }
    },
    // 获取最大年最小年
    async getMaxMinDate() {
      let res = await chartDataFun.getMaxMinDate(
        this.tableName[this.activeKey]
      );
      console.log(res)
      let arrmaxmin = res.Y.split("_");
      if (this.activeKey == "yearly") {
        let obj = JSON.parse(JSON.stringify(this.options["yearly"]));
        for (let k in obj.list) {
          obj.list[k].frame = res.Y;
        }
        this.$set(this.options, "yearly", obj);
        this.options.yearly.list.start.value = arrmaxmin[1] - 4;
        this.options.yearly.list.end.value = arrmaxmin[1];
      }
      if (this.activeKey == "monthly") {
        let arrmaxminM = res.M.split("_");
        let obj = JSON.parse(JSON.stringify(this.options["monthly"]));
        for (let k in obj.list) {
          obj.list[k].frame = res.Y;
        }
        this.$set(this.options, "monthly", obj);
        let QMDefaultTime = await chartDataFun.getQMDefaultTime(
          arrmaxmin[1],
          arrmaxminM[1],
          1
        );
        this.options.monthly.list.start.value = QMDefaultTime.M.start_beforeSix;
        this.options.monthly.list.end.value = QMDefaultTime.M.end;
      }
    },
    async getItemData(arrSourceData, Axis, Ayis, range) {
      //根据字段获取数据
      let result = {};
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
        result[item] = data;
      }
      return result;
    },
    // 获取当前页面的每条线数据（按年度 月度分）
    async getItemCategoryData(res, XNameAttr, dataAttr, range) {
      let data = await this.getItemData(res, XNameAttr, dataAttr, range);
      if (this.activeKey == "monthly" && this.selectOption.value.id == 2) {
        this.USD.series[0]["data"] = data.USD_cumulativeBalance;
        return;
      }
      this.USD.series[0]["data"] = data.USD_balance;
    },
    async getChartsData(aug) {
      await this.setTableConfig(aug);
      let data;
      let dataAttr;
      let range;
      if (this.activeKey == "yearly") {
        data = await request.getTotalTradeGoodsByBalance(aug);
        dataAttr = ["USD_balance"];
        range = await chartDataFun.getXRange(aug);
        await chartDataFun.addOtherCategory(data);
      }
      if (this.activeKey == "monthly") {
        data = await request.getTotalTradeGoodsMonthByBalance(aug);
        // 当月
        if (this.selectOption.value.id == 1) {
          dataAttr = ["USD_balance"];
          range = await chartDataFun.getXRangeCurrentMonth(aug);
          await chartDataFun.addOtherCategoryCurrentMonth(data);
        }
        // 累计
        if (this.selectOption.value.id == 2) {
          dataAttr = ["USD_cumulativeBalance"];
          range = await chartDataFun.getXRange(aug);
          await chartDataFun.addOtherCategory(data);
        }
      }
      this.USD.xData = range;
      this.USD.updatedDate = this.$store.getters.latestTime;
      this.totalData.updatedDate = this.$store.getters.latestTime;
      let XNameAttr;
      if (aug.type == "yearly") {
        XNameAttr = "year";
      } else if ((aug.type = "monthly")) {
        XNameAttr = "M";
      }
      // 获取当前页面所有线
      await this.getItemCategoryData(data, XNameAttr, dataAttr, range);
    },
    async setTableConfig(aug) {
      if (aug.type == "yearly") {
        this.totalData.tableTitle = {
          year: {
            text: "年份_Year",
            width: "10%"
          },
          USD_balance: {
            text: "贸易差额_Balance",
            width: "45%",
            formatNum: true
          }
        };
      } else {
        // 如果是当月
        if (this.selectOption.value.id == 1) {
          this.totalData.tableTitle = {
            year: {
              text: "年份_Year",
              width: "10%"
            },
            month: {
              text: "月份_month",
              width: "20%"
            },
            USD_balance: {
              text: "当月贸易差额_Monthly balance",
              width: "35%",
              formatNum: true
            }
          };
        }
        // 如果是累计
        if (this.selectOption.value.id == 2) {
          this.totalData.tableTitle = {
            year: {
              text: "年份_Year",
              width: "10%"
            },
            month: {
              text: "月份_month",
              width: "20%"
            },
            USD_cumulativeBalance: {
              text: "累计贸易差额_Cumulative monthly balance",
              width: "35%",
              formatNum: true
            }
          };
        }
      }
    },
    // 时间范围组件 update and change
    update(activeKey, value) {
      // console.log(activeKey, value, "666");
      this.options[activeKey].list.start.value = value[0];
      this.options[activeKey].list.end.value = value[1];
      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        this.mainGetChartsData();
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
    //选择当月或累计月份
    async changeRadioSelect(item) {
      this.selectOption.value = item;
      this.handleText();
      await this.mainGetChartsData();
    },
    // 改变年度季度月度时：
    async changeActiveKey(activeKey) {
      this.activeKey = activeKey;
      this.handleText();
      await this.getMaxMinDate();
      await this.mainGetChartsData();
    },
    handleText() {
      if (this.activeKey == "yearly") {
        this.USD.series[0].name = "贸易差额_Trade balance|";
      }
      if (this.activeKey == "monthly") {
        if (this.selectOption.value.id == 1) {
          this.USD.series[0].name = "当月贸易差额_Monthly balance|";
        }
        if (this.selectOption.value.id == 2) {
          this.USD.series[0].name = "累计贸易差额_Cumulative monthly balance|";
        }
      }
    }
  }
};
</script>

<style lang="less" scoped>
.outflows-chart {
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
      padding: 0.104167rem;
    }
  }
}
</style>
