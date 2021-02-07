<template>
  <!--服务贸易分类统计chart -->
  <div class="outflows-chart">
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
        <lines-chart
          v-if="(!isShowTable)&&reload"
          ref="linesChart"
          :options="USD"
          :selectOption="industry.value"
        ></lines-chart>
      </div>
    </div>
    <div class="select-block">
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
          :option="industry"
          :value="industry.value"
          @change="changeRadioSelectByIndustry($event)"
        ></SelectRadio>
      </div>
    </div>
  </div>
</template>

<script>
import dayjs from "dayjs";
import TimeFrame from "@/components/timeFrame/TimeFrame";
import LinesChart from "@/components/charts/Lines";
import request from "@/request/goodsTrade/goodsTrade";
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
  name: "TotalTradeInServices",
  data() {
    return {
      reload:true,
      activeKey: "yearly",
      tableName: {
        yearly: "TradeServicesTypeVolume"
      },
      totalData: {
        title: {
          // ch: "中国服务贸易进出口总值 - 其他服务",
          // en: "China's trade in services not allocated"
          ch: "中国服务贸易进出口总值 - 金融业",
          en: "China's trade in financial services"
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
        title: {
          // ch: "中国服务贸易进出口总值 - 其他服务",
          // en: "China's trade in services not allocated"
          ch: "中国服务贸易进出口总值 - 金融业",
          en: "China's trade in financial services"
        },
        xData: [],
        series: [
          {
            name: "进口_Import|进口同比_Y-o-y import",
            color: "#c23531",
            data: []
          },
          {
            name: "出口_Export|出口同比_Y-o-y export",
            color: "#61a0a8",
            data: []
          }
        ],
        updatedDate: ""
      },
      industry: {
        ch: "服务类别",
        en: "Service type",
        value: {
          // ch: "其他服务",
          // en: "Services not allocated"
          ch: "金融业",
          en: "Financial services"
        },
        op: chartDataFun.tradeServiceIndustry()
      },
      options: {
        yearly: {
          ch: "年度",
          en: "Yearly",
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
    industry: {
      handler() {
        let str = this.industry.value.en;
        str = str.replace(str[0], str[0].toLowerCase()); //商品类别首字母小写
        this.totalData.title.ch = this.USD.title.ch = `中国服务贸易进出口总值 - ${this.industry.value.ch}`;
        this.totalData.title.en = this.USD.title.en = `China's trade in ${str}`;
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
      this.$refs.linesChart.downloadFile();
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
          noMonth: true,
          equalTo: {
            industry: this.industry.value.ch
          }
        });
      }
    },
    async getMaxMinDate() {
      let yearly = await chartDataFun.getMaxMinDate(this.tableName["yearly"]);
      let arrmaxmin_yearly = yearly.Y.split("_");
      let obj_yearly = JSON.parse(JSON.stringify(this.options["yearly"]));
      for (let k in obj_yearly.list) {
        obj_yearly.list[k].frame = yearly.Y;
      }
      this.$set(this.options, "yearly", obj_yearly);
      this.options.yearly.list.start.value = arrmaxmin_yearly[1] - 4;
      this.options.yearly.list.end.value = arrmaxmin_yearly[1];
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
      this.reload=false;
      this.USD.series[0]["data"] = res.length ? data.IMPvolume : [];
      this.USD.series[1]["data"] = res.length ? data.EXPvolume : [];
       this.$nextTick(()=>{
        this.reload=true;
      });
    },
    async getChartsData(aug) {
      await this.setTableConfig(aug);
      //改变横轴 获取数据
      let res = await request.getTradeServicesTypeVolume(aug);
      // 完整的区间
      let range = await chartDataFun.getXRange(aug);
      // 要换取纵轴数据的字段属性
      let dataAttr = ["IMPvolume", "EXPvolume"];
      let XNameAttr = "year";
      this.USD.xData = range;
      this.USD.updatedDate = this.$store.getters.latestTime;
      this.totalData.updatedDate = this.$store.getters.latestTime;
      //添加额外的Q和M属性
      await chartDataFun.addOtherCategory(res);
      if (aug.type == "yearly") {
        XNameAttr = "year";
      }
      // 获取当前页面所有线
      await this.getItemCategoryData(res, XNameAttr, dataAttr, range);
    },
    async setTableConfig(aug) {
      if (aug.type == "yearly") {
        this.totalData.tableTitle = {
          year: {
            text: "年份_Year",
            width: "10%"
          },
          IMPvolume: {
            text: "进口_Import",
            width: "20%",
            formatNum: true
          },
          EXPvolume: {
            text: "出口_Export",
            width: "20%",
            formatNum: true
          }
        };
      }
    },
    // 时间范围组件 update and change
    update(activeKey, value) {
       
      this.options[activeKey].list.start.value = value[0];
      this.options[activeKey].list.end.value = value[1];
      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        // 条件改变时获取数据数据入口
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
    changeRadioSelectByIndustry(item) {
      this.industry.value = item;
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
.outflows-chart {
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
    // border-right: none;
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
    .frame {
      padding: 0.104167rem;
      border-bottom: 1.5px solid #cacaca;
    }
    .status {
      padding: 0.104167rem;
    }
  }
}
</style>
