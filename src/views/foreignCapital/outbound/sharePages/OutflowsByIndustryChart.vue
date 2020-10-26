<template>
  <!-- 中国对外直接投资流量行业分布情况chart -->
  <div class="outflows-chart">
    <div class="echart-block">
      <div v-if="isShowTable" class="table-block"></div>
      <div v-if="isShowLineChart" class="container">
        <lines-chart :options="USD"></lines-chart>
      </div>
      <div v-else class="container">
         <chart-bar :chartBarData="chartBar"></chart-bar>
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
import ChartBar from '@/components/charts/ChartBar'
import LinesChart from "@/components/charts/Lines";

export default {
  props: {
    isShowTable: {}
  },
  components: {
    TimeFrame,
    CheckBox,
    ChartBar,
    LinesChart
  },
  name: "outflowsChart",
  data() {
    return {
      isShowLineChart: false,
      chartBar: {
        showAxisLabel:false,
        yName: { ch: "百万美元", en: "USD min" },
        title:{
          text:'中国对外直接投资流量行业分布情况',
          subtext:"China’s FDI outflows by industry"
        },
        xData: [
          "租赁和商务服务业\nLeasing and business service",
          "制造业\nManufacturing",
          "科学研究和技术服务业\nScientific research and technological service",
          "卫生和社会工作\nHealthcare and social work",
          "电力/热力/燃气及水的生产和供应业\nElectricity, gas, etc",
          "居民服务/修理和其他服务业\nResidential, repair and other services",
          "交通运输/仓储和邮政业\nTransportation, storage and postal service"
        ],
        series:[
          {
            // name:'存量_xxxxx',
            color:["#0C9AFF", "#434348", "#90ed7d", "#f7a35c", "#61a0a8", "#61a0a8", "#91c7ae", "#2f4554"],
            data: [10000, 52000, 200000, 334000, 390000, 330000, 220000]
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
          ? (this.isShowLineChart = true)
          : (this.isShowLineChart = false);
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
