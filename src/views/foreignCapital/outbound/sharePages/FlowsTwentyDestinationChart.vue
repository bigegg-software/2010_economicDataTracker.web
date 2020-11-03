<template>
<!-- 中国对外直接投资流量按历年前20位国家chart -->
  <div class="flows-twenty-destination-chart">
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
  name: "flowsTwentyDestinationChart",
  data() {
    return {
      showTimeFrame:false,
      chartBar: {
        watermark: false,
        dataSources: "中国人民网",
        yName: { ch: "百万美元", en: "USD min" },
        title: {
          text: "中国对外直接投资流量历年前20位国家",
          subtext: "Top 20 destinations of China's FDI outflow"
        },
        xData: [
          "蒙古\nMongolia",
          "芬兰\nFinland",
          "瑞典\nSweden",
          "挪威\nNorway",
          "冰岛\nIceland",
          "丹麦\nDenmark",
          "泰国\nThailand"
        ],
        series: [
          {
            // name:'存量_xxxxx',
            color:['#0C9AFF'],
            data: []
          }
        ]
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
    await this.getChartsData({
      ascending:'rank', //排名升序
      limit:20,
      year: Number(arrmaxmin[1])
    });
  },
  components: { ChartBar, Year },
  methods: {
    async getMaxMinDate() {
      // 获取最大年最小年
      let res = await chartDataFun.getMaxMinDate("FDITop20Outflow");
        this.$set(this.option, 'frame', res);
      this.showTimeFrame = true;
      return res;
    },
    async getChartsData(aug) {  //年份 获取数据
      let {res} = await request.getFlowsTwentyDestinationChart(aug);
      let Xname=[];
      // 金额
      let outflow=[];
          res.forEach(item => {
              Xname.push(item.country);
              outflow.push(item.outflowMillion);
          });
          this.chartBar.xData=Xname;
          this.chartBar.series[0].data=outflow;
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
.flows-twenty-destination-chart {
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
    // border-right: none;
    .container {
      width: 100%;
      height: 100%;
    }
  }
  .select-block {
    flex: 1;
    height: auto;
    background-color: #f0f0f0;
    border: 2px solid #cacaca;
    border-left: none;
    .frame {
      padding: 0.104167rem;
    }
  }
}
</style>
