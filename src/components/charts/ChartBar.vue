<template>
    <div ref="chartBar" style="width:100%;height:100%;"></div>
</template>

<script>
import echarts from "echarts";
export default {
  data() {
    return {
      setTime:null,
      myChartBar:Object,
      option:{
        title:{
          text:this.chartBarData.title.text,
          subtext:this.chartBarData.title.subtext,
          top:'3%',
          left:'center',
          textStyle:{
            fontSize:'20'
          }
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        grid: {
          top:'18%',
          left: "3%",
          right: "4%",
          bottom: "0%",
          containLabel: true
        },
        xAxis: [
          {
            type: "category",
            data: this.chartBarData.xData,
            axisLabel: {
              fontSize: 10,
              rotate: 45,
              margin: 10 //刻度标签与轴线之间的距离
            },
            axisTick: {
              alignWithLabel: true
            },
            axisTick: {
              show: false
            }
          }
        ],
        yAxis: [
          {
            type: "value",
            name: this.chartBarData.yName,
            axisLine: {
              show: false
            },
            axisTick: {
              show: false
            },
            splitLine: {
              show: true,
              lineStyle: {
                type: "dashed",
                color: "#dedede"
              }
            }
          }
        ],
        series: [
          {
            name: "直接访问",
            type: "bar",
            barWidth: "60%",
            data: this.chartBarData.seriesData,
            itemStyle: {
              color: "deepskyblue"
            }
          }
        ]
      }
    };
  },
  props: {
    chartBarData:{
      type:Object,
      required:true
    }
  },
  watch:{
    chartBarData: {
        handler(newName, oldName) {
        this.initChart();
      },
      deep: true
    }
  },
  created() {},
  mounted() {
    if(JSON.stringify(this.chartBarData)!='{}'){
        this.initChart();
    }
  },
  methods: {
    initChart() {
      this.myChartBar = echarts.init(this.$refs.chartBar);
       this.myChartBar.setOption(this.option);
          window.addEventListener('resize',()=>{
            this.setTime=null;
            this.setTime=setTimeout( ()=>{this.myChartBar.resize();},800);
          });
    }
  }
};
</script>
<style scoped>
</style>

