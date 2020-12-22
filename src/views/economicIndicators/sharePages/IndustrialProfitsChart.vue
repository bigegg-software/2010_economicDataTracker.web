<template>
  <!-- 工业企业利润 chart-->
  <div class="goodstotal-chart">
    <div class="echart-block">
      <div v-if="isShowTable" class="table-block">
        <TableChart :totalData="totalData"></TableChart>
      </div>
      <div :class="$store.state.fullScreen.isFullScreen==false?'fullContainer':'container'">
        <bar-line-mix v-if="!isShowTable" ref="barLine" :activeKeyCur="'monthly'" :options="USD"></bar-line-mix>
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
    </div>
  </div>
</template>

<script>
import dayjs from "dayjs";
import TimeFrame from "@/components/timeFrame/TimeFrame";
import BarLineMix from "@/components/charts/BarLineMix";
import request from "@/request/economicIndicators/economicIndicators";
import chartDataFun from "@/utils/chartDataFun";
import TableChart from "@/components/charts/TableChart";

export default {
  props: {
    isShowTable: {},
    describeData: {}
  },
  components: {
    TimeFrame,
    BarLineMix,
    TableChart,
  },
  name: "IndustrialProfitsChart",
  data() {
    return {
      totalData: {
        title: {
          ch: "工业企业利润",
          en: "Industrial profit"
        },
        unit: {
          ch: "亿元人民币",
          en: "100 mln RMB"
        },
        tableTitle: {
          year: {
            text: "年度_Year",
            width: "10%"
          },
          month: {
            text: "月份_Month",
            width: "10%"
          },
          unit:{
            text: "单位_unit",
            width: "25%"
          },
          yoyCumulativeIndustrialGrowth: {
            text: "月度累计工业企业利润额_Cumulative monthly industrial profit",
            width: "25%",
            formatNum: true
          },
          yoyGrowth: {
            text: "月度累计工业企业利润额同比_Y-o-y cumulative monthly industrial profit",
            width: "25%",
            formatPer: true
          }
        },
        tableData: [],
        updatedDate: ""
      },
      timer: null,
      showTimeFrame: false,
      USD: {
        id: "USD",
        dataSources: this.describeData,
        // yPosition:['left','right'],
        // yLabel:[true,true],
        yName: { ch: "亿元人民币", en: "100 mln RMB" },
        title: {
          ch: "工业企业利润",
          en: "Industrial profit"
        },
        xData: [],
        grid: {
          bottom: "10%",
          enGapch: this.$fz(0.4) //数据来源中英文间距
        },
        // hideLegend: true,
        series: [
              {
                  type:'bar',
                  yAxisIndex:0,//数值
                  name: "月度累计工业企业利润额_Cumulative monthly industrial profit",
                  color: "#61a0a8",
                  data: []
                },
                {
                  type:'line',
                  yAxisIndex:1,//百分比
                  name: "月度累计工业企业利润额同比_Y-o-y cumulative monthly industrial profit",
                  color: "red",
                  data: [],
                  percent:true
                }
          ],
        updatedDate: ""
      },
      options: {
        quarterly: {
          ch: "季度",
          en: "Quarterly",
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
    let Monthres = await this.getMaxMinDate('IndustrialProfit');
    let Marrmaxmin = Monthres.split("_");
    // 初始化日期月度季度赋值
    let QMDefaultTime = await chartDataFun.getQMDefaultTime(Marrmaxmin[1], 1);
    this.options.monthly.list.start.value=QMDefaultTime.M.start;
    this.options.monthly.list.end.value=QMDefaultTime.M.end;
    // await this.getChartsData({
    //   type: "monthly",
    //   start: Number(Yarrmaxmin[0]),
    //   end: Number(Yarrmaxmin[1]),
    //   //缺少月份
    // });
  },
  mounted() {
    //下载图片
    this.$EventBus.$on("downLoadImg", () => {
      this.$refs.barLine.downloadFile();
    });
  },
  beforeDestroy() {
    this.$EventBus.$off("downLoadImg");
  },
  methods: {
    async mainGetChartsData(type) {
      //条件改变时获取数据
      let { start, end } = this.options[type].list;
        let startTimeArr = start.value.split("-");
        let endTimeArr = end.value.split("-");
        let yearStart = parseInt(startTimeArr[0]);
        let monthStart = parseInt(startTimeArr[1]);
        let yearEnd = parseInt(endTimeArr[0]);
        let monthEnd = parseInt(endTimeArr[1]);
        console.log(quarterEndMonth)
        await this.getChartsData({
          type,
          start: yearStart,
          end: yearEnd,
          startMonth: monthStart,
          endMonth: monthEnd
        });
    },
    async getMaxMinDate(tableName) {
      // 获取最大年最小年
      let res = await chartDataFun.getMaxMinDate(tableName);
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
    // 获取当前页面的每条线数据（按月度分）
    async getItemCategoryData(res, XNameAttr, dataAttr, range) {
      console.log(res, XNameAttr, dataAttr, range)
      let data = await this.getItemData(res, XNameAttr, dataAttr, range);
      this.USD.series[0]["data"] = data.yoyCumulativeIndustrialGrowth;
      this.USD.series[1]["data"] = data.yoyGrowth;
      //
    },
    async getChartsData(aug) {
      //改变横轴 获取数据
      let { res } = await request.getIndustrialProfitsChartsData( //等待中
        'IndustrialProfit',aug
        );
      // 完整的区间
      let range = await chartDataFun.getXRangeMC(aug);
      // 要换取纵轴数据的字段属性
      let dataAttr = ["yoyCumulativeIndustrialGrowth","yoyGrowth"];
      let XNameAttr = "M";
      this.USD.xData = range;
      this.USD.updatedDate = this.$store.getters.latestTime;
      this.totalData.updatedDate = this.$store.getters.latestTime;
      //   //添加额外的Q和M属性
      await chartDataFun.addOtherCategoryMC(res);
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
    },
    // 改变年度季度月度时：
    async changeActiveKey(ev) {
      await this.mainGetChartsData(ev);
    }
  }
};
</script>

<style lang="less" scoped>
.goodstotal-chart {
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
  }
}
</style>
