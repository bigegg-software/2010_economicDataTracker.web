<template>
  <!-- 主要对华投资国家和地区统计-年度部分国家/地区对华直接投资chart -->
  <div class="state-DirectInvest-InChinaChart">
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
      <div class="status" v-if="$store.getters.showOperate">
        <select-check-box
          :option="checkBox"
          :result="result"
          @change="changeOption"
          @changeInputValue="changeInputValue"
        ></select-check-box>
      </div>
    </div>
  </div>
</template>

<script>
import dayjs from "dayjs";
import TimeFrame from "@/components/timeFrame/TimeFrame";
import LinesChart from "@/components/charts/Lines";
import SelectCheckBox from "@/components/select/selectCheckBox/SelectCheckBox";
import request from "@/request/inBound/inBound";
import chartDataFun from "@/utils/chartDataFun";
import CheckBox from "@/components/select/selectCheckBox/CheckBox";
import TableChart from "@/components/charts/TableChart";

export default {
  props: {
    isShowTable: {},
    describeData: {}
  },
  components: {
    TimeFrame,
    LinesChart,
    SelectCheckBox,
    CheckBox,
    TableChart
  },
  name: "stateDirectInvestInChinaChart",
  data() {
    return {
      searchTimer:null,
      totalData: {
        title: {
          ch: "部分国家/地区对华直接投资",
          en: "China's FDI inflows by major country/region"
        },
        unit: {
          ch: "百万美元",
          en: "USD mln"
        },
        tableTitle: {
          year: {
            text: "年份_Year",
            width: "10%"
          },
          continentEn: {
            text: "区域（英文）_Area",
            width: "20%"
          },
          continent: {
            text: "区域_Area",
            width: "20%"
          },
          countryEn: {
            text: "国家/地区（英文）_Country/Region",
            width: "15%"
          },
          country: {
            text: "国家/地区_Country/Region",
            width: "15%"
          },
          enterpriseNumber: {
            text: "企业数_Number of enterprises",
            width: "10%",
            formatInt:true
          },
          enterprisePercent: {
            text: "占外资企业数比重_Share of foreign investment enterprises",
            width: "15%",
            formatPer:true
          },
          FDIInflowsMillion: {
            text: "实际投入外资金额_FDI inflows to China",
            width: "15%",
            formatNum:true
          },
          inflowsPercent: {
            text: "占实际投入外资金额_Share of total FDI inflows to China",
            width: "15%",
            formatPer:true
          }
        },
        tableData: [],
        updatedDate: ""
      },
      timer: null,
      randomColor: [
        "#a65783",
        "#c68821",
        "#b8a597",
        "#72a083",
        "#c96470",
        "#61a0a9",
        "#2b4659",
        "#d38265",
        "#d2da90",
        "#6e6e70",
        "#c2cdd3",
        "#c03838",
        "#9d9930",
        "#9a8ccc",
        "#d4a04d",
        "#ca849f",
        "#b7d9bc",
        "#dfdc90"
      ],
      showTimeFrame: false,
      USD: {
        id: "USD",
        dataSources: this.describeData,
        yName: { ch: "百万美元", en: "USD mln" },
        y2Name: { ch: "家", en: "Enterprise" },
        unit2Symbol: "",
        yearOnYear: false, //通过修改这个值来显示同比
        title: { ch: "部分国家/地区对华直接投资", en: "China's FDI inflows by major country/region" },
        xData: [],
        grid: {
          right: "9%",
          bottom:"11%",
          enGapch:this.$fz(0.2),//数据来源中英文间距
        },
        yearInt:true,//点击功能区企业数为整数
        series: [],
        updatedDate: "",
        legendMark: {
          //右上角水印
          en: "Enterprise",
          ch: "企业数",
        },
      },
      status: [
        {
          checked: false,
          ch: "企业数",
          en: "Number of enterprises"
        }
      ],
      result: [],
      checkBox: {
        ch: "国家/地区",
        en: "Country/ region",
        op: []
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
        let resoult = chartDataFun.conversionTable(
          this.totalData.tableTitle,
          this.$store.getters.chartInfo.tableData
        );
         
        this.$set(this.totalData, "tableData", resoult);
      },
      deep: true
    },
    result: {
      async handler() {
        this.USD.series = [];
        await this.mainGetChartsData("yearly");
      },
      // deep: true
    }
  },
  async created() {
    let rand = await chartDataFun.randomColor(203);
    this.randomColor= [...this.randomColor,...rand];
    await this.getAllCountryName();
    let res = await this.getMaxMinDate();
    let arrmaxmin = res.Y.split("_");
    this.options.yearly.list.start.value = arrmaxmin[0];
    this.options.yearly.list.end.value = arrmaxmin[1];
    await this.getChartsData({
      noMonth: true,
      type: "yearly",
      containedIn: {
        country: this.result.map(item => {
          return item.ch;
        })
      },
      start: Number(arrmaxmin[0]),
      end: Number(arrmaxmin[1])
    });
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
    // 获取国家列表数据
    async getAllCountryName() {
      let countrys=await chartDataFun.getCountryName('MajorInvestors','country');
      let res = await request.getAllCountryName('abbreviationZH',countrys);
      // let d=[];
      //    d=res.map(s=>{
      //       return s.abbreviationZH
      //     })
      //   let xx=countrys.filter(v=>{
      //    return !d.includes(v);
      //   })
      this.checkBox.op = res;
      res[0].checked = true;
      res[1].checked = true;
      this.result = res.slice(0, 2);
    },
    async mainGetChartsData(type) {
      //条件改变时获取数据
      let { start, end } = this.options[type].list;
      let containedIn = this.result.map(item => {
        return item.ch;
      });
      await this.getChartsData({
        noMonth: true,
        type,
        containedIn: {
          country: containedIn
        },
        start: Number(start.value),
        end: Number(end.value)
      });
    },
    async getMaxMinDate() {
      // 获取最大年最小年
      let res = await chartDataFun.getMaxMinDate("MajorInvestors");
       
      for (let key in this.options) {
        let obj = JSON.parse(JSON.stringify(this.options[key]));
        for (let k in obj.list) {
          obj.list[k].frame = res.Y;
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
    // 获取当前页面的每条线数据（按年度 季度 月度分）
    async getItemCategoryData(res, XNameAttr, dataAttr, range) {
       
      for (let i = 0; i < res.length; i++) {
        let data = await this.getItemData(res[i], XNameAttr, dataAttr, range);
        this.$set(this.USD.series, i, {
          name: `${this.result[i].ch}_${this.result[i].en}|企业数_Number of enterprises`,
          data: data["FDIInflowsMillion"],
          yearOnYear: data["enterpriseNumber"],
          color: this.randomColor[i]
        });
      }
      //
    },
    async getChartsData(aug) {
      //改变横轴 获取数据
      let { res } = await request.getStateDirectInvestInChinaChartData(
        "MajorInvestors",
        aug,
        "FDIInflows"
      );
      // 完整的区间
      let range = await chartDataFun.getXRange(aug);
      // 要换取纵轴数据的字段属性
      let dataAttr = ["FDIInflowsMillion", "enterpriseNumber"];
      let XNameAttr = "year";
      this.USD.xData = range;
      this.totalData.updatedDate=this.$store.getters.latestTime;
      this.USD.updatedDate=this.$store.getters.latestTime;
      // 获取当前页面所有线
      await this.getItemCategoryData(res, XNameAttr, dataAttr, range);
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
      this.status[index].checked = !this.status[index].checked;
      if (index == 0) {
        this.status[index].checked
          ? (this.USD.yearOnYear = true)
          : (this.USD.yearOnYear = false);
      }
      if (index == 1) {
        this.status[index].checked
          ? (this.isShowRMB = true)
          : (this.isShowRMB = false);
      }
    },
    // 下拉多选框
    async changeOption(op) {
      // 判断存不存在 存在就删掉， 不存在就加进去
      let index = await this.result.findIndex(v => v.en == op.en);
      if (index == -1) {
        this.result.push(op);
      } else {
        this.result.splice(index, 1);
      }

      let i = await this.checkBox.op.findIndex(v => v.en == op.en);
      this.checkBox.op[i].checked = !this.checkBox.op[i].checked;
      // this.USD.series = [];
      // await this.mainGetChartsData("yearly");
    },
    async changeInputValue(value) {
      clearTimeout(this.searchTimer);
      this.searchTimer=setTimeout(async()=>{
      //输入的字符串中文英文拆分 中文匹配到字 英文匹配到词
      let regz = /[\u4e00-\u9fa5]/gi;
      let reg = /\s+/;
      let ch = value.match(regz) ? value.match(regz) : [];
      let en = value.replace(regz, "");
      let arr = en.split(reg);
      let arrName = Array.from(new Set([...arr, ...ch]));
      // 去掉数组中的空字符串
      for (var i = 0; i < arrName.length; i++) {
        if (
          arrName[i] == "" ||
          arrName[i] == null ||
          typeof arrName[i] == undefined
        ) {
          arrName.splice(i, 1);
          i = i - 1;
        }
      }
      if (value.replace(/(^\s*)/g, "") == "") {
        for (let y = 0; y < this.checkBox.op.length; y++) {
            this.checkBox.op[y].show = true;
        }
      } else {
        for (let i = 0; i < this.checkBox.op.length; i++) {
          let splitList = await this.checkBox.op[i].searchArr
            .join(",")
            .toLowerCase()
            // .split(",");  //去掉了切割成分组 可以搜索英文字符串 不用输入全英文单词
          
          let active = true;
          for (let k = 0; k < arrName.length; k++) {
            if (!splitList.includes(arrName[k].toLowerCase())) {
              active = false;
            }
          }
            this.checkBox.op[i].show = active;
        }
      }
    },600);
    }///
  }
};
</script>

<style lang="less" scoped>
.state-DirectInvest-InChinaChart {
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
      .checkbox {
        padding: 0;
      }
    }
  }
}
</style>
