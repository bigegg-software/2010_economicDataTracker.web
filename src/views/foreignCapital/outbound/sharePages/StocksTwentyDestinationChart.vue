<template>
<!-- 中国对外直接投资存量按历年前20位国家chart -->
  <div class="stocks-twenty-destination-chart">
    <div class="echart-block">
      <chart-bar :chartBarData="chartBar"></chart-bar>
    </div>
    <div class="select-block"></div>
  </div>
</template>

<script>
import ChartBar from '@/components/charts/ChartBar'
export default {
  name: "stocksTwentyDestinationChart",
  data() {
    return {
      chartBar: {
        title:{
          text:'中国对外直接投资存量历年前20位国家',
          subtext:"Top 20 destinations of China's FDI outflow"
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
        yName: "百万美元\nUSD min",
        seriesData: [10000, 52000, 200000, 334000, 390000, 330000, 220000]
      }
    };
  },
  components:{ChartBar},
  methods: {}
};
</script>

<style lang="less" scoped>
.stocks-twenty-destination-chart {
  display: flex;
  .echart-block {
    width: 77%;
    height: 664px;
    background-color: #fff;
    border: 2px solid #cacaca;
    border-right: none;
  }
  .select-block {
    width: 23%;
    height: 664px;
    background-color: #f0f0f0;
    border: 2px solid #cacaca;
  }
}
</style>
