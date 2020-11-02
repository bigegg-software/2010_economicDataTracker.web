<template>
  <!-- 中国对外劳务合作---年度派出各类劳务人员前10位目的地国家chart -->
  <div class="topTenDest-of-workersChart">
    <div class="echart-block">
      <div v-if="isShowTable" class="table-block"></div>
      <div class="container">
        <chart-bar ref="barChart" :chartBarData="chartBar"></chart-bar>
      </div>
    </div>
    <div class="select-block">
      <div class="frame">
        <year :option="option" :value="option.value" @change="yearChange"></year>
      </div>
    </div>
  </div>
</template>

<script>
import ChartBar from "@/components/charts/ChartBar";
import Year from "@/components/timeFrame/Year";
export default {
  name: "topTenDestOfWorkersChart",
  data() {
    return {
      chartBar: {
         watermark: false,
        dataSources: "中国人民网",
        yName: { ch: "百万美元", en: "USD min" },
        title: {
          text: "年度派出各类劳务人员前10位目的地国家",
          subtext: "Top 10 destinations of workers sent overseas"
        },
        xData: [
          "蒙古\nMongolia",
          "芬兰\nFinland",
          "瑞典\nSweden",
          "挪威\nNorway",
          "冰岛\nIceland",
          "丹麦\nDenmark",
          "泰国\nThailand"
        ],
        series: [
          {
            // name:'存量_xxxxx',
            color: ["#0C9AFF"],
            data: [10000, 52000, 200000, 334000, 390000, 330000, 220000]
          }
        ]
      },
      option: {
        ch: "年度",
        en: "Yearly",
        frame: "1990_2020",
        value: "1990"
      }
    };
  },
  props: {
    isShowTable: {
      type: Boolean,
      default: false
    }
  },
  mounted() {
    this.$EventBus.$on("downLoadImg", () => {
      this.$refs.barChart.downloadFile();
    });
  },
  beforeDestroy() {
    this.$EventBus.$off("downLoadImg");
  },
  components: { ChartBar, Year },
  methods: {
    yearChange(year) {
      this.option.value = year;
    }
  }
};
</script>

<style lang="less" scoped>
.topTenDest-of-workersChart {
  display: flex;
  .echart-block {
    position: relative;
    width: 77%;
    height: auto;
    background-color: #fff;
    border: 2px solid #cacaca;
    .table-block {
      position: absolute;
      left: 0;
      top: 0;
      z-index: 3;
      width: 100%;
      height: 100%;
      background-color: #ccc;
    }
    // border-right: none;
    .container {
      width: 100%;
      height: 3.458333rem;
    }
  }
  .select-block {
    width: 23%;
    height: auto;
    background-color: #f0f0f0;
    border: 2px solid #cacaca;
    border-left: none;
    .frame {
      padding: 0.104167rem;
    }
  }
}
</style>
