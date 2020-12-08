<template>
  <div :id="totalData.id" ref="barLine" style="width:100%;height:100%;"></div>
</template>

<script>
import echarts from "echarts";
export default {
  data() {
    return {
      chart: ""
    };
  },
  props: {
    totalData: {}
  },
  onLoad() {},
  mounted() {
    this.drawChart();
    console.log(this.totalData.yearOnYear);
    if (JSON.stringify(this.totalData) != "{}") {
      this.drawChart();
      this.$EventBus.$on("resize", () => {
        this.timer = null;
        this.timer = setTimeout(async () => {
          console.log("页面尺寸变化");
          await this.drawChart();
        }, 1000);
      });
    }
  },
  watch: {
    // "$store.state.fullScreen.isFullScreen"() {
    //   this.drawChart();
    // },
    totalData: {
      handler(newName, oldName) {
        this.drawChart();
      },
      deep: true
    }
  },
  methods: {
    drawChart() {
      this.chart = echarts.init(document.getElementById(this.totalData.id));
      //找出y轴数值最大最小值
      let totalArray = [];
      let yearArray = [];
      let Max1, Min1, Max2, Min2;
      for (let j = 0; j < this.totalData.series.length; j++) {
        for (let i = 0; i < this.totalData.series[j].data.length; i++) {
          if (this.totalData.series[j].data) {
            totalArray.push(this.totalData.series[j].data[i]);
          }
          if (this.totalData.series[j].yearOnYear) {
            yearArray.push(this.totalData.series[j].yearOnYear[i]);
          }
        }
      }
      if (this.totalData) {
        Max1 = this.calMax(totalArray);
        Min1 = this.calMin(totalArray);
        Max2 = this.calMax(yearArray);
        Min2 = this.calMin(yearArray);
      }
      let series = [];
      for (var j = 0; j < this.totalData.series.length; j++) {
        series.push(
          {
            name: this.totalData.series[j].name,
            type: "bar",
            yAxisIndex: 0,
            barWidth: "40px",
            itemStyle: {
              normal: {
                show: true,
                borderWidth: 0
              }
            },
            data: this.totalData.series[j].data
          },
          {
            name: this.totalData.series[j].name + "同比",
            type: "line",
            yAxisIndex: 1,
            symbolSize: 6,
            data: this.totalData.yearOnYear
              ? this.totalData.series[j].yearOnYear
              : "[]"
          }
        );
      }
      // 绘制图表
      let option = {
        title: {
          text: this.totalData.title.en,
          subtext: this.totalData.title.ch,
          top: "3%",
          left: "center",
          textStyle: {
            color: "#333",
            fontSize: this.$fz(0.26)
          },
          subtextStyle: {
            color: "#333",
            fontSize: this.$fz(0.18)
          }
        },
        backgroundColor: "#fff",
        tooltip: {
          trigger: "axis",
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        legend: {
          top: "13%",
          show: true
        },
        // 	年度完成率和季度完成率颜色
        // color: ["#071960", "#1740B4", "#1962CA", ],
        grid: {
          left: "3%",
          right: "4%",
          top: "20%",
          bottom: "3%",
          containLabel: true
        },
        xAxis: [
          {
            type: "category",
            axisLine: {
              lineStyle: {
                color: "#1B3F81"
              }
            },
            axisLabel: {
              //坐标轴刻度标签的相关设置。
              interval: 0, //设置为 1，表示『隔一个标签显示一个标签』
              margin: 10
            },
            axisLine: {
              lineStyle: {
                color: "#8C8C8C"
              }
            },
            axisTick: {
              alignWithLabel: true,
              show: false
            },
            data: ["第一次", "第二次", "第三次"]
          }
        ],
        // legend:[]
        yAxis: [
          {
            type: "value",
            min: Min1,
            max: Max1,
            splitNumber: 5,
            interval: (Max1 - Min1) / 5,
            splitLine: {
              show: true,
              lineStyle: {
                type: "dashed",
                color: "#eee"
              }
            },
            axisLine: {
              show: false
            },
            axisTick: {
              show: false
            },
            axisLabel: {
              show: true,
              textStyle: {
                color: "#666",
                fontSize: this.$fz(0.16)
              }
            }
          },
          {
            show: this.totalData.yearOnYear,
            min: Min2,
            max: Max2,
            splitNumber: 5,
            interval: (Max2 - Min2) / 5,
            name: "比率(%)",
            // 单位 显示位置
            // nameLocation: 'start',

            type: "value",
            axisLabel: {
              //坐标轴刻度标签的相关设置。
              interval: 0, //设置为 1，表示『隔一个标签显示一个标签』
              formatter: "{value}%",
              textStyle: {
                color: "#666",
                fontSize: this.$fz(0.16)
              }
            },
            splitLine: {
              show: true,
              lineStyle: {
                type: "dashed",
                color: "#eee"
              }
            },
            axisLine: {
              show: true,
              lineStyle: {
                color: "#ffffff"
              }
            },
            axisTick: {
              show: false
            },
          }
        ],
        series: series
      };

      this.chart.setOption(option, true);
    },
    //计算最大值
    calMax(arr) {
      let max = Math.max(...arr);
      let maxint = Math.ceil(max / 9.5); // 不让最高的值超过最上面的刻度
      let maxval = maxint * 10; // 让显示的刻度是整数
      // 为了防止数据为0时，Y轴不显示，给个最大值
      if (maxval == 0) {
        maxval = 1;
      }
      return maxval;
    },
    //计算最小值
    calMin(arr) {
      let min = Math.min(...arr);
      let minint = Math.floor(min / 10);
      let minval = minint * 10; //让显示的刻度是整数
      return minval > 0 ? 0 : minval;
    }
  }
};
</script>
<style scoped>
</style>

