<template>
  <!--服务贸易分类统计chart -->
  <div class="Inflowsto-chinaBRI-chart">
    <div class="echart-block">
      <div v-if="isShowTable" class="table-block">
        <TableChart :totalData="totalData"></TableChart>
      </div>
      <div :class="$store.state.fullScreen.isFullScreen==false?'fullContainer':'container'">
        <lines-chart v-if="!isShowTable" ref="linesChart" :options="USD" :selectOption="selectOption.value"></lines-chart>
      </div>
    </div>
    <div :class="$store.state.fullScreen.isFullScreen==false?'fullselect-block':'select-block'">
      <div class="frame">
        <time-frame v-if="showTimeFrame" :options="options" @change="change" @update="update"></time-frame>
      </div>
      <SelectRadio
        class="status"
        :option="selectOption"
        :value="selectOption.value"
        @change="changeRadioSelect($event)"
      ></SelectRadio>
    </div>
  </div>
</template>

<script>
import dayjs from "dayjs";
import TimeFrame from "@/components/timeFrame/TimeFrame";
import LinesChart from "@/components/charts/Lines";
import request from "@/request/inBound/inBound";
import chartDataFun from "@/utils/chartDataFun";
import TableChart from "@/components/charts/TableChart";
import SelectRadio from "@/components/select/SelectRadio";

