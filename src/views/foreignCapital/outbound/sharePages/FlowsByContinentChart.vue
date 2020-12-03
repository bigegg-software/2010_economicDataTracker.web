<template>
  <!-- 中国对外直接投资流量按国家和地区统计-按大洲统计chart-->
  <div class="flows-By-Continent-Chart">
    <div class="echart-block">
      <div v-if="isShowTable" class="table-block">
        <TableChart :totalData="totalData"></TableChart>
      </div>
      <div :class="$store.state.fullScreen.isFullScreen==false?'fullContainer':'container'">
        <lines-chart v-if="!isShowTable" ref="linesChart" :options="USD"></lines-chart>
      </div>
    </div>
    <div class="select-block">
      <div class="frame">
        <time-frame v-if="showTimeFrame" :options="options" @change="change" @update="update"></time-frame>
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
  name: "flowsByContinentChart",
  data() {
    return {
      totalData: {
        title: {
          ch: "中国对外直接投资流量按大洲统计",
          en: "China's FDI outflows by continent"
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
          name: {
            text: "大洲_Continent",
            width: "35%"
          },
          mount: {
            text: "中国对外直接投资流量_China's FDI outflows",
            width: "35%",
            formatNum:true
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
        yName: { ch: "百万美元", en: "USD min" },
        title: {
          ch: "中国对外直接投资流量按大洲统计",
          en: "China's FDI outflows by continent"
        },
        xData: [],
         grid: {
         bottom:"14%",
          enGapch:this.$fz(0.4),//数据来源中英文间距
        },
        series: [],
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
  async mounted() {
    let res = await this.getMaxMinDate();
    let arrmaxmin = res.split("_");
    this.options.yearly.list.start.value=arrmaxmin[0];
    this.options.yearly.list.end.value=arrmaxmin[1];
    await this.getChartsData({
      noMonth: true,
      type: "yearly",
      start: Number(arrmaxmin[0]),
      end: Number(arrmaxmin[1])
    });

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
      let res = await chartDataFun.getMaxMinDate("FDIOutflowDestination");
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
    // 获取当前页面的每条线数据（按年度 季度 月度分）
    async getItemCategoryData(
      Asia,
      Europe,
      Oceania,
      North_America,
      Antarctica,
      South_America,
      Africa,
      Latin_America,
      XNameAttr,
      dataAttr,
      range
    ) {
      this.USD.series=[];
      //亚洲
      let dataAsia = await this.getItemData(Asia, XNameAttr, dataAttr, range);
      if(Asia.length){
        this.USD.series.push({
            name: "亚洲_Asia",
            color: "#b8a597",
            data: dataAsia.mount
          });
      }
      //欧洲
      let dataEurope = await this.getItemData(
        Europe,
        XNameAttr,
        dataAttr,
        range
      );
      if(Europe.length){
        this.USD.series.push({
            name: "欧洲_Europe",
            color: "#72a083",
            data: dataEurope.mount
          });
      }
      //大洋洲 Oceania
      let dataOceania = await this.getItemData(
        Oceania,
        XNameAttr,
        dataAttr,
        range
      );
      if(Oceania.length){
        this.USD.series.push({
            name: "大洋洲_Oceania",
            color: "#c96470",
            data: dataOceania.mount
          });
      }
      //North_America 北美洲
      let dataNorth_America = await this.getItemData(
        North_America,
        XNameAttr,
        dataAttr,
        range
      );
      if(North_America.length){
        this.USD.series.push({
            name: "北美洲_North America",
            color: "#a65783",
            data: dataNorth_America.mount
          });
      }
      //Antarctica 南极洲
      let dataAntarctica = await this.getItemData(
        Antarctica,
        XNameAttr,
        dataAttr,
        range
      );
      if(Antarctica.length){
        this.USD.series.push({
            name: "南极洲_Antarctica",
            color: "#d38265",
            data: dataAntarctica.mount
          });
      }
      //South_America 南美洲
      let dataSouth_America = await this.getItemData(
        South_America,
        XNameAttr,
        dataAttr,
        range
      );
      if(South_America.length){
        this.USD.series.push({
            name: "南美洲_South America",
            color: "#86a1b0",
            data: dataSouth_America.mount
          });
      }
      //Africa 非洲
      let dataAfrica = await this.getItemData(
        Africa,
        XNameAttr,
        dataAttr,
        range
      );
      if(Africa.length){
        this.USD.series.push({
            name: "非洲_Africa",
            color: "#9d9930",
            data: dataAfrica.mount
          });
      }
      //拉丁美洲
      let dataLatin_America = await this.getItemData(
        Latin_America,
        XNameAttr,
        dataAttr,
        range
      );
      if(Latin_America.length){
        this.USD.series.push({
            name: "拉丁美洲_Latin America",
            color: "#288b99",
            data: dataLatin_America.mount
          });
      }
    },
    async getChartsData(aug) {
      //改变横轴 获取数据
      let {
        Asia,
        Europe,
        Oceania,
        North_America,
        Antarctica,
        South_America,
        Africa,
        Latin_America
      } = await request.getOutflowsOutstocksByDestinationChartsData(
        "FDIOutflowDestination",
        aug,
        "outflow",
        2
      );
      // 完整的区间
      let range = await chartDataFun.getXRange(aug);
      // 要换取纵轴数据的字段属性
      let dataAttr = ["mount"];
      let XNameAttr = "year";
      this.USD.xData = range;
      this.USD.updatedDate=this.$store.getters.latestTime;
      this.totalData.updatedDate=this.$store.getters.latestTime;
      // 获取当前页面所有线
      await this.getItemCategoryData(
        Asia,
        Europe,
        Oceania,
        North_America,
        Antarctica,
        South_America,
        Africa,
        Latin_America,
        XNameAttr,
        dataAttr,
        range
      );
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
      console.log("change");
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
    }
  }
};
</script>

<style lang="less" scoped>
.flows-By-Continent-Chart {
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
    }
    .status {
      padding: 0.104167rem;
    }
  }
}
</style>
