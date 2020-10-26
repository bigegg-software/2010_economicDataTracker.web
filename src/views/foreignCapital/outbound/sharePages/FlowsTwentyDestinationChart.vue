<template>
<!-- 中国对外直接投资流量按历年前20位国家chart -->
  <div class="flows-twenty-destination-chart" >

    <div class="echart-block">
        <div v-if="isShowTable" class="table-block"></div>
        <div class="container">
            <chart-bar :chartBarData="chartBar"></chart-bar>
        </div>
    </div>
    <div class="select-block">
      <div class="frame">
            <year :option="option" :value="option.value" @change="yearChange"></year>
      </div>
    </div>
  </div>
  
</template>

<script>
import ChartBar from '@/components/charts/ChartBar'
import Year from '@/components/timeFrame/Year'
export default {
  name: "flowsTwentyDestinationChart",
  data() {
    return {
      chartBar: {
        yName: { ch: "百万美元", en: "USD min" },
        title:{
          text:'中国对外直接投资流量历年前20位国家',
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
        series:[
          {
            // name:'存量_xxxxx',
            color:['#0C9AFF'],
            data: [10000, 52000, 200000, 334000, 390000, 330000, 220000]
          }
        ]
      },
      option: {
              ch: "年度",
              en: "Yearly",
              frame: "1990_2020",
              value: "1990"
            }
    };
  },
  props:{
    isShowTable:{
      type:Boolean,
      default:false
    }
  },
  mounted() {

  },
  components:{ChartBar,Year},
  methods: {
    yearChange(year) {
          this.option.value=year;
    }
  }
};
</script>

<style lang="less" scoped>
.flows-twenty-destination-chart {
  display: flex;
  .echart-block {
    position: relative;
    width: 77%;
    height: auto;
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
      height: 3.458333rem;
    }
  }
  .select-block {
    width: 23%;
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
