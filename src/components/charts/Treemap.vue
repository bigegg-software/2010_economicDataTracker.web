<template>
  <!-- <div class="container"> -->
  <div ref="treeMap" id="treemap" style="width:100%;height:100%;" @contextmenu.prevent></div>
  <!-- </div> -->
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
    totalData: {}
  },
  watch: {
    "$store.state.fullScreen.isFullScreen"() {
      this.drawTreemap();
      this.chart.resize();
    },
    totalData: {
      // 表示对象中属性变化的处理函数，这个函数只能叫这个名字
      handler(newName, oldName) {
        this.drawTreemap();
      },
      deep: true // 表示开启深度监听
    }
  },
  onLoad() {},
  mounted() {
    this.chartDataSourcesEn =
      "Data Sources:" +
      (this.totalData.dataSources.enThird
        ? this.totalData.dataSources.en +
          this.totalData.dataSources.enSecond +
          this.totalData.dataSources.enThird
        : this.totalData.dataSources.enSecond
        ? this.totalData.dataSources.en + this.totalData.dataSources.enSecond
        : this.totalData.dataSources.en
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

    this.chartDataSourcesCh = (this.totalData.dataSources.chThird
      ? this.totalData.dataSources.ch +
        this.totalData.dataSources.chSecond +
        this.totalData.dataSources.chThird
      : this.totalData.dataSources.chSecond
      ? this.totalData.dataSources.ch + this.totalData.dataSources.chSecond
      : this.totalData.dataSources.ch
    ).replace(/_/g, "");
    console.log(this.chartDataSourcesEn, this.chartDataSourcesCh);
    this.$EventBus.$on("resize", () => {
      clearInterval(this.timer);
      this.timer = setTimeout(async () => {
        this.drawTreemap();
        this.chart.resize();
      }, 1000);
    });
    this.drawTreemap();
  },
  methods: {
    downloadFile() {
      //添加水印
      this.watermark = true;
      this.drawTreemap();
      let aLink = document.createElement("a");
      let blob = this.base64ToBlob();
      let evt = document.createEvent("HTMLEvents");
      evt.initEvent("click", true, true);
      aLink.download = this.totalData.title.ch; //下载图片的名称
      aLink.href = URL.createObjectURL(blob);
      aLink.click();
      //消除水印
      this.watermark = false;
      this.drawTreemap();
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
      let strs = (Math.round(value*10)/10).toFixed(1)
      // return strs && strs.toString().replace(/(?!^)(?=(\d{3})+\.)/g, ",");
      let source = String(value).split(".");//按小数点分成bai2部分
      source[0] = source[0].replace(new RegExp('(\\d)(?=(\\d{3})+$)','ig'),"$1,");//只将整数部分进行都好分割
      return source.join(".");//再将小数部分合并进来
    },
    drawTreemap() {
      this.chart = echarts.init(document.getElementById("treemap"));
      let that = this;
      let option = {
        tooltip: {
          backgroundColor: "rgba(255, 255, 255,0)",
          formatter: params => {
            //国家或地区
            let name = `<div style="height:0.09375rem;line-height:0.09375rem;color:#3E3E3E;font-size:0.083333rem">${
              (params.name || "").split("_")[0]
            }</div>`;
            let nameCh = `<div style="height:0.09375rem;line-height:0.09375rem;padding-top:0.026042rem;color:#7C7C7C;font-size:0.072917rem">${
              (params.name || "").split("_")[1]
            }</div>`;
            //实际投入外资金额
            let actual = `<div style="height:0.09375rem;margin-top:0.12rem;line-height:0.09375rem;color:#3E3E3E;font-size:0.072917rem">${
              (params.data.actual || "").split("_")[1]
            }</div>`;
            let actualCh = `<div style="height:0.09375rem;line-height:0.09375rem;padding-top:0.026042rem;color:#7C7C7C;font-size:0.0625rem">${
              (params.data.actual || "").split("_")[0]
            }</div>`;
            let value = `<div style="margin-top:0.055rem;color:#333;font-size:0.114583rem;font-weight:bold;">${
              !!params.data.value||params.data.value=="0" ? this.formatNum(params.data.value) : ""
            }</div>`;
            //金额比重
            let proportion = `<div style="height:0.09375rem;margin-top:0.06rem;line-height:0.09375rem;color:#3E3E3E;font-size:0.072917rem">${
              (params.data.proportion || "").split("_")[1]
            }</div>`;
            let proportionCh = `<div style="height:0.09375rem;line-height:0.09375rem;padding-top:0.026042rem;color:#7C7C7C;font-size:0.0625rem">${
              (params.data.proportion || "").split("_")[0]
            }</div>`;

            let proportionValue = `<div style="padding:0.052083rem 0 0.01rem;color:#333;font-size:0.114583rem;font-weight:bold;">${params.data.proportionValue}%</div>`;

            let dom =
              name +
              nameCh +
              actual +
              actualCh +
              value +
              proportion +
              proportionCh +
              proportionValue;
            let basic = name + nameCh + value;
            return `<div style="width:auto;height:auto;border-radius:0.026rem;padding: 0.052083rem 0.078125rem;background:#fff;box-shadow: #999 0px 0px .026rem 1px;">${
              params.data.actual ? dom : basic
            }</div>`;
          }
        },
        series: [
          {
            top: "16.5%",
            bottom: this.watermark ? "10%" : "6%",
            left: "2%",
            right: "2%",
            name: this.totalData.seriesData.all,
            type: "treemap",
            // radius: "100%", //控制内容大小
            // visibleMin: 300,//小于多少就不会显示
            data: this.totalData.seriesData.data,
            // leafDepth: 1, //呈现层级，若为1加载时仅展开一层，接下来的每一层通过单击进入
            label: {
              show: true,
              fontSize: 14,
              position: "insideTopLeft",
              letterSpacing: "10",
              formatter: params => {
                let www = [
                  `{d|${(params.data.actual || "").split("_")[1]}}`,
                  `{a|${(params.data.actual || "").split("_")[0]}}`,
                  `{c|${
                    !!params.data.value ||params.data.value=="0"? this.formatNum(params.data.value) : ""
                  }}`,
                  `{d|${(params.data.proportion || "").split("_")[1]}}`,
                  `{a|${(params.data.proportion || "").split("_")[0]}}`,
                  `{c|${params.data.proportionValue}%}`
                ];
                return [
                  `{a|${(params.data.name || "").split("_")[0]}}`,
                  `{a|${(params.data.name || "").split("_")[1]}}`,
                  ...(params.data.actual
                    ? www
                    : [
                        `{a|${
                          !!params.data.value||params.data.value=="0"
                            ? this.formatNum(params.data.value)
                            : ""
                        }}`
                      ])
                ].join("\n");
              },
              rich: {
                a: {
                  color: "#FFF",
                  fontSize: this.$fz(0.16),
                  lineHeight: this.$fz(0.2)
                },
                c: {
                  color: "#FFF",
                  fontSize: this.$fz(0.18),
                  lineHeight: this.$fz(0.28)
                },
                d: {
                  color: "#FFF",
                  fontSize: this.$fz(0.16),
                  padding: [0, 0, 6, 0]
                  // margin:[this.$fz(0.5),0,0,0]
                  // lineHeight: this.$fz(0.5)
                }
              }
            },
            itemStyle: {
              borderColor: "#fff"
            },
            levels: [
              {
                colorSaturation: [0.2, 0.8],
                itemStyle: {
                  normal: {
                    borderColor: "#fff",
                    gapWidth: 2
                  }
                }
              }
            ]
            //面包屑
            // breadcrumb: {
            //   top: that.$refs.treeMap.offsetWidth * 0.58,
            //   left: "center",
            //   itemStyle: {
            //     color: "#fff",
            //     borderColor: "#fff",
            //     shadowBlur: 0,
            //     textStyle: {
            //       color: "#666"
            //     }
            //   }
            // }
          }
        ],
        graphic: [
          {
            type: "image",
            left: that.$refs.treeMap.offsetWidth / 2.86,
            top: that.$refs.treeMap.offsetHeight / 2.56,
            z: 9999,
            style: {
              image: require("../../assets/img/waterMark.png"),
              width: that.$refs.treeMap.offsetWidth / 3.33,
              height: that.$refs.treeMap.offsetWidth / 4.55
            }
          },
          {
            type: "group",
            left: "center",
            top: this.$fz(0.15) * 1.4,
            children: [
              {
                type: "text",
                z: 100,
                left: "center",
                style: {
                  fill: "#333",
                  text: this.totalData.title.en,
                  font: `bold ${this.$fz(0.26)}px sans-serif`
                }
              },
              {
                type: "text",
                z: 100,
                left: "center",
                top: this.$fz(0.15) * 2.5,
                style: {
                  fill: "#333",
                  text: this.totalData.title.ch,
                  font: ` ${this.$fz(0.18)}px sans-serif`
                }
              }
            ]
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
            bottom: "0",
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
          },
          {
            type: "group",
            left: this.$fz(0.15) * 1.5,
            top: this.$fz(0.15) * 6,
            children: [
              {
                type: "text",
                z: 100,
                style: {
                  fill: "#666",
                  text: this.totalData.yName.en,
                  font: `${this.$fz(0.2)}px Calibri`
                }
              },
              {
                type: "text",
                z: 100,
                top: this.$fz(0.15) * 1.2,
                style: {
                  fill: "#666",
                  text: this.totalData.yName.ch,
                  font: `${this.$fz(0.14)}px 黑体`
                }
              }
            ]
          },
          {
            type: "group",
            left: 0,
            top: 0,
            children: [
              {
                type: "rect",
                z: 99,
                shape: {
                  width: that.$refs.treeMap.offsetWidth,
                  height: this.$fz(1.25)
                },
                style: {
                  fill: "#fff"
                }
              },
              {
                type: "rect",
                z: 99,
                shape: {
                  width: that.$refs.treeMap.offsetWidth * 0.02,
                  height: that.$refs.treeMap.offsetHeight
                },
                style: {
                  fill: "#fff"
                }
              }
            ]
          },
          {
            type: "group",
            children: [
              {
                type: "rect",
                z: 99,
                shape: {
                  x: that.$refs.treeMap.offsetWidth * 0.98,
                  width: that.$refs.treeMap.offsetWidth * 0.02,
                  height: that.$refs.treeMap.offsetHeight
                },
                style: {
                  fill: "#fff"
                }
              },
              {
                type: "rect",
                z: 99,
                shape: {
                  // y: that.$refs.treeMap.offsetHeight * 0.925,
                  y: this.watermark
                    ? this.totalData.grid
                      ? that.$refs.treeMap.offsetHeight * 0.9
                      : that.$refs.treeMap.offsetHeight * 0.925
                    : that.$refs.treeMap.offsetHeight * 0.925,
                  width: that.$refs.treeMap.offsetWidth,
                  height: that.$refs.treeMap.offsetHeight * 0.5
                },
                style: {
                  fill: "#fff"
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
<style lang="less" scoped>
// .container {
//   width: 100%;
//   height: 100%;
// }
</style>