export default {
  props: {
    isShowTable: {},
    describeData: {}
  },
  components: {
    TimeFrame,
    LinesChart,
    TableChart,
    SelectRadio
  },
  name: "inflowsToChinaBRIChart",
  data() {
    return {
      totalData: {
        title: {
          ch: "中国服务贸易分类统计",
          en: "China's trade volume by service type"
        },
        unit: {
          ch: "百万美元",
          en: "USD mln"
        },
        tableTitle: {
          year: {
            text: "年份_Year",
            width: "20%"
          },
          BRIAmountMillion: {
            text:
              "一带一路沿线国家投资金额_BRI countries' FDI inflows to China",
            width: "40%",
            formatNum: true
          },
          BRIAmountPercent: {
            text: "占总外资金额比重_Share of total FDI inflows to China",
            width: "40%",
            formatPer: true
          }
        },
        tableData: [],
        updatedDate: ""
      },
      timer: null,
      showTimeFrame: false,
      USD: {
        id: "USD",
        dataSources: this.describeData,
        yName: { ch: "百万美元", en: "USD mln" },
        yearOnYear: false, //通过修改这个值来显示同比
        title: {
          ch: "中国服务贸易分类统计",
          en: "China's trade volume by service type"
        },
        xData: [],
        hideLegend: true,
        series: [
          {
            name: "进口_Import|进口同比_Y-o-y import",
            color: "#c23531",
            data: [420, 380, 480, 350, 290],
            yearOnYear: [1, 2.8, 1, -1, -1.2]
          },
          {
            name: "出口_Export|出口同比_Y-o-y export",
            color: "#61a0a8",
            data: [720, 380, 580, 960, 390],
            yearOnYear: [2.2, 3.8, -2, 1, -0.2]
          }
        ],
        updatedDate: ""
      },
      options: {
        yearly: {
          ch: "年度",
          en: "Yearly",
          list: {
            start: {
              ch: "开始",
              en: "Start",
              frame: "",
              value: ""
            },
            end: {
              ch: "结束",
              en: "End",
              frame: "",
              value: ""
            }
          }
        }
      },
      selectOption: {
        ch: "服务类别",
        en: "Service type",
        value: {
          id: 1,
          ch: "产品1",
          en: "Xxxxxxx"
        },
        op: [
          {
            id: 1,
            ch: "产品1",
            en: "Xxxxxxxx"
          },
          {
            id: 2,
            ch: "产品2",
            en: "Xxxxxxx"
          }
        ]
      }
    };
  },
  computed: {
    tableDatas() {
      return this.$store.getters.chartInfo;
    }
  },
  watch: {
    tableDatas: {
      handler() {
        let resoult = chartDataFun.conversionTable(
          this.totalData.tableTitle,
          this.$store.getters.chartInfo.tableData
        );
        console.log(resoult);
        this.$set(this.totalData, "tableData", resoult);
      },
      deep: true
    }
  },
  async mounted() {
    let res = await this.getMaxMinDate();
    let arrmaxmin = res.split("_");
    this.options.yearly.list.start.value = arrmaxmin[0];
    this.options.yearly.list.end.value = arrmaxmin[1];
    await this.getChartsData({
      noMonth: true,
      type: "yearly",
      start: Number(arrmaxmin[0]),
      end: Number(arrmaxmin[1])
    });
    this.$EventBus.$on("downLoadImg", () => {
      this.$refs.linesChart.downloadFile();
    });
  },
  beforeDestroy() {
    this.$EventBus.$off("downLoadImg");
  },
  methods: {
    async mainGetChartsData(type) {
      //条件改变时获取数据
      let { start, end } = this.options[type].list;
      await this.getChartsData({
        noMonth: true,
        type,
        start: Number(start.value),
        end: Number(end.value)
      });
    },
    async getMaxMinDate() {
      // 获取最大年最小年
      let res = await chartDataFun.getMaxMinDate("BRIInvestors");
      console.log(res);
      for (let key in this.options) {
        let obj = JSON.parse(JSON.stringify(this.options[key]));
        for (let k in obj.list) {
          obj.list[k].frame = res;
        }
        this.$set(this.options, key, obj);
      }
      this.showTimeFrame = true;
      return res;
    },
    async getItemData(arrSourceData, Axis, Ayis, range) {
      //根据字段获取数据
      let resoult = {};
      for (let i = 0; i < Ayis.length; i++) {
        let item = Ayis[i];
        // 转换图标数据数组和横轴名称数组
        let dataArr = await chartDataFun.objArrtransArr(
          arrSourceData,
          Axis,
          item
        );
        // 补全数据
        let data = await chartDataFun.completionDate(dataArr, range);
        resoult[item] = data;
      }
      return resoult;
    },
    // 获取当前页面的每条线数据
    async getItemCategoryData(res, XNameAttr, dataAttr, range) {
      //对华一带一路 投入实际金额
      let data = await this.getItemData(res, XNameAttr, dataAttr, range);
      this.USD.series[0]["data"] = data.BRIAmountMillion;
      this.USD.series[0]["yearOnYear"] = data.BRIAmountPercent;
    },
    async getChartsData(aug) {
      //改变横轴 获取数据
      let { res } = await request.getNonFinancialToBRIChartsData(aug, 1);
      // 完整的区间
      let range = await chartDataFun.getXRange(aug);
      // 要换取纵轴数据的字段属性
      let dataAttr = ["BRIAmountMillion", "BRIAmountPercent"];
      let XNameAttr = "year";
      this.USD.xData = range;
      this.USD.updatedDate = this.$store.getters.latestTime;
      this.totalData.updatedDate = this.$store.getters.latestTime;
      // 获取当前页面所有线
      await this.getItemCategoryData(res, XNameAttr, dataAttr, range);
    },
    //选择类型新签合同额还是完成营业额
    async changeRadioSelect(item) {
      this.selectOption.value = item;
      let Yoy =
        item.ch == "新签合同额"
          ? "新签合同额同比_Y-o-y growth of new contract value"
          : "完成营业额同比_Y-o-y growth of completed contract revenue";
      await this.getChartsData({
        type: item.id,
        ascending: "rank",
        limit: 10,
        year: Number(this.option.value)
      });
      this.chartBar.title = {
        text: this.selectOption.value.ch,
        subtext: this.selectOption.value.en
      };
      this.chartBar.series[0].name =
        this.selectOption.value.ch +
        "_" +
        this.selectOption.value.en +
        "|" +
        Yoy;
    },
    // 时间范围组件 update and change
    update(activeKey, value) {
      // console.log(activeKey, value, "666");
      this.options[activeKey].list.start.value = value[0];
      this.options[activeKey].list.end.value = value[1];
      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        // 条件改变时获取数据数据入口  zp
        this.mainGetChartsData(activeKey);
      }, 600);
    },
    change(activeKey, key, value) {
      let list = JSON.parse(JSON.stringify(this.options[activeKey].list));
      let start =
        key == "start" ? dayjs(`${value}`) : dayjs(`${list.start.value}`);
      let end = key == "end" ? dayjs(`${value}`) : dayjs(`${list.end.value}`);
      if (end.isBefore(start)) {
        this.$message.warn("开始时间不得大于结束时间");
        return;
      }
      this.options[activeKey].list[key].value = value;
      // 获取数据入口  zp  开始和结束都有值再去查
      if (
        this.options[activeKey].list["start"].value &&
        this.options[activeKey].list["end"].value
      ) {
        this.mainGetChartsData(activeKey);
      }
    }
  }
};
</script>

<style lang="less" scoped>
.Inflowsto-chinaBRI-chart {
  display: flex;
  .echart-block {
    position: relative;
    background-color: #fff;
    border: 2px solid #cacaca;
    .table-block {
      position: absolute;
      left: 0;
      top: 0;
      z-index: 3;
      width: 100%;
      height: 100%;
      background-color: #fff;
    }
    .container {
      width: 5.875rem;
      height: 3.916667rem;
    }
    .fullContainer {
      width: 7.4rem;
      height: 4.933333rem;
    }
  }
  .fullselect-block {
    width: 1.74667rem;
    height: auto;
    background-color: #f0f0f0;
    border: 2px solid #cacaca;
    border-left: none;
  }
  .select-block {
    width: 1.385rem;
    height: auto;
    background-color: #f0f0f0;
    border: 2px solid #cacaca;
    border-left: none;
  }
  .frame {
    padding: 0.104167rem;
    border-bottom: 1.5px solid #cacaca;
  }
  .status {
    padding: 0.104167rem;
  }
}
</style>
