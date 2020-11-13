<template>
  <!-- 中国对外直接投资流量行业分布情况chart -->
  <div class="outflows-chart">
    <div class="echart-block">
      <div v-if="isShowTable" class="table-block">
        <TableChart :totalData="totalData"></TableChart>
      </div>
      <div
        v-if="isShowLineChart"
        :class="$store.state.fullScreen.isFullScreen==false?'fullContainer':'container'"
      >
        <lines-chart v-if="!isShowTable" ref="linesChart" :options="USD"></lines-chart>
      </div>
      <div v-else :class="$store.state.fullScreen.isFullScreen==false?'fullContainer':'container'">
        <chart-bar v-if="!isShowTable" ref="barChart" :chartBarData="chartBar"></chart-bar>
      </div>
    </div>
    <div class="select-block">
      <div class="frame">
        <time-frame v-if="showTimeFrame" :options="options" @change="change" @update="update"></time-frame>
      </div>
      <div class="status">
        <check-box
          v-for="(item, index) in status"
          :key="index"
          :option="item"
          @change="changeSelect(index)"
        ></check-box>
      </div>
      <div class="status">
        <select-check-box
          v-if="status[0].checked"
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
import SelectCheckBox from "@/components/select/selectCheckBox/SelectCheckBox";
import ChartBar from "@/components/charts/ChartBar";
import LinesChart from "@/components/charts/Lines";
import request from "@/request/outBound/outBound";
import chartDataFun from "@/utils/chartDataFun";
import TableChart from "@/components/charts/TableChart";

