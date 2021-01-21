<template>
  <!-- 中国货物进出口总值按国别/地区统计chart -->
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
        <bar-line v-if="!isShowTable" ref="barLine" :options="USD" :selectOption="checkBox"></bar-line>
      </div>
    </div>
    <div :class="$store.state.fullScreen.isFullScreen==false?'fullselect-block':'select-block'">
      <div class="frame">
        <time-frame
          :options="options"
          @change="change"
          @update="update"
          @changeActiveKey="changeActiveKey"
        ></time-frame>
      </div>
      <!-- 筛选国家 -->
      <div class="status">
        <SelectRadioBySearch
          :option="checkBox"
          :result="checkBox.value"
          @changeInputValue="changeInputValue"
          @changeRadio="changeRadioBySearch"
        ></SelectRadioBySearch>
      </div>
      <div class="status">
        <SelectRadio
          v-if="this.activeKey == 'monthly'"
          :option="selectOption"
          :value="selectOption.value"
          @change="changeRadioSelect($event)"
        ></SelectRadio>
      </div>
    </div>
  </div>
</template>

<script>
import dayjs from "dayjs";
import TimeFrame from "@/components/timeFrame/TimeFrame";
import BarLine from "@/components/charts/BarLine";
import request from "@/request/goodsTrade/goodsTrade";
import SelectRadio from "@/components/select/SelectRadio";
import chartDataFun from "@/utils/chartDataFun";
import TableChart from "@/components/charts/TableChart";
import SelectRadioBySearch from "@/components/select/selectRadioBySearch/SelectRadioBySearch";

