<template>
<!-- 中国对外承包工程--对外承包工程前十国别（市场）chart-->
  <div class="topTenCountriesToOP-chart">
    <div class="echart-block">
        <div v-if="isShowTable" class="table-block"></div>
        <div class="container">
            <chart-bar :chartBarData="chartBar"></chart-bar>
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
      <div class="status">
        <check-box
          v-for="(item, index) in status"
          :key="index"
          :option="item"
          @change="changeSelect(index)"
        ></check-box>
      </div>
    </div>
  </div>
</template>

<script>
import ChartBar from '@/components/charts/ChartBar'
import Year from '@/components/timeFrame/Year'
import CheckBox from "@/components/select/selectCheckBox/CheckBox";
import SelectRadio from "@/components/select/SelectRadio";
import request from "@/request/outBound/outBound";
import chartDataFun from "@/utils/chartDataFun";
export default {
  name: "topTenCountriesToOPChart",
  data() {
    return {
      timer: null,
      showTimeFrame: false,
      chartBar: {
        yearOnYear: false,
        yName: { ch: "百万美元", en: "USD min" },
        title:{
          text:'新签合同额',
          subtext:"Total value of new contract"
        },
        xData: [
        ],
        series:[
          {
            // name:'存量_xxxxx',
            color:['#0C9AFF'],
            data: [],
            yearOnYear:[]
          }
        ]
      },
      option: {
              ch: "年度",
              en: "Yearly",
              frame: "",
              value: ""
            },
      status: [
        {
          checked: false,
          ch: "同比",
          en: "xxx"
        }
      ],
      selectOption: {
        ch: "类型",
        en: "xxxxxx",
        value: {
          id:1,
          ch: "新签合同额",
          en: "Total value of new contract"
        },
        op: [
          {
            id:1,
            ch: "新签合同额",
            en: "Total value of new contract"
          },
          {
          id:2,
          ch: "完成营业额",
          en: "Total value of new contract y-o-y growth "
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
      type:1,
      ascending:'rank',
      limit:10,
      year: Number(arrmaxmin[1])
    });
  },
  components:{ChartBar,Year,CheckBox,SelectRadio},
  methods: {
    async getMaxMinDate() {
      // 获取最大年最小年
      let res = await chartDataFun.getMaxMinDate("ForeignContractAnnualRank");
        this.$set(this.option, 'frame', res);
      this.showTimeFrame = true;
      return res;
    },
    async getChartsData(aug) {  //年份 获取数据
      let {res} = await request.getTopTenCountriesToOPChart(aug);
      let Xname=[];
      // 新签合同额,完成营业额，新签合同额同比，完成营业额同比
      let amount=[],amountYOY=[];
          res.forEach(item => {
              Xname.push(item.country+'\n'+item.countryEn);
              amount.push(item.amountMillion);
              amountYOY.push(item.amountYOY);
          });
          this.chartBar.xData=Xname;
              this.chartBar.series[0].data=amount;
              this.chartBar.series[0].yearOnYear=amountYOY;
            
    },
    async yearChange(year) {
          this.option.value=year;
          await this.getChartsData({
            type:this.selectOption.value.id,
            ascending:'rank',
            limit:10,
            year: Number(year)
          });
    },
    // 复选框
    changeSelect(index) {
      this.status[index].checked = !this.status[index].checked;
      if (index == 0) {
        this.status[index].checked
          ? this.$set(this.chartBar, "yearOnYear", true)
          : this.$set(this.chartBar, "yearOnYear", false)
      }
      if (index == 1) {
        this.status[index].checked
          ? (this.isShowRMB = true)
          : (this.isShowRMB = false);
      }
    },
    //选择类型新签合同额还是完成营业额
    async changeRadioSelect(item) {
      this.selectOption.value = item;
          await this.getChartsData({
            type:item.id,
            ascending:'rank',
            limit:10,
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
.topTenCountriesToOP-chart {
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
