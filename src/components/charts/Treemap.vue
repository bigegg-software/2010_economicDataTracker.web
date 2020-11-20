<template>
  <!-- <div class="container"> -->
  <div ref="treeMap" id="treemap" style="width:100%;height:100%;"></div>
  <!-- </div> -->
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
      this.totalData.watermark = true;
      this.drawTreemap();
      let aLink = document.createElement("a");
      let blob = this.base64ToBlob();
      let evt = document.createEvent("HTMLEvents");
      evt.initEvent("click", true, true);
      aLink.download = this.totalData.title.ch; //下载图片的名称
      aLink.href = URL.createObjectURL(blob);
      aLink.click();
      //消除水印
      this.totalData.watermark = false;
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
      let strs = value.toFixed(1);
      return strs && strs.toString().replace(/(?!^)(?=(\d{3})+\.)/g, ",");
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
              (params.name || "").split("_")[1]
            }</div>`;
            let nameCh = `<div style="height:0.09375rem;line-height:0.09375rem;padding-top:0.026042rem;color:#7C7C7C;font-size:0.072917rem">${
              (params.name || "").split("_")[0]
            }</div>`;
            //实际投入外资金额
            let actual = `<div style="height:0.09375rem;margin-top:0.065rem;color:#3E3E3E;font-size:0.072917rem">${
              (params.data.actual || "").split("_")[1]
            }</div>`;
            let actualCh = `<div style="height:0.09375rem;line-height:0.09375rem;padding-top:0.026042rem;color:#7C7C7C;font-size:0.0625rem">${
              (params.data.actual || "").split("_")[0]
            }</div>`;
            let value = `<div style="margin-top:0.055rem;color:#333;font-size:0.114583rem;font-weight:bold;">${
              !!params.data.value ?this.formatNum(params.data.value) : ""
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
            bottom: "6%",
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
                    !!params.data.value
                      ? this.formatNum(params.data.value)
                      : ""
                  }}`,
                  `{d|${(params.data.proportion || "").split("_")[1]}}`,
                  `{a|${(params.data.proportion || "").split("_")[0]}}`,
                  `{c|${params.data.proportionValue}%}`
                ];
                return [
                  `{a|${(params.data.name || "").split("_")[1]}}`,
                  `{a|${(params.data.name || "").split("_")[0]}}`,
                  ...(params.data.actual
                    ? www
                    : [
                        `{a|${
                          !!params.data.value
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
                  padding:[0,0,6,0]
                  // margin:[this.$fz(0.5),0,0,0]
                  // lineHeight: this.$fz(0.5)
                },
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
            ],
            //面包屑 没用可删
            breadcrumb: {
              show: false,
              left: "center",
              itemStyle: {
                normal: {
                  color: "#fff",
                  borderColor: "#999",
                  borderWidth: 1,
                  shadowColor: "#999",
                  shadowBlur: 3,
                  shadowOffsetX: 0,
                  shadowOffsetY: 0,
                  textStyle: {
                    color: "#1d3f6c",
                    fontWeight: "bold"
                  }
                },
                emphasis: {
                  textStyle: {}
                }
              }
            }
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
                  font: `bold ${this.$fz(0.26)}px Calibri-Bold `,
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
                  font: `bold ${this.$fz(0.18)}px SimHei`
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
                  text: this.totalData.watermark
                    ? "数据来源:" + this.totalData.dataSources
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
                left:this.$fz(0.15),
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
                  y: that.$refs.treeMap.offsetHeight * 0.925,
                  width: that.$refs.treeMap.offsetWidth,
                  height: that.$refs.treeMap.offsetHeight * 0.08
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

