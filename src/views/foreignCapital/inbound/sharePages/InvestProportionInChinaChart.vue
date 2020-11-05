<template>
  <!-- 主要对华投资国家/地区-国家和地区对华投资比重chart-->
  <div class="investProportion-in-China-chart">
    <div class="echart-block">
      <div v-if="isShowTable" class="table-block"></div>
      <div class="container">
        <treemap-chart ref="treemapChart" :totalData="totalData"></treemap-chart>
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
import request from "@/request/inBound/inBound";
import chartDataFun from "@/utils/chartDataFun";

export default {
  components: {
    TreemapChart,
    Yearly,
    SelectRadio
  },
  props: {
    isShowTable: {}
  },
  name: "investProportionInChinaChart",
  data() {
    return {
      showTimeFrame: false,
      totalData: {
        dataSources: "中国人民网",
        title: {
          ch: "按各洲内国家/地区统计",
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
        updatedDate: "2020-10-23"
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
      let res = await chartDataFun.getMaxMinDate("MajorInvestors");
      this.$set(this.option, "frame", res);
      this.showTimeFrame = true;
      return res;
    },
    async getChartsData(aug) {
      //年份 获取数据
      let { res } = await request.getMajorInvestors(aug);
      console.log(res)
      this.totalData.seriesData.data = [];
      res.forEach((item, index) => {
        this.$set(this.totalData.seriesData.data, index, {
          name: item.country + "_qqww",
          value: item.enterprisePercent
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
.investProportion-in-China-chart {
  display: flex;
  .echart-block {
    position: relative;
    width: 5.875rem;
    height: 3.916667rem;
    background-color: #fff;
    border: 2px solid #cacaca;
    .table-block {
      position: absolute;
      left: 0;
      top: 0;
      z-index: 3;
      width: 100%;
      height: 100%;
      background-color: #ccc;
    }
    .container {
      width: 100%;
      height: 100%;
    }
  }
  .select-block {
    flex: 1;
    height: auto;
    padding: 0.078125rem;
    box-sizing: border-box;
    background-color: #f0f0f0;
    border: 2px solid #cacaca;
    .year-select {
      margin-bottom: 0.078125rem;
    }
  }
}
</style>
