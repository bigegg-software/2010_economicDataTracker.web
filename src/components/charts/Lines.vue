<template>
  <div :id="options.id" ref="lineChart" style="width:100%;height:100%;" @contextmenu.prevent></div>
</template>

<script>
import echarts from "echarts";
export default {
  data() {
    return {
      timer: null,
      chart: null,
      watermark: false,
      canvas: null,
      selected: {},
      chartDataSourcesEn: "",
      chartDataSourcesCh: ""
    };
  },
  props: {
    options: {},
    selectOption: {} //展示功能区选择的选项（外贸）
  },
  async mounted() {
    this.chartDataSourcesEn =
      "Data Sources:" +
      (
        (this.options.dataSources && this.options.dataSources.en
          ? this.options.dataSources.en
          : "") +
        (this.options.dataSources && this.options.dataSources.enSecond
          ? this.options.dataSources.enSecond
          : "") +
        (this.options.dataSources && this.options.dataSources.enThird
          ? this.options.dataSources.enThird
          : "")
      ).replace(/_/g, "");
    let str = this.chartDataSourcesEn;
    let result = "";
    let curlen = 0;
    let arrValues = str.split(" ");
    let arrRes = [];
    for (let index = 0; index < arrValues.length; index++) {
      const element = arrValues[index];
      if (element.indexOf(",") >= 0) {
        let arrDot = element.split(",");
        arrDot.map(item => {
          if (item.length > 0) {
            arrRes.push(item);
            arrRes.push(",");
          }
        });
      } else {
        arrRes.push(element);
      }
      arrRes.push(" ");
    }
    for (let i = 0; i < arrRes.length; i++) {
      const element = arrRes[i];
      if (curlen + element.length > 96) {
        curlen = 0;
        result += "\n";
        i--;
      } else {
        curlen += element.length;
        result += arrRes[i];
      }
    }
    this.chartDataSourcesEn = result;

    this.chartDataSourcesCh = (
      (this.options.dataSources && this.options.dataSources.ch
        ? this.options.dataSources.ch
        : "") +
      (this.options.dataSources && this.options.dataSources.chSecond
        ? this.options.dataSources.chSecond
        : "") +
      (this.options.dataSources && this.options.dataSources.chThird
        ? this.options.dataSources.chThird
        : "")
    ).replace(/_/g, "");
    this.$EventBus.$on("resize", () => {
      clearInterval(this.timer);
      this.timer = setTimeout(async () => {
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
      setTimeout(() => {
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
      }, 250);
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
    formatNum(it) {
      let value = (Math.round(it.value * 10) / 10).toFixed(1);
      // return value && value.toString().replace(/(?!^)(?=(\d{3})+\.)/g, ",");
      let source = String(value).split("."); //按小数点分成bai2部分
      source[0] = source[0].replace(
        new RegExp("(\\d)(?=(\\d{3})+$)", "ig"),
        "$1,"
      ); //只将整数部分进行都好分割
      return source.join("."); //再将小数部分合并进来
    },
    //企业数 转换成整数
    formatInt(it) {
      let value = it.value;
      return (
        value &&
        value.toString().replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, "$&,")
      );
    },
    initChart() {
      // 基于准备好的dom，初始化echarts实例
      this.chart = echarts.init(document.getElementById(this.options.id));
      let that = this;
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
            smooth: true, //平滑曲线显示
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
          left: "8.4%",
          right: this.options.yearOnYear ? "6%" : "4%",
          bottom: this.watermark
            ? this.options.grid
              ? this.options.grid.bottom
              : "11%"
            : "11%"
        },
        graphic: [
          {
            type: "image",
            left: that.$refs.lineChart.offsetWidth / 2.86,
            top: that.$refs.lineChart.offsetHeight / 2.56,
            z: 9999,
            style: {
              image: require("../../assets/img/waterMark.png"),
              width: that.$refs.lineChart.offsetWidth / 3.33,
              height: that.$refs.lineChart.offsetWidth / 4.55
            }
          },
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
                  font: `${this.$fz(0.14)}px SimHei`
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
            right: this.$fz(0.15),
            bottom: this.options.bottomDistance
              ? this.options.bottomDistance
              : "0",
            children: [
              {
                type: "text",
                z: 100,
                left: "right",
                style: {
                  fill: "#666",
                  text: this.watermark ? this.chartDataSourcesEn : "",
                  font: `${this.$fz(0.18)}px Calibri`
                }
              },
              {
                type: "text",
                z: 100,
                left: "right",
                top: this.options.grid
                  ? this.options.grid.enGapch
                  : this.$fz(0.2),
                style: {
                  fill: "#666",
                  text: this.watermark
                    ? "数据来源:" +
                      (this.chartDataSourcesCh.slice(0, 54) +
                        "\n" +
                        this.chartDataSourcesCh.slice(54, 100))
                    : "",
                  font: `${this.$fz(0.14)}px 黑体`
                }
              }
            ]
          },
          {
            //右上角水印
            type: "group",
            right: this.$fz(0.2),
            top: this.options.isLongTitle ? this.$fz(0.46) : this.$fz(0.15),
            children: [
              {
                type: "text",
                z: 100,
                left: 0,
                style: {
                  fill: "#666",
                  text:
                    this.watermark &&
                    this.options.yearOnYear &&
                    this.options.legendMark
                      ? "Value"
                      : "",
                  font: `${this.$fz(0.16)}px Calibri`
                }
              },
              {
                type: "text",
                z: 100,
                left: 0,
                top: this.$fz(0.16),
                style: {
                  fill: "#666",
                  text:
                    this.watermark &&
                    this.options.yearOnYear &&
                    this.options.legendMark
                      ? "金额"
                      : "",
                  font: `${this.$fz(0.14)}px 黑体`
                }
              },
              {
                type: "text",
                z: 100,
                left: this.options.legendMark
                  ? this.options.legendMark.en == "Enterprise"
                    ? this.$fz(0.73)
                    : this.$fz(0.6)
                  : "",
                top: this.$fz(0.09),
                style: {
                  fill: "#999",
                  text:
                    this.watermark &&
                    this.options.yearOnYear &&
                    this.options.legendMark
                      ? "———"
                      : "",
                  font: `${this.$fz(0.14)}px 黑体`
                }
              }
            ]
          },
          {
            //右上角水印
            type: "group",
            right: this.$fz(0.2),
            top: this.options.isLongTitle ? this.$fz(0.8) : this.$fz(0.5),
            children: [
              {
                type: "text",
                z: 100,
                left: 0,
                style: {
                  fill: "#666",
                  text:
                    this.watermark && this.options.legendMark
                      ? this.options.percent && this.options.yearOnYear
                        ? this.options.shareLegendMark.en
                        : this.options.yearOnYear
                        ? this.options.legendMark.en
                        : ""
                      : "",
                  font: `${this.$fz(0.16)}px Calibri`
                }
              },
              {
                type: "text",
                z: 100,
                left: 0,
                top: this.$fz(0.16),
                style: {
                  fill: "#666",
                  text:
                    this.watermark && this.options.legendMark
                      ? this.options.percent && this.options.yearOnYear
                        ? this.options.shareLegendMark.ch
                        : this.options.yearOnYear
                        ? this.options.legendMark.ch
                        : ""
                      : "",
                  font: `${this.$fz(0.14)}px 黑体`
                }
              },
              {
                type: "text",
                z: 100,
                left: this.$fz(0.35),
                top: this.$fz(0.1),
                style: {
                  fill: "#666",
                  text:
                    this.watermark &&
                    this.options.yearOnYear &&
                    this.options.legendMark
                      ? this.options.legendMark.doSymbol
                      : "",
                  font: `${this.$fz(0.14)}px Calibri`
                }
              },
              {
                type: "text",
                z: 100,
                left: this.options.legendMark
                  ? this.options.legendMark.en == "Enterprise"
                    ? this.$fz(0.73)
                    : this.$fz(0.6)
                  : "",
                top: this.$fz(0.09),
                style: {
                  fill: "#666",
                  text:
                    this.watermark &&
                    this.options.yearOnYear &&
                    this.options.legendMark
                      ? "- - - - - -"
                      : "",
                  font: `${this.$fz(0.14)}px Calibri`
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
            let dom = "";
            let rowCount = 6; //一列允许的最大行数
            let lineCount = parseInt(params.length / rowCount) + 1; //列数
            let a = "";
            let b = "";
            let c = "";
            dom += `<div style="width:auto;height:auto;padding:0 0.078125rem;border-radius: 0.026042rem;background:#fff;box-shadow: darkgrey 0px 0px 10px 3px;">`;
            dom += "<table>";
            if (this.selectOption) {
              //判断功能区是否有筛选
              dom += `<div style="padding:0.052rem  0 0; color:#1D3F6C;font-size:0.104167rem;font-family: Calibri;font-weight: bold;">${params[0].name}</div>`;
              dom += `<div style="color:#1D3F6C;font-weight: bold;"><p style="font-size:0.104167rem;font-family: Calibri;">${this.selectOption.en}</p><p style="font-size:0.083333rem;margin-top:-0.1rem;font-family: SimHei;">${this.selectOption.ch}</p></div>`;
            } else {
              dom += `<div style="padding:0.052rem  0 0.052rem; color:#1D3F6C;font-size:0.104167rem;font-family: Calibri;font-weight: bold;">${params[0].name}</div>`;
            }
            for (let i = 0; i < rowCount; i++) {
              dom += `<tr>`;
              for (
                let j = 0;
                j < lineCount && j * rowCount + i < params.length;
                j++
              ) {
                let it = params[j * rowCount + i];
                if (
                  this.options.yearOnYear == false ||
                  this.options.yearOnYear == undefined ||
                  i % 2 === 0
                ) {
                  if (it.seriesName.split("|")[0].split("_")[1]) {
                    a = `<div style="height:0.09375rem;line-height:0.09375rem;color:#666;font-size:0.072917rem">${
                      it.seriesName.split("|")[0].split("_")[1]
                    }</div>`;
                  }
                  if (it.seriesName.split("|")[0].split("_")[0]) {
                    b = `<div style="height:0.09375rem;line-height:0.09375rem;padding-top:0.02rem;color:#666;font-size:0.072917rem">${
                      it.seriesName.split("|")[0].split("_")[0]
                    }</div>`;
                  }
                  c = `<div style="padding:0.05rem 0 0.08rem;color:#000;font-size:0.114583rem;font-weight:bold;">${
                    !!it.value || it.value == "0"
                      ? this.options.dataInt
                        ? this.formatInt(it)
                        : this.formatNum(it)
                      : "-"
                  }</div>`;
                } else {
                  if (it.seriesName.split("|")[0].split("_")[1]) {
                    a = `<div style="height:0.09375rem;line-height:0.09375rem;color:#666;font-size:0.072917rem">${
                      it.seriesName.split("|")[1].split("_")[1]
                    }</div>`;
                  }
                  if (it.seriesName.split("|")[0].split("_")[0]) {
                    b = `<div style="height:0.09375rem;line-height:0.09375rem;padding-top:0.02rem;color:#666;font-size:0.072917rem">${
                      it.seriesName.split("|")[1].split("_")[0]
                    }</div>`;
                  }
                  c = `<div style="padding:0.05rem 0 0.08rem;color:#000;font-size:0.114583rem;font-weight:bold;">${
                    !!it.value || it.value == "0"
                      ? (this.options.yearInt
                          ? this.formatInt(it)
                          : this.formatNum(it)) +
                        (this.options.y2Name ? "" : "%")
                      : "-"
                  }</div>`;
                }
                dom += `<td style="padding-right:0.08rem;">${a + b + c}</td>`;
              }
              dom += `</tr>`;
            }
            dom += "</table>";
            dom += `</div>`;
            return dom;
          },

          axisPointer: {
            label: { show: false }
          }
        },
        // color: ["#1DD6CF", "#ED8DD0"], // 控制 lengend icon 的颜色
        legend: {
          selected: this.selected,
          data: legend,
          selectedMode: true, //是否可以通过点击图例改变系列的显示状态
          formatter: name => {
            if (!this.options.hideLegend) {
              return [
                `${name.split("|")[0].split("_")[1]}`,
                `${name.split("|")[0].split("_")[0]}`
              ].join("\n");
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
            lineStyle: {
              color: "#8c8c8c",
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
              align: "left",
              padding: [0, -2, 0, -that.$refs.lineChart.offsetWidth * 0.07],
              color: "#666",
              rich: {
                div: {
                  fontSize: this.$fz(0.18)
                },
                divch: {
                  padding: [0, 0, 2, 0],
                  fontSize: this.$fz(0.14)
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
              this.options.y2Name ? `{div|${this.options.y2Name.en}}` : "",
              this.options.y2Name ? `{divch|${this.options.y2Name.ch}}` : ""
            ].join("\n"),
            nameTextStyle: {
              align: "left",
              padding: [0, 0, 0, -that.$refs.lineChart.offsetWidth * 0.03],
              color: "#666",
              rich: {
                div: {
                  fontSize: this.$fz(0.18)
                },
                divch: {
                  fontSize: this.$fz(0.14)
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
                color: "#666",
                fontSize: this.$fz(0.16)
              }
            }
          }
        ],
        series: series
      };
      this.chart.off("legendselectchanged");
      this.chart.on("legendselectchanged", param => {
        this.selected = param.selected;
      });
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
