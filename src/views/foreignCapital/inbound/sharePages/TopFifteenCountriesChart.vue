<template>
  <!-- 主要对华投资国家/地区-前15位国家/地区chart-->
  <div class="topFifteenCountries-chart">
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
      <div class="status">
        <check-box
          v-for="(item, index) in status"
          :key="index"
          :option="item"
          @change="changeSelect(index)"
        ></check-box>
      </div>
    </div>
  </div>
</template>

<script>
import ChartBar from "@/components/charts/ChartBar";
import Year from "@/components/timeFrame/Year";
import CheckBox from "@/components/select/selectCheckBox/CheckBox";
export default {
  name: "TopFifteenCountriesChart",
  data() {
    return {
      chartBar: {
        dataSources: "中国人民网",
        yName: { ch: "百万美元", en: "USD min" },
        title: {
          text: "前15位国家/地区",
          subtext: "XXXXXXXX"
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
      },
      status: [
        {
          checked: false,
          ch: "企业数",
          en: "xxx"
        }
      ]
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
  components: { ChartBar, Year, CheckBox },
  methods: {
    yearChange(year) {
      this.option.value = year;
    },
    // 复选框
    changeSelect(index) {
      this.status[index].checked = !this.status[index].checked;
      if (index == 0) {
        this.status[index].checked
          ? console.log("同比")
          : console.log("去掉同比");
      }
      if (index == 1) {
        this.status[index].checked
          ? (this.isShowRMB = true)
          : (this.isShowRMB = false);
      }
    }
  }
};
</script>

<style lang="less" scoped>
.topFifteenCountries-chart {
  display: flex;
  .echart-block {
    position: relative;
    width: 5.875rem;
    height: 3.916667rem;
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
    .container {
      width: 100%;
      height: 100%;
    }
  }
  .select-block {
    flex: 1;
    height: auto;
    background-color: #f0f0f0;
    border: 2px solid #cacaca;
    border-left: none;
    .frame {
      padding: 0.104167rem;
      border-bottom: 1.5px solid #cacaca;
    }
    .status {
      padding: 0.052083rem 0.104167rem;
    }
  }
}
</style>
