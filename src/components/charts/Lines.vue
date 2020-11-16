<template>
  <div :id="options.id" style="width:100%;height:100%;"></div>
</template>

<script>
import echarts from "echarts";
export default {
  data() {
    return {
      timer: null,
      chart: null,
      watermark: false
    };
  },
  props: {
    options: {}
  },
  mounted() {
    this.$EventBus.$on("resize", () => {
      clearInterval(this.timer);
      this.timer = setTimeout(async () => {
        console.log("页面尺寸变化");
        this.initChart();
        this.chart.resize();
      }, 1000);
    });
    this.initChart();
  },
  beforeDestroy() {
    this.$EventBus.$off("resize");
  },
  watch: {
    "$store.state.fullScreen.isFullScreen"() {
      this.initChart();
      this.chart.resize();
    },
    options: {
      // 表示对象中属性变化的处理函数，这个函数只能叫这个名字
      handler(newName, oldName) {
        this.initChart();
      },
      deep: true // 表示开启深度监听
    }
  },
  methods: {
    downloadFile() {
      //添加水印
      this.watermark = true;
      this.initChart();
      let aLink = document.createElement("a");
      let blob = this.base64ToBlob();
      let evt = document.createEvent("HTMLEvents");
      evt.initEvent("click", true, true);
      aLink.download = this.options.title.ch; //下载图片的名称
      aLink.href = URL.createObjectURL(blob);
      aLink.click();
      //消除水印
      this.watermark = false;
      this.initChart();
    },

    exportImg() {
      //echart返回一个 base64 的 URL
      return this.chart.getDataURL({
        type: "png",
        pixelRatio: 5, //清晰度
        backgroundColor: "#fff",
        border: "none"
      });
    },
    base64ToBlob() {
      //将base64转换blob
      let img = this.exportImg();
      let parts = img.split(";base64,");
      let contentType = parts[0].split(":")[1];
      let raw = window.atob(parts[1]);
      let rawLength = raw.length;
      let uInt8Array = new Uint8Array(rawLength);
      for (let i = 0; i < rawLength; ++i) {
        uInt8Array[i] = raw.charCodeAt(i);
      }
      return new Blob([uInt8Array], { type: contentType });
    },
    formatNum(value) {
      if (!value && value !== 0) return 0;
      let strs = value.toFixed(1) 
      let str = strs.toString() ;
      let reg =
        str.indexOf(".") > -1 ? /(\d)(?=(\d{3})+\.)/g : /(\d)(?=(?:\d{3})+$)/g;
      return str.replace(reg, "$1,");
    },
    initChart() {
      // 基于准备好的dom，初始化echarts实例
      this.chart = echarts.init(document.getElementById(this.options.id));
      //找出y轴数值最大最小值
      let totalArray = [];
      let yearArray = [];
      let Max1, Min1, Max2, Min2;
      for (let j = 0; j < this.options.series.length; j++) {
        for (let i = 0; i < this.options.series[0].data.length; i++) {
          if (this.options.series[0].data) {
            totalArray.push(this.options.series[j].data[i]);
          }
          if (this.options.series[j].yearOnYear) {
            yearArray.push(this.options.series[j].yearOnYear[i]);
          }
        }
      }
      if (this.options) {
        Max1 = this.calMax(totalArray);
        Min1 = this.calMin(totalArray);
        Max2 = this.calMax(yearArray);
        Min2 = this.calMin(yearArray);
      }
      let series = [];
      let legend = [];
      for (let j = 0; j < this.options.series.length; j++) {
        series.push(
          {
            // connectNulls: true,
            symbol: "circle", //拐点样式
            symbolSize: 4, //拐点大小
            color: this.options.series[j].color,
            name: this.options.series[j].name,
            type: "line",
            showSymbol: true, //是否显示拐点
            smooth: true, //平滑曲线显示
            lineStyle: {
              color: this.options.series[j].color,
              width: 1.5
            },
            data: this.options.series[j].data
          },
          {
            // connectNulls: true,
            symbol: "circle", //拐点样式
            symbolSize: 4, //拐点大小
            color: this.options.series[j].color,
            name: this.options.series[j].name,
            type: "line",
            yAxisIndex: 1, //使用的 y 轴的 index，在单个图表实例中存在多个 y轴的时候有用
            showSymbol: true,
            lineStyle: {
              color: this.options.series[j].color,
              width: 1.5,
              type: "dashed"
            },
            data: this.options.yearOnYear
              ? this.options.series[j].yearOnYear
              : []
          }
        );
        legend.push({
          name: this.options.series[j].name,
          textStyle: {
            color: this.options.series[j].color
          }
        });
      }

      // 绘制图表
      let option = {
        title: {
          text: this.options.title.en,
          textStyle: {
            color: "#333",
            fontSize: this.$fz(0.26)
          },
          subtext: this.options.title.ch,
          subtextStyle: {
            color: "#333",
            fontSize: this.$fz(0.18)
          },
          top: "2%",
          left: "center"
        },
        grid: {
          top: "23%",
          left: "8%",
          right: "4%",
          bottom: "11%"
        },
        graphic: [
          {
            type: "group",
            left: this.$fz(0.15) * 1.5,
            bottom: this.$fz(0.15) * 2.2,
            children: [
              {
                type: "text",
                z: 100,
                left: "center",
                top: "middle",
                style: {
                  fill: "#666",
                  text: "Data last updated",
                  font: `${this.$fz(0.18)}px Calibri`
                }
              }
            ]
          },
          {
            type: "group",
            left: this.$fz(0.15) * 1.5,
            bottom: this.$fz(0.15),
            children: [
              {
                type: "text",
                z: 100,
                left: "center",
                top: "middle",
                style: {
                  fill: "#666",
                  text: "数据最后更新时间",
                  font: `${this.$fz(0.14)}px 黑体`
                }
              }
            ]
          },
          {
            type: "group",
            left: this.$fz(0.15) * 11.5,
            bottom: this.$fz(0.15) * 1.3,
            children: [
              {
                type: "text",
                z: 100,
                left: "right",
                top: "middle",
                style: {
                  fill: "#666",
                  text: this.options.updatedDate,
                  font: `${this.$fz(0.2)}px Calibri`
                }
              }
            ]
          },
          {
            type: "group",
            right: this.$fz(0.15) * 1,
            bottom: this.$fz(0.15) * 1.5,
            children: [
              {
                type: "text",
                z: 100,
                left: "right",
                top: "middle",
                style: {
                  fill: "#333",
                  text: this.watermark
                    ? "数据来源:" + this.options.dataSources
                    : "",
                  font: `${this.$fz(0.14)}px 黑体`
                }
              }
            ]
          }
        ],

        tooltip: {
          trigger: "axis",
          confine: true,
          backgroundColor: "rgba(255, 255, 255,0)",
          formatter: params => {
            let a = "";
            let b = "";
            let c = "";
            let dom = `<div style="padding:0.052rem  0 0.125rem;font-size:0.104167rem;font-weight:bold;color:#1D3F6C;">${params[0].name}</div>`;
            for (let i = 0; i < params.length; i++) {
              if (params[i].seriesName.split("_")[1]) {
                a = `<div style="height:0.09375rem;line-height:0.09375rem;color:#666;font-size:0.072917rem">${
                  params[i].seriesName.split("_")[1]
                }</div>`;
              }
              if (params[i].seriesName.split("_")[0]) {
                b = `<div style="height:0.09375rem;line-height:0.09375rem;padding-top:0.026042rem;color:#666;font-size:0.072917rem">${
                  params[i].seriesName.split("_")[0]
                }</div>`;
              }
              c = `<div style="padding:0.052083rem 0 0.078125rem;color:#000;font-size:0.114583rem;font-weight:bold;">${
                !!params[i].value ? this.formatNum(params[i].value) : "-"
              }</div>`;
              dom = dom + a + b + c;
            }
            return `<div style="width:auto;height:auto;padding:0 0.078125rem;border-radius: 0.026042rem;background:#fff;box-shadow: darkgrey 0px 0px 10px 3px;">${dom}</div>`;
          },
          axisPointer: {
            label: { show: false }
          }
        },
        // color: ["#1DD6CF", "#ED8DD0"], // 控制 lengend icon 的颜色
        legend: {
          data: legend,
          selectedMode: true, //是否可以通过点击图例改变系列的显示状态
          formatter: name => {
            if (!this.options.hideLegend) {
              return [`${name.split("_")[1]}`, `${name.split("_")[0]}`].join(
                "\n"
              );
            } else {
              return [];
            }
          },
          top: "13%",
          icon: "none",
          textStyle: {
            color: params => {},
            fontSize: this.$fz(0.14)
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
              color: "#888",
              fontSize: this.$fz(0.16)
            }
          }
        },
        yAxis: [
          {
            type: "value",
            min: Min1,
            max: Max1,
            splitNumber: 5,
            interval: (Max1 - Min1) / 5,
            name: [
              `{div|${this.options.yName.en}}`,
              `{divch|${this.options.yName.ch}}`
            ].join("\n"),
            nameTextStyle: {
              rich: {
                div: {
                  color: "#666",
                  fontSize: this.$fz(0.18),
                  padding: [2, 0, 0, -45]
                },
                divch: {
                  color: "#666",
                  fontSize: this.$fz(0.14),
                  padding: [2, 0, 2, -58]
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
                color: "#666",
                fontSize: this.$fz(0.16)
              }
            }
          },
          {
            type: "value",
            show: this.options.yearOnYear,
            min: Min2,
            max: Max2,
            splitNumber: 5,
            interval: (Max2 - Min2) / 5,
            name: [
              this.options.y2Name ? `{div|${this.options.y2Name.ch}}` : "",
              this.options.y2Name ? `{div|${this.options.y2Name.en}}` : ""
            ].join("\n"),
            nameTextStyle: {
              rich: {
                div: {
                  color: "#333",
                  fontSize: this.$fz(0.14),
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
              formatter:
                "{value}" +
                `${
                  this.options.unit2Symbol == "" || this.options.unit2Symbol
                    ? " " + this.options.unit2Symbol
                    : " %"
                }`, //右侧Y轴文字显示
              textStyle: {
                color: "#333",
                fontSize: this.$fz(0.14)
              }
            }
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
<style scoped></style>
