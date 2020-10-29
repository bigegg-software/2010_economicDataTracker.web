<template>
  <!-- 中国对外直接投资流量chart-->
  <div class="outflows-chart">
    <div class="echart-block">
      <div v-if="isShowTable" class="table-block"></div>
      <div class="container">
        <lines-chart :options="USD"></lines-chart>
      </div>
      <div v-if="isShowRMB" class="container">
        <lines-chart :options="RMB"></lines-chart>
      </div>
    </div>
    <div class="select-block">
      <div class="frame">
        <time-frame
          v-if="showTimeFrame"
          :options="options"
          @change="change"
          @update="update"
        ></time-frame>
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
import dayjs from "dayjs";
import TimeFrame from "@/components/timeFrame/TimeFrame";
import CheckBox from "@/components/select/selectCheckBox/CheckBox";
import LinesChart from "@/components/charts/Lines";
import { objArrtransArr } from "@/utils/echarts";
import request from "@/request/outBound/outflows";
import chartDataFun from "@/utils/chartDataFun";
export default {
  props: {
    isShowTable: {}
  },
  components: {
    TimeFrame,
    CheckBox,
    LinesChart
  },
  name: "outflowsChart",
  data() {
    return {
      timer: null,
      showTimeFrame: false,
      maxmindate: "",
      isShowRMB: false,
      RMB: {
        id: "RMB",
        yName: { ch: "百万人民币", en: "RMB min" },
        yearOnYear: false, //通过修改这个值来显示同比
        title: { ch: "中国对外直接投资流量", en: "China's FDI outflows" },
        xData: [],
        series: [
          {
            name: "中国对外全行业直接投资_xxx",
            color: "#6AA3CD",
            data: [],
            yearOnYear: []
          },
          {
            name: "中国对外非金融类直接投资_xxx",
            color: "#FF0000",
            data: [],
            yearOnYear: []
          }
        ]
      },
      USD: {
        id: "USD",
        yName: { ch: "百万美元", en: "USD min" },
        yearOnYear: false, //通过修改这个值来显示同比
        title: { ch: "中国对外直接投资流量", en: "China's FDI outflows" },
        xData: [],
        series: [
          {
            name: "中国对外全行业直接投资_xxx",
            color: "#6AA3CD",
            data: [],
            yearOnYear: []
          },
          {
            name: "中国对外非金融类直接投资_xxx",
            color: "#FF0000",
            data: [],
            yearOnYear: []
          }
        ]
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
          en: "yearly",
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
        quarterly: {
          ch: "季度",
          en: "quarterly",
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
          en: "monthly",
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
  async mounted() {
    let res = await this.getMaxMinDate();
    let arrmaxmin = res.split("_");
    await this.getChartsData({
      type: "yearly",
      start: Number(arrmaxmin[0]),
      end: Number(arrmaxmin[1])
    });
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
      let res = await chartDataFun.getMaxMinDate("FDIOutflow");
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
    async getItemCategoryData(
      allIndustry,
      nonFinancial,
      XNameAttr,
      dataAttr,
      range
    ) {
      //全行业
      let data = await this.getItemData(
        allIndustry,
        XNameAttr,
        dataAttr,
        range
      );
      this.USD.series[0]["data"] = data.investConversionMillion;
      this.USD.series[0]["yearOnYear"] = data.conversionYOY;
      this.RMB.series[0]["data"] = data.investAmountMillion;
      this.RMB.series[0]["yearOnYear"] = data.yOY;
      //非金融
      let nondata = await this.getItemData(
        nonFinancial,
        XNameAttr,
        dataAttr,
        range
      );
      this.USD.series[1]["data"] = nondata.investConversionMillion;
      this.USD.series[1]["yearOnYear"] = nondata.conversionYOY;
      this.RMB.series[1]["data"] = nondata.investAmountMillion;
      this.RMB.series[1]["yearOnYear"] = nondata.yOY;
      //
    },
    async getChartsData(aug) {
      //改变横轴 获取数据
      let { allIndustry, nonFinancial } = await request.getChartsData(aug);
      // 完整的区间
      let range = await chartDataFun.getXRange(aug);
      // 要换取纵轴数据的字段属性
      let dataAttr = [
        "investConversionMillion",
        "conversionYOY",
        "investAmountMillion",
        "yOY"
      ];
      let XNameAttr = "year";
      this.USD.xData = range;
      this.RMB.xData = range;
      console.log(allIndustry, nonFinancial);
      //添加额外的Q和M属性
      await chartDataFun.addOtherCategory(allIndustry);
      await chartDataFun.addOtherCategory(nonFinancial);

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
      await this.getItemCategoryData(
        allIndustry,
        nonFinancial,
        XNameAttr,
        dataAttr,
        range
      );
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
      console.log("change");
      let list = JSON.parse(JSON.stringify(this.options[activeKey].list));
      let start =
        key == "start" ? dayjs(`${value}`) : dayjs(`${list.start.value}`);
      let end = key == "end" ? dayjs(`${value}`) : dayjs(`${list.end.value}`);
      if (end.isBefore(start)) {
        return console.log("开始时间不得大于结束时间");
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
    }
  }
};
</script>

<style lang="less" scoped>
.outflows-chart {
  display: flex;
  .echart-block {
    position: relative;
    width: 77%;
    height: auto;
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
    // border-right: none;
    .container {
      width: 100%;
      height: 3.458333rem;
    }
  }
  .select-block {
    width: 23%;
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
