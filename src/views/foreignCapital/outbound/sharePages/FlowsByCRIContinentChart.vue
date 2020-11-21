<template>
  <!-- 中国对外直接投资流量按各洲内国家/地区统计chart -->
  <div class="flows-by-CRI-continent-chart">
    <div class="echart-block">
      <div v-if="isShowTable" class="table-block">
        <TableChart :totalData="tableTotalData"></TableChart>
      </div>
      <div :class="$store.state.fullScreen.isFullScreen==false?'fullContainer':'container'">
        <treemap-chart v-if="!isShowTable" ref="treemapChart" :totalData="totalData"></treemap-chart>
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
import {outflowsByDestinationDescribe} from '@/utils/describe.js'
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
          ch: "",
          en: ""
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
          continent: {
            text: "大洲_Continent",
            width: "35%"
          },
          country: {
            text: "国家_Country/Region",
            width: "35%"
          },
          outflowMillion: {
            text: "中国对外直接投资流量_China's FDI outflow",
            width: "35%",
            formatNum:true
          }
        },
        tableData: [],
        updatedDate: ""
      },
      showTimeFrame: false,
      totalData: {
        dataSources: outflowsByDestinationDescribe.dataSources,
        title: {
          ch: "",
          en: ""
        },
        yName: {
          ch: "百万美元",
          en: "USD min"
        },
        seriesData: {
          all: "全部_ALL",
          data: []
        },
        updatedDate: ""
      },
      option: {
        ch: "年度",
        en: "Yearly",
        frame: "",
        value: ""
      },
      selectOption: {
        ch: "大洲",
        en: "Continent",
        value: {
          ch: "亚洲",
          en: "Asia"
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
            en: "South America"
          },
          {
            ch: "欧洲",
            en: "Europe"
          },
          {
            ch: "北美洲",
            en: "North America"
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
  computed: {
    tableDatas() {
      return this.$store.getters.chartInfo;
    }
  },
  watch: {
    tableDatas: {
      handler() {
        let resoult = chartDataFun.conversionTable(
          this.tableTotalData.tableTitle,
          this.$store.getters.chartInfo.tableData
        );
        this.$set(this.tableTotalData, "tableData", resoult);
      },
      deep: true
    },
    option:{
      handler() {
          this.totalData.title.ch=this.tableTotalData.title.ch=`${this.option.value}年${this.selectOption.value.ch}内国家/地区统计`;
          this.totalData.title.en=this.tableTotalData.title.en=`${this.option.value} By country/region within ${this.selectOption.value.en}`;
      },
      deep:true
    },
    selectOption:{
      handler() {
          this.totalData.title.ch=this.tableTotalData.title.ch=`${this.option.value}年${this.selectOption.value.ch}内国家/地区统计`;
          this.totalData.title.en=this.tableTotalData.title.en=`${this.option.value} By country/region within ${this.selectOption.value.en}`;
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
      this.tableTotalData.updatedDate=this.$store.getters.latestTime;
      this.totalData.updatedDate=this.$store.getters.latestTime;
      this.totalData.seriesData.data = [];
      res.forEach((item, index) => {
        this.$set(this.totalData.seriesData.data, index, {
          name: item.country + "_"+ item.countryEn ,
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
    .fullContainer {
      width: 7.4rem;
      height: 4.933333rem;
    }
  }
  .select-block {
    width: 1.74667rem;
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
