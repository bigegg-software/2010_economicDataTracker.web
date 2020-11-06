<template>
<!-- 中国对外劳务合作---12月末派出各类劳务人员前10位国家chart -->
  <div class="topTenDest-ofNumof-workersChart">
    <div class="echart-block">
        <div v-if="isShowTable" class="table-block"></div>
        <div class="container">
            <chart-bar ref="barChart" :chartBarData="chartBar"></chart-bar>
        </div>
    </div>
    <div class="select-block">
      <div class="frame">
            <year  v-if="showTimeFrame" :option="option" :value="option.value" @change="yearChange"></year>
      </div>
    </div>
  </div>
</template>

<script>
import ChartBar from '@/components/charts/ChartBar'
import Year from '@/components/timeFrame/Year'
import request from "@/request/outBound/outBound";
import chartDataFun from "@/utils/chartDataFun";
export default {
  name: "topTenDestOfWorkersChart",
  data() {
    return {
      showTimeFrame:false,
      chartBar: {
         dataSources: "中国人民网",
        yName: { ch: "万人", en: "XXXXXXXXXX" },
        title:{
          text:'12月末在外各类劳务人员前10位国家',
          subtext:"Top 10 desinations of total number of workers overseas"
        },
        xData: [
        ],
        series: [
          {
            // name:'存量_xxxxx',
            color:['#0C9AFF'],
            data: []
          }
        ],
        updatedDate:"2020-11-6"
      },
      option: {
              ch: "年度",
              en: "Yearly",
              frame: "",
              value: ""
            }
    };
  },
  props: {
    isShowTable: {
      type: Boolean,
      default: false
    }
  },
  mounted() {
    this.$EventBus.$on("downLoadImg", () => {
      this.$refs.barChart.downloadFile();
    });
  },
  beforeDestroy() {
    this.$EventBus.$off("downLoadImg");
  },
  async created() {
     let res = await this.getMaxMinDate();
     let arrmaxmin = res.split("_");
     this.option.value=arrmaxmin[1];
    await this.getChartsData({
      type:2,
      descending:'destinationPercent', //比重
      limit:10,
      year: Number(arrmaxmin[1])
    });
  },
  beforeDestroy() {
    this.$EventBus.$off("downLoadImg");
  },

  components: { ChartBar, Year },
  methods: {
    async getMaxMinDate() {
      // 获取最大年最小年
      let res = await chartDataFun.getMaxMinDate("LaborServiceTop10AnnualRank");
        this.$set(this.option, 'frame', res);
      this.showTimeFrame = true;
      return res;
    },
    async getChartsData(aug) {  //年份 获取数据
      let {res} = await request.getLaborServiceTop10AnnualRankChart(aug);
      let Xname=[];
      // 年度派出各类劳务人员人数
      let variousTypesPerNum=[];
          res.forEach(item => {
              Xname.push(item.destinations);
              variousTypesPerNum.push(item.variousTypesPerNum);
          });
          this.chartBar.xData=Xname;
          this.chartBar.series[0].data=variousTypesPerNum;
    },
    async yearChange(year) {
          this.option.value=year;
          await this.getChartsData({
            type:2,
            descending:'destinationPercent',
            limit:10,
            year: Number(year)
          });
    }
  }
};
</script>

<style lang="less" scoped>
.topTenDest-ofNumof-workersChart {
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
      background-color: #ccc;
    }
    .container {
    width: 5.875rem;
    height: 3.916667rem;
    }
  }
  .select-block {
    width: 1.40625rem;
    height: auto;
    background-color: #f0f0f0;
    border: 2px solid #cacaca;
    border-left: none;
    padding: 0.102083rem;
    box-sizing: border-box;
  }
}
</style>
