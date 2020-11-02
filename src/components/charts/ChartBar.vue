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
      aLink.download = "zhangsan"; //下载图片的名称
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
      let series = [];
      this.chartBarData.series.forEach((item, i) => {
        series.push({
          name: item.name,
          type: "bar",
          barWidth: "30%",
          data: item.data,
          itemStyle: {
            normal: {
              color: params => {
                let colorList = this.chartBarData.series[i].color;
                return colorList[params.dataIndex] || colorList[0];
              }
            }
          }
        });
      });
      let option = {
        title: {
          text: this.chartBarData.title.text,
          subtext: this.chartBarData.title.subtext,
          top: "3%",
          left: "center",
          textStyle: {
            color: "#000",
            fontSize: this.$fz(0.2)
          },
          subtextStyle: {
            color: "#CBCBCB",
            fontSize: this.$fz(0.14)
          }
        },
        graphic: [
          // 数据最后更新时间：2020-09-24 Data last updated：September 24，2020
          {
            type: "group",
            left: this.$fz(0.15) * 2,
            bottom: this.$fz(0.15) * 2.2,
            children: [
              {
                type: "text",
                z: 100,
                left: "center",
                top: "middle",
                style: {
                  fill: "#333",
                  text: "数据最后更新时间：",
                  font: `${this.$fz(0.15)}px Microsoft YaHei`
                }
              }
            ]
          },
          {
            type: "group",
            left: this.$fz(0.15) * 2,
            bottom: this.$fz(0.05) * 2.2,
            children: [
              {
                type: "text",
                z: 100,
                left: "center",
                top: "middle",
                style: {
                  fill: "#333",
                  text: "Data last updated：",
                  font: `${this.$fz(0.15)}px Microsoft YaHei`
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
                  font: `${this.$fz(0.15)}px Microsoft YaHei`
                }
              }
            ]
          }
        ],
        tooltip: {
          trigger: "axis",
          backgroundColor: "rgba(225,225,255,0)",
          axisPointer: {
            type: "line" // 默认为直线，可选为：'line' | 'shadow'
          },
          formatter: params => {
            let a = "";
            let b = "";
            let c = "";
            console.log(params);
            let dom = `<div style="padding:0.052rem 0 0.055rem 0; line-height:0.12rem; font-size:0.09375rem; font-weight:bold;color:rgba(29, 64, 109,0.8);">
              <span>${params[0].name.split("\n")[0]}</span><br/>
              <span style="font-size:0.0625rem; font-weight:normal;">${
                params[0].name.split("\n")[1]
              }</span>
            </div>`;
            for (let i = 0; i < params.length; i++) {
              if (params[i].seriesName.includes("_")) {
                if (params[i].seriesName.split("_")[0]) {
                  a = `<div style="height:0.09375rem;line-height:0.09375rem;color:#3E3E3E;font-size:0.072917rem">${
                    params[i].seriesName.split("_")[0]
                  }</div>`;
                }
                if (params[i].seriesName.split("_")[1]) {
                  b = `<div style="height:0.09375rem;line-height:0.09375rem;padding-top:0.026042rem;color:#7C7C7C;font-size:0.0625rem">${
                    params[i].seriesName.split("_")[1]
                  }</div>`;
                }
              }
              c = `<div style="padding:0.052083rem 0 0.078125rem;color:#333;font-size:0.114583rem;font-weight:bold;">${params[i].value}</div>`;
              dom = dom + a + b + c;
            }
            return `<div style="width:auto;height:auto;padding:0 0.078125rem;border-radius: 0.026042rem;background:#fff;box-shadow: darkgray 0px 0px 10px 3px;">${dom}</div>`;
          }
        },
        grid: {
          top: "23%",
          left: "3%",
          right: "4%",
          bottom: "10%",
          containLabel: true
        },
        xAxis: [
          {
            type: "category",
            data: this.chartBarData.xData,
            axisLabel: {
              show: this.chartBarData.showAxisLabel == false ? false : true,
              interval: 0, //强制显示全
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
            name: [
              `{div|${this.chartBarData.yName.ch}}`,
              `{div|${this.chartBarData.yName.en}}`
            ].join("\n"),
            nameTextStyle: {
              rich: {
                div: {
                  color: "#333",
                  fontSize: this.$fz(0.14),
                  padding: [2, 0, 0, -60]
                }
              }
            },
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
        series: series
      };
      this.myChartBar = echarts.init(this.$refs.chartBar);
      this.myChartBar.setOption(option);
      this.myChartBar.resize();
    }
  },
  beforeDestroy() {
    this.$EventBus.$off("resize");
  }
};
</script>
<style scoped>
</style>

