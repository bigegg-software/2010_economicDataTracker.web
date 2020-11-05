<template>
  <div class="container">
    <div id="treemap" style="width:100%;height:100%;"></div>
  </div>
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
      aLink.download = "zhangsan"; //下载图片的名称
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
    drawTreemap() {
      this.chart = echarts.init(document.getElementById("treemap"));
      let option = {
        tooltip: {
          backgroundColor: "rgba(255, 255, 255,0)",
          formatter: params => {
            let a = `<div style="color:#333;font-size:0.072917rem">${
              params.name.split("_")[0]
            }</div>`;
            let b = `<div style="color:#ccc;font-size:0.0625rem">${
              params.name.split("_")[1]
            }</div>`;
            let c = `<div style="color:#333;font-size: 0.114583rem;font-weight:bold;">${params.value}</div>`;
            let dom = a + b + c;
            return `<div style="width:auto;height:auto;border-radius:0.026rem;padding: 0.052083rem 0.078125rem;background:#fff;box-shadow: #999 0px 0px .026rem 1px;">${dom}</div>`;
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
              formatter: params => {
                return [
                  `{a|${params.name.split("_")[0]}}`,
                  `{a|${params.name.split("_")[1]}}`,
                  `{c|${params.value}}`
                ].join("\n");
              },
              rich: {
                a: {
                  color: "#FFF",
                  lineHeight: this.$fz(0.16)
                },
                c: {
                  color: "#FFF",
                  fontSize: this.$fz(0.18),
                  lineHeight: this.$fz(0.2)
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
            type: "group",
            left: "center",
            top: this.$fz(0.15) * 1,
            children: [
              {
                type: "text",
                z: 100,
                left: "center",
                style: {
                  fill: "#333",
                  text: this.totalData.title.en,
                  font: `${this.$fz(0.26)}px Calibri`
                }
              },
              {
                type: "text",
                z: 100,
                left: "center",
                top: this.$fz(0.15) * 2,
                style: {
                  fill: "#333",
                  text: this.totalData.title.ch,
                  font: `${this.$fz(0.18)}px 黑体`
                }
              }
            ]
          },
          {
            type: "group",
            left: this.$fz(0.15) * 1.5,
            bottom: this.$fz(0.15) * 2,
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
            bottom: this.$fz(0.15) * 0.8,
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
            bottom: this.$fz(0.15) * 1.15,
            children: [
              {
                type: "text",
                z: 100,
                top: "middle",
                style: {
                  fill: "#666",
                  text: this.totalData.updatedDate,
                  font: `${this.$fz(0.20)}px Calibri`
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
                  font: `${this.$fz(0.15)}px 黑体`
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
                  font: `${this.$fz(0.18)}px Calibri`
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
                  width: this.$fz(0.15) * 75,
                  height: this.$fz(0.15) * 8.2
                },
                style: {
                  fill: "#fff"
                }
              },
              {
                type: "rect",
                z: 99,
                shape: {
                  width: this.$fz(0.15) * 1.5,
                  height: this.$fz(0.15) * 50
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
                  x: this.$fz(0.15) * 73.6,
                  y: 0,
                  width: this.$fz(0.15) * 1.5,
                  height: this.$fz(0.15) * 50
                },
                style: {
                  fill: "#fff"
                }
              },
              {
                type: "rect",
                z: 99,
                shape: {
                  y: this.$fz(0.15) * 46.5,
                  width: this.$fz(0.15) * 74,
                  height: this.$fz(0.15) * 4
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
.container {
  width: 100%;
  height: 100%;
  // padding: 0.07rem 0.1rem 0.1rem;
  // box-sizing: border-box;
  // .title {
  //   width: 100%;
  //   display: flex;
  //   flex-flow: column nowrap;
  //   align-items: center;
  //   .titleCh {
  //     font-size: 0.09375rem;
  //     font-weight: bold;
  //     color: #333;
  //   }
  //   .titleEn {
  //     font-size: 0.083333rem;
  //     color: #999;
  //   }
  // }
  // .unit {
  //   font-size: 0.083333rem;
  //   color: #666;
  //   line-height: 0.09rem;
  // }
  // #treemap {
  //   padding: 0.01rem 0 0.03rem;
  //   box-sizing: border-box;
  // }
  // .updated {
  //   display: flex;
  //   align-items: center;
  //   font-size:0.078125rem;
  //   color: #333;
  // }
  // .updatedDate{
  //   margin-left: 0.07rem;
  // }
}
</style>

