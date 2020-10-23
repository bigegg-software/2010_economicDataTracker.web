<template>
<!-- 中国对外直接投资存量按历年前20位国家chart -->
  <div >
    <div class="stocks-twenty-destination-chart" v-show="!isShowTable" >
        <div class="echart-block">
        <chart-bar :chartBarData="chartBar"></chart-bar>
      </div>
      <div class="select-block">
        <year :option="option" :value="option.value" @change="yearChange"></year>
      </div>
    </div>
    <div v-show="isShowTable" class="table">
           
    </div>
  </div>
</template>

<script>
import ChartBar from '@/components/charts/ChartBar'
import Year from '@/components/timeFrame/Year'
export default {
  name: "stocksTwentyDestinationChart",
  data() {
    return {
      chartBar: {
        yName: { ch: "百万美元", en: "USD min" },
        title:{
          text:'中国对外直接投资存量历年前20位国家',
          subtext:"Top 20 destinations of China's FDI stocks"
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
            color:'#0C9AFF',
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
.stocks-twenty-destination-chart {
  display: flex;
  .echart-block {
    width: 4.765625rem;
    height: 3.182292rem;
    background-color: #fff;
    border: 2px solid #cacaca;
    border-right: none;
  }
  .select-block {
    width: 1.401042rem;
    height: 3.182292rem;
    padding: 0.104167rem;
    background-color: #f0f0f0;
    border: 2px solid #cacaca;
  }
}
.table{
  height:3.182292rem;
  width: 100%;
  background:#eee;
}
</style>
