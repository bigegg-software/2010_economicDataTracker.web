<template>
<!-- 中国主要经济体投资按行业统计chart-->
  <div class="economy-ByIndustry-chart">
    <div class="echart-block">
        <div v-if="isShowTable" class="table-block"></div>
        <div class="container">
            <chart-bar ref="barChart" :chartBarData="chartBar"></chart-bar>
        </div>
    </div>
    <div class="select-block">
      <div class="frame">
            <year v-if="showTimeFrame" :option="option" :value="option.value" @change="yearChange"></year>
      </div>
      <SelectRadio
        class="status"
        :option="selectOption"
        :value="selectOption.value"
        @change="changeRadioSelect($event)"
      ></SelectRadio>
    </div>
  </div>
</template>

<script>
import ChartBar from '@/components/charts/ChartBar'
import Year from '@/components/timeFrame/Year'
import SelectRadio from "@/components/select/SelectRadio";
import request from "@/request/outBound/outBound";
import chartDataFun from "@/utils/chartDataFun";
export default {
  name: "economyByIndustryChart",
  data() {
    return {
      timer: null,
      randomColor:['#8DC32E','#FF800C','#0CF6FF','#DB9800','#8D6CE3','#FFBD0C','#111BFF','#FF0CC5','#2992AE','#0C9AFF','#C4D225','#E39145','#0CFFCB','#CF90FF','#FF0000','#101010','#D04747','#7B0CFF'],
      showTimeFrame: false,
      chartBar: {
         dataSources: "中国人民网",
        yName: { ch: "百万美元", en: "USD min" },
        title:{
          text:'中国对东盟直接投资的主要行业',
          subtext:"XXXXXXXXXXXXXXXXXXXXXX"
        },
        xData: [2020],
        series:[
          {
            // name:'存量_xxxxx',
            color:[],
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
            },
      selectOption: {
        ch: "经济体",
        en: "xxxxxx",
        value: {
          id:1,
          ch: "欧盟",
          en: "xxxxxx"
        },
        op: [
          {
            id:1,
            ch: "欧盟",
            en: "xxxxxx"
          },
          {
          id:2,
          ch: "亚太经合组织",
          en: "yyyyy"
        }
        ]
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
     this.option.value=arrmaxmin[1];
    await this.getChartsData({
      equalTo:{
        economies:this.selectOption.value.ch
      },
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
  components:{ChartBar,Year,SelectRadio},
  methods: {
    async getMaxMinDate() {
      // 获取最大年最小年
      let res = await chartDataFun.getMaxMinDate("FDIMajorEconomiesIndustry");
        this.$set(this.option, 'frame', res);
      this.showTimeFrame = true;
      return res;
    },
    async getChartsData(aug) {  //年份 获取数据
      let {res} = await request.getFDIMajorEconomiesIndustry(aug);
      let Xname=[];
      let outflows=[];
      let colors=[];
          res.forEach((item,i) => {
              Xname.push(item.industry+'\n'+item.industryEN);
              outflows.push(item.outflowsMillion);
              colors.push(this.randomColor[i]);
          });
          this.chartBar.xData=Xname;
          this.chartBar.series[0].color=colors;
          this.chartBar.series[0].data=outflows;
            
    },
    async yearChange(year) {
          this.option.value=year;
          await this.getChartsData({
            equalTo:{
              economies:this.selectOption.value.ch
            },
            year: Number(year)
          });
    },
    //选择经济体
    async changeRadioSelect(item) {
      this.selectOption.value = item;
          await this.getChartsData({
            equalTo:{
              economies:this.selectOption.value.ch
            },
            year: Number(this.option.value)
          });
      this.chartBar.title={
        text:this.selectOption.value.ch,
        subtext:this.selectOption.value.en
      }
    }
  }
};
</script>

<style lang="less" scoped>
.economy-ByIndustry-chart {
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
      border-bottom: 1.5px solid #cacaca;
    }
    .status {
      padding: 0.052083rem 0.104167rem;
    }
  }
}
</style>
