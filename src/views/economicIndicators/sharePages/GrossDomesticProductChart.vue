<template>
  <!-- 国内生产总值GDP chart-->
  <div class="goodstotal-chart">
    <div class="echart-block">
      <div v-if="isShowTable" class="table-block">
        <TableChart :totalData="totalData"></TableChart>
      </div>
      <div :class="$store.state.fullScreen.isFullScreen==false?'fullContainer':'container'">
        <bar-line-mix v-if="!isShowTable" ref="barLine" :options="USD"></bar-line-mix>
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
  name: "GrossDomesticProductChart",
  data() {
    return {
      totalData: {
        title: {
          ch: "国内生产总值 GDP",
          en: "Gross Domestic Product"
        },
        unit: {
          ch: "亿元人民币",
          en: "100 mln RMB"
        },
        tableTitle: {},
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
        yName2: { ch: "同比", en: "Y-o-y" },
        title: {
          ch: "国内生产总值",
          en: "Gross Domestic Product"
        },
        xData: [],
        // hideLegend: true,
        series: [
          
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
              en: "From",
              frame: "2016_2020",
              value: "2018"
            },
            end: {
              ch: "结束",
              en: "To",
              frame: "2016_2020",
              value: "2018"
            }
          }
        },
        quarterly: {
          ch: "季度",
          en: "Quarterly",
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
        },
      },

     
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
    let Yearres = await this.getMaxMinDate('GDP');
    let res = await chartDataFun.getQNoMonthDefaultTime('GDPQuarterly');
    let Yarrmaxmin = Yearres.Y.split("_");
    this.options.yearly.list.start.value = Yarrmaxmin[0];
    this.options.yearly.list.end.value = Yarrmaxmin[1];
    // 初始化日期月度季度赋值
    this.options.quarterly.list.start.frame=`${res.min}_${res.max}`;
    this.options.quarterly.list.end.frame=`${res.min}_${res.max}`;
    this.options.quarterly.list.start.value=`${res.max-1}-${res.maxQuarterMonth}`;
    this.options.quarterly.list.end.value=`${res.max}-${res.maxQuarterMonth}`;
    await this.getChartsData({
      type: "yearly",
      start: Number(Yarrmaxmin[0]),
      end: Number(Yarrmaxmin[1]),
      noMonth:true
    });
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
      if (type == "yearly") {
        await this.getChartsData({
          type,
          start: Number(start.value),
          end: Number(end.value),
          noMonth:true
        });
      } else if (type == "quarterly" || type == "monthly") {
        let startTimeArr = start.value.split("-");
        let endTimeArr = end.value.split("-");
        let quarterStart = parseInt(startTimeArr[0]);
        let quarterStartMonth = parseInt(startTimeArr[1])/3;
        let quarterEnd = parseInt(endTimeArr[0]);
        let quarterEndMonth = parseInt(endTimeArr[1])/3;
        await this.getChartsData({
          type,
          start: quarterStart,
          end: quarterEnd,
          startQuarter: quarterStartMonth,
          endQuarter: quarterEndMonth
        });
      }
    },
    async getMaxMinDate(tableName) {
      // 获取最大年最小年
      let res = await chartDataFun.getMaxMinDate(tableName);
      for (let key in this.options) {
        let obj = JSON.parse(JSON.stringify(this.options[key]));
        for (let k in obj.list) {
          obj.list[k].frame = res.Y;
        }
        if (tableName == "GDP" && key == "yearly") {
          this.$set(this.options, "yearly", obj);
        }
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
      //
      let data = await this.getItemData(res, XNameAttr, dataAttr, range);
      if(XNameAttr=='year'){
        this.USD.series=[
              {
                  type:'bar',
                  yAxisIndex:0,//数值
                  name: "国内生产总值_GDP",
                  color: "#71a6c2",
                  data: data.GDP
                },
                {
                  type:'line',
                  yAxisIndex:1,//百分比
                  name: "年度增速_Y-o-y GDP",
                  color: "#c23531",
                  data: data.yoyGrowth,
                  percent:true
                }
          ]
      }else{
        this.USD.series=[
              {
                  type:'bar',
                  yAxisIndex:0,//数值
                  name: "当季国内生产总值_Quarterly GDP",
                  color: "#c23531",
                  data: data.GDP
                },
                {
                  type:'line',
                  yAxisIndex:1,//百分比
                  name: "当季同比增速_Y-o-y quarterly GDP",
                  color: "#d95959",
                  data: data.yoyGrowth,
                  percent:true
                },
                {
                  type:'bar',
                  yAxisIndex:0,//数值
                  name: "季度累计国内生产总值_Cumulative quarterly GDP",
                  color: "#71a6c2",
                  data: data.cumulativeGDP 
                },
                {
                  type:'line',
                  yAxisIndex:1,//百分比
                  name: "季度累计同比增速_Y-o-y cumulative quarterly GDP",
                  color: "#61a0c0",
                  data: data.cumulativeYoyGrowth ,
                  percent:true
                },
                {
                  type:'line',
                  yAxisIndex:1,//百分比
                  name: "季度环比增速_Q-o-q GDP",
                  color: "#69b9a0",
                  data: data.qoqGDP ,
                  percent:true
                }
          ]
      }
      
      // this.USD.series[0]["data"] = data.GDP;
      // this.USD.series[1]["data"] = data.yoyGrowth;
      //
    },
    async getChartsData(aug) {
      await this.setTableConfig(aug);
      //改变横轴 获取数据
      let { res } = await request.getGrossDomesticProductChartsData(
        aug.type == "yearly" ? "GDP" : "GDPQuarterly",aug
        );

      // 完整的区间
      let range = await chartDataFun.getXRangeMC(aug);
      // 要换取纵轴数据的字段属性
      let dataAttr = aug.type == "yearly"?["GDP","yoyGrowth"]:["GDP","cumulativeGDP","yoyGrowth",'cumulativeYoyGrowth','qoqGDP'];
      let XNameAttr = "year";
      this.USD.xData = range;
      this.USD.updatedDate = this.$store.getters.latestTime;
      this.totalData.updatedDate = this.$store.getters.latestTime;
      //   //添加额外的Q和M属性
      await chartDataFun.addOtherCategoryMC(res);

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
      if (aug.type == "yearly") {
        this.totalData.tableTitle = {
          year: {
            text: "年度_Year",
            width: "10%"
          },
          GDP: {
            text: "国内生产总值_GDP",
            width: "50%",
            formatNum: true
          },
          yoyGrowth: {
            text: "年度增速_Y-o-y GDP",
            width: "40%",
            formatPer: true
          }
        };
      } else {
        this.totalData.tableTitle = {
          year: {
            text: "年份_Year",
            width: "10%"
          },
          quarter: {
            text: "季度_Quarter",
            width: "20%"
          },
          GDP: {
            text: "当季国内生产总值_Quarterly GDP",
            width: "35%",
            formatNum: true
          },
          cumulativeGDP: {
            text: "季度累计国内生产总值_Cumulative quarterly GDP",
            width: "35%",
            formatNum: true
          },
          yoyGrowth : {
            text: "当季同比增速_Y-o-y quarterly GDP",
            width: "35%",
            formatPer: true
          },
          cumulativeYoyGrowth : {
            text: "季度累计同比增速_Y-o-y cumulative quarterly GDP",
            width: "35%",
            formatPer: true
          },
          qoqGDP  : {
            text: "季度环比增速_Q-o-q GDP",
            width: "35%",
            formatPer: true
          }
        };
      }
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
