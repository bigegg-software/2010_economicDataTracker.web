<template>
  <div id="myChart" style="width:100%;height:100%;"></div>
</template>

<script>
import echarts from "echarts";
import { fontSize } from "./echarts";
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
      //       yearArray.push(this.options.series[j].yearOnYear[i]);
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
            data: this.options.yearOnYear
              ? this.options.series[j].yearOnYear
              : []
          }
        );
      }
      // 绘制图表
      let option = {
        title: {
          text: this.options.title.ch,
          textStyle: {
            color: "#333",
            fontSize: fontSize(0.18)
          },
          subtext: this.options.title.en,
          subtextStyle: {
            color: "#999",
            fontSize: fontSize(0.16)
          },
          top: "2%",
          left: "center"
        },
        grid: {
          top: "25%",
          bottom: "10%"
        },
        tooltip: {
          trigger: "axis",
          backgroundColor: "rgba(255, 255, 255,0)",
          formatter: params => {
            let dom = `<div style="padding:10px 0;font-size:16px;font-weight:bold;color:rgba(29, 64, 109,0.8);">${params[0].name}</div>`;
            for (let i = 0; i < params.length; i++) {
              let a = `<div style="height:18px;line-height:18px;color:#333;font-size:12px">${
                params[i].seriesName.split("_")[0]
              }</div>`;
              let b = `<div style="height:18px;line-height:18px;color:#ccc;font-size:12px">${
                params[i].seriesName.split("_")[1]
              }</div>`;
              let c = `<div style="padding:10px 0 15px;color:#333;font-size:18px;font-weight:bold;">${params[i].value}</div>`;
              dom = dom + a + b + c;
            }
            return `<div style="width:auto;height:auto;padding:0 15px;border-radius: 5px;background:#fff;box-shadow: darkgrey 0px 0px 5px 1px;">${dom}</div>`;
          },
          axisPointer: {
            label: { show: false }
          }
        },
        legend: {
          selectedMode: false, //是否可以通过点击图例改变系列的显示状态
          formatter: name => {
            return [`${name.split("_")[0]}`, `${name.split("_")[1]}`].join(
              "\n"
            );
          },

          top: "13%",
          icon: "none",
          textStyle: {
            color: params => {},
            fontSize: fontSize(0.14)
          }
        },
        xAxis: {
          data: this.options.xData, // x轴
          axisLine: {
            show: true,
            lineStyle: {
              color: "#ccc",
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
            name: [
              `{div|${this.options.yName.ch}}`,
              `{div|${this.options.yName.en}}`
            ].join("\n"),
            nameTextStyle: {
              rich: {
                div: {
                  color: "#333",
                  fontSize: "12",
                  padding: [2, 0]
                }
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
            show: this.options.yearOnYear,
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
<style scoped>
.a {
  color: red;
}
</style>
