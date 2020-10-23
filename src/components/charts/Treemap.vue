<template>
  <div class="container">
    <div class="title">
      <div class="titleCh">{{this.totalData.title.ch}}</div>
      <div class="titleEn">{{this.totalData.title.en}}</div>
    </div>
    <div class="unit">
      <div>{{this.totalData.yName.ch}}</div>
      <div>{{this.totalData.yName.en}}</div>
    </div>
    <div id="treemap" style="width:100%;height:81%;"></div>
    <div class="updated">
      <div >
        <div>数据最后更新时间</div>
        <div>Date last updated</div>
      </div >
      <div class="updatedDate">{{this.totalData.updatedDate.ch}}</div>
    </div>
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
  onLoad() {},
  mounted() {
    this.$EventBus.$on("resize", () => {
      clearInterval(this.timer);
      this.timer = setTimeout(async () => {
        this.drawChart();
        this.chart.resize();
      }, 1000);
    });
    this.drawChart();
  },
  methods: {
    drawChart() {
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
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            name: this.totalData.seriesData.all,
            type: "treemap",
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
  padding: 0.07rem 0.1rem 0.1rem;
  box-sizing: border-box;
  .title {
    width: 100%;
    display: flex;
    flex-flow: column nowrap;
    align-items: center;
    .titleCh {
      font-size: 0.09375rem;
      font-weight: bold;
      color: #333;
    }
    .titleEn {
      font-size: 0.083333rem;
      color: #999;
    }
  }
  .unit {
    font-size: 0.083333rem;
    color: #666;
    line-height: 0.09rem;
  }
  #treemap {
    padding: 0.01rem 0 0.03rem;
    box-sizing: border-box;
  }
  .updated {
    display: flex;
    align-items: center;
    font-size:0.078125rem;
    color: #333;
  }
  .updatedDate{
    margin-left: 0.07rem;
  }
}
</style>

