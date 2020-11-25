<template>
  <!-- :ref="totalData.id" -->
  <div ref="pieChart" id="pieChart" style="width:100%;
    height:100%"></div>
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
      this.totalData.watermark = true;
      this.drawPie();
      let aLink = document.createElement("a");
      let blob = this.base64ToBlob();
      let evt = document.createEvent("HTMLEvents");
      evt.initEvent("click", true, true);
      aLink.download = this.totalData.title.ch; //下载图片的名称
      aLink.href = URL.createObjectURL(blob);
      aLink.click();
      //消除水印
      this.totalData.watermark = false;
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
            let year = `<div style="color:#1D3F6C;font-size:0.104167rem;font-family: Calibri;font-weight: bold;margin-bottom:0.02rem;">${this.value}</div>`;
            let a = `<div style="color:#666;font-size:0.09375rem">${
              params.data.valueName.split("_")[1]
            }</div>`;
            let b = `<div style="color:#666;font-size:0.072917rem">${
              params.data.valueName.split("_")[0]
            }</div>`;
            let c = `<div style="color:#666;font-size:0.09375rem">${
              params.data.proportionName.split("_")[1]
            }</div>`;
            let d = `<div style="color:#666;font-size:0.072917rem">${
              params.data.proportionName.split("_")[0]
            }</div>`;
            let e = `<div style="color:#000;font-size: 0.114583rem;font-weight:bold;margin:0.02rem 0 0.05rem;">${params.value}</div>`;
            let f = `<div style="color:#000;font-size: 0.114583rem;font-weight:bold;margin:0.02rem 0 0.05rem;">${params.data.proportion.toFixed(
              1
            )}%</div>`;
            let dom = year + a + b + e + c + d + f;
            return `<div style="width:auto;height:auto;border-radius:0.026rem;padding: 0.052083rem 0.078125rem;background:#fff;box-shadow: #999 0px 0px .026rem 1px;">${dom}</div>`;
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
            bottom: this.$fz(0.15),
            children: [
              {
                type: "text",
                z: 100,
                left: "right",
                top: "middle",
                style: {
                  fill: "#666",
                  text: this.totalData.watermark
                    ? "Data Sources:" +
                      (this.totalData.dataSources.en.length > 80
                        ? this.totalData.dataSources.en.slice(0, 80) + "..."
                        : this.totalData.dataSources.en)
                    : "",
                  font: `${this.$fz(0.18)}px Calibri`
                }
              },
              {
                type: "text",
                z: 100,
                left: "right",
                top: this.$fz(0.12),
                style: {
                  fill: "#666",
                  text: this.totalData.watermark
                    ? "数据来源:" +
                      (this.totalData.dataSources.ch.length > 80
                        ? this.totalData.dataSources.ch.slice(0, 80) + "..."
                        : this.totalData.dataSources.ch)
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

