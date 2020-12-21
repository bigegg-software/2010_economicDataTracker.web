<template>
  <!-- 中国货物进出口总值chart -->
  <div class="goodstotal-chart">
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
        <bar-line v-if="!isShowTable" ref="barLine" :options="USD"></bar-line>
      </div>
      <div
        v-if="isShowRMB && !isShowTable"
        :class="
          $store.state.fullScreen.isFullScreen == false
            ? 'fullContainer'
            : 'container'
        "
      >
        <bar-line :options="RMB"></bar-line>
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
      <div class="status" v-if="$store.getters.showOperate">
        <check-box
          v-for="(item, index) in status"
          :key="index"
          :option="item"
          @change="changeSelect(index)"
        ></check-box>
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
//  年度月度分两张表
import dayjs from "dayjs";
import TimeFrame from "@/components/timeFrame/TimeFrame";
import CheckBox from "@/components/select/selectCheckBox/CheckBox";
import BarLine from "@/components/charts/BarLine";
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
    CheckBox,
    BarLine,
    TableChart,
    SelectRadio
  },
  name: "goodsTotal",
  data() {
    return {
      activeKey: "yearly",
      tableName: {
        yearly: "TotalTradeGoods",
        monthly: "TotalTradeGoodsMonth"
      },
      totalData: {
        title: {
          ch: "中国进出口贸易总额",
          en: "Revenue of completed contract from China's overseas projects"
        },
        unit: {
          ch: "百万美元/亿人民币",
          en: "USD mln/RMB 100 mln"
        },
        tableTitle: {},
        tableData: [],
        updatedDate: ""
      },
      timer: null,
      isShowRMB: false,
      USD: {
        id: "USD",
        dataSources: this.describeData,
        yName: { ch: "百万美元", en: "USD mln" },
        yearOnYear: true, //通过修改这个值来显示同比
        title: {
          ch: "中国货物进出口总值",
          en: "China's total trade volume of goods"
        },
        xData: [],
        grid: {
          bottom: "10%",
          enGapch: this.$fz(0.4) //数据来源中英文间距
        },
        hideLegend: true,
        series: [
          {
            name: "进出口_Trade volume|进出口同比_Y-o-y trade",
            color: "#91c7ae",
            data: [],
            yearOnYear: []
          },
          {
            name: "进口_Import|进口同比_Y-o-y import",
            color: "#c23531",
            data: [],
            yearOnYear: []
          },
          {
            name: "出口_Export|出口同比_Y-o-y export",
            color: "#61a0a8",
            data: [],
            yearOnYear: []
          }
        ],
        updatedDate: ""
      },
      RMB: {
        id: "RMB",
        dataSources: this.describeData,
        yName: { ch: "亿元人民币", en: "RMB 100 mln" },
        yearOnYear: true, //通过修改这个值来显示同比
        title: {
          ch: "中国货物进出口总值",
          en: "China's total trade volume of goods"
        },
        xData: [],
        grid: {
          bottom: "14%",
          enGapch: this.$fz(0.4) //数据来源中英文间距
        },
        hideLegend: true,
        series: [
          {
            name: "进口_Import|进口同比_Y-o-y import",
            color: "#c23531",
            data: [],
            yearOnYear: []
          },
          {
            name: "出口_Export|出口同比_Y-o-y export",
            color: "#61a0a8",
            data: [],
            yearOnYear: []
          },
          {
            name: "进出口_Trade volume|进出口同比_Y-o-y trade",
            color: "#91c7ae",
            data: [],
            yearOnYear: []
          }
        ],
        updatedDate: ""
      },
      status: [
        {
          checked: false,
          ch: "人民币计价",
          en: "In RMB"
        }
      ],
      options: {
        yearly: {
          ch: "年度",
          en: "Yearly",
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
        },
        monthly: {
          ch: "月度",
          en: "Monthly",
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
      },
      selectOption: {
        ch: "月份",
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
  mounted() {
    this.$EventBus.$on("downLoadImg", () => {
      this.$refs.barLine.downloadFile();
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
      let yearly = await chartDataFun.getMaxMinDate(this.tableName["yearly"]);
      let monthly = await chartDataFun.getMaxMinDate(this.tableName["monthly"]);
      let arrmaxmin_yearly = yearly.split("_");
      let arrmaxmin_monthly = monthly.split("_");
      //
      let obj_yearly = JSON.parse(JSON.stringify(this.options["yearly"]));
      for (let k in obj_yearly.list) {
        obj_yearly.list[k].frame = yearly;
      }
      this.$set(this.options, "yearly", obj_yearly);
      this.options.yearly.list.start.value = arrmaxmin_yearly[1] - 4;
      this.options.yearly.list.end.value = arrmaxmin_yearly[1];
      //
      let obj_monthly = JSON.parse(JSON.stringify(this.options["monthly"]));
      for (let k in obj_monthly.list) {
        obj_monthly.list[k].frame = monthly;
      }
      this.$set(this.options, "monthly", obj_monthly);
      let QMDefaultTime = await chartDataFun.getQMDefaultTime(
        arrmaxmin_monthly[1],
        1
      );
      this.options.monthly.list.start.value = QMDefaultTime.M.start;
      this.options.monthly.list.end.value = QMDefaultTime.M.end;
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
    // 获取当前页面的每条线数据（按年度 季度 月度分）
    async getItemCategoryData(res, XNameAttr, dataAttr, range) {
      let data = await this.getItemData(res, XNameAttr, dataAttr, range);
      if (this.activeKey == "monthly" && this.selectOption.value.id == 2) {
        this.USD.series[0]["data"] = data.USD_cumulativeTradeVolume;
        this.USD.series[0]["yearOnYear"] = data.USD_yoyCumulativeTrade;
        this.USD.series[1]["data"] = data.USD_cumulativeImport;
        this.USD.series[1]["yearOnYear"] = data.USD_yoyCumulativeImport;
        this.USD.series[2]["data"] = data.USD_cumulativeExport;
        this.USD.series[2]["yearOnYear"] = data.USD_yoyCumulativeExport;
        this.RMB.series[0]["data"] = data.RMB_cumulativeTradeVolume;
        this.RMB.series[0]["yearOnYear"] = data.RMB_yoyCumulativeTrade;
        this.RMB.series[1]["data"] = data.RMB_cumulativeImport;
        this.RMB.series[1]["yearOnYear"] = data.RMB_yoyCumulativeImport;
        this.RMB.series[2]["data"] = data.RMB_cumulativeExport;
        this.RMB.series[2]["yearOnYear"] = data.RMB_yoyCumulativeExport;
        return;
      }
      this.USD.series[0]["data"] = data.USD_tradeVolume;
      this.USD.series[0]["yearOnYear"] = data.USD_yoyTrade;
      this.USD.series[1]["data"] = data.USD_import;
      this.USD.series[1]["yearOnYear"] = data.USD_yoyImport;
      this.USD.series[2]["data"] = data.USD_export;
      this.USD.series[2]["yearOnYear"] = data.USD_yoyExport;
      this.RMB.series[0]["data"] = data.RMB_tradeVolume;
      this.RMB.series[0]["yearOnYear"] = data.RMB_yoyTrade;
      this.RMB.series[1]["data"] = data.RMB_import;
      this.RMB.series[1]["yearOnYear"] = data.RMB_yoyImport;
      this.RMB.series[2]["data"] = data.RMB_export;
      this.RMB.series[2]["yearOnYear"] = data.RMB_yoyExport;
    },
    async getChartsData(aug) {
      await this.setTableConfig(aug);
      let data;
      let dataAttr;
      let range;

      if (this.activeKey == "yearly") {
        data = await request.getTotalTradeGoods(aug);
        dataAttr = [
          "USD_tradeVolume",
          "USD_yoyTrade",
          "USD_import",
          "USD_yoyImport",
          "USD_export",
          "USD_yoyExport",
          "RMB_tradeVolume",
          "RMB_yoyTrade",
          "RMB_import",
          "RMB_yoyImport",
          "RMB_export",
          "RMB_yoyExport"
        ];
        range = await chartDataFun.getXRange(aug);
        await chartDataFun.addOtherCategory(data);
      }
      if (this.activeKey == "monthly") {
        data = await request.getTotalTradeGoodsMonth(aug);
        // 当月
        if (this.selectOption.value.id == 1) {
          dataAttr = [
            "USD_tradeVolume",
            "USD_yoyTrade",
            "USD_import",
            "USD_yoyImport",
            "USD_export",
            "USD_yoyExport",
            "RMB_tradeVolume",
            "RMB_yoyTrade",
            "RMB_import",
            "RMB_yoyImport",
            "RMB_export",
            "RMB_yoyExport"
          ];
          range = await chartDataFun.getXRangeCurrentMonth(aug);
          await chartDataFun.addOtherCategoryCurrentMonth(data);
        }
        // 累计
        if (this.selectOption.value.id == 2) {
          dataAttr = [
            "USD_cumulativeTradeVolume",
            "USD_yoyCumulativeTrade",
            "USD_cumulativeImport",
            "USD_yoyCumulativeImport",
            "USD_cumulativeExport",
            "USD_yoyCumulativeExport",
            "RMB_cumulativeTradeVolume",
            "RMB_yoyCumulativeTrade",
            "RMB_cumulativeImport",
            "RMB_yoyCumulativeImport",
            "RMB_cumulativeExport",
            "RMB_yoyCumulativeExport"
          ];
          range = await chartDataFun.getXRange(aug);
          await chartDataFun.addOtherCategory(data);
        }
      }
      // 要换取纵轴数据的字段属性

      let XNameAttr = "year";
      this.USD.xData = range;
      this.USD.updatedDate = this.$store.getters.latestTime;
      this.RMB.xData = range;
      this.RMB.updatedDate = this.$store.getters.latestTime;
      this.totalData.updatedDate = this.$store.getters.latestTime;

      if (aug.type == "yearly") {
        XNameAttr = "year";
      }
      if (aug.type == "monthly") {
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
            width: "100px"
          },
          USD_tradeVolume: {
            text: "进出口(USD)_Trade volume(USD)",
            width: "100px",
            formatNum: true
          },
          USD_yoyTrade: {
            text: "进出口同比(USD)_Y-o-y trade(USD)",
            width: "100px",
            formatPer: true
          },
          USD_import: {
            text: "进口(USD)_Import(USD)",
            width: "100px",
            formatNum: true
          },
          USD_yoyImport: {
            text: "进口同比(USD)_Y-o-y import(USD)",
            width: "100px",
            formatPer: true
          },
          USD_export: {
            text: "出口(USD)_Export(USD)",
            width: "100px",
            formatNum: true
          },
          USD_yoyExport: {
            text: "出口同比(USD)_Y-o-y export(USD)",
            width: "100px",
            formatPer: true
          },
          RMB_tradeVolume: {
            text: "进出口(RMB)_Trade volume(RMB)",
            width: "100px",
            formatNum: true
          },
          RMB_yoyTrade: {
            text: "进出口同比(RMB)_Y-o-y trade(RMB)",
            width: "100px",
            formatPer: true
          },
          RMB_import: {
            text: "进口(RMB)_Import(RMB)",
            width: "100px",
            formatNum: true
          },
          RMB_yoyImport: {
            text: "进口同比(RMB)_Y-o-y import(RMB)",
            width: "100px",
            formatPer: true
          },
          RMB_export: {
            text: "出口(RMB)_Export(RMB)",
            width: "100px",
            formatNum: true
          },
          RMB_yoyExport: {
            text: "出口同比(RMB)_Y-o-y export(RMB)",
            width: "100px",
            formatPer: true
          }
        };
      } else {
        if (this.selectOption.value.id == 1) {
          this.totalData.tableTitle = {
            year: {
              text: "年份_Year",
              width: "10%"
            },
            month: {
              text: "月份_Month",
              width: "20%"
            },
            USD_tradeVolume: {
              text: "当月进出口(USD)_Monthly trade(USD)",
              width: "25%",
              formatNum: true
            },
            USD_yoyTrade: {
              text: "当月进出口同比(USD)_Y-o-y monthly trade(USD)",
              width: "25%",
              formatPer: true
            },
            USD_import: {
              text: "当月进口(USD)_Monthly import(USD)",
              width: "20%",
              formatNum: true
            },
            USD_yoyImport: {
              text: "当月进口同比(USD)_Y-o-y monthly import(USD)",
              width: "20%",
              formatPer: true
            },
            USD_export: {
              text: "当月出口(USD)_Monthly export(USD)",
              width: "20%",
              formatNum: true
            },
            USD_yoyExport: {
              text: "当月出口同比(USD)_Y-o-y monthly export(USD)",
              width: "20%",
              formatPer: true
            },
            RMB_tradeVolume: {
              text: "当月进出口(RMB)_Monthly trade(RMB)",
              width: "25%",
              formatNum: true
            },
            RMB_yoyTrade: {
              text: "当月进出口同比(RMB)_Y-o-y monthly trade(RMB)",
              width: "25%",
              formatPer: true
            },
            RMB_import: {
              text: "当月进口(RMB)_Monthly import(RMB)",
              width: "20%",
              formatNum: true
            },
            RMB_yoyImport: {
              text: "当月进口同比(RMB)_Y-o-y monthly import(RMB)",
              width: "20%",
              formatPer: true
            },
            RMB_export: {
              text: "当月出口(RMB)_Monthly export(RMB)",
              width: "20%",
              formatNum: true
            },
            RMB_yoyExport: {
              text: "当月出口同比(RMB)_Y-o-y monthly export(RMB)",
              width: "20%",
              formatPer: true
            }
          };
        }
        if (this.selectOption.value.id == 2) {
          this.totalData.tableTitle = {
            year: {
              text: "年份_Year",
              width: "10%"
            },
            month: {
              text: "月份_Month",
              width: "20%"
            },
            USD_cumulativeTradeVolume: {
              text: "累计进出口(USD)_Cumulative monthly trade(USD)",
              width: "25%",
              formatNum: true
            },
            USD_yoyCumulativeTrade: {
              text: "累计进出口同比(USD)_Y-o-y cumulative monthly trade(USD)",
              width: "25%",
              formatPer: true
            },
            USD_cumulativeImport: {
              text: "累计进口(USD)_Cumulative monthly import(USD)",
              width: "20%",
              formatNum: true
            },
            USD_yoyCumulativeImport: {
              text: "累计进口同比(USD)_Y-o-y cumulative monthly import(USD)",
              width: "20%",
              formatPer: true
            },
            USD_cumulativeExport: {
              text: "累计出口(USD)_Cumulative monthly export(USD)",
              width: "20%",
              formatNum: true
            },
            USD_yoyCumulativeExport: {
              text: "累计出口同比(USD)_Y-o-y cumulative monthly export(USD)",
              width: "20%",
              formatPer: true
            },
            RMB_cumulativeTradeVolume: {
              text: "累计进出口(RMB)_Cumulative monthly trade(RMB)",
              width: "25%",
              formatNum: true
            },
            RMB_yoyCumulativeTrade: {
              text: "累计进出口同比(RMB)_Y-o-y cumulative monthly trade(RMB)",
              width: "25%",
              formatPer: true
            },
            RMB_cumulativeImport: {
              text: "累计进口(RMB)_Cumulative monthly import(RMB)",
              width: "20%",
              formatNum: true
            },
            RMB_yoyCumulativeImport: {
              text: "累计进口同比(RMB)_Y-o-y cumulative monthly import(RMB)",
              width: "20%",
              formatPer: true
            },
            RMB_cumulativeExport: {
              text: "累计出口(RMB)_Cumulative monthly export(RMB)",
              width: "20%",
              formatNum: true
            },
            RMB_yoyCumulativeExport: {
              text: "累计出口同比(RMB)_Y-o-y cumulative monthly export(RMB)",
              width: "20%",
              formatPer: true
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
        this.mainGetChartsData();
      }
    }, // 复选框
    changeSelect(index) {
      this.status[index].checked = !this.status[index].checked;
      this.status[index].checked
        ? (this.isShowRMB = true)
        : (this.isShowRMB = false);
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
      // await this.getMaxMinDate();
      this.handleText();
      await this.mainGetChartsData();
    },
    handleText() {
      let keys = ["USD", "RMB"];
      for (let i = 0; i < keys.length; i++) {
        if (this.activeKey == "yearly") {
          this[keys[i]].series[0].name = "进口_Import|进口同比_Y-o-y import";
          this[keys[i]].series[1].name = "出口_Export|出口同比_Y-o-y export";
          this[keys[i]].series[2].name =
            "进出口_Monthly trade|进出口同比_Y-o-y trade";
        }
        if (this.activeKey == "monthly") {
          if (this.selectOption.value.id == 1) {
            this[keys[i]].series[0].name =
              "当月进口_Monthly import|当月进口同比_Y-o-y monthly import";
            this[keys[i]].series[1].name =
              "当月出口_Monthly export|当月出口同比_Y-o-y monthly export";
            this[keys[i]].series[2].name =
              "当月进出口_Trade volume|当月进出口同比_Y-o-y monthly trade";
          }
          if (this.selectOption.value.id == 2) {
            this[keys[i]].series[0].name =
              "累计进口_Cumulative monthly import|累计进口同比_Y-o-y cumulative monthly import";
            this[keys[i]].series[1].name =
              "累计出口_Cumulative monthly export|累计出口同比_Y-o-y cumulative monthly export";
            this[keys[i]].series[2].name =
              "累计进出口_Cumulative monthly trade|累计进出口同比_Y-o-y cumulative monthly trade";
          }
        }
      }
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
