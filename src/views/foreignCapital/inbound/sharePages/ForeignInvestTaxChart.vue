<template>
  <!-- 外商投资企业税收统计-外商投资企业税收统计chart -->
  <div class="foreign-invest-taxChart">
    <div class="echart-block">
      <div v-if="isShowTable" class="table-block">
        <TableChart :totalData="totalData"></TableChart>
      </div>
      <div :class="$store.state.fullScreen.isFullScreen==false?'fullContainer':'container'">
        <lines-chart v-if="!isShowTable" ref="linesChart" :options="USD"></lines-chart>
      </div>
    </div>
    <div class="select-block">
      <div class="frame">
        <time-frame v-if="showTimeFrame" :options="options" @change="change" @update="update"></time-frame>
      </div>
      <div class="status" v-if="$store.getters.showOperate">
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
import dayjs from "dayjs";
import TimeFrame from "@/components/timeFrame/TimeFrame";
import CheckBox from "@/components/select/selectCheckBox/CheckBox";
import LinesChart from "@/components/charts/Lines";
import request from "@/request/inBound/inBound";
import chartDataFun from "@/utils/chartDataFun";
import TableChart from "@/components/charts/TableChart";

export default {
  props: {
    isShowTable: {},
    describeData: {}
  },
  components: {
    TimeFrame,
    CheckBox,
    LinesChart,
    TableChart
  },
  name: "foreignInvestTaxChart",
  data() {
    return {
       totalData: {
        title: {
          ch: "外商投资企业税收统计",
          en: "Tax statistics of foreign invested enterprises"
        },
        unit:{
          ch: "百万美元",
          en: "USD min"
        },
        tableTitle: {
          year: {
            text: "年份_Year",
            width: "10%"
          },
          taxMillion: {
            text: "外商投资企业税收额_Tax reveune of Foreign Investment Enterprises",
            width: "40%",
            formatNum:true
          },
          YOYGrowth: {
            text: "增幅_Y-o-y growth",
            width: "25%",
            formatPer:true
          },
          percentInCountry: {
            text: "全国占比_Share of national tax revenue",
            width: "25%",
            formatPer:true
          }
        },
        tableData: [],
        updatedDate: ""
      },
      timer: null,
      showTimeFrame: false,
      yearOnYearData: 0,
      percentData: 0,
      USD: {
        id: "USD",
        dataSources: this.describeData,
        yName: { ch: "百万美元", en: "USD min" },
        yearOnYear: false, //通过修改这个值来显示同比
        percent: false, //通过修改这个值来显示同比
        title: {
          ch: "外商投资企业税收统计",
          en: "Tax revenue from foreign investment enterprises"
        },
        xData: [],
        hideLegend: true,
        spliceCon:{// toolTip里面插入同比和同比英文
          ch:'同比',
          en:'year on year'
        },
        series: [
          {
            name:
              "外商投资企业税收统计_Tax revenue from foreign investment enterprises",
            color: "#6AA3CD",
            data: [],
            yearOnYear: [],
            percent: []
          }
        ],
        updatedDate:''
      },
      status: [
        {
          checked: false,
          ch: "同比",
          en: "Year on year"
        },
        {
          checked: false,
          ch: "占比",
          en: "XXXXXXX"
        }
      ],
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
      }
    };
  },
   computed:{
    tableDatas() {
      return this.$store.getters.chartInfo;
    }
  },
  watch:{
    tableDatas:{
      handler() {
        let resoult= chartDataFun.conversionTable(this.totalData.tableTitle,this.$store.getters.chartInfo.tableData);
            console.log(resoult);
            this.$set(this.totalData,'tableData',resoult);
      },
      deep:true
    }
  },
  async mounted() {
    let res = await this.getMaxMinDate();
    let arrmaxmin = res.split("_");
    this.options.yearly.list.start.value=arrmaxmin[0];
    this.options.yearly.list.end.value=arrmaxmin[1];
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
      let res = await chartDataFun.getMaxMinDate("ForeignInvestment");
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
      //外商投资企业税收统计
      let data = await this.getItemData(res, XNameAttr, dataAttr, range);
      this.USD.series[0]["data"] = data.taxMillion;
      this.yearOnYearData = JSON.parse(JSON.stringify(data.YOYGrowth));
      this.percentData = JSON.parse(JSON.stringify(data.percentInCountry));
      this.USD.series[0]["yearOnYear"] = data.YOYGrowth;
    },
    async getChartsData(aug) {
      //改变横轴 获取数据
      let { res } = await request.getForeignInvestTaxChartsData(aug);
      // 完整的区间
      let range = await chartDataFun.getXRange(aug);
      // 要换取纵轴数据的字段属性
      let dataAttr = ["taxMillion", "YOYGrowth", "percentInCountry"];
      let XNameAttr = "year";
      this.USD.xData = range;
      this.USD.updatedDate=this.$store.getters.latestTime;
      this.totalData.updatedDate=this.$store.getters.latestTime;
      // 获取当前页面所有线
      await this.getItemCategoryData(res, XNameAttr, dataAttr, range);
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
        this.$message.warn('开始时间不得大于结束时间');
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
    // 复选框
    changeSelect(index) {
      for (let i = 0; i < this.status.length; i++) {
        if (i == index) {
          this.status[index].checked = !this.status[index].checked;
        } else {
          this.status[i].checked = false;
        }
      }
      if (index == 0) {
        this.USD.spliceCon={// toolTip里面插入同比和同比英文
          ch:'同比',
          en:'year on year'
        };
        this.USD.series[0]["yearOnYear"] = this.yearOnYearData;
        this.status[index].checked
          ? this.$set(this.USD, "yearOnYear", true)
          : this.$set(this.USD, "yearOnYear", false);
      }
      if (index == 1) {
        this.USD.spliceCon={// toolTip里面插入占比和占比英文
          ch:'占比',
          en:'xxxxx'
        },
        this.USD.series[0]["yearOnYear"] = this.percentData;
        this.status[index].checked
          ? this.$set(this.USD, "yearOnYear", true)
          : this.$set(this.USD, "yearOnYear", false);
      }
    }
  }
};
</script>

<style lang="less" scoped>
.foreign-invest-taxChart {
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
