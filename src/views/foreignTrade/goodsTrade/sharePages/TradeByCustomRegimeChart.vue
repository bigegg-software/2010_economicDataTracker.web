<template>
  <!-- 货物进出口总值（贸易方式）chart -->
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
        <bar-line
          v-if="!isShowTable"
          ref="barLine"
          :options="USD"
          :selectOption="customRegime"
        ></bar-line>
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
      <div class="status">
        <SelectRadio
          :option="customRegime"
          :value="customRegime.value"
          @change="changeRadioSelectByCustomRegime($event)"
        ></SelectRadio>
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

export default {
  props: {
    isShowTable: {},
    describeData: {}
  },
  components: {
    TimeFrame,
    BarLine,
    TableChart,
    SelectRadio
  },
  name: "TradeByOrigin",
  data() {
    return {
      activeKey: "yearly",
      tableName: {
        yearly: "ImportExportCustomRegime",
        monthly: "ImportExportCustomRegime"
      },
      totalData: {
        title: {
          ch: "中国货物进出口总值按国别/地区统计",
          en: "China's import and export by origin"
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
          ch: "中国货物进出口总值按国别/地区统计",
          en: "China's import and export by origin"
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
      customRegime: {
        ch: "贸易方式",
        en: "Custom regime",
        value: {
          ch: "一般贸易",
          en: "Ordinary Trade"
        },
        op: chartDataFun.customRegime()
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
          noMonth: false
          // equalTo: {
          //   categoryZH: this.customRegime.value.ch
          // }
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
          // equalTo: {
          //   categoryZH: this.customRegime.value.ch
          // }
        });
      }
    },
    // 获取最大年最小年
    async getMaxMinDate() {
      let res = await chartDataFun.getMaxMinDate(
        this.tableName[this.activeKey]
      );
      let arrmaxmin = res.split("_");
      if (this.activeKey == "yearly") {
        let obj = JSON.parse(JSON.stringify(this.options["yearly"]));
        for (let k in obj.list) {
          obj.list[k].frame = res;
        }
        this.$set(this.options, "yearly", obj);
        this.options.yearly.list.start.value = arrmaxmin[1] - 5;
        this.options.yearly.list.end.value = arrmaxmin[1];
      }
      if (this.activeKey == "monthly") {
        let obj = JSON.parse(JSON.stringify(this.options["monthly"]));
        for (let k in obj.list) {
          obj.list[k].frame = res;
        }
        this.$set(this.options, "monthly", obj);
        let QMDefaultTime = await chartDataFun.getQMDefaultTime(
          arrmaxmin[1],
          1
        );
        this.options.monthly.list.start.value = QMDefaultTime.M.start;
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
    // 获取当前页面的每条线数据（按年度 季度 月度分）
    async getItemCategoryData(res, XNameAttr, dataAttr, range) {
      let data = await this.getItemData(res, XNameAttr, dataAttr, range);
      if (this.activeKey == "yearly") {
        this.USD.series[0]["data"] = data._cumulativeImport;
        this.USD.series[0]["yearOnYear"] = data.yoyCumulativeImport;
        this.USD.series[1]["data"] = data._cumulativeExport;
        this.USD.series[1]["yearOnYear"] = data.yoyCumulativeExport;
      }
      if (this.activeKey == "monthly") {
        if (this.selectOption.value.id == 1) {
          this.USD.series[0]["data"] = data._import;
          this.USD.series[0]["yearOnYear"] = [];
          this.USD.series[1]["data"] = data._export;
          this.USD.series[1]["yearOnYear"] = [];
        }
        if (this.selectOption.value.id == 2) {
          this.USD.series[0]["data"] = data._cumulativeImport;
          this.USD.series[0]["yearOnYear"] = data.yoyCumulativeImport;
          this.USD.series[1]["data"] = data._cumulativeExport;
          this.USD.series[1]["yearOnYear"] = data.yoyCumulativeExport;
        }
      }
    },
    async getChartsData(aug) {
      await this.setTableConfig(aug);
      let data;
      let dataAttr;
      if (this.activeKey == "yearly") {
        data = await request.getImportExportCustomRegime(aug);
        dataAttr = [
          "_cumulativeImport",
          "yoyCumulativeImport",
          "_cumulativeExport",
          "yoyCumulativeExport"
        ];
      }
      if (this.activeKey == "monthly") {
        data = await request.getImportExportCustomRegimeMonth(aug);
        // 当月
        if (this.selectOption.value.id == 1) {
          dataAttr = ["_import", "_export"];
        }
        // 累计
        if (this.selectOption.value.id == 2) {
          dataAttr = [
            "_cumulativeImport",
            "yoyCumulativeImport",
            "_cumulativeExport",
            "yoyCumulativeExport"
          ];
        }
      }
      // 完整的区间
      let range = await chartDataFun.getXRange(aug);
      let XNameAttr = "year";
      this.USD.xData = range;
      this.USD.updatedDate = this.$store.getters.latestTime;
      this.totalData.updatedDate = this.$store.getters.latestTime;
      //   //添加额外的Q和M属性
      await chartDataFun.addOtherCategory(data);
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
            width: "10%"
          },
          categoryZH: {
            text: "商品类别_Commodity section",
            width: "20%"
          },
          _cumulativeImport: {
            text: "进口_Import",
            width: "20%",
            formatNum: true
          },
          yoyCumulativeImport: {
            text: "进口同比_Y-o-y import",
            width: "20%",
            formatPer: true
          },
          _cumulativeExport: {
            text: "出口_Export",
            width: "20%",
            formatNum: true
          },
          yoyCumulativeExport: {
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
            categoryZH: {
              text: "商品类别_Commodity section",
              width: "20%"
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
            categoryZH: {
              text: "商品类别_Commodity section",
              width: "20%"
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
    //选择当月或累计月份
    changeRadioSelect(item) {
      this.selectOption.value = item;
      this.handleText();
      this.mainGetChartsData();
    },
    // 选择分类
    changeRadioSelectByCustomRegime(item) {
      this.customRegime.value = item;
      this.mainGetChartsData();
    },
    // 改变年度季度月度时：
    async changeActiveKey(activeKey) {
      this.activeKey = activeKey;
      await this.getMaxMinDate();
      this.handleText();
      await this.mainGetChartsData(activeKey);
    },
    handleText() {
      if (this.activeKey == "yearly") {
        this.USD.series[0].name = "进口_Import|进口同比_Y-o-y import";
        this.USD.series[1].name = "出口_Export|出口同比_Y-o-y export";
      }
      if (this.activeKey == "monthly") {
        if (this.selectOption.value.id == 1) {
          this.USD.series[0].name =
            "当月进口_Monthly import|当月进口同比_Y-o-y monthly import";
          this.USD.series[1].name =
            "当月出口_Monthly export|当月出口同比_Y-o-y monthly export";
        }
        if (this.selectOption.value.id == 2) {
          this.USD.series[0].name =
            "累计进口_Cumulative monthly import|累计进口同比_Y-o-y cumulative monthly import";
          this.USD.series[1].name =
            "累计出口_Cumulative monthly export|累计出口同比_Y-o-y cumulative monthly export";
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
