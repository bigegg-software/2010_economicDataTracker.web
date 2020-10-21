<template>
  <!-- 中国对外直接投资流量chart-->
  <div class="outflows-chart">
    <div v-if="isShowTable" class="table-block"></div>
    <div class="echart-block">
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
      isShowRMB: false,
      RMB: {
        id: "RMB",
        yName: { ch: "百万美元", en: "USD min" },
        yearOnYear: true, //通过修改这个值来显示同比
        title: { ch: "中国对外直接投资流量", en: "China's FDI outflows" },
        xData: [
          "2011",
          "2012",
          "2013",
          "2014",
          "2015",
          "2016",
          "2017",
          "2018",
          "2019",
          "2020"
        ],
        series: [
          {
            name: "中国对外全行业直接投资_xxx",
            color: "#6AA3CD",
            data: [420, 380, 480, 350, 290, 380, 300, 520, 360, 500],
            yearOnYear: [1, 2.8, 1, -1, -1.2, 5, 4, 8, 7, 6]
          },
          {
            name: "中国对内非金融类直接投资_xxx",
            color: "#FF0000",
            data: [720, 380, 580, 360, 390, 310, 240, 590, 400, 500],
            yearOnYear: [2.2, 3.8, -2, 1, -0.2, 6.8, 7, 8, 9, 8]
          }
        ]
      },
      USD: {
        id: "USD",
        yName: { ch: "百万美元", en: "USD min" },
        yearOnYear: true, //通过修改这个值来显示同比
        title: { ch: "中国对外直接投资流量", en: "China's FDI outflows" },
        xData: [
          "2011",
          "2012",
          "2013",
          "2014",
          "2015",
          "2016",
          "2017",
          "2018",
          "2019",
          "2020"
        ],
        series: [
          {
            name: "中国对外全行业直接投资_xxx",
            color: "#6AA3CD",
            data: [420, 380, 480, 350, 290, 380, 300, 520, 360, 500],
            yearOnYear: [1, 2.8, 1, -1, -1.2, 5, 4, 8, 7, 6]
          },
          {
            name: "中国对内非金融类直接投资_xxx",
            color: "#FF0000",
            data: [720, 380, 580, 360, 390, 310, 240, 590, 400, 500],
            yearOnYear: [2.2, 3.8, -2, 1, -0.2, 6.8, 7, 8, 9, 8]
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
              frame: "1990_2020",
              value: "1990"
            },
            end: {
              ch: "结束",
              en: "End",
              frame: "1990_2020",
              value: "2020"
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
              frame: "2000_2020",
              value: "2000-03"
            },
            end: {
              ch: "结束",
              en: "End",
              frame: "2000_2020",
              value: "2020-12"
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
              frame: "2010_2020",
              value: "2010-03"
            },
            end: {
              ch: "结束",
              en: "End",
              frame: "2010_2020",
              value: "2020-12"
            }
          }
        }
      }
    };
  },
  mounted() {
    // console.log(this.isShowTable, "isShowTable");
  },
  methods: {
    // 时间范围组件 update and change
    update(activeKey, value) {
      // console.log(activeKey, value, "666");
      this.options[activeKey].list.start.value = value[0];
      this.options[activeKey].list.end.value = value[1];
    },
    change(activeKey, key, value) {
      let list = JSON.parse(JSON.stringify(this.options[activeKey].list));
      let start =
        key == "start" ? dayjs(`${value}`) : dayjs(`${list.start.value}`);
      let end = key == "end" ? dayjs(`${value}`) : dayjs(`${list.end.value}`);
      if (end.isBefore(start)) {
        return console.log("开始时间不得大于结束时间");
      }
      this.options[activeKey].list[key].value = value;
    },
    // 复选框
    changeSelect(index) {
      this.status[index].checked = !this.status[index].checked;
      if (index == 0) {
        this.status[index].checked
          ? console.log("同比")
          : console.log("去掉同比");
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
  position: relative;
  display: flex;
  .table-block {
    position: absolute;
    left: 0;
    top: 0;
    z-index: 3;
    width: 100%;
    height: 100%;
    background-color: #ccc;
  }
  .echart-block {
    width: 77%;
    height: auto;
    background-color: #fff;
    border: 2px solid #cacaca;
    border-right: none;
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
