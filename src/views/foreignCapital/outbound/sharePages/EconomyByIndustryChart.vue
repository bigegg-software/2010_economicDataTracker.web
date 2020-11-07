<template>
  <!-- 中国对主要经济体投资按行业统计chart -->
  <div class="economy-by-industry-chart">
    <div class="echart-block">
      <div v-if="isShowTable" class="table-block"></div>
      <div class="container">
        <chart-bar ref="barChart" :chartBarData="chartBar"></chart-bar>
      </div>
    </div>
    <div class="select-block">
      <div class="frame">
        <year
          :option="option"
          :value="option.value"
          @change="yearChange"
        ></year>
      </div>
      <div class="frame">
        <SelectRadio
          :option="selectOption"
          :value="selectOption.value"
          @change="changeSelect($event)"
        ></SelectRadio>
      </div>
    </div>
  </div>
</template>

<script>
import ChartBar from '@/components/charts/ChartBar'
import Year from '@/components/timeFrame/Year'
import request from "@/request/outBound/outBound";
import SelectRadio from "@/components/select/SelectRadio";
import chartDataFun from "@/utils/chartDataFun";
export default {
  name: "economyByIndustryChart",
  data() {
    return {
      randomColor:[],
      chartBar: {
        showAxisLabel:false,
        watermark: false,
        dataSources: "中国人民网",
        yName: { ch: "百万美元", en: "USD min" },
        title:{
          text:'中国对东盟的直接投资主要行业',
          subtext:"XXXXXXXX"
        },
        xData: [
          "租赁和商务服务业\nLeasing and business service",
          "制造业\nManufacturing",
          "科学研究和技术服务业\nScientific research and technological service",
          "卫生和社会工作\nHealthcare and social work",
          "电力/热力/燃气及水的生产和供应业\nElectricity, gas, etc",
          "居民服务/修理和其他服务业\nResidential, repair and other services",
          "交通运输/仓储和邮政业\nTransportation, storage and postal service"
        ],
        series:[
          // {
          //   name:'存量_xxxxx',
          //   color:["#0C9AFF", "#434348", "#90ed7d", "#f7a35c", "#61a0a8", "#61a0a8", "#91c7ae", "#2f4554"],
          //   data: [10000, 52000, 200000, 334000, 390000, 330000, 220000]
          // }
        ]
      },
      option: {
              ch: "年度",
              en: "Yearly",
              frame: "1990_2020",
              value: "1990"
            },
      selectOption: {
        ch: "行业",
        en: "xxxxxx",
        value: {
          ch: "欧盟",
          en: "dongmeng"
        },
        op: [
          {
          ch: "欧盟",
          en: "dongmeng"
        },
        {
          ch: "亚太经合组织",
          en: "ouzhou"
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
  mounted() {
    this.$EventBus.$on("downLoadImg", () => {
      this.$refs.barChart.downloadFile();
    });
  },
  beforeDestroy() {
    this.$EventBus.$off("downLoadImg");
  },
  async created() {
    this.randomColor=await chartDataFun.randomColor(18);
    let res = await this.getMaxMinDate();
    let arrmaxmin = res.split("_");
    console.log("arrmaxmin",arrmaxmin,this.selectOption.value.ch)
    await this.getChartsData({
      equalTo: {
        economies: this.selectOption.value.ch
      },
      limit: 20,
      year: Number(arrmaxmin[1])
    });
    this.option.value=arrmaxmin[1];
  },
  components:{ChartBar,Year,SelectRadio},
  methods: {
    async getMaxMinDate() {
      // 获取最大年最小年
      let res = await chartDataFun.getMaxMinDate("FDIMajorEconomiesIndustry");
      this.$set(this.option, "frame", res);
      return res;
    },
    async yearChange(year) {
        this.option.value=year;
        console.log("yearChange",year)
        await this.getChartsData({
          equalTo: {
            economies: this.selectOption.value.ch
          },
          limit: 20,
          year: Number(this.option.value)
        });
    },
    async changeSelect(item) {
      this.selectOption.value = item;
      console.log("changeSelect",item,this.selectOption.value)
      await this.getChartsData({
        equalTo: {
          economies: this.selectOption.value.ch
        },
        limit: 20,
        year: Number(this.option.value)
      });
    },
    async getChartsData(aug) {
      //年份 获取数据
      let { res } = await request.getFDIMajorEconomiesIndustry(aug);
      // debugger
      console.log("======主要经济体======",res,aug)
      // 金额
      let outflow = [];
      res.forEach((item,i) => {
        outflow.push({
          name:`${item.industry}_${item.industry}`,
          data:[item.outflows],
          color:[this.randomColor[i]]
        })
      });
      this.chartBar.xData = [];
      this.chartBar.series = outflow
      console.log("this.chartBar",this.chartBar.series.length, outflow)
    }
  }
};
</script>

<style lang="less" scoped>
.economy-by-industry-chart {
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
