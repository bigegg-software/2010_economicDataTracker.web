<template>
  <div id="treemap" style="width:100%;height:100%"></div>
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
    this.drawChart();
  },
  methods: {
    drawChart() {
      this.chart = echarts.init(document.getElementById("treemap"));
      let option = {
        tooltip: {
          backgroundColor: "rgba(255, 255, 255,0)",
          formatter: params => {
            let a = `<div style="height:18px;line-height:18px;color:#333;font-size:12px">${
              params.name.split("_")[0]
            }</div>`;
            let b = `<div style="height:18px;line-height:18px;color:#ccc;font-size:12px">${
              params.name.split("_")[1]
            }</div>`;
            let c = `<div style="padding:5px 0px 0px;color:#333;font-size:18px;font-weight:bold;">${params.value}</div>`;
            let dom = a + b + c;
            return `<div style="width:auto;height:auto;padding:10px 15px;border-radius: 5px;background:#fff;box-shadow: #999 0px 0px 5px 1px;">${dom}</div>`;
          }
        },
        series: [
          {
            // roam: "scale", //只能缩放 
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            // breadcrumb: { show: false }, //隐藏面包屑按钮
            name: "全部",
            type: "treemap",
            // visibleMin: 300,//小于多少就不会显示
            data: this.totalData.seriesData,
            leafDepth: 1, //呈现层级，若为1加载时仅展开一层，接下来的每一层通过单击进入
            label: {
              show: true,
              fontSize: 12,
              position: "insideTopLeft",
              formatter: params => {
                return [
                  `${params.name.split("_")[0]}`,
                  `${params.name.split("_")[1]}`,
                  `${params.value}`
                ].join("\n");
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
                    // borderWidth: 2,
                    gapWidth: 2
                  }
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
.container {
  width: 600px;
  height: 400px;
  border: 1px solid red;
}
</style>

