<template>
<!-- 中国对外直接投资存量按历年前20位国家chart -->
  <div class="stocksTwentyDestination-chart">
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
  name: "stocksTwentyDestinationChart",
  data() {
    return {
      showTimeFrame:false,
      chartBar: {
        watermark: false,
        dataSources: "中国人民网",
        yName: { ch: "百万美元", en: "USD min" },
        title:{
          text:'中国对外直接投资流量历年前20位国家',
          subtext:"Top 20 destinations of China's FDI outflow"
        },
        xData: [],
        series:[
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
  props:{
    isShowTable:{
      type:Boolean,
      default:false
    }
  },
  async created() {
     let res = await this.getMaxMinDate();
     let arrmaxmin = res.split("_");
    await this.getChartsData({
      ascending:'rank', //排名升序
      limit:20,
      year: Number(arrmaxmin[1])
    });
  },
  mounted() {
    this.$EventBus.$on("downLoadImg", () => {
      this.$refs.barChart.downloadFile();
    });
  },
  beforeDestroy() {
    this.$EventBus.$off("downLoadImg");
  },
  components:{ChartBar,Year},
  methods: {
    async getMaxMinDate() {
      // 获取最大年最小年
      let res = await chartDataFun.getMaxMinDate("FDITop20Stock");
        this.$set(this.option, 'frame', res);
      this.showTimeFrame = true;
      return res;
    },
    async getChartsData(aug) {  //年份 获取数据
      let {res} = await request.getStocksTwentyDestinationChart(aug);
      let Xname=[];
      // 金额
      let stocks=[];
          res.forEach(item => {
              Xname.push(item.country);
              stocks.push(item.stocksMillion);
          });
          this.chartBar.xData=Xname;
          this.chartBar.series[0].data=stocks;
    },
    async yearChange(year) {
          this.option.value=year;
          await this.getChartsData({
            ascending:'rank',
            limit:20,
            year: Number(year)
          });
    }
  }
};
</script>

<style lang="less" scoped>
.stocksTwentyDestination-chart {
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
    // border-right: none;
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
    .frame{
      padding: 0.104167rem;
    }
  }
}
</style>
