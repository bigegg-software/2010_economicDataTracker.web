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
      let Max1, Min1;
      for (let j = 0; j < this.options.series.length; j++) {
        this.options.series[j].smooth = true; //圆滑曲线
        for (let i = 0; i < this.options.series[j].data.length; i++) {
          if (this.options.series[j].data) {
            totalArray.push(this.options.series[j].data[i]);
          }
        }
      }
      if (this.options) {
        Max1 = this.calMax(totalArray);
        Min1 = this.calMin(totalArray);
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
        tooltip: {
          trigger: "axis",
          confine: true,
          backgroundColor: "rgba(255, 255, 255,0)",
          formatter: params => {
            let dom = "";
            dom += `<div style="width:auto;height:auto;padding:0 0.078125rem;border-radius: 0.026042rem;background:#fff;box-shadow: darkgrey 0px 0px 10px 3px;">`;
            dom += `<div style="padding:0.052rem  0 0.052rem; color:#1D3F6C;font-size:0.104167rem;font-family: Calibri;font-weight: bold;">${params[0].name}</div>`;
            for (let i = 0; i < params.length; i++) {
              if (params[i].seriesName) {
                dom += `<div style="height:0.09375rem;line-height:0.09375rem;color:#666;font-size:0.072917rem">${
                  params[i].seriesName.split("_")[1]
                }</div>`;
                dom += `<div style="height:0.09375rem;line-height:0.09375rem;padding-top:0.02rem;color:#666;font-size:0.072917rem">${
                  params[i].seriesName.split("_")[0]
                }</div>`;
              }
              dom += `<div style="padding:0.05rem 0 0.08rem;color:#000;font-size:0.114583rem;font-weight:bold;">${
                !!params[i].value || params[i].value == "0"
                  ? params[i].value + "%"
                  : "-"
              }</div>`;
            }
            dom += `</div>`;
            return dom;
          },

          axisPointer: {
            label: { show: false }
          }
        },
        legend: {
          //     name: this.options.series[j].name,
          //   textStyle: {
          //     color: this.options.series[j].color
          //   }
          //   selected: this.selected,
          //   data: legend,
          selected: this.selected,
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
        grid: {
          top: "23%",
          left: "2%",
          right: "4%",
          bottom: this.watermark
            ? this.options.grid
              ? this.options.grid.bottom
              : "8%"
            : "8%",
          containLabel: true
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
        yAxis: {
          type: "value",
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
            padding: [
              0,
              -2,
              0,
              -that.$refs.lineChart.offsetWidth *
                (Max1.toString().length * 0.0236)
            ],
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
            formatter: "{value}" + " %", //右侧Y轴文字显示
            textStyle: {
              color: "#666",
              fontSize: this.$fz(0.16)
            }
          }
        },
        series: this.options.series,
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
          }
        ]
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
