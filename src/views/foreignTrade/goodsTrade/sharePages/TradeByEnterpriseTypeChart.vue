<template>
  <!-- 货物进出口总值（企业性质）chart -->
  <div class="goodstotal-chart">
    <div class="echart-block">
      <div v-if="isShowTable" class="table-block">
        <TableChart :totalData="totalData"></TableChart>
      </div>
      <div
        :class="
          $store.state.fullScreen.isFullScreen == false
            ? 'fullContainer'
            : 'container'
        "
      >
        <bar-line v-if="!isShowTable" ref="barLine" :options="USD" :selectOption="enterpriseType"></bar-line>
      </div>
    </div>
    <div :class="$store.state.fullScreen.isFullScreen==false?'fullselect-block':'select-block'">
      <div class="frame">
        <time-frame
          :options="options"
          @change="change"
          @update="update"
          @changeActiveKey="changeActiveKey"
        ></time-frame>
      </div>
      <div class="status">
        <SelectRadio
          :option="enterpriseType"
          :value="enterpriseType.value"
          @change="changeRadioSelectByEnterpriseType($event)"
        ></SelectRadio>
      </div>
    </div>
  </div>
</template>

<script>
import dayjs from "dayjs";
import TimeFrame from "@/components/timeFrame/TimeFrame";
import BarLine from "@/components/charts/BarLine";
import request from "@/request/goodsTrade/goodsTrade";
import SelectRadio from "@/components/select/SelectRadio";
import chartDataFun from "@/utils/chartDataFun";
import TableChart from "@/components/charts/TableChart";

