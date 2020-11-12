<template>
  <!-- 中国对外直接投资流量按各洲内国家/地区统计chart -->
  <div class="flows-by-CRI-continent-chart">
    <div class="echart-block">
      <div v-if="isShowTable" class="table-block">
        <TableChart :totalData="tableTotalData"></TableChart>
      </div>
      <div class="container">
        <treemap-chart  v-if="!isShowTable" ref="treemapChart" :totalData="totalData"></treemap-chart>
      </div>
    </div>
    <div class="select-block">
      <div class="year-select">
        <Yearly v-if="showTimeFrame" :option="option" :value="option.value" @change="yearChange"></Yearly>
      </div>
      <SelectRadio
        :option="selectOption"
        :value="selectOption.value"
        @change="changeSelect($event)"
      ></SelectRadio>
    </div>
  </div>
</template>

<script>

import TreemapChart from "@/components/charts/Treemap";
import Yearly from "@/components/timeFrame/Year";
import SelectRadio from "@/components/select/SelectRadio";
import request from "@/request/outBound/outBound";
import chartDataFun from "@/utils/chartDataFun";
import TableChart from "@/components/charts/TableChart";
export default {
   components: {
    TreemapChart,
    Yearly,
    SelectRadio,
    TableChart
  },
   props: {
    isShowTable: {}
  },
  name: "flowsByCRIContinentChart",
   data() {
    return {
      tableTotalData: {
        title: {
          ch: "按各洲内国家/地区统计",
          en: "By country/region within a continent"
        },
        unit:{
          ch:'百万美元',
          en:'USD min'
        },
        tableTitle: {
          year: {
            text: "年份_Year",
            width: "10%"
          },
          continent: {
            text: "大洲_Continent",
            width: "35%"
          },
          country: {
            text: "国家_Country/Region",
            width: "35%"
          },
          outflowMillion:{
            text: "中国对外直接投资流量_China's FDI outflow",
            width: "35%"
          }
        },
        tableData: [],
        updatedDate: "2020-10-23"
      },
      showTimeFrame: false,
      totalData: {
        dataSources: "中国人民网",
        title: {
          ch: "111按各洲内国家/地区统计",
          en: "Statistics by continent country / Region"
        },
        yName: {
          ch: "百万美元",
          en: "USD min"
        },
        seriesData: {
          all: "全部_ALL",
          data: []
        },
        updatedDate:"2020-10-23", 
      },
      option: {
        ch: "年度",
        en: "yearly",
        frame: "",
        value: ""
      },
      selectOption: {
        ch: "大洲",
        en: "xxxxxx",
        value: {
          ch: "亚洲",
          en: "yazhou"
        },
        op: [
          {
            ch: "非洲",
            en: "Africa"
          },
          {
            ch: "亚洲",
            en: "Asia"
          },
          {
            ch: "南美洲",
            en: "South_America"
          },
          {
            ch: "欧洲",
            en: "Europe"
          },
          {
            ch: "北美洲",
            en: "North_America"
          },
          {
            ch: "南极洲",
            en: "Antarctica"
          },
          {
            ch: "大洋洲",
            en: "Oceania"
          }
        ]
      }
    };
  },
  computed:{
    tableDatas() {
      return this.$store.getters.chartInfo;
    }
  },
  watch:{
    tableDatas:{
      handler() {
        let resoult= chartDataFun.conversionTable(this.tableTotalData.tableTitle,this.$store.getters.chartInfo.tableData);
            this.$set(this.tableTotalData,'tableData',resoult);
      },
      deep:true
    }
  },
  mounted() {
    this.$EventBus.$on("downLoadImg", () => {
      this.$refs.treemapChart.downloadFile();
    });
  },
  beforeDestroy() {
    this.$EventBus.$off("downLoadImg");
  },
  async created() {
    let res = await this.getMaxMinDate();
    let arrmaxmin = res.split("_");
    await this.getChartsData({
      year: Number(arrmaxmin[1]),
      equalTo: {
        continent: this.selectOption.value.ch
      }
    });
    this.option.value = Number(arrmaxmin[1]);
  },
   methods: {
    async getMaxMinDate() {
      // 获取最大年最小年
      let res = await chartDataFun.getMaxMinDate("FDIOutflowDestination");
      this.$set(this.option, "frame", res);
      this.showTimeFrame = true;
      return res;
    },
    async getChartsData(aug) {
      //年份 获取数据
      let { res } = await request.getFDIOutflowDestination(aug);
      this.totalData.seriesData.data = [];
      res.forEach((item, index) => {
        this.$set(this.totalData.seriesData.data, index, {
          name: item.country + "_qqww",
          value: item.outflowMillion
        });
      });
    },
    async yearChange(year) {
      this.option.value = year;
      await this.getChartsData({
        year: Number(year),
        equalTo: {
          continent: this.selectOption.value.ch
        }
      });
    },
    async changeSelect(item) {
      this.selectOption.value = item;
      await this.getChartsData({
        year: Number(this.option.value),
        equalTo: {
          continent: item.ch
        }
      });
    }
  }
};
</script>

<style lang="less" scoped>
.flows-by-CRI-continent-chart {
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
  }
  .select-block {
    width: 1.40625rem;
    height: auto;
    padding: 0.078125rem;
    box-sizing: border-box;
    background-color: #f0f0f0;
    border: 2px solid #cacaca;
    border-left: none;
    .year-select {
      margin-bottom: 0.078125rem;
    }
  }
}
</style>
