<template>
  <!-- 中国对外直接投资存量按各洲内国家/地区统计chart -->
  <div class="stocks-by-CRI-continent-chart">
    <div class="echart-block">
      <div v-if="isShowTable" class="table-block">
        <TableChart :totalData="tableTotalData"></TableChart>
      </div>
      <div :class="$store.state.fullScreen.isFullScreen==false?'fullContainer':'container'">
        <treemap-chart v-if="!isShowTable" ref="treemapChart" :totalData="totalData"></treemap-chart>
      </div>
    </div>
    <div :class="$store.state.fullScreen.isFullScreen==false?'fullselect-block':'select-block'">
      <div class="year-select">
        <year v-if="showTimeFrame" :option="option" :value="option.value" @change="yearChange"></year>
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
import Year from "@/components/timeFrame/Year";
import SelectRadio from "@/components/select/SelectRadio";
import request from "@/request/outBound/outBound";
import chartDataFun from "@/utils/chartDataFun";
import TableChart from "@/components/charts/TableChart";
import Parse from "@/request";

export default {
  components: {
    TreemapChart,
    Year,
    SelectRadio,
    TableChart
  },
  props: {
    isShowTable: {},
    describeData: {}
  },
  name: "stocksByCRIContinentChart",
  data() {
    return {
      tableTotalData: {
        title: {
          ch: "",
          en: ""
        },
        unit: {
          ch: "百万美元",
          en: "USD mln"
        },
        tableTitle: {
          year: {
            text: "年份_Year",
            width: "10%"
          },
          continentEn: {
            text: "大洲（英文）_Continent",
            width: "35%"
          },
          continent: {
            text: "大洲_Continent",
            width: "35%"
          },
          countryEN: {
            text: "国家/地区（英文）_Country/Region",
            width: "35%"
          },
          country: {
            text: "国家/地区_Country/Region",
            width: "35%"
          },
          stocksMillion: {
            text: "中国对外直接投资存量_China's FDI stocks",
            width: "35%",
            formatNum: true
          }
        },
        tableData: [],
        updatedDate: ""
      },
      showTimeFrame: false,
      totalData: {
        dataSources: this.describeData,
        title: {
          ch: "",
          en: ""
        },
        grid: {
          bottom: "14%",
          enGapch: this.$fz(0.4) //数据来源中英文间距
        },
        yName: {
          ch: "百万美元",
          en: "USD mln"
        },
        seriesData: {
          all: "",
          data: []
        },
        updatedDate: ""
      },
      option: {
        ch: "年度",
        en: "yearly",
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
        op: []
      },
      allContinent: [
        {
          ch: "非洲",
          en: "Africa"
        },
        {
          ch: "亚洲",
          en: "Asia"
        },
        {
          ch: "拉丁美洲",
          en: "Latin America"
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
    option: {
      handler() {
        this.totalData.seriesData.all = `${this.selectOption.value.en} ${this.selectOption.value.ch}`;
        this.totalData.title.ch = this.tableTotalData.title.ch = `${this.option.value}年中国对外直接投资存量${this.selectOption.value.ch}内国家/地区统计`;
        this.totalData.title.en = this.tableTotalData.title.en = `China's outward FDI stocks by country/region within ${this.selectOption.value.en} in ${this.option.value}`;
      },
      deep: true
    },
    selectOption: {
      handler() {
        this.totalData.seriesData.all = `${this.selectOption.value.en} ${this.selectOption.value.ch}`;
        this.totalData.title.ch = this.tableTotalData.title.ch = `${this.option.value}年中国对外直接投资存量${this.selectOption.value.ch}内国家/地区统计`;
        this.totalData.title.en = this.tableTotalData.title.en = `China's outward FDI stocks by country/region within ${this.selectOption.value.en} in ${this.option.value}`;
      },
      deep: true
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
    let arrmaxmin = res.Y.split("_");
    await this.getChartsData({
      year: Number(arrmaxmin[1]),
      equalTo: {
        continent: this.selectOption.value.ch
      }
    });
    this.option.value = Number(arrmaxmin[1]);
    this.getContinent();
  },
  methods: {
    //获取大洲
    async getContinent() {
      await chartDataFun.become();
      let continent=await new Parse.Cloud.run('getContinent',{tableName:'FDIStock'});
          continent=continent.data.result;
      continent = continent.map(item => {
        return item.toJSON().continent;
      });
      let res = Array.from(new Set(continent));
       
      for (let i = 0; i < this.allContinent.length; i++) {
        if (res.includes(this.allContinent[i].ch)) {
          this.selectOption.op.push(this.allContinent[i]);
        }
      }
    },
    async getMaxMinDate() {
      // 获取最大年最小年
      let res = await chartDataFun.getMaxMinDate("FDIStock");
      this.$set(this.option, "frame", res.Y);
      this.showTimeFrame = true;
      return res;
    },
    async getChartsData(aug) {
      //年份 获取数据
      let { res } = await request.getFDIStock(aug);
      this.tableTotalData.updatedDate = this.$store.getters.latestTime;
      this.totalData.updatedDate = this.$store.getters.latestTime;
      this.totalData.seriesData.data = [];
      res.forEach((item, index) => {
        this.$set(this.totalData.seriesData.data, index, {
          name: item.countryEN + "_" + item.country,
          value: item.stocksMillion
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
.stocks-by-CRI-continent-chart {
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
  .fullselect-block {
    width: 1.74667rem;
    height: auto;
    padding: 0.078125rem;
    box-sizing: border-box;
    background-color: #f0f0f0;
    border: 2px solid #cacaca;
    border-left: none;
  }
  .select-block {
    width: 1.385rem;
    height: auto;
    padding: 0.078125rem;
    box-sizing: border-box;
    background-color: #f0f0f0;
    border: 2px solid #cacaca;
    border-left: none;
  }
  .year-select {
    margin-bottom: 0.078125rem;
  }
}
</style>