export default {
  props: {
    isShowTable: {},
    describeData: {}
  },
  components: {
    TimeFrame,
    BarLine,
    TableChart,
    SelectRadio
  },
  name: "TradeByOrigin",
  data() {
    return {
      activeKey: "yearly",
      tableName: {
        yearly: "ImportExportEnterprise",
        monthly: "ImportExportEnterprise"
      },
      totalData: {
        title: {
          ch: "中国国有企业货物进出口总值",
          en: "China's import and export by state-owned enterprises"
        },
        unit: {
          ch: "百万美元",
          en: "USD mln"
        },
        tableTitle: {},
        tableData: [],
        updatedDate: ""
      },
      timer: null,
      USD: {
        id: "USD",
        dataSources: this.describeData,
        yName: { ch: "百万美元", en: "USD mln" },
        yearOnYear: true, //通过修改这个值来显示同比
        title: {
          ch: "中国国有企业货物进出口总值",
          en: "China's import and export by state-owned enterprises"
        },
        xData: [],
        grid: {
          bottom: "10%",
          enGapch: this.$fz(0.4) //数据来源中英文间距
        },
        hideLegend: true,
        series: [
          {
            name: "进口_Import|进口同比_Y-o-y import",
            color: "#c23531",
            data: [],
            yearOnYear: []
          },
          {
            name: "出口_Export|出口同比_Y-o-y export",
            color: "#61a0a8",
            data: [],
            yearOnYear: []
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
              en: "From",
              frame: "2016_2020",
              value: "2018"
            },
            end: {
              ch: "结束",
              en: "To",
              frame: "2016_2020",
              value: "2018"
            }
          }
        },
        monthly: {
          ch: "月度",
          en: "Monthly",
          list: {
            start: {
              ch: "开始",
              en: "From",
              frame: "",
              value: ""
            },
            end: {
              ch: "结束",
              en: "To",
              frame: "",
              value: ""
            }
          }
        }
      },
      enterpriseType: {
        ch: "企业性质",
        en: "Enterprise type",
        value: {
          ch: "国有企业",
          en: "State-owned enterprises",
          id: 1
        },
        op: chartDataFun.enterpriseType()
      },
      field: {
        1: [
          "IMP_importStateOwnedEns",
          "IMPyoyImportStateOwnedEns",
          "EXP_importStateOwnedEns",
          "EXPyoyImportStateOwnedEns"
        ],
        2: [
          "IMP_importForeignInvestedEns",
          "IMPyoyImportForeignInvestedEns",
          "EXP_importForeignInvestedEns",
          "EXPyoyImportForeignInvestedEns"
        ],
        3: [
          "IMP_importPrivateOwnedEns",
          "IMPyoyImportPrivateOwnedEns",
          "EXP_importPrivateOwnedEns",
          "EXPyoyImportPrivateOwnedEns"
        ],
        4: [
          "IMP_importOtherEns",
          "IMPyoyImportForeignInvestedEns",
          "EXP_importOtherEns",
          "EXPyoyImportOtherEns"
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
        let result = chartDataFun.conversionTable(
          this.totalData.tableTitle,
          this.$store.getters.chartInfo.tableData
        );
        this.$set(this.totalData, "tableData", result);
      },
      deep: true
    },
    enterpriseType: {
      handler() {
        let str = this.enterpriseType.value.en;
        str = str.replace(str[0], str[0].toLowerCase()); //商品类别首字母小写
        this.totalData.title.ch = this.USD.title.ch = `中国${this.enterpriseType.value.ch}货物进出口总值`;
        this.totalData.title.en = this.USD.title.en = `China's import and export by ${str}`;
      },
      deep: true
    }
  },
  async created() {
    await this.getMaxMinDate();
    this.mainGetChartsData();
  },
  mounted() {
    this.$EventBus.$on("downLoadImg", () => {
      this.$refs.barLine.downloadFile();
    });
  },
  beforeDestroy() {
    this.$EventBus.$off("downLoadImg");
  },
  methods: {
    async mainGetChartsData() {
      let { start, end } = this.options[this.activeKey].list;
      if (this.activeKey == "yearly") {
        await this.getChartsData({
          tableName: this.tableName[this.activeKey],
          type: this.activeKey,
          start: Number(start.value),
          end: Number(end.value),
          noMonth: false,
          enterpriseType: this.enterpriseType.value
        });
      }
      if (this.activeKey == "monthly") {
        let startTimeArr = start.value.split("-");
        let endTimeArr = end.value.split("-");
        let quarterStart = parseInt(startTimeArr[0]);
        let quarterStartMonth = parseInt(startTimeArr[1]);
        let quarterEnd = parseInt(endTimeArr[0]);
        let quarterEndMonth = parseInt(endTimeArr[1]);
        await this.getChartsData({
          tableName: this.tableName[this.activeKey],
          type: this.activeKey,
          start: quarterStart,
          end: quarterEnd,
          startMonth: quarterStartMonth,
          endMonth: quarterEndMonth,
          enterpriseType: this.enterpriseType.value // 企业类别
        });
      }
    },
    // 获取最大年最小年
    async getMaxMinDate() {
      let yearly = await chartDataFun.getMaxMinDate(this.tableName["yearly"]);
      let monthly = await chartDataFun.getMaxMinDate(this.tableName["monthly"]);
      let arrmaxmin_yearly = yearly.split("_");
      let arrmaxmin_monthly = monthly.split("_");
      //
      let obj_yearly = JSON.parse(JSON.stringify(this.options["yearly"]));
      for (let k in obj_yearly.list) {
        obj_yearly.list[k].frame = yearly;
      }
      this.$set(this.options, "yearly", obj_yearly);
      this.options.yearly.list.start.value = arrmaxmin_yearly[1] - 11;
      this.options.yearly.list.end.value = arrmaxmin_yearly[1];
      //
      let obj_monthly = JSON.parse(JSON.stringify(this.options["monthly"]));
      for (let k in obj_monthly.list) {
        obj_monthly.list[k].frame = monthly;
      }
      this.$set(this.options, "monthly", obj_monthly);
      let QMDefaultTime = await chartDataFun.getQMDefaultTime(
        arrmaxmin_monthly[1],
        1
      );
      this.options.monthly.list.start.value = QMDefaultTime.M.start_beforeSix;
      this.options.monthly.list.end.value = QMDefaultTime.M.end;
    },
    async getItemData(arrSourceData, Axis, Ayis, range) {
      //根据字段获取数据
      let result = {};
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
        result[item] = data;
      }
      return result;
    },
    // 获取当前页面的每条线数据（按年度 季度 月度分）
    async getItemCategoryData(res, XNameAttr, dataAttr, range) {
      let data = await this.getItemData(res, XNameAttr, dataAttr, range);
      let type = this.field[this.enterpriseType.value.id];
      this.USD.series[0]["data"] = data[type[0]];
      this.USD.series[0]["yearOnYear"] = data[type[1]];
      this.USD.series[1]["data"] = data[type[2]];
      this.USD.series[1]["yearOnYear"] = data[type[3]];
    },
    async getChartsData(aug) {
      await this.setTableConfig(aug);
      let range;
      let data = await request.getImportExportEnterprise(aug);
      let dataAttr = this.field[this.enterpriseType.value.id];
      // 完整的区间
      let XNameAttr = "year";
      if (aug.type == "yearly") {
        XNameAttr = "year";
        range = await chartDataFun.getXRange(aug);
        await chartDataFun.addOtherCategory(data);
      }
      if (aug.type == "monthly") {
        XNameAttr = "M";
        range = await chartDataFun.getXRangeCurrentMonth(aug);
        await chartDataFun.addOtherCategoryCurrentMonth(data);
      }
      this.USD.xData = range;
      this.USD.updatedDate = this.$store.getters.latestTime;
      this.totalData.updatedDate = this.$store.getters.latestTime;
      // 获取当前页面所有线
      await this.getItemCategoryData(data, XNameAttr, dataAttr, range);
    },
    async setTableConfig(aug) {
      let field = this.field[this.enterpriseType.value.id];
      let obj = {};
      obj.year = {
        text: "年份_Year",
        width: "10%"
      };
      if (aug.type == "monthly") {
        obj.month = {
          text: "月份_Month",
          width: "20%"
        };
      }
      obj.enterpriseType = {
        text: "企业性质_Enterprise type",
        width: "20%"
      };
      obj[field[0]] = {
        text: "进口_Import",
        width: "20%",
        formatNum: true
      };
      obj[field[1]] = {
        text: "进口同比_Y-o-y import",
        width: "20%",
        formatPer: true
      };
      obj[field[2]] = {
        text: "出口_Export",
        width: "20%",
        formatNum: true
      };
      obj[field[3]] = {
        text: "出口同比_Y-o-y export",
        width: "20%",
        formatPer: true
      };
      this.totalData.tableTitle = obj;
    },
    // 时间范围组件 update and change
    update(activeKey, value) {
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
    },
    // 选择分类
    changeRadioSelectByEnterpriseType(item) {
      this.enterpriseType.value = item;
      this.mainGetChartsData();
    },
    // 改变年度季度月度时：
    async changeActiveKey(activeKey) {
      this.activeKey = activeKey;
      await this.mainGetChartsData(activeKey);
    }
  }
};
</script>

<style lang="less" scoped>
.goodstotal-chart {
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
  .select-block {
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
