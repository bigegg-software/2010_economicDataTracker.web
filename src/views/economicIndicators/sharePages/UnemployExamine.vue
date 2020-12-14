<template>
  <!-- 调查失业率chart -->
  <div class="Flows-and-stocksChart">
    <div class="echart-block">
      <div v-if="isShowTable" class="table-block">
        <TableChart :totalData="totalData"></TableChart>
      </div>
      <div :class="$store.state.fullScreen.isFullScreen==false?'fullContainer':'container'">
       <macro-lines v-if="!isShowTable" ref="linesChart" :options="USD"></macro-lines>
      </div>
    </div>

    <div class="select-block">
      <div class="frame">
        <!-- 时间选择为  月度选择 -->
        <time-frame v-if="showTimeFrame" :options="options" @change="change" @update="update"></time-frame>
      </div>
    </div>
  </div>
</template>

<script>
import dayjs from "dayjs";
import TimeFrame from "@/components/timeFrame/TimeFrame";
import MacroLines from "@/components/charts/MacroLines";
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
    MacroLines,
    TableChart
  },
  name: "flowsAndStocksChart",
  data() {
    return {
      totalData: {
        title: {
          ch: "调查失业率",
          en: "Urban surveyed unemployment rate"
        },
        unit: {
          ch: "调查失业率(%)",
          en: "xxxxxx"
        },
        tableTitle: {
          year: {
            text: "年份_Year",
            width: "10%"
          },
          outward_FDI_flows: {
            text: "中国对外直接投资流量_China's FDI outflows",
            width: "40%",
            formatNum: true
          },
          outward_FDI_stocks: {
            text: "中国对外直接投资存量_China's FDI stocks",
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
        USD: {
        id: "USD",
        dataSources: this.describeData,
        yName: { ch: "百万美元", en: "USD mln" },
        monthOnMonth: false, //通过修改这个值来显示环比
        title: {
          ch: "调查失业率",
          en: "Urban surveyed unemployment rate"
        },
        xData: [],
        hideLegend: false,
        unit1Symbol: "%",
        series: [
          {
            name: "同比_xxxxx",
            type: "line",
            color: "#6AA3CD",
            data: [120, 132, 101, 134, 90, 230]
          },
          {
            name: "222_xxx",
            type: "line",
            color: "#c23531",
            data: [220, 182, 234, 290, 330, 310]
          },
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
    await this.getChartsData({
      noMonth: true,
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
      console.log(res);
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
      let data = await this.getItemData(res, XNameAttr, dataAttr, range);
      this.USD.series[0]["data"] = data.outward_FDI_flows;
      this.USD.series[1]["data"] = data.outward_FDI_stocks;

      //
    },
    async getChartsData(aug) {
      //改变横轴 获取数据
      let { res } = await request.getoutstocksChartsData(aug, 2);

      // 完整的区间
      let range = await chartDataFun.getXRange(aug);
      // 要换取纵轴数据的字段属性
      let dataAttr = ["outward_FDI_flows", "outward_FDI_stocks"];
      let XNameAttr = "year";
      this.USD.xData = range;
      this.totalData.updatedDate = this.$store.getters.latestTime;
      this.USD.updatedDate = this.$store.getters.latestTime;
      // 获取当前页面所有线
      await this.getItemCategoryData(res, XNameAttr, dataAttr, range);
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
    }
  }
};
</script>

<style lang="less" scoped>
.Flows-and-stocksChart {
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
  }
}
</style>
