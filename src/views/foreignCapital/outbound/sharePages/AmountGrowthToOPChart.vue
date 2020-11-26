<template>
  <!-- 中国对外承包工程完成营业额chart -->
  <div class="outflows-chart">
    <div class="echart-block">
      <div v-if="isShowTable" class="table-block">
        <TableChart :totalData="totalData"></TableChart>
      </div>
      <div :class="$store.state.fullScreen.isFullScreen==false?'fullContainer':'container'">
        <lines-chart v-if="!isShowTable" ref="linesChart" :options="USD"></lines-chart>
      </div>
      <div
        v-if="isShowRMB &&!isShowTable"
        :class="$store.state.fullScreen.isFullScreen==false?'fullContainer':'container'"
      >
        <lines-chart :options="RMB"></lines-chart>
      </div>
    </div>
    <div class="select-block">
      <div class="frame">
        <time-frame v-if="showTimeFrame" :options="options" @change="change" @update="update" @changeActiveKey="changeActiveKey"></time-frame>
      </div>
      <div class="status" v-if="$store.getters.showOperate">
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
import request from "@/request/outBound/outBound";
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
          ch: "中国对外承包工程完成营业额",
          en: "Revenue of completed contract from China's overseas projects"
        },
        unit: {
          ch: "百万美元/百万人民币",
          en: "USD min/RMB min"
        },
        tableTitle: {},
        tableData: [],
        updatedDate: ""
      },
      timer: null,
      showTimeFrame: false,
      isShowRMB: false,
      RMB: {
        id: "RMB",
        dataSources: this.describeData,
        yName: { ch: "百万人民币", en: "RMB min" },
        yearOnYear: false, //通过修改这个值来显示同比
        title: {
          ch: "中国对外承包工程完成营业额",
          en: "Revenue of completed contract from China's overseas projects"
        },
        xData: [],
        hideLegend: true,
        spliceCon: {
          // toolTip里面插入同比和同比英文
          ch: "同比",
          en: "year on year"
        },
        series: [
          {
            name: "完成营业额_Total value of new contract y-o-y growth ",
            color: "#6AA3CD",
            data: [],
            yearOnYear: []
          }
        ],
        updatedDate: ""
      },
      USD: {
        id: "USD",
        dataSources: this.describeData,
        yName: { ch: "百万美元", en: "USD min" },
        yearOnYear: false, //通过修改这个值来显示同比
        title: {
           ch: "中国对外承包工程完成营业额",
          en: "Revenue of completed contract from China's overseas projects"
        },
        xData: [],
        hideLegend: true,
        spliceCon: {
          // toolTip里面插入同比和同比英文
          ch: "同比",
          en: "year on year"
        },
        series: [
          {
            name: "完成营业额_Total value of new contract y-o-y growth ",
            color: "#6AA3CD",
            data: [],
            yearOnYear: []
          }
        ],
        updatedDate: ""
      },
      status: [
        {
          checked: false,
          ch: "同比",
          en: "Year on year"
        },
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
        // quarterly: {
        //   ch: "季度",
        //   en: "Quarterly",
        //   list: {
        //     start: {
        //       ch: "开始",
        //       en: "Start",
        //       frame: "",
        //       value: ""
        //     },
        //     end: {
        //       ch: "结束",
        //       en: "End",
        //       frame: "",
        //       value: ""
        //     }
        //   }
        // },
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
    let res = await this.getMaxMinDate();
    let arrmaxmin = res.split("_");
    this.options.yearly.list.start.value = arrmaxmin[0];
    this.options.yearly.list.end.value = arrmaxmin[1];
    // 初始化日期月度季度赋值
    let QMDefaultTime=await chartDataFun.getQMDefaultTime(arrmaxmin[1],1);
    // this.options.quarterly.list.start.value=QMDefaultTime.Q.start;
    // this.options.quarterly.list.end.value=QMDefaultTime.Q.end;
    this.options.monthly.list.start.value=QMDefaultTime.M.start;
    this.options.monthly.list.end.value=QMDefaultTime.M.end;
    await this.getChartsData({
      type: "yearly",
      start: Number(arrmaxmin[0]),
      end: Number(arrmaxmin[1])
    });
  },
  mounted() {
    this.$EventBus.$on("downLoadImg", () => {
      this.$refs.linesChart.downloadFile();
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
          end: Number(end.value)
        });
      } else if (type == "quarterly" || type == "monthly") {
        let startTimeArr = start.value.split("-");
        let endTimeArr = end.value.split("-");
        let quarterStart = parseInt(startTimeArr[0]);
        let quarterStartMonth = parseInt(startTimeArr[1]);
        let quarterEnd = parseInt(endTimeArr[0]);
        let quarterEndMonth = parseInt(endTimeArr[1]);
        await this.getChartsData({
          type,
          start: quarterStart,
          end: quarterEnd,
          startMonth: quarterStartMonth,
          endMonth: quarterEndMonth
        });
      }
    },
    async getMaxMinDate() {
      // 获取最大年最小年
      let res = await chartDataFun.getMaxMinDate("ForeignContract");
      for (let key in this.options) {
        let obj = JSON.parse(JSON.stringify(this.options[key]));
        for (let k in obj.list) {
          obj.list[k].frame = res;
        }
        this.$set(this.options, key, obj);
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
      //全行业
      let data = await this.getItemData(res, XNameAttr, dataAttr, range);
      this.USD.series[0]["data"] = data.completedAmountConMillion;
      this.USD.series[0]["yearOnYear"] = data.completedAmountConYOY;
      this.RMB.series[0]["data"] = data.completedAmountMillion;
      this.RMB.series[0]["yearOnYear"] = data.completedAmountYOY;
      //
    },
    async getChartsData(aug) {
      await this.setTableConfig(aug);
      //改变横轴 获取数据
      let { res } = await request.getOverSeasProjectsChartsData(aug, 1);

      // 完整的区间
      let range = await chartDataFun.getXRange(aug);
      // 要换取纵轴数据的字段属性
      let dataAttr = [
        "completedAmountConMillion",
        "completedAmountConYOY",
        "completedAmountMillion",
        "completedAmountYOY"
      ];
      let XNameAttr = "year";
      this.USD.xData = range;
      this.RMB.xData = range;
      this.USD.updatedDate = this.$store.getters.latestTime;
      this.RMB.updatedDate = this.$store.getters.latestTime;
      this.totalData.updatedDate = this.$store.getters.latestTime;
      //添加额外的Q和M属性
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
      await this.getItemCategoryData(res, XNameAttr, dataAttr, range);
    },
    async setTableConfig(aug) {
         if(aug.type=='yearly'){
        this.totalData.tableTitle={
          year: {
            text: "年份_Year",
            width: "10%"
          },
          completedAmountCon: {
            text: "完成营业额(USD)_Revenue of completed contract",
            width: "25%",
            formatNum: true
          },
          completedAmountConYOY: {
            text: "完成营业额同比_Y-o-y growth of completed contract revenue",
            width: "25%",
            formatPer: true
          },
          completedAmount: {
            text: "完成营业额折合(RMB)_unit",
            width: "20%",
            formatNum: true
          },
          completedAmountYOY: {
            text: "完成营业额折合同比_type",
            width: "20%",
            formatPer: true
          }
        }
      }else{
        this.totalData.tableTitle={
          year: {
            text: "年份_Year",
            width: "10%"
          },
          month: {
            text: "月份_month",
            width: "20%"
          },
          completedAmountCon: {
            text: "完成营业额(USD)_Revenue of completed contract",
            width: "35%",
            formatNum: true
          },
          completedAmountConYOY: {
            text: "完成营业额同比_Y-o-y growth of completed contract revenue",
            width: "35%",
            formatPer: true
          },
          completedAmount: {
            text: "完成营业额折合(RMB)_unit",
            width: "35%",
            formatNum: true
          },
          completedAmountYOY: {
            text: "完成营业额折合同比_type",
            width: "35%",
            formatPer: true
          }
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
        this.$message.warn('开始时间不得大于结束时间');
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
    // 复选框
    changeSelect(index) {
      this.status[index].checked = !this.status[index].checked;
      if (index == 0) {
        this.status[index].checked
          ? (() => {
              this.$set(this.USD, "yearOnYear", true);
              this.$set(this.RMB, "yearOnYear", true);
            })()
          : (() => {
              this.$set(this.USD, "yearOnYear", false);
              this.$set(this.RMB, "yearOnYear", false);
            })();
      }
      if (index == 1) {
        this.status[index].checked
          ? (this.isShowRMB = true)
          : (this.isShowRMB = false);
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
