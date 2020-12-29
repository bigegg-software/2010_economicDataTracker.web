<template>
  <!-- 外商直接投资主要行业--开办企业数chart -->
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
      <div class="status" v-if="$store.getters.showOperate">
        <check-box
          v-for="(item, index) in status"
          :key="index"
          :option="item"
          @change="changeSelect(index)"
        ></check-box>
      </div>
      <div class="status" v-if="$store.getters.showOperate">
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
import SelectCheckBox from "@/components/select/selectCheckBox/SelectCheckBox";
import ChartBar from "@/components/charts/ChartBar";
import LinesChart from "@/components/charts/Lines";
import request from "@/request/inBound/inBound";
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
    ChartBar,
    LinesChart,
    SelectCheckBox,
    TableChart
  },
  name: "outflowsChart",
  data() {
    return {
      searchTimer: null,
      totalData: {
        title: {
          ch: "开办企业数",
          en: "Number of enterprises set up"
        },
        unit: {
          ch: "家",
          en: "Enterprise"
        },
        tableTitle: {
          year: {
            text: "年份_Year",
            width: "10%"
          },
          industryEn: {
            text: "行业（英文）_Industry",
            width: "30%"
          },
          industry: {
            text: "行业_Industry",
            width: "30%"
          },
          enterprisesNumber: {
            text: "企业数_Number of enterprises",
            width: "30%",
            formatInt: true
          },
          numberYOYGrowth: {
            text: "企业数同比_Number of enterprises y-o-y growth",
            width: "30%",
            formatPer: true
          }
        },
        tableData: [],
        updatedDate: ""
      },
      timer: null,
      randomColor: [
        "#a65783",
        "#c68821",
        "#b8a597",
        "#72a083",
        "#c96470",
        "#61a0a9",
        "#2b4659",
        "#d38265",
        "#d2da90",
        "#6e6e70",
        "#c2cdd3",
        "#c03838",
        "#9d9930",
        "#9a8ccc",
        "#d4a04d",
        "#ca849f",
        "#b7d9bc",
        "#dfdc90"
      ],
      showTimeFrame: false,
      isShowLineChart: false,
      chartBar: {
        watermark: false,
        dataInt:true,//图表展示企业数为整数        
        dataSources: this.describeData,
        showAxisLabel: true,
        yName: { ch: "家", en: "Enterprise" },
        grid: {
          //图表上下左右的padding
          top: "40%",
          left: "4%",
          bottom: "8%",
          enGapch: this.$fz(0.2) //数据来源中英文间距
        },
        title: {
          text: "开办企业数",
          subtext: "Number of enterprises"
        },
        updatedDate: "",
        xData: [],
        series: []
      },
      USD: {
        id: "USD",
        dataInt:true,//点击功能区企业数为整数        
        dataSources: this.describeData,
        yName: { ch: "家", en: "Enterprise" },
        yearOnYear: true, //通过修改这个值来显示同比
        title: { ch: "开办企业数", en: "Number of enterprises" },
        xData: [],
        series: [
          // {
          //   name: "中国对外全行业直接投资_xxx",
          //   color: "#6AA3CD",
          //   data: [],
          //   yearOnYear: []
          // }
        ],
        updatedDate: "",
        legendMark: {//右上角水印
          en: "Y-o-y",
          ch: "同比",
          doSymbol: "(%)"
        }
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
        console.log(resoult);
        this.$set(this.totalData, "tableData", resoult);
      },
      deep: true
    },
    result: {
      async handler() {
        this.USD.series = [];
        await this.mainGetChartsData("yearly");
      }
      // deep: true
    }
  },
  async created() {
    // 行业
    this.checkBox.op = await chartDataFun.getServerIndustry();
    // 行业默认选中
    this.checkBox.op[0].checked = true;
    this.checkBox.op[1].checked = true;
    this.result = this.checkBox.op.slice(0, 2);
    //随机颜色
    // this.randomColor=await chartDataFun.randomColor(18);
    let res = await this.getMaxMinDate();
    let arrmaxmin = res.split("_");
    this.options.yearly.list.start.value = (
      Number(arrmaxmin[1]) - 1
    ).toString();
    this.options.yearly.list.end.value = arrmaxmin[1];
    await this.getChartsData({
      noMonth: true,
      type: "yearly",
      start: Number(arrmaxmin[1]) - 1,
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
      let res = await chartDataFun.getMaxMinDate(
        "ForeignInvestmentMainIndustries"
      );
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
      this.chartBar.series = [];
      this.USD.series = [];
      let industryAddYoYData = [];
      for (let i = 0; i < res.length; i++) {
        let data = await this.getItemData(res[i], XNameAttr, dataAttr, range);
        for (let p = 0; p < this.result.length; p++) {
          let item = this.result[p];
          if (item.ch == res[i][0].industry) {
            this.chartBar.series.push({
              name: `${res[i][0].industry}_${res[i][0].industryEn}`,
              data: data["enterprisesNumber"],
              color: [this.randomColor[p]]
            });
            industryAddYoYData.push(...res[i]);
            let selectedIndustry = {
              name: `${res[i][0].industry}_${res[i][0].industryEn}|${
                res[i][0].industry
              }同比_Y-o-y ${res[i][0].industryEn.slice("0").toLowerCase()}`,
              data: data["enterprisesNumber"],
              yearOnYear: data["numberYOYGrowth"],
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
          fileName: "开办企业数",
          tHeader: ["年份", "行业", "单位", "企业数", "企业数同比"],
          filterVal: [
            "year",
            "industry",
            "unitMillion",
            "enterprisesNumber",
            "numberYOYGrowth"
          ],
          tableData: [...industryAddYoYData]
        };
        this.$store.commit("saveChartTable", tableInfo);
      }
      //
    },
    async getChartsData(aug) {
      //改变横轴 获取数据
      let { res } = await request.getForeignInvestIndustryData(aug, 1);
      console.log(res);
      // 完整的区间
      let range = await chartDataFun.getXRange(aug);
      // 要换取纵轴数据的字段属性
      let dataAttr = ["enterprisesNumber", "numberYOYGrowth"];
      let XNameAttr = "year";
      this.chartBar.xData = range;
      this.USD.xData = range;
      this.USD.updatedDate = this.$store.getters.latestTime;
      this.totalData.updatedDate = this.$store.getters.latestTime;
      this.chartBar.updatedDate = this.$store.getters.latestTime;
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
      // this.USD.series = [];
      // await this.mainGetChartsData("yearly");
    },
    async changeInputValue(value) {
      clearTimeout(this.searchTimer);
      this.searchTimer = setTimeout(async () => {
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
      }, 600);
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
    // 复选框
    changeSelect(index) {
      this.status[index].checked = !this.status[index].checked;
      if (index == 0) {
        this.status[index].checked
          ? (this.isShowLineChart = true)
          : (this.isShowLineChart = false);
      }
      this.chartBar.series = [];
      this.USD.series = [];
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
    // border-right: none;
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
      padding: 0.052083rem 0.104167rem;
    }
  }
}
</style>
