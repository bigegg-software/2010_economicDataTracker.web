<template>
  <div ref="chartBar" style="width:100%;height:100%;"></div>
</template>

<script>
import echarts from "echarts";
export default {
  data() {
    return {
      timer: null,
      myChartBar: Object,
      selected: {},
      chartDataSourcesEn: "",
      chartDataSourcesCh: "",
      watermark: false,
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
      this.initChart();
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
    this.chartDataSourcesEn =  "Data Sources:" +(this.chartBarData.dataSources.enThird
      ? this.chartBarData.dataSources.en +
        this.chartBarData.dataSources.enSecond +
        this.chartBarData.dataSources.enThird
      : this.chartBarData.dataSources.enSecond
      ? this.chartBarData.dataSources.en +
        this.chartBarData.dataSources.enSecond
      : this.chartBarData.dataSources.en
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
        console.log("arrDot", arrDot);
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

    this.chartDataSourcesCh = (this.chartBarData.dataSources.chThird
      ? this.chartBarData.dataSources.ch +
        this.chartBarData.dataSources.chSecond +
        this.chartBarData.dataSources.chThird
      : this.chartBarData.dataSources.chSecond
      ? this.chartBarData.dataSources.ch +
        this.chartBarData.dataSources.chSecond
      : this.chartBarData.dataSources.ch
    ).replace(/_/g, "");
    console.log(this.chartDataSourcesEn, this.chartDataSourcesCh);
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
      this.watermark = true;
      this.initChart();
      let aLink = document.createElement("a");
      let blob = this.base64ToBlob();
      let evt = document.createEvent("HTMLEvents");
      evt.initEvent("click", true, true);
      aLink.download = this.chartBarData.title.text; //下载图片的名称
      aLink.href = URL.createObjectURL(blob);
      aLink.click();
      //消除水印
      this.watermark = false;
      this.initChart();
    },
    exportImg() {
      //echart返回一个 base64 的 URL
      return this.myChartBar.getDataURL({
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
      let strs = value.toFixed(1);
      return strs && strs.toString().replace(/(?!^)(?=(\d{3})+\.)/g, ",");
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
            name: this.chartBarData.spliceCon
              ? this.chartBarData.series[j].name.split("_")[0] +
                this.chartBarData.spliceCon.ch +
                "_" +
                this.chartBarData.series[j].name.split("_")[1] +
                " " +
                this.chartBarData.spliceCon.en
              : this.chartBarData.series[j].name,
            type: "line",
            yAxisIndex: 1, //使用的 y 轴的 index，在单个图表实例中存在多个 y轴的时候有用
            showSymbol: false,
            smooth: true, //平滑曲线显示
            lineStyle: {
              color: "#c33531",
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
      let that = this;
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
        legend: {
          selected: this.selected,
          data: legend,
          selectedMode: true, //是否可以通过点击图例改变系列的显示状态
          formatter: name => {
            if (!this.chartBarData.hideLegend) {
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
        graphic: [
          {
            type: "image",
            left: that.$refs.chartBar.offsetWidth / 2.86,
            top: that.$refs.chartBar.offsetHeight / 2.56,
            z: 9999,
            style: {
              image: require("../../assets/img/waterMark.png"),
              width: that.$refs.chartBar.offsetWidth / 3.33,
              height: that.$refs.chartBar.offsetWidth / 4.55
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
                  text: this.chartBarData.updatedDate,
                  font: `${this.$fz(0.2)}px Calibri`
                }
              }
            ]
          },
          {
            type: "group",
            right: this.$fz(0.15),
            bottom:  this.chartBarData.bottomDistance
              ? this.chartBarData.bottomDistance
              : "0",
            children: [
              {
                type: "text",
                z: 100,
                left: "right",
                // top: "middle",
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
                top: this.chartBarData.grid
                  ? this.chartBarData.grid.enGapch
                  : this.$fz(0.2),
                style: {
                  fill: "#666",
                  text: this.watermark
                    ? "数据来源:" +
                      (this.chartDataSourcesCh.slice(0, 56) +
                        "\n" +
                        this.chartDataSourcesCh.slice(56, 100))
                    : "",
                  font: `${this.$fz(0.14)}px 黑体`
                }
              }
            ]
          }
        ],
        tooltip: {
          confine: true,
          trigger: "axis",
          backgroundColor: "rgba(225,225,255,0)",
          axisPointer: {
            type: "line" // 默认为直线，可选为：'line' | 'shadow'
          },
          formatter: params => {
            let a = "";
            let b = "";
            let c = "";
            let dom = "";
            let rowCount = 6; //一列允许的最大行数
            let lineCount = parseInt(params.length / rowCount) + 1; //列数
            dom += `<div style="width:auto;max-height:height:auto;padding:0 0.078125rem;border-radius: 0.026042rem;background:#fff;box-shadow: darkgray 0px 0px 10px 3px;">`;
            dom += "<table>";
            dom += `<div style="padding:0.052rem 0 0.055rem 0; line-height:0.12rem; color:#1D3F6C;font-size:0.104167rem;font-family: Calibri;font-weight: bold;">
            <span>${params[0].name.split("\n")[0]}</span><br/>
               <span style="font-size:0.072917rem; font-weight:normal;">${
                 params[0].name.includes("\n")
                   ? params[0].name.split("\n")[1]
                   : ""
               }</span>
            </div>`;
            for (let i = 0; i < rowCount; i++) {
              dom += "<tr>";
              for (
                let j = 0;
                j < lineCount && j * rowCount + i < params.length;
                j++
              ) {
                let it = params[j * rowCount + i];
                if (it.seriesName.includes("_")) {
                  if (it.seriesName.split("_")[1]) {
                    a = `<div style="height:0.09375rem;line-height:0.09375rem;color:#3E3E3E;font-size:0.072917rem">${
                      it.seriesName.split("_")[1]
                    }</div>`;
                  }
                  if (it.seriesName.split("_")[0]) {
                    b = `<div style="height:0.09375rem;padding-top:0.01rem;line-height:0.09375rem;color:#7C7C7C;font-size:0.0625rem">${
                      it.seriesName.split("_")[0]
                    }</div>`;
                  }
                }
                c = `<div style="padding:0.03rem 0 0.08rem;color:#333;font-size:0.114583rem;font-weight:bold;">${
                  !!it.value
                    ? this.formatNum(it.value) +
                      (it.seriesName.includes("占比") ||
                      it.seriesName.includes("同比")
                        ? "%"
                        : "")
                    : "-"
                }</div>`;
                dom += `<td style="padding-right:0.08rem;">${a + b + c}</td>`;
              }
              dom += "</tr>";
            }
            dom += "</table>";
            dom += `</div>`;
            return dom;
          }
        },
        grid: {
          top: this.chartBarData.grid ? this.chartBarData.grid.top : "23%",
          left: this.chartBarData.grid ? this.chartBarData.grid.left : "3%",
          right: this.chartBarData.Yearonshow
            ? this.chartBarData.yearOnYear
              ? "3%"
              : "-2%"
            : "4%",
          bottom: this.chartBarData.grid
            ? this.chartBarData.grid.bottom
            : "10%",
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
              align: "left",
              padding: [0, 0, -2, -that.$refs.chartBar.offsetWidth * 0.07],
              color: "#666",
              rich: {
                diven: {
                  fontSize: this.$fz(0.18)
                },
                div: {
                  padding:[0,0,2,0],
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
            show: this.chartBarData.yearOnYear,
            min: Min2,
            max: Max2,
            splitNumber: 5,
            interval: (Max2 - Min2) / 5,
            name: [
              this.chartBarData.y2Name
                ? `{div|${this.chartBarData.y2Name.en}}`
                : "",
              this.chartBarData.y2Name
                ? `{divch|${this.chartBarData.y2Name.ch}}`
                : ""
            ].join("\n"),
            nameTextStyle: {
              align: "left",
              padding: [0, 0, 0, 7],
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
                  this.chartBarData.unit2Symbol == "" ||
                  this.chartBarData.unit2Symbol
                    ? " " + this.chartBarData.unit2Symbol
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
      this.myChartBar = echarts.init(this.$refs.chartBar);
      this.myChartBar.off("legendselectchanged");
      this.myChartBar.on("legendselectchanged", param => {
        this.selected = param.selected;
      });
      this.myChartBar.setOption(option, true);
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

