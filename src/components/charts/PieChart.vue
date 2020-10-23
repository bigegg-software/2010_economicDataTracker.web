<template>
  <div id="pieChart" style="width:100%;
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
    totalData: {}
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
    drawPie() {
      this.chart = echarts.init(document.getElementById("pieChart"));
      // 绘制图表
      let option = {
        title: {
          left: "center",
          top: "2%",
          text: this.totalData.title.ch,
          textStyle: {
            color: "#333",
            fontSize: this.$fz(0.18)
          },
          subtext: this.totalData.title.en,
          subtextStyle: {
            color: "#999",
            fontSize: this.$fz(0.16)
          }
        },
        tooltip: {
          trigger: "item",
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
            type: "pie",
            // radius: "190",//控制内容大小
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
                  `{a|${params.name.split("_")[0]}}`,
                  `{a|${params.name.split("_")[1]}}`
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
                  text: "数据最后更新时间",
                  font: `${this.$fz(0.15)}px Microsoft YaHei`
                }
              }
            ]
          },
          {
            type: "group",
            left: this.$fz(0.15) * 2,
            bottom: this.$fz(0.15),
            children: [
              {
                type: "text",
                z: 100,
                left: "center",
                top: "middle",
                style: {
                  fill: "#333",
                  text: "Data last updated",
                  font: `${this.$fz(0.15)}px Microsoft YaHei`
                }
              }
            ]
          },
          {
            type: "group",
            left: this.$fz(0.15) * 11.5,
            bottom: this.$fz(0.15) * 1.5,
            children: [
              {
                type: "text",
                z: 100,
                left: "right",
                top: "middle",
                style: {
                  fill: "#333",
                  text: this.totalData.updatedDate,
                  font: `${this.$fz(0.15)}px Microsoft YaHei`
                }
              }
            ]
          }
        ],
      };
      this.chart.setOption(option, true);
    }
  }
};
</script>
<style scoped>
</style>

