<template>
  <!-- 中国对外劳务合作派出人数chart -->
  <div class="outflows-chart">
    <div class="echart-block">
      <div v-if="isShowTable" class="table-block">
        <TableChart :totalData="totalData"></TableChart>
      </div>
      <div :class="$store.state.fullScreen.isFullScreen==false?'fullContainer':'container'">
        <lines-chart v-if="!isShowTable" ref="linesChart" :options="Person"></lines-chart>
      </div>
    </div>

    <div class="select-block">
      <div class="frame">
        <time-frame v-if="showTimeFrame" :options="options" @change="change" @update="update" @changeActiveKey="changeActiveKey"></time-frame>
      </div>
    </div>
  </div>
</template>

<script>
import dayjs from "dayjs";
import TimeFrame from "@/components/timeFrame/TimeFrame";
import LinesChart from "@/components/charts/Lines";
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
    LinesChart,
    TableChart
  },
  name: "outflowsChart",
  data() {
    return {
      totalData: {
        title: {
          ch: "中国对外劳务合作派出人数",
          en: "Number of workers sent overseas"
        },
        unit: {
          ch: "万人",
          en: "10,000 persons"
        },
        tableTitle: {},
        tableData: [],
        updatedDate: ""
      },
      timer: null,
      showTimeFrame: false,
      isShowRMB: false,
      Person: {
        dataSources: this.describeData,
        id: "person",
        yName: { ch: "万人", en: "10,000 persons" },
        title: { ch: "中国对外劳务合作派出人数", en: "Number of workers sent overseas" },
        xData: [],   
        series: [
          {
            name: "各类劳务人员_Workers sent overseas",
            color: "#6AA3CD",
            data: []
          },
          {
            name: "承包工程项下派人数_Workers under contracted projects",
            color: "#d43838",
            data: []
          },
          {
            name: "劳务合作项下派人数_Workers under labor service cooperation",
            color: "#73a083",
            data: []
          }
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
        monthly: {
          ch: "月度",
          en: "Monthly",
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
         
        this.$set(this.totalData, "tableData", resoult);
      },
      deep: true
    }
  },
  async created() {
    let res = await this.getMaxMinDate();
    this.$store.commit('setDBMinMaxDateQM',res);
    let arrmaxmin = res.Y.split("_");
    let arrmaxminM = res.M.split("_");
    this.options.yearly.list.start.value = arrmaxmin[0];
    this.options.yearly.list.end.value = arrmaxmin[1];// 初始化日期月度季度赋值
    let QMDefaultTime=await chartDataFun.getQMDefaultTime(arrmaxmin[1],arrmaxminM[1],1);
    this.options.monthly.list.start.value=QMDefaultTime.M.start;
    this.options.monthly.list.end.value=QMDefaultTime.M.end;
    await this.getChartsData({
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
      let res = await chartDataFun.getMaxMinDate("LaborServiceCooperation");
       
      for (let key in this.options) {
        let obj = JSON.parse(JSON.stringify(this.options[key]));
        for (let k in obj.list) {
          obj.list[k].frame = res.Y;
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
    async getItemCategoryData(res, XNameAttr, dataAttr, range) {
      let data = await this.getItemData(res, XNameAttr, dataAttr, range);
      this.Person.series[0]["data"] = data.variousTypesPerNum;
      this.Person.series[1]["data"] = data.contractProject;
      this.Person.series[2]["data"] = data.laborCooperation;
      //
    },
    async getChartsData(aug) {
      await this.getTableConfig(aug);
      //改变横轴 获取数据
      let { res } = await request.getTradeVolumeChartChartsData(aug);
      // 完整的区间
      let range = await chartDataFun.getXRange(aug);
      // 要换取纵轴数据的字段属性
      let dataAttr = [
        "variousTypesPerNum",
        "contractProject",
        "laborCooperation"
      ];
      let XNameAttr = "year";
      this.Person.xData = range;
      this.totalData.updatedDate=this.$store.getters.latestTime;
      this.Person.updatedDate=this.$store.getters.latestTime;
      //添加额外的Q和M属性
      await chartDataFun.addOtherCategory(res);

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
    async getTableConfig(aug){
             if(aug.type=='yearly'){
                this.totalData.tableTitle={
                  year: {
                    text: "年份_Year",
                    width: "10%"
                  },
                  variousTypesPerNum: {
                    text: "各类劳务人员_Workers sent overseas",
                    width: "30%" ,
                    formatNum:true
                  },
                  contractProject: {
                    text: "承包工程项下派人数_Workers under contracted projects",
                    width: "30%",
                    formatNum:true
                  },
                  laborCooperation: {
                    text: "劳务合作项下派人数_Workers under labor service cooperation",
                    width: "30%",
                    formatNum:true
                  }
                }
             }else{
               this.totalData.tableTitle={
                  year: {
                    text: "年份_Year",
                    width: "10%"
                  },
                  month: {
                    text: "月份_Month",
                    width: "20%"
                  },
                  variousTypesPerNum: {
                    text: "各类劳务人员_Workers sent overseas",
                    width: "35%" ,
                    formatNum:true
                  },
                  contractProject: {
                    text: "承包工程项下派人数_Workers under contracted projects",
                    width: "35%",
                    formatNum:true
                  },
                  laborCooperation: {
                    text: "劳务合作项下派人数_Workers under labor service cooperation",
                    width: "35%",
                    formatNum:true
                  }
                }
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
        this.$message.warn('开始时间不得大于结束时间');
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
    },// 改变年度季度月度时：
    async changeActiveKey(ev) {
        await this.mainGetChartsData(ev);
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