export default {
  props: {
    isShowTable: {},
    describeData: {}
  },
  components: {
    TimeFrame,
    BarLine,
    TableChart,
    SelectRadio,
    SelectRadioBySearch
  },
  name: "TradeByOrigin",
  data() {
    return {
      activeKey: "yearly",
      tableName: {
        yearly: "ImportExportOrigin",
        monthly: "ImportExportOriginMonth"
      },
      totalData: {
        title: {
          ch: "",
          en: ""
        },
        unit: {
          ch: "百万美元",
          en: "USD mln"
        },
        tableTitle: {},
        tableData: [],
        updatedDate: ""
      },
      timer: null,
      USD: {
        id: "USD",
        dataSources: this.describeData,
        yName: { ch: "百万美元", en: "USD mln" },
        yearOnYear: true, //通过修改这个值来显示同比
        title: {
          ch: "",
          en: ""
        },
        xData: [],
        grid: {
          bottom: "10%",
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
            name: "进出口_Trade|进出口同比_Y-o-y trade",
            color: "#91c7ae",
            data: [],
            yearOnYear: []
          }
        ],
        updatedDate: ""
      },
      searchValue: "",
      checkBox: {
        ch: "国家/地区",
        en: "Country/ region",
        value: {
          ch: "中国香港",
          en: "Hong Kong, China"
        },
        op: []
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
    },
    checkBox: {
      handler() {
        this.totalData.title.ch = this.USD.title.ch = `中国与${this.checkBox.value.ch}货物进出口总值`;
        this.totalData.title.en = this.USD.title.en = `China's trade in goods with ${this.checkBox.value.en}`;
      },
      deep: true
    }
  },
  async created() {
    await this.getMaxMinDate();
    await this.getCountryList();
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
          noMonth: true,
          equalTo: {
            country: this.checkBox.value.ch
          }
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
          dataType: this.selectOption.value.id, // 1当月 / 2累计
          equalTo: {
            country: this.checkBox.value.ch
          }
        });
      }
    },
    // 获取最大年最小年
    async getMaxMinDate() {
      let yearly = await chartDataFun.getMaxMinDate(this.tableName["yearly"]);
      let monthly = await chartDataFun.getMaxMinDate(this.tableName["monthly"]);
      let arrmaxmin_yearly = yearly.Y.split("_");
      let arrmaxmin_monthly = monthly.Y.split("_");
      let arrmaxmin_monthlyM = monthly.M.split("_");
      //
      let obj_yearly = JSON.parse(JSON.stringify(this.options["yearly"]));
      for (let k in obj_yearly.list) {
        obj_yearly.list[k].frame = yearly.Y;
      }
      this.$set(this.options, "yearly", obj_yearly);
      this.options.yearly.list.start.value = arrmaxmin_yearly[1] - 4;
      this.options.yearly.list.end.value = arrmaxmin_yearly[1];
      //
      let obj_monthly = JSON.parse(JSON.stringify(this.options["monthly"]));
      for (let k in obj_monthly.list) {
        obj_monthly.list[k].frame = monthly.Y;
      }
      this.$set(this.options, "monthly", obj_monthly);
      let QMDefaultTime = await chartDataFun.getQMDefaultTime(
        arrmaxmin_monthly[1],
        arrmaxmin_monthlyM[1],
        1
      );
      this.options.monthly.list.start.value = QMDefaultTime.M.start_beforeSix;
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
      if (this.activeKey == "yearly") {
        this.USD.series[0]["data"] = data.import;
        this.USD.series[0]["yearOnYear"] = data.yoyImport;
        this.USD.series[1]["data"] = data.export;
        this.USD.series[1]["yearOnYear"] = data.yoyExport;
        this.USD.series[2]["data"] = data.trade;
        this.USD.series[2]["yearOnYear"] = data.yoyTrade;
      }
      if (this.activeKey == "monthly") {
        if (this.selectOption.value.id == 1) {
          this.USD.series[0]["data"] = data._import;
          this.USD.series[0]["yearOnYear"] = [];
          this.USD.series[1]["data"] = data._export;
          this.USD.series[1]["yearOnYear"] = [];
          this.USD.series[2]["data"] = data._trade;
          this.USD.series[2]["yearOnYear"] = [];
        }
        if (this.selectOption.value.id == 2) {
          this.USD.series[0]["data"] = data._cumulativeImport;
          this.USD.series[0]["yearOnYear"] = data.yoyCumulativeImport;
          this.USD.series[1]["data"] = data._cumulativeExport;
          this.USD.series[1]["yearOnYear"] = data.yoyCumulativeExport;
          this.USD.series[2]["data"] = data._cumulativeTrade;
          this.USD.series[2]["yearOnYear"] = data.yoyCumulativeTrade;
        }
      }
    },
    async getChartsData(aug) {
      await this.setTableConfig(aug);
      let data;
      let dataAttr;
      let range;
      if (this.activeKey == "yearly") {
        data = await request.getImportExportOrigin(aug);
        dataAttr = [
          "trade",
          "yoyTrade",
          "import",
          "yoyImport",
          "export",
          "yoyExport"
        ];
        range = await chartDataFun.getXRange(aug);
      }
      if (this.activeKey == "monthly") {
        data = await request.getImportExportOriginMonth(aug);
        // 当月 // 'yoyTrade', 'yoyImport', 'yoyExport'
        if (this.selectOption.value.id == 1) {
          dataAttr = ["_trade", "_import", "_export"];
          range = await chartDataFun.getXRangeCurrentMonth(aug);
        }
        // 累计
        if (this.selectOption.value.id == 2) {
          dataAttr = [
            "_cumulativeTrade",
            "yoyCumulativeTrade",
            "_cumulativeImport",
            "yoyCumulativeImport",
            "_cumulativeExport",
            "yoyCumulativeExport"
          ];
          range = await chartDataFun.getXRange(aug);
        }
      }
      let XNameAttr = "year";
      this.USD.xData = range;
      this.USD.updatedDate = this.$store.getters.latestTime;
      this.totalData.updatedDate = this.$store.getters.latestTime;
      //   //添加额外的Q和M属性
      if (aug.type == "yearly") {
        XNameAttr = "year";
        await chartDataFun.addOtherCategory(data);
      }
      if (aug.type == "monthly") {
        XNameAttr = "M";
        if (this.selectOption.value.id == 1) {
          await chartDataFun.addOtherCategoryCurrentMonth(data);
        }
        if (this.selectOption.value.id == 2) {
          await chartDataFun.addOtherCategory(data);
        }
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
          trade: {
            text: "进出口_Trade",
            width: "20%",
            formatNum: true
          },
          yoyTrade: {
            text: "进出口同比_Y-o-y trade",
            width: "20%",
            formatPer: true
          },
          import: {
            text: "进口_Import",
            width: "20%",
            formatNum: true
          },
          yoyImport: {
            text: "进口同比_Y-o-y import",
            width: "20%",
            formatPer: true
          },
          export: {
            text: "出口_Export",
            width: "20%",
            formatNum: true
          },
          yoyExport: {
            text: "出口同比_Y-o-y export",
            width: "20%",
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
            _trade: {
              text: "当月进出口_Monthly trade",
              width: "25%",
              formatNum: true
            },
            _import: {
              text: "当月进口_Monthly import",
              width: "20%",
              formatNum: true
            },
            _export: {
              text: "当月出口_Monthly export",
              width: "20%",
              formatNum: true
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
            _cumulativeTrade: {
              text: "累计进出口_Cumulative monthly trade",
              width: "25%",
              formatNum: true
            },
            yoyCumulativeTrade: {
              text: "累计进出口同比_Y-o-y cumulative monthly trade",
              width: "25%",
              formatPer: true
            },
            _cumulativeImport: {
              text: "累计进口_Cumulative monthly import",
              width: "20%",
              formatNum: true
            },
            yoyCumulativeImport: {
              text: "累计进口同比_Y-o-y cumulative monthly import",
              width: "20%",
              formatPer: true
            },
            _cumulativeExport: {
              text: "累计出口_Cumulative monthly export",
              width: "20%",
              formatNum: true
            },
            yoyCumulativeExport: {
              text: "累计出口同比_Y-o-y cumulative monthly export",
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
    // 获取国家列表
    async getCountryList() {
      let countryList = await request.getCountryList(
        this.searchValue,
        this.activeKey
      );
      this.checkBox.op = countryList;
    },
    // 搜索国家
    changeInputValue(val) {
      this.searchValue = val;
      this.getCountryList();
    },
    // 选择国家
    changeRadioBySearch(val) {
      this.checkBox.value = val;
      this.mainGetChartsData();
    },
    //选择当月或累计月份
    changeRadioSelect(item) {
      this.selectOption.value = item;
      this.handleText();
      this.mainGetChartsData();
    },
    // 改变年度季度月度时：
    async changeActiveKey(activeKey) {
      this.activeKey = activeKey;
      await this.getCountryList();
      this.handleText();
      await this.mainGetChartsData(activeKey);
    },
    handleText() {
      if (this.activeKey == "yearly") {
        this.USD.series[0].name = "进口_Import|进口同比_Y-o-y import";
        this.USD.series[1].name = "出口_Export|出口同比_Y-o-y export";
        this.USD.series[2].name = "进出口_Monthly trade|进出口同比_Y-o-y trade";
      }
      if (this.activeKey == "monthly") {
        if (this.selectOption.value.id == 1) {
          this.USD.series[0].name = "当月进口_Monthly import|";
          this.USD.series[1].name = "当月出口_Monthly export|";
          this.USD.series[2].name = "当月进出口_Trade volume|";
        }
        if (this.selectOption.value.id == 2) {
          this.USD.series[0].name =
            "累计进口_Cumulative monthly import|累计进口同比_Y-o-y cumulative monthly import";
          this.USD.series[1].name =
            "累计出口_Cumulative monthly export|累计出口同比_Y-o-y cumulative monthly export";
          this.USD.series[2].name =
            "累计进出口_Cumulative monthly trade|累计进出口同比_Y-o-y cumulative monthly trade";
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
    
  }.frame {
      padding: 0.104167rem;
      border-bottom: 1.5px solid #cacaca;
    }
    .status {
      padding: 0.104167rem;
    }
}
</style>
