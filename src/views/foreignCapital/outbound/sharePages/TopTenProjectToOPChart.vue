<template>
  <!-- 中国对外承包工程前十项目chart -->
  <div class="topTenProject-To-OPChart">
    <div class="echart-block">
      <div v-if="isShowTable" class="table-block"></div>
      <div :class="$store.state.fullScreen.isFullScreen==false?'fullContainer':'container'">
        <TableChart :totalData="totalData"></TableChart>
      </div>
    </div>
    <div class="select-block">
      <year v-if="showTimeFrame" :option="option" :value="option.value" @change="yearChange"></year>
    </div>
  </div>
</template>

<script>
import TableChart from "@/components/charts/TableChart";
import Year from "@/components/timeFrame/Year";
import request from "@/request/outBound/outBound";
import chartDataFun from "@/utils/chartDataFun";
export default {
  components: { TableChart, Year },
  name: "topTenProjectToOPChart",
  data() {
    return {
      showTimeFrame: false,
      totalData: {
        title: {
          ch: "中国年度对外承包工程新签合同额前十项目",
          en: "China's top 10 overseas project by contracts value"
        },
        tableTitle: {
          rank: {
            text: "排名_Rank",
            width: "10%"
          },
          country: {
            text: "国家(地区)_Country/Region",
            width: "20%"
          },
          projectEn: {
            text: "项目名称（英文）_Project (English)",
            width: "35%"
          },
          project: {
            text: "项目名称（中文）_Project (Chinese)",
            width: "35%"
          },
          contractingEnterpriseEn: {
            text: "签约企业（英文）_Contracting enterprise (English)",
            width: "35%"
          },
          contractingEnterprise: {
            text: "签约企业（中文）_Contracting enterprise(Chinese)",
            width: "35%"
          }
        },
        tableData: [],
        updatedDate: ""
      },
      option: {
        ch: "年度",
        en: "Yearly",
        frame: "",
        value: ""
      }
    };
  },
  props: {
    isShowTable: {
      type: Boolean,
      default: false
    }
  },
  watch:{
    option:{
      handler() {
          this.totalData.title.ch=`${this.option.value}中国年度对外承包工程新签合同额前十项目`;
          this.totalData.title.en=`China's top 10 overseas project by contracts value in ${this.option.value}`;
      },
      deep:true
    },
  },
  mounted() {},
  async created() {
    let res = await this.getMaxMinDate();
    let arrmaxmin = res.split("_");
    this.option.value=arrmaxmin[1];
    await this.getChartsData({
      ascending: "rank", //排名升序
      limit: 20,
      year: Number(arrmaxmin[1])
    });
  },
  methods: {
    async getMaxMinDate() {
      // 获取最大年最小年
      let res = await chartDataFun.getMaxMinDate("ForeignContractNewConRank");
      this.$set(this.option, "frame", res);
      this.showTimeFrame = true;
      return res;
    },
    async getChartsData(aug) {
      //年份 获取数据
      let { res } = await request.getForeignContractNewConRank(aug);
      this.totalData.updatedDate=this.$store.getters.latestTime;
      this.totalData.tableData = [];
      res.forEach(item => {
        this.totalData.tableData.push({
          rank: {
            text: item.rank + "_",
            width: "10%"
          },
          country: {
            text: item.country + "_" + item.countryEn,
            width: "20%"
          },
          projectEn: {
            text: item.projectEn + "_",
            width: "35%"
          },
          project: {
            text: item.project + "_",
            width: "35%"
          },
          contractingEnterpriseEn: {
            text: item.contractingEnterpriseEn + "_",
            width: "35%"
          },
          contractingEnterprise: {
            text: item.contractingEnterprise + "_",
            width: "35%"
          }
        });
      });
    },
    async yearChange(year) {
      this.option.value = year;
      await this.getChartsData({
        ascending: "rank",
        // limit: 20,
        year: Number(year)
      });
    }
  }
};
</script>

<style lang="less" scoped>
.topTenProject-To-OPChart {
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
    padding: 0.078125rem;
    box-sizing: border-box;
  }
}
</style>
