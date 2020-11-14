<template>
  <div ref="chartBar" style="width:100%;height:100%;"></div>
</template>

<script>
import echarts from "echarts";
export default {
  data() {
    return {
      timer: null,
      myChartBar: Object
    };
  },
  props: {
    chartBarData: {
      type: Object,
      required: true
    }
  },
  watch: {
     "$store.state.fullScreen.isFullScreen"() {
       this.initChart()
    },
    chartBarData: {
      handler(newName, oldName) {
        this.initChart();
      },
      deep: true
    }
  },
  created() {},
  mounted() {
    if (JSON.stringify(this.chartBarData) != "{}") {
      this.initChart();
      this.$EventBus.$on("resize", () => {
        this.timer = null;
        this.timer = setTimeout(async () => {
          console.log("页面尺寸变化");
          await this.initChart();
        }, 1000);
      });
    }
  },
  methods: {
    downloadFile() {
      //添加水印
      this.chartBarData.watermark = true;
      this.initChart();
      let aLink = document.createElement("a");
      let blob = this.base64ToBlob();
      let evt = document.createEvent("HTMLEvents");
      evt.initEvent("click", true, true);
      aLink.download = this.chartBarData.title.ch; //下载图片的名称
      aLink.href = URL.createObjectURL(blob);
      aLink.click();
      //消除水印
      this.chartBarData.watermark = false;
      this.initChart();
    },
    exportImg() {
      //echart返回一个 base64 的 URL
      return this.myChartBar.getDataURL({
        type: "png",
        pixelRatio: 5, //清晰度
        backgroundColor: "#fff"
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
    initChart() {
      //找出y轴数值最大最小值
      let totalArray = [];
      let yearArray = [];
      let Max1, Min1, Max2, Min2;
      for (let j = 0; j < this.chartBarData.series.length; j++) {
        for (let i = 0; i < this.chartBarData.series[0].data.length; i++) {
          if (this.chartBarData.series[0].data) {
            totalArray.push(this.chartBarData.series[j].data[i]);
          }
          if (this.chartBarData.series[j].yearOnYear) {
            yearArray.push(this.chartBarData.series[j].yearOnYear[i]);
          }
        }
      }
      if (this.chartBarData) {
        Max1 = this.calMax(totalArray);
        Min1 = this.calMin(totalArray);
        Max2 = this.calMax(yearArray);
        Min2 = this.calMin(yearArray);
      }
      let series = [];
      let legend = [];
      for (let j = 0; j < this.chartBarData.series.length; j++) {
        series.push(
          {
            name: this.chartBarData.series[j].name,
            type: "bar",
            // barWidth: "30%",
            itemStyle: {
              normal: {
                color: params => {
                  let colorList = this.chartBarData.series[j].color;
                  return colorList[params.dataIndex] || colorList[0];
                }
              }
            },
            data: this.chartBarData.series[j].data
          },
          {
            name: this.chartBarData.series[j].name,
            type: "line",
            yAxisIndex: 1, //使用的 y 轴的 index，在单个图表实例中存在多个 y轴的时候有用
            showSymbol: false,
            lineStyle: {
              color: '#f00fff',
              width: 1.5,
              type: "dashed"
            },
            data: this.chartBarData.yearOnYear
              ? this.chartBarData.series[j].yearOnYear
              : []
          }
        );
        legend.push({
          name: this.chartBarData.series[j].name,
          textStyle: {
            color: this.chartBarData.series[j].color
          }
        });
      }
      let option = {
        title: {
          text: this.chartBarData.title.subtext,
          subtext: this.chartBarData.title.text,
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
        legend:{
          data: legend,
          selectedMode: true, //是否可以通过点击图例改变系列的显示状态
          formatter: name => {
            if(!this.chartBarData.hideLegend){
              return [`${name.split("_")[1]}`, `${name.split("_")[0]}`].join(
              "\n"
              );
            }else{
              return []
            }
          },
          top: "13%",
          icon: "none",
          textStyle: {
            color: params => {},
            fontSize: this.$fz(0.14)
          }
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
                  text: this.chartBarData.updatedDate,
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
                  text: this.chartBarData.watermark
                    ? "数据来源:" + this.chartBarData.dataSources
                    : "",
                  font: `${this.$fz(0.14)}px 黑体`
                }
              }
            ]
          }
        ],
        tooltip: {
          confine:true,
          trigger: "axis",
          backgroundColor: "rgba(225,225,255,0)",
          axisPointer: {
            type: "line" // 默认为直线，可选为：'line' | 'shadow'
          },
          formatter: params => {
            let a = "";
            let b = "";
            let c = "";
            let dom = `<div style="padding:0.052rem 0 0.055rem 0; line-height:0.12rem; font-size:0.09375rem; font-weight:bold;color:#666;">
              <span>${params[0].name.split("\n")[0]}</span><br/>
              <span style="font-size:0.072917rem; font-weight:normal;">${
                params[0].name.includes("\n")?params[0].name.split("\n")[1]:''
              }</span>
            </div>`;
            for (let i = 0; i < params.length; i++) {
              if (params[i].seriesName.includes("_")) {
                if (params[i].seriesName.split("_")[1]) {
                  a = `<div style="height:0.09375rem;line-height:0.09375rem;color:#3E3E3E;font-size:0.072917rem">${
                    params[i].seriesName.split("_")[1]
                  }</div>`;
                }
                if (params[i].seriesName.split("_")[0]) {
                  b = `<div style="height:0.09375rem;line-height:0.09375rem;padding-top:0.026042rem;color:#7C7C7C;font-size:0.0625rem">${
                    params[i].seriesName.split("_")[0]
                  }</div>`;
                }
              }
              c = `<div style="padding:0.052083rem 0 0.078125rem;color:#333;font-size:0.114583rem;font-weight:bold;">${!!params[i].value?params[i].value.toFixed(1) :"-"}</div>`;
              dom = dom + a + b + c;
            }
            return `<div style="width:auto;max-height:height:auto;padding:0 0.078125rem;border-radius: 0.026042rem;background:#fff;box-shadow: darkgray 0px 0px 10px 3px;">${dom}</div>`;
          }
        },
        grid: {
          top: this.chartBarData.grid?this.chartBarData.grid.top:"23%",
          left: this.chartBarData.left?this.chartBarData.grid.left:"3%",
          right: this.chartBarData.right?this.chartBarData.grid.right:"4%",
          bottom: this.chartBarData.bottom?this.chartBarData.grid.bottom:"10%",
          containLabel: true
        },
        xAxis: [
          {
            type: "category",
            data: this.chartBarData.xData,
            axisLabel: {
              show: this.chartBarData.showAxisLabel == false ? false : true,
              // interval: 0, //强制显示全
              fontSize: this.$fz(0.14),
              rotate: 45,
              margin: 10 //刻度标签与轴线之间的距离
            },
            axisLine: {
              lineStyle: {
                color: "#8C8C8C"
              }
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
            min: Min1,
            max: Max1,
            splitNumber: 5,
            interval: (Max1 - Min1) / 5,
            name: [
              `{diven|${this.chartBarData.yName.en}}`,
              `{div|${this.chartBarData.yName.ch}}`
            ].join("\n"),
            nameTextStyle: {
              rich: {
                diven: {
                  color: "#666",
                  fontSize: this.$fz(0.18),
                  padding: [2,0]
                },
                div: {
                  color: "#666",
                  fontSize: this.$fz(0.14),
                  padding: [2,0]
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
                color: "#333",
                fontSize: this.$fz(0.14)
              }
            }
          },
          {
            type: "value",
            show: this.chartBarData.yearOnYear,
            min: Min2,
            max: Max2,
            splitNumber: 5,
            interval: (Max2 - Min2) / 5,
            name: [
              this.chartBarData.y2Name ? `{div|${this.chartBarData.y2Name.en}}`: "",
              this.chartBarData.y2Name ? `{divch|${this.chartBarData.y2Name.ch}}`: ""
            ].join("\n"),
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
              formatter: "{value}" +
                `${
                  this.chartBarData.unit2Symbol == "" || this.chartBarData.unit2Symbol
                    ? " " + this.chartBarData.unit2Symbol
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
      this.myChartBar = echarts.init(this.$refs.chartBar);
      this.myChartBar.setOption(option);
      this.myChartBar.resize();
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
  },
  beforeDestroy() {
    this.$EventBus.$off("resize");
  }
};
</script>
<style scoped>
</style>

