<template>
  <div :id="options.id" ref="barLineMix" style="width:100%;height:100%;"></div>
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
    options: {},
    selectOption: {}
  },
  onLoad() {},
  mounted() {
    if (JSON.stringify(this.options) != "{}") {
      this.drawChart();
      this.$EventBus.$on("resize", () => {
        this.timer = null;
        this.timer = setTimeout(async () => {
          await this.drawChart();
        }, 1000);
      });
    }
  },
  beforeDestroy() {
    this.$EventBus.$off("resize");
  },
  watch: {
    "$store.state.fullScreen.isFullScreen"() {
      this.drawChart();
    },
    options: {
      handler(newName, oldName) {
        this.drawChart();
      },
      deep: true
    }
  },
  methods: {
    downloadFile() {
      //添加水印
      this.watermark = true;
      this.drawChart();
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
        this.drawChart();
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
      let value = it.value.toFixed(1);
      return value && value.toString().replace(/(?!^)(?=(\d{3})+\.)/g, ",");
    },
    //企业数 转换成整数
    formatInt(it) {
      let value = it.value;
      return (
        value &&
        value.toString().replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, "$&,")
      );
    },
    drawChart() {
      this.chart = echarts.init(document.getElementById(this.options.id));
      //找出y轴数值最大最小值
      let that = this;
      let totalArray = [];
      let yearArray = [];
      let Max1, Min1, Max2, Min2;
      for (let j = 0; j < this.options.series.length; j++) {
        for (let i = 0; i < this.options.series[j].data.length; i++) {
          if (
            this.options.series[j].data &&
            this.options.series[j].yAxisIndex == 0
          ) {
            totalArray.push(this.options.series[j].data[i]);
          }
          if (
            this.options.series[j].data &&
            this.options.series[j].yAxisIndex == 1
          ) {
            yearArray.push(this.options.series[j].data[i]);
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
      for (var j = 0; j < this.options.series.length; j++) {
        series.push(
          {
            name: this.options.series[j].name,
            type: this.options.series[j].type
              ? this.options.series[j].type
              : "bar",
            smooth: true,
            yAxisIndex: this.options.series[j].yAxisIndex
              ? this.options.series[j].yAxisIndex
              : 0,
            itemStyle: {
              normal: {
                show: true,
                color: this.options.series[j].color
                  ? this.options.series[j].color
                  : ""
              }
            },
            data: this.options.series[j].data ? this.options.series[j].data : []
          }
          //   ,
          //   {
          //     // clip: true,
          //     name: this.options.yearOnYear
          //       ? this.options.series[j].name.split("|")[1]
          //       : "",
          //     type: "line",
          //     yAxisIndex: 1,
          //     // symbolSize: 6,
          //     //  itemStyle: {
          //     //   normal: {
          //     //     show: true,
          //     //     color:this.options.series[j].color
          //     //   }
          //     // },
          //     data: this.options.yearOnYear
          //       ? this.options.series[j].yearOnYear
          //       : "[]"
          //   }
        );
      }
      // 绘制图表
      let option = {
        title: {
          text: this.options.title.en,
          subtext: this.options.title.ch,
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
          confine: true, //限制在区域内
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type:
              this.options.yLabel && !this.options.yLabel[0] ? "line" : "shadow" // 默认为直线，可选为：'line' | 'shadow'
          },
          backgroundColor: "rgba(255, 255, 255,0)",
          formatter: params => {
            let dom = "";
            let rowCount = 6; //一列允许的最大行数
            let lineCount = parseInt(params.length / rowCount) + 1; //列数
            let a = "";
            let b = "";
            let c = "";
            dom += `<div style="width:auto;height:auto;padding-left:0.078125rem;border-radius: 0.026042rem;background:#fff;box-shadow: darkgrey 0px 0px 10px 3px;">`;
            dom += "<table>";
            dom += `<div style="padding:0.052rem  0 0.052rem; color:#1D3F6C;font-size:0.104167rem;font-family: Calibri;font-weight: bold;">${params[0].name}</div>`;
            if (this.selectOption) {
              //判断功能区是否有筛选
              dom += `<div style="color:#1D3F6C;font-weight: bold;"><p style="font-size:0.104167rem;font-family: Calibri;">${this.selectOption.value.en}</p><p style="font-size:0.083333rem;margin-top:-0.1rem;font-family: SimHei;">${this.selectOption.value.ch}</p></div>`;
            }
            for (let i = 0; i < rowCount; i++) {
              dom += `<tr>`;
              for (
                let j = 0;
                j < lineCount && j * rowCount + i < params.length;
                j++
              ) {
                let it = params[j * rowCount + i];
                if (it.seriesName.split("_")[1]) {
                  a = `<div style="height:0.09375rem;line-height:0.09375rem;color:#666;font-size:0.072917rem">${
                    it.seriesName.split("_")[1]
                  }</div>`;
                }
                if (it.seriesName.split("_")[0]) {
                  b = `<div style="height:0.09375rem;line-height:0.09375rem;padding-top:0.02rem;color:#666;font-size:0.072917rem">${
                    it.seriesName.split("_")[0]
                  }</div>`;
                }
                c = `<div style="padding:0.05rem 0 0.08rem;color:#000;font-size:0.114583rem;font-weight:bold;">${
                  !this.options.series[i].yAxisIndex &&
                  this.options.series[i].yAxisIndex == 0 &&
                  !!it.value
                    ? this.formatNum(it)
                    : this.options.series[i].yAxisIndex &&
                      this.options.series[i].yAxisIndex == 1 &&
                      !!it.value
                    ? this.options.series[i].rightInt
                      ? this.formatNum(it)
                      : this.formatNum(it) + "%"
                    : "-"
                }</div>`;
                dom += `<td style="padding-right:0.08rem;">${a + b + c}</td>`;
              }
              dom += `</tr>`;
            }
            dom += "</table>";
            dom += `</div>`;
            return dom;
          }
        },
        legend: {
          width: "80%",
          top: "13%",
          show: !this.options.hideLegend,
          // icon:'none',
          formatter: name => {
            return [`${name.split("_")[1]}`, `${name.split("_")[0]}`].join(
              "\n"
            );
          },
          textStyle: {
            // color: params => {
            // },
            fontSize: this.$fz(0.14)
          }
        },
        // 	年度完成率和季度完成率颜色
        // color: ["#071960", "#1740B4", "#1962CA", ],
        grid: {
          left: "5%",
          right: "4%",
          top: "30%",
          bottom: this.watermark
            ? this.options.grid
              ? this.options.grid.bottom
              : "11%"
            : "8%",
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
              // interval: 0, //设置为 1，表示『隔一个标签显示一个标签』
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
            data: this.options.xData
          }
        ],
        yAxis: [
          {
            type: "value",
            show: true,
            position:
              this.options.yPosition && this.options.yPosition[0]
                ? this.options.yPosition[0]
                : "left",
            min: Min1,
            max: Max1,
            splitNumber: 5,
            interval: (Max1 - Min1) / 5,
            name: [
              `{div|${this.options.yName ? this.options.yName.en : ""}}`,
              `{divch|${this.options.yName ? this.options.yName.ch : ""}}`
            ].join("\n"),
            nameTextStyle: {
              align: "left",
              padding: [0, -2, 0, -that.$refs.barLineMix.offsetWidth * 0.07],
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
              show: this.options.yLabel ? this.options.yLabel[0] : true,
              textStyle: {
                color: "#666",
                fontSize: this.$fz(0.16)
              }
            }
          },
          {
            show: true,
            position:
              this.options.yPosition && this.options.yPosition[1]
                ? this.options.yPosition[1]
                : "right",
            min: Min2,
            max: Max2,
            splitNumber: 5,
            interval: (Max2 - Min2) / 5,
            name: [
              `{div|${this.options.yName2 ? this.options.yName2.en : ""}}`,
              `{divch|${this.options.yName2 ? this.options.yName2.ch : ""}}`
            ].join("\n"),
            nameTextStyle: {
              align: "left",
              padding: [0, -2, 0, -that.$refs.barLineMix.offsetWidth * 0.07],
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
            // 单位 显示位置
            // nameLocation: 'start',
            type: "value",
            axisLabel: {
              //坐标轴刻度标签的相关设置。
              // interval: 0, //设置为 1，表示『隔一个标签显示一个标签』
              show: this.options.yLabel ? this.options.yLabel[1] : true,
              formatter: this.options.rightInt ? "{value}" : "{value}%",
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
            }
          }
        ],
        graphic: [
          {
            type: "image",
            left: that.$refs.barLineMix.offsetWidth / 2.86,
            top: that.$refs.barLineMix.offsetHeight / 2.56,
            z: 9999,
            style: {
              image: require("../../assets/img/waterMark.png"),
              width: that.$refs.barLineMix.offsetWidth / 3.33,
              height: that.$refs.barLineMix.offsetWidth / 4.55
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
          }
          // {
          //   type: "group",
          //   right: this.$fz(0.15),
          //   bottom: this.options.bottomDistance
          //     ? this.options.bottomDistance
          //     : "0",
          //   children: [
          //     {
          //       type: "text",
          //       z: 100,
          //       left: "right",
          //       style: {
          //         fill: "#666",
          //         text: this.watermark ? this.chartDataSourcesEn : "",
          //         font: `${this.$fz(0.18)}px Calibri`
          //       }
          //     },
          //     {
          //       type: "text",
          //       z: 100,
          //       left: "right",
          //       top: this.options.grid
          //         ? this.options.grid.enGapch
          //         : this.$fz(0.2),
          //       style: {
          //         fill: "#666",
          //         text: this.watermark
          //           ? "数据来源:" +
          //             (this.chartDataSourcesCh.slice(0, 54) +
          //               "\n" +
          //               this.chartDataSourcesCh.slice(54, 100))
          //           : "",
          //         font: `${this.$fz(0.14)}px 黑体`
          //       }
          //     }
          //   ]
          // }
        ],
        series: series
      };
      this.chart.setOption(option, true);
      this.chart.resize();
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
