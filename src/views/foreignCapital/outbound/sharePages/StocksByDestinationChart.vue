<template>
  <!-- 中国对外直接投资存量按国家和地区统计chart -->
  <div class="stocks-by-destination-chart">
    <div class="echart-block">
      <div v-if="isShowTable" class="table-block"></div>
      <div class="container">
        <lines-chart :options="USD"></lines-chart>
      </div>
    </div>
    <div class="select-block">
      <div class="frame">
        <time-frame :options="options" @change="change" @update="update"></time-frame>
      </div>
      <div class="status">
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
import LinesChart from "@/components/charts/Lines";
import SelectCheckBox from "@/components/select/selectCheckBox/SelectCheckBox";

export default {
  props: {
    isShowTable: {}
  },
  components: {
    TimeFrame,
    LinesChart,
    SelectCheckBox
  },
  name: "stocksByDestinationChart",
  data() {
    return {
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
            data: [420, 380, 480, 350, 290, 380, 300, 520, 360, 500]
          },
          {
            name: "中国对内非金融类直接投资_xxx",
            color: "#FF0000",
            data: [720, 380, 580, 360, 390, 310, 240, 590, 400, 500]
          }
        ]
      },
      result: [],
      checkBox: {
        ch: "国家",
        en: "country",
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
          },
          {
            ch: "俄罗斯",
            en: "els",
            checked: false
          },
          {
            ch: "日本",
            en: "japan",
            checked: false
          },
          {
            ch: "朝鲜",
            en: "cx",
            checked: false
          },
          {
            ch: "加拿大",
            en: "jnd",
            checked: false
          },
          {
            ch: "英国",
            en: "english",
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
.stocks-by-destination-chart {
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
