<template>
  <div id="myChart" style="width:100%;height:100%;"></div>
</template>

<script>
import echarts from "echarts";

export default {
  data() {
    return {};
  },
  props: {
    options: {}
  },
  mounted() {
    this.initChart();
  },
  watch: {
    options: {
      // 表示对象中属性变化的处理函数，这个函数只能叫这个名字
      handler(newName, oldName) {
        this.initChart();
      },
      deep: true // 表示开启深度监听
    }
  },
  methods: {
    initChart() {
      // 基于准备好的dom，初始化echarts实例
      let myChart = echarts.init(document.getElementById("myChart"));

      //找出y轴数值最大最小值
      //   let totalArray = [];
      //   let yearArray = [];
      //   let Max1, Min1, Max2, Min2;
      //   for (let j = 0; j < this.options.series.length; j++) {
      //     for (let i = 0; i < this.options.series[0].data.length; i++) {
      //       totalArray.push(this.options.series[j].data[i]);
      //       yearArray.push(this.options.series[j].yearData[i]);
      //     }
      //   }
      //   if (this.options) {
      //     Max1 = this.calMax(totalArray);
      //     Min1 = this.calMin(totalArray);
      //     Max2 = this.calMax(yearArray);
      //     Min2 = this.calMin(yearArray);
      //   }
      let series = [];
      for (let j = 0; j < this.options.series.length; j++) {
        series.push(
          {
            name: this.options.series[j].name,
            type: "line",
            showSymbol: false, //是否显示拐点
            smooth: true, //平滑曲线显示
            itemStyle: {
              normal: {
                color: this.options.series[j].color
              }
            },
            data: this.options.series[j].data
          },
          {
            name: this.options.series[j].name,
            type: "line",
            yAxisIndex: 1, //使用的 y 轴的 index，在单个图表实例中存在多个 y轴的时候有用
            showSymbol: false,
            itemStyle: {
              normal: {
                lineStyle: {
                  color: this.options.series[j].color,
                  width: 2,
                  type: "dashed"
                }
              }
            },
            data: this.options.series[j].yearData
          }
        );
      }
      // 绘制图表
      let option = {
        title: {
          text: this.options.title,
          textStyle: {
            color: "#333",
            fontSize: 16
          },
          subtext: this.options.titleText,
          subtextStyle: {
            color: "#999",
            fontSize: 14
          },
          top: "3%",
          left: "center"
        },
        grid: {
          top: "25%",
          bottom: "10%"
        },
        tooltip: {
          trigger: "axis"
        },
        legend: {
          data: this.options.series.name,
          selectedMode: false, //是否可以通过点击图例改变系列的显示状态
          top: "15%",
          icon: "none",
          textStyle: {
            color: function(params) {}
          }
        },
        xAxis: {
          data: [
            "2011",
            "2012",
            "2013",
            "2014",
            "2015",
            "2016",
            "2017",
            "2018",
            "2019",
            "2020"
          ], // x轴
          axisLine: {
            show: true,
            lineStyle: {
              color: "#666",
              type: "solid"
            }
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            show: true,
            textStyle: {
              color: "#333"
            }
          }
        },
        yAxis: [
          {
            type: "value",
            // min: Min1,
            // max: Max1,
            // splitNumber: 5,
            // interval: (Max1 - Min1) / 5,
            name: this.options.yName,
            nameTextStyle: {
              color: "#333"
            },
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
                color: "#333"
              }
            }
          },
          {
            show: this.options.yearStatus,
            type: "value",
            // min: Min2,
            // max: Max2,
            // splitNumber: 5,
            // interval: (Max2 - Min2) / 5,
            nameTextStyle: {
              color: "#333"
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
            axisLabel: {
              show: true,
              formatter: "{value} %", //右侧Y轴文字显示
              textStyle: {
                color: "#333"
              }
            }
          }
        ],
        series: series
      };

      myChart.setOption(option, true);
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
      return minval;
    }
  }
};
</script>
<style scoped></style>