export default {
  props: {
    isShowTable: {}
  },
  components: {
    TimeFrame,
    CheckBox,
    ChartBar,
    LinesChart,
    SelectCheckBox,
    TableChart
  },
  name: "outflowsChart",
  data() {
    return {
      totalData: {
        title: {
          ch: "中国对外直接投资流量行业分布情况",
          en: "China's FDI outflows by industry"
        },
        unit: {
          ch: "百万美元",
          en: "USD min"
        },
        tableTitle: {
          year: {
            text: "年份_Year",
            width: "10%"
          },
          industry: {
            text: "行业_industry",
            width: "20%"
          },
          outflowsMillion: {
            text: "流量_outflows",
            width: "35%"
          },
          yOY: {
            text: "同比_xxxxxxxx",
            width: "35%"
          }
        },
        tableData: [],
        updatedDate: "2020-10-23"
      },
      timer: null,
      randomColor: [
        "#8DC32E",
        "#FF800C",
        "#0CF6FF",
        "#DB9800",
        "#8D6CE3",
        "#FFBD0C",
        "#111BFF",
        "#FF0CC5",
        "#2992AE",
        "#0C9AFF",
        "#C4D225",
        "#E39145",
        "#0CFFCB",
        "#CF90FF",
        "#FF0000",
        "#101010",
        "#D04747",
        "#7B0CFF"
      ],
      showTimeFrame: false,
      isShowLineChart: false,
      chartBar: {
        watermark: false,
        dataSources: "中国人民网",
        showAxisLabel: false,
        yName: { ch: "百万美元", en: "USD min" },
        grid: {
          //图表上下左右的padding
          top: "40%"
        },
        title: {
          text: "中国对外直接投资流量行业分布情况",
          subtext: "China’s FDI outflows by industry"
        },
        xData: [],
        series: []
      },
      USD: {
        id: "USD",
        yName: { ch: "百万美元", en: "USD min" },
        yearOnYear: true, //通过修改这个值来显示同比
        title: {
          ch: "中国对外直接投资流量行业分布情况",
          en: "China’s FDI outflows by industry"
        },
        xData: [],
        series: [
          // {
          //   name: "中国对外全行业直接投资_xxx",
          //   color: "#6AA3CD",
          //   data: [],
          //   yearOnYear: []
          // }
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
        en: "industry",
        op: []
      },
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
        }
      }
    };
  },
  watch: {
    result: {
      async handler() {
        this.USD.series = [];
        await this.mainGetChartsData("yearly");
      },
      deep: true
    },
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
  computed: {
    tableDatas() {
      return this.$store.getters.chartInfo;
    }
  },
  async created() {
    // 行业
    this.checkBox.op = await chartDataFun.industry();
    // 行业默认选中
    this.checkBox.op[0].checked = true;
    this.checkBox.op[1].checked = true;
    this.result = this.checkBox.op.slice(0, 2);
    //随机颜色
    // this.randomColor=await chartDataFun.randomColor(18);
    let res = await this.getMaxMinDate();
    let arrmaxmin = res.split("_");
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
    // console.log(this.isShowTable, "isShowTable");
    if (!this.isShowYearOnYear) {
      this.$EventBus.$on("downLoadImg", () => {
        this.$refs.barChart && this.$refs.barChart.downloadFile();
      });
    }
    {
      this.$EventBus.$on("downLoadImg", () => {
        this.$refs.linesChart && this.$refs.linesChart.downloadFile();
      });
    }
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
      let res = await chartDataFun.getMaxMinDate("FDIOutflowsIndustry");
      for (let key in this.options) {
        let obj = JSON.parse(JSON.stringify(this.options[key]));
        for (let k in obj.list) {
          obj.list[k].frame = res;
        }
        console.log(obj);
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
      this.USD.series = [];
      let industryAddYoYData = [];
      for (let i = 0; i < res.length; i++) {
        let data = await this.getItemData(res[i], XNameAttr, dataAttr, range);
        this.$set(this.chartBar.series, i, {
          name: `${res[i][0].industry}_${res[i][0].industryEn}`,
          data: data["outflowsMillion"],
          color: [this.randomColor[i]]
        });
        for (let p = 0; p < this.result.length; p++) {
          let item = this.result[p];
          if (item.ch == res[i][0].industry) {
            // 为了保存同比下的行业分布情况在表格中展示
            industryAddYoYData.push(...res[i]);
            let selectedIndustry = {
              name: `${res[i][0].industry}_${res[i][0].industryEn}`,
              data: data["outflowsMillion"],
              yearOnYear: data["yOY"],
              color: [this.randomColor[p]]
            };
            this.USD.series.push(selectedIndustry);
          }
        }
      }
      industryAddYoYData = industryAddYoYData.sort((a, b) => {
        return b.year - a.year;
      });
      if (this.status[0].checked) {
        let tableInfo = {
          fileName: "中国对外直接投资流量行业分布情况",
          tHeader: ["年份", "行业", "流量", "同比", "单位"],
          filterVal: [
            "year",
            "industry",
            "outflowsMillion",
            "yOY",
            "unitMillion"
          ],
          tableData: [...industryAddYoYData]
        };
        this.$store.commit("saveChartTable", tableInfo);
      }

      //
    },
    async getChartsData(aug) {
      //改变横轴 获取数据
      let { res } = await request.getoutflowsByIndustryBarChartsData(aug);

      // 完整的区间
      let range = await chartDataFun.getXRange(aug);
      // 要换取纵轴数据的字段属性
      let dataAttr = ["outflowsMillion", "yOY"];
      let XNameAttr = "year";
      this.chartBar.xData = range;
      this.USD.xData = range;
      // 获取当前页面所有线
      await this.getItemCategoryData(res, XNameAttr, dataAttr, range);
    },
    // 下拉多选框
    async changeOption(op) {
      // 判断存不存在 存在就删掉， 不存在就加进去
      let index = await this.result.findIndex(v => v.en == op.en);
      if (index == -1) {
        this.result.push(op);
      } else {
        this.result.splice(index, 1);
      }

      let i = await this.checkBox.op.findIndex(v => v.en == op.en);
      this.checkBox.op[i].checked = !this.checkBox.op[i].checked;
      this.USD.series = [];
      await this.mainGetChartsData("yearly");
    },
    async changeInputValue(value) {
      //搜索
      //输入的字符串中文英文拆分 中文匹配到字 英文匹配到词
      let regz = /[\u4e00-\u9fa5]/gi;
      let reg = /\s+/;
      let ch = value.match(regz) ? value.match(regz) : [];
      let en = value.replace(regz, "");
      let arr = en.split(reg);
      let arrName = Array.from(new Set([...arr, ...ch]));
      // 去掉数组中的空字符串
      for (var i = 0; i < arrName.length; i++) {
        if (
          arrName[i] == "" ||
          arrName[i] == null ||
          typeof arrName[i] == undefined
        ) {
          arrName.splice(i, 1);
          i = i - 1;
        }
      }
      if (value.replace(/(^\s*)/g, "") == "") {
        for (let y = 0; y < this.checkBox.op.length; y++) {
          this.checkBox.op[y].show = true;
        }
      } else {
        for (let i = 0; i < this.checkBox.op.length; i++) {
          let splitList = await this.checkBox.op[i].searchArr
            .join(",")
            .toLowerCase()
            .split(",");
          console.log(splitList);
          let active = true;
          for (let k = 0; k < arrName.length; k++) {
            if (!splitList.includes(arrName[k].toLowerCase())) {
              active = false;
            }
          }
          this.checkBox.op[i].show = active;
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
          ? (this.isShowLineChart = true)
          : (this.isShowLineChart = false);
      }
      // 重新去获取数据再判断表格切换数据时展示行业筛选后的还是全部行业的
      this.mainGetChartsData("yearly");
    }
  }
};
</script>

<style lang="less" scoped>
.outflows-chart {
  display: flex;
  .echart-block {
    position: relative;
    // width: 5.875rem;
    // height: 3.916667rem;
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
