<template>
  <!-- :ref="totalData.id" -->
  <div ref="pieChart" id="pieChart" style="width:100%;
    height:100%" @contextmenu.prevent></div>
</template>

<script>
import echarts from "echarts";
export default {
  data() {
    return {
      chart: "",
      watermark: false,
      chartDataSourcesEn: "",
      chartDataSourcesCh: ""
    };
  },
  props: {
    totalData: {},
    value: {}
  },
  watch: {
    "$store.state.fullScreen.isFullScreen"() {
      this.drawPie();
      this.chart.resize();
    },
    totalData: {
      // 表示对象中属性变化的处理函数，这个函数只能叫这个名字
      handler(newName, oldName) {
        this.drawPie();
      },
      deep: true // 表示开启深度监听
    }
  },
  onLoad() {},
  mounted() {
    this.chartDataSourcesEn =
      "Data Sources:" +
      (
        (this.totalData.dataSources && this.totalData.dataSources.en
          ? this.totalData.dataSources.en
          : "") +
        (this.totalData.dataSources && this.totalData.dataSources.enSecond
          ? this.totalData.dataSources.enSecond
          : "") +
        (this.totalData.dataSources && this.totalData.dataSources.enThird
          ? this.totalData.dataSources.enThird
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
      if (curlen + element.length > 94) {
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
      (this.totalData.dataSources && this.totalData.dataSources.ch
        ? this.totalData.dataSources.ch
        : "") +
      (this.totalData.dataSources && this.totalData.dataSources.chSecond
        ? this.totalData.dataSources.chSecond
        : "") +
      (this.totalData.dataSources && this.totalData.dataSources.chThird
        ? this.totalData.dataSources.chThird
        : "")
    ).replace(/_/g, "");
    this.$EventBus.$on("resize", () => {
      clearInterval(this.timer);
      this.timer = setTimeout(async () => {
        this.drawPie();
        this.chart.resize();
      }, 1000);
    });
    this.drawPie();
  },
  methods: {
    downloadFile() {
      //添加水印
      this.watermark = true;
      this.drawPie();
      let aLink = document.createElement("a");
      let blob = this.base64ToBlob();
      let evt = document.createEvent("HTMLEvents");
      evt.initEvent("click", true, true);
      aLink.download = this.totalData.title.ch; //下载图片的名称
      aLink.href = URL.createObjectURL(blob);
      aLink.click();
      //消除水印
      this.watermark = false;
      this.drawPie();
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
    drawPie() {
      this.chart = echarts.init(document.getElementById("pieChart"));
      let that = this;
      // 绘制图表
      let option = {
        title: {
          left: "center",
          top: "2%",
          text: this.totalData.title.en,
          textStyle: {
            color: "#333",
            fontSize: this.$fz(0.26)
          },
          subtext: this.totalData.title.ch,
          subtextStyle: {
            color: "#333",
            fontSize: this.$fz(0.18)
          }
        },
        tooltip: {
          confine: true,
          trigger: "item",
          backgroundColor: "rgba(255, 255, 255,0)",
          formatter: params => {
            let year = `<div style="padding:0.052rem  0 0.125rem; color:#1D3F6C;font-size:0.104167rem;font-family: Calibri;font-weight: bold;">${this.value}</div>`;
            let a = `<div style="height:0.09375rem;line-height:0.09375rem;color:#666;font-size:0.072917rem">${
              params.data.valueName.split("_")[1]
            }</div>`;
            let b = `<div style="height:0.09375rem;line-height:0.09375rem;padding-top:0.02rem;color:#666;font-size:0.072917rem">${
              params.data.valueName.split("_")[0]
            }</div>`;
            let c = `<div style="height:0.09375rem;line-height:0.09375rem;color:#666;font-size:0.072917rem">${
              params.data.proportionName.split("_")[1]
            }</div>`;
            let d = `<div style="height:0.09375rem;line-height:0.09375rem;padding-top:0.02rem;color:#666;font-size:0.072917rem">${
              params.data.proportionName.split("_")[0]
            }</div>`;
            let e = `<div style="padding:0.05rem 0 0.08rem;color:#000;font-size:0.114583rem;font-weight:bold;">${params.value}</div>`;
            let f = `<div style="padding:0.05rem 0 0.08rem;color:#000;font-size:0.114583rem;font-weight:bold;"">${
              // params.data.proportion.toFixed(1)
              (Math.round(params.data.proportion * 10) / 10).toFixed(1)
            }%</div>`;
            let dom = year + a + b + e + c + d + f;
            return `<div style="width:auto;height:auto;border-radius:0.026rem;padding: 0 0.078125rem;background:#fff;box-shadow: #999 0px 0px .026rem 1px;">${dom}</div>`;
          }
        },
        series: [
          {
            type: "pie",
            radius: "70%", //控制内容大小
            center: ["50%", "52%"],
            data: this.totalData.seriesData,
            emphasis: {
              itemStyle: {
                shadowBlur: 5,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)"
              }
            },
            label: {
              formatter: params => {
                return [
                  `{a|${params.name.split("_")[1]}}`,
                  `{a|${params.name.split("_")[0]}}`
                ].join("\n");
              },
              rich: {
                a: {
                  lineHeight: this.$fz(0.18),
                  fontSize: this.$fz(0.14)
                }
              }
            }
          }
        ],
        graphic: [
          {
            type: "image",
            left: that.$refs.pieChart.offsetWidth / 2.86,
            top: that.$refs.pieChart.offsetHeight / 2.56,
            z: 9999,
            style: {
              image: require("../../assets/img/waterMark.png"),
              width: that.$refs.pieChart.offsetWidth / 3.33,
              height: that.$refs.pieChart.offsetWidth / 4.55
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
                  text: this.totalData.updatedDate,
                  font: `${this.$fz(0.2)}px Calibri`
                }
              }
            ]
          },
          {
            type: "group",
            right: this.$fz(0.15),
            bottom: this.totalData.bottomDistance
              ? this.totalData.bottomDistance
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
                top: this.totalData.grid
                  ? this.totalData.grid.enGapch
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
        ]
      };
      this.chart.setOption(option, true);
    }
  }
};
</script>
<style scoped>
#shui {
  position: absolute;
  left: 0px;
  top: 0px;
}
</style>

