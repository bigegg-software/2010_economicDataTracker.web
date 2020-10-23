<template>
  <!-- 外商直接投资主要行业-开办企业数chart-->
  <div class="outflows-chart">
    <div class="echart-block">
      <div v-if="isShowTable" class="table-block"></div>
      <div v-if="isShowYearOnYear" class="container">
        <lines-chart :options="RMB"></lines-chart>
      </div>
      <div v-else class="container">
        柱状图
      </div>
    </div>
    <div class="select-block">
      <div v-if="isShowYearOnYear" class="frame">
        <time-frame
          :options="options"
          @change="change"
          @update="update"
        ></time-frame>
      </div>
      <div v-if="!isShowYearOnYear" class="frame">
        选择单年份选择器
      </div>
      <div class="status">
        <check-box
          v-for="(item, index) in status"
          :key="index"
          :option="item"
          @change="changeSelect(index)"
        ></check-box>
      </div>
      <div v-if="isShowYearOnYear" class="status">
        <select-check-box
          :option="checkBox"
          :result="result"
          @change="changeOption"
          @changeInputValue="changeInputValue"
        ></select-check-box>
      </div>
    </div>
  </div>
</template>

<script>
import dayjs from "dayjs";
import TimeFrame from "@/components/timeFrame/TimeFrame";
import CheckBox from "@/components/select/selectCheckBox/CheckBox";
import LinesChart from "@/components/charts/Lines";
import SelectCheckBox from "@/components/select/selectCheckBox/SelectCheckBox";

export default {
  props: {
    isShowTable: {}
  },
  components: {
    TimeFrame,
    CheckBox,
    LinesChart,
    SelectCheckBox
  },
  name: "outflowsChart",
  data() {
    return {
      isShowYearOnYear: false,
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
          }
        ]
      },
      status: [
        {
          checked: false,
          ch: "同比",
          en: "Year on year"
        }
      ],
      result: [],
      checkBox: {
        ch: "行业",
        en: "Industry",
        op: [
          {
            ch: "中国",
            en: "china",
            checked: false
          },
          {
            ch: "巴基斯坦",
            en: "bjstbbbbbbbb",
            checked: false
          }
        ]
      },
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
          ? (this.isShowYearOnYear = true)
          : (this.isShowYearOnYear = false);
      }
    },
    // 下拉多选框
    changeOption(op) {
      // 判断存不存在 存在就删掉， 不存在就加进去
      let index = this.result.findIndex(v => v.en == op.en);
      if (index == -1) {
        this.result.push(op);
      } else {
        this.result.splice(index, 1);
      }

      let i = this.checkBox.op.findIndex(v => v.en == op.en);
      this.checkBox.op[i].checked = !this.checkBox.op[i].checked;
      // console.log(this.result, "this.result");
    },
    changeInputValue(value) {
      console.log(value, "inputvalue");
      // 然后重新发请求修改 checkBox.op
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
      padding: 0.052083rem 0.104167rem;
    }
  }
}
</style>
