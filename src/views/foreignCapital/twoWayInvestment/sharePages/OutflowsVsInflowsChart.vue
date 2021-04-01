<template>
  <!-- 双向直接投资chart-->
  <div class="outflows-chart">
    <div class="echart-block">
      <div v-if="isShowTable" class="table-block">
        <TableChart :totalData="totalData"></TableChart>
      </div>
      <!-- <div v-if="isShowTable" class="table-block"></div> -->
      <div
        :class="
          $store.state.fullScreen.isFullScreen == false
            ? 'fullContainer'
            : 'container'
        "
        v-show="!isShowRMB"
      >
        <lines-chart v-if="!isShowRMB && !isShowTable" ref="linesChart" :options="USD"></lines-chart>
      </div>
      <div
        :class="
          $store.state.fullScreen.isFullScreen == false
            ? 'fullContainer'
            : 'container'
        "
        v-show="isShowRMB"
      >
        <lines-chart v-if="isShowRMB && !isShowTable" ref="lines2Chart" :options="RMB"></lines-chart>
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
      <div v-if="activeKey != 'yearly'" class="status">
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
import dayjs from "dayjs";
import TimeFrame from "@/components/timeFrame/TimeFrame";
import CheckBox from "@/components/select/selectCheckBox/CheckBox";
import LinesChart from "@/components/charts/Lines";
import request from "@/request/twoWayInvestment/twoWayInvestment";
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
    LinesChart,
    TableChart
  },
  name: "outflowsChart",
  data() {
    return {
      totalData: {
        title: {
          ch: "双向直接投资",
          en: "FDI outflows vs. actual use of foreign capital"
        },
        unit: {
          ch: "百万美元",
          en: "USD mln"
        },
        tableTitle: {
          year: {
            text: "年份_Year",
            width: "20%"
          },
          outward_FDI_flows: {
            text: "对外直接投资流量_FDI outflows",
            width: "40%",
            formatNum: true
          },
          inward_FDI_flows: {
            text: "实际使用外资_Actual use of foreign capital",
            width: "40%",
            formatNum: true
          }
        },
        tableData: [],
        updatedDate: ""
      },
      timer: null,
      showTimeFrame: false,
      isShowRMB: false,
      activeKey: "yearly",
      RMB: {
        id: "RMB",
        dataSources: this.describeData,
        yearOnYear: false, //通过修改这个值来显示同比
        yName: { ch: "百万美元", en: "USD mln" },
        title: {
          ch: "双向直接投资",
          en: "FDI outflows vs. actual use of foreign capital"
        },
        grid: {
          bottom: "18%",
          enGapch: this.$fz(0.58) //数据来源中英文间距
        },
        xData: [],
        series: [
          {
            name:
              "实际使用外资_Actual use of foreign capital|实际使用外资同比_Y-o-y actual use of foreign capital",
            color: "#6AA3CD",
            data: [],
            yearOnYear: []
          },
          {
            name:
              "对外直接投资流量_FDI outflows|对外直接投资流量同比_Y-o-y FDI outflows",
            color: "#d43838",
            data: [],
            yearOnYear: []
          }
        ],
        updatedDate: "",
        legendMark: {
          //右上角水印
          en: "Y-o-y",
          ch: "同比",
          doSymbol: "(%)"
        }
      },
      USD: {
        id: "USD",
        dataSources: this.describeData,
        yName: { ch: "百万美元", en: "USD mln" },
        title: {
          ch: "双向直接投资",
          en: "FDI outflows vs. actual use of foreign capital"
        },
        xData: [],
        grid: {
          bottom: "18%",
          enGapch: this.$fz(0.58) //数据来源中英文间距
        },
        bottomDistance: this.$fz(0.15),
        series: [
          {
            name:
              "实际使用外资_Actual use of foreign capital|实际使用外资同比_Y-o-y actual use of foreign capital",
            color: "#6AA3CD",
            data: []
          },
          {
            name:
              "对外直接投资流量_FDI outflows|对外直接投资流量同比_Y-o-y FDI outflows",
            color: "#d43838",
            data: []
          }
        ],
        updatedDate: ""
      },
      status: [
        {
          checked: false,
          ch: "同比",
          en: "Year on year"
        }
      ],
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
        quarterly: {
          ch: "季度",
          en: "Quarterly",
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
    let res = await this.getMaxMinDate();
    let resQM = await this.getMaxMinDateQM();
    this.$store.commit("setDBMinMaxDateQM", resQM);
    let arrmaxmin = res.Y.split("_");
    this.options.yearly.list.start.value = arrmaxmin[0];
    this.options.yearly.list.end.value = arrmaxmin[1];
    await this.getChartsData({
      noMonth: true,
      type: "yearly",
      start: Number(arrmaxmin[0]),
      end: Number(arrmaxmin[1])
    });
  },
  mounted() {
    this.$EventBus.$on("downLoadImg", () => {
      this.$refs.linesChart && this.$refs.linesChart.downloadFile();
      this.$refs.lines2Chart && this.$refs.lines2Chart.downloadFile();
    });
  },
  beforeDestroy() {
    this.$EventBus.$off("downLoadImg");
  },
  methods: {
    async mainGetChartsData(type) {
      //条件改变时获取数据
      let { start, end } = this.options[type].list;
      await this.getChartsData({
        noMonth: true,
        type,
        start: Number(start.value),
        end: Number(end.value)
      });
    },
    async getMaxMinDate() {
      // 获取最大年最小年
      let res = await chartDataFun.getMaxMinDate("FDIOutflowsInflows");
      let obj = JSON.parse(JSON.stringify(this.options["yearly"]));
      for (let k in obj.list) {
        obj.list[k].frame = res.Y;
      }
      this.$set(this.options, "yearly", obj);
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
      let data = await this.getItemData(res, XNameAttr, dataAttr, range);
      this.USD.series[1]["data"] = data.outward_FDI_flows;
      this.USD.series[0]["data"] = data.inward_FDI_flows;

      //
    },
    updateTableTitle(type) {
      switch (type) {
        case 1:
          this.totalData.tableTitle = {
            year: {
              text: "年份_Year",
              width: "20%"
            },
            outward_FDI_flows: {
              text: "对外直接投资流量_FDI outflows",
              width: "40%",
              formatNum: true
            },
            inward_FDI_flows: {
              text: "实际使用外资_Actual use of foreign capital",
              width: "40%",
              formatNum: true
            }
          };
          break;
        case 2:
          this.totalData.tableTitle = {
            year: {
              text: "年份_Year",
              width: "10%"
            },
            month: {
              text: "月份_Month",
              width: "10%"
            },
            inwardFDIConMillion: {
              text: "实际使用外资_Actual use of foreign capital",
              width: "20%",
              formatNum: true
            },
            inwardFDIConYOY: {
              text: "实际使用外资同比_Y-o-y actual use of foreign capital",
              width: "20%",
              formatPer: true
            },
            investConversionMillion: {
              text: "对外直接投资流量_FDI outflows",
              width: "20%",
              formatNum: true
            },
            conversionYOY: {
              text: "对外直接投资流量同比_Y-o-y FDI outflows",
              width: "20%",
              formatPer: true
            }
          };
          break;
      }
    },
    async getChartsData(aug) {
      this.updateTableTitle(1);
      //改变横轴 获取数据
      let { res } = await request.getOutflowsVsInflowsChartData(aug);

      // 完整的区间
      let range = await chartDataFun.getXRange(aug);
      // 要换取纵轴数据的字段属性
      let dataAttr = ["outward_FDI_flows", "inward_FDI_flows"];
      let XNameAttr = "year";
      this.USD.xData = range;
      this.USD.updatedDate = this.$store.getters.latestTime;
      this.totalData.updatedDate = this.$store.getters.latestTime;
      // 获取当前页面所有线
      await this.getItemCategoryData(res, XNameAttr, dataAttr, range);
    },
    // 季度，月度当逻辑空间
    async mainGetChartsDataQM(type) {
      //条件改变时获取数据
      let { start, end } = this.options[type].list;
      if (type == "quarterly" || type == "monthly") {
        let startTimeArr = start.value.split("-");
        let endTimeArr = end.value.split("-");
        let quarterStart = parseInt(startTimeArr[0]);
        let quarterStartMonth = parseInt(startTimeArr[1]);
        let quarterEnd = parseInt(endTimeArr[0]);
        let quarterEndMonth = parseInt(endTimeArr[1]);
        await this.getChartsDataQM({
          type,
          start: quarterStart,
          end: quarterEnd,
          startMonth: quarterStartMonth,
          endMonth: quarterEndMonth
        });
      }
    },
    async getMaxMinDateQM() {
      // 获取最大年最小年
      let Inres = await chartDataFun.getMaxMinDate("InwardFDI");
      let allIndustryres = await chartDataFun.getMaxMinDate("FDIOutflow");
      let res = {};
      let start =
        (await Number(Inres.Y.split("_")[0])) -
          Number(allIndustryres.Y.split("_")[0]) >=
        0
          ? allIndustryres.Y.split("_")[0]
          : Inres.Y.split("_")[0];
      let end =
        (await Number(Inres.Y.split("_")[1])) -
          Number(allIndustryres.Y.split("_")[1]) >=
        0
          ? Inres.Y.split("_")[1]
          : allIndustryres.Y.split("_")[1];

      let startM =
        (await Number(Inres.M.split("_")[0])) -
          Number(allIndustryres.M.split("_")[0]) >=
        0
          ? allIndustryres.M.split("_")[0]
          : Inres.M.split("_")[0];
      let endM =
        (await Number(Inres.M.split("_")[1])) -
          Number(allIndustryres.M.split("_")[1]) >=
        0
          ? Inres.M.split("_")[1]
          : allIndustryres.M.split("_")[1];

      res = { Y: `${start}_${end}`, M: `${startM}_${endM}` };
      for (let key in this.options) {
        let obj = JSON.parse(JSON.stringify(this.options[key]));
        for (let k in obj.list) {
          obj.list[k].frame = res.Y;
        }
        let QMDefaultTime = await chartDataFun.getQMDefaultTime(end, endM, 1);
        if (key == "quarterly") {
          obj.list.start.value = QMDefaultTime.Q.start;
          obj.list.end.value = QMDefaultTime.Q.end;
          this.$set(this.options, "quarterly", obj);
        } else if (key == "monthly") {
          obj.list.start.value = QMDefaultTime.M.start;
          obj.list.end.value = QMDefaultTime.M.end;
          this.$set(this.options, "monthly", obj);
        }
      }
      this.showTimeFrame = true;
      return res;
    },
    async getItemDataQM(arrSourceData, Axis, Ayis, range) {
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
    async getItemCategoryDataQM(
      res,
      allIndustry,
      XNameAttr,
      dataAttr,
      IndustryDataAttr,
      range
    ) {
      let data = await this.getItemDataQM(res, XNameAttr, dataAttr, range);
      this.RMB.series[0]["data"] = data.inwardFDIConMillion;
      this.RMB.series[0]["yearOnYear"] = data.inwardFDIConYOY;
      let allIndustrydata = await this.getItemDataQM(
        allIndustry,
        XNameAttr,
        IndustryDataAttr,
        range
      );
      console.log(allIndustrydata,55)
      this.RMB.series[1]["data"] = allIndustrydata.investConversionMillion;
      this.RMB.series[1]["yearOnYear"] = allIndustrydata.conversionYOY;
    },
    async getChartsDataQM(aug) {
      this.updateTableTitle(2);
      //改变横轴 获取数据
      let {
        allIndustry,
        res
      } = await request.getQuarterMonthOutflowsVsInflowsChartData(aug);
      // 完整的区间
      let range = await chartDataFun.getXRange(aug);
      // 要换取纵轴数据的字段属性
      let IndustryDataAttr = ["investConversionMillion", "conversionYOY"];
      let dataAttr = ["inwardFDIConMillion", "inwardFDIConYOY"];
      let XNameAttr = "year";
      this.RMB.xData = range;
      this.RMB.updatedDate = this.$store.getters.latestTime;
      this.totalData.updatedDate = this.$store.getters.latestTime;
      //添加额外的Q和M属性
      await chartDataFun.addOtherCategory(allIndustry);
      await chartDataFun.addOtherCategory(res);

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
      await this.getItemCategoryDataQM(
        res,
        allIndustry,
        XNameAttr,
        dataAttr,
        IndustryDataAttr,
        range
      );
    },
    // 季度，月度当逻辑空间结束
    // 时间范围组件 update and change
    update(activeKey, value) {
      this.options[activeKey].list.start.value = value[0];
      this.options[activeKey].list.end.value = value[1];
      this.activeKey = activeKey;
      if (this.activeKey == "yearly") {
        clearTimeout(this.timer);
        this.timer = setTimeout(() => {
          // 条件改变时获取数据数据入口  zp
          this.mainGetChartsData(activeKey);
        }, 600);
      } else {
        clearTimeout(this.timer);
        this.timer = setTimeout(() => {
          // 条件改变时获取数据数据入口  zp
          this.mainGetChartsDataQM(activeKey);
        }, 600);
      }
    },
    // 改变年度季度月度时：
    async changeActiveKey(ev) {
      this.activeKey = ev;
      if (ev == "quarterly" || ev == "monthly") {
        this.isShowRMB = true;
        await this.mainGetChartsDataQM(ev);
      } else {
        this.isShowRMB = false;
        await this.getChartsData({
          noMonth: true,
          type: "yearly",
          start: Number(this.options.yearly.list.start.value),
          end: Number(this.options.yearly.list.end.value)
        });
      }
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
        if (this.activeKey == "yearly") {
          this.mainGetChartsData(activeKey);
        } else {
          this.mainGetChartsDataQM(activeKey);
        }
      }
    },
    // 复选框
    changeSelect(index) {
      this.status[index].checked = !this.status[index].checked;
      if (index == 0) {
        this.status[index].checked
          ? (this.RMB.yearOnYear = true)
          : (this.RMB.yearOnYear = false);
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
