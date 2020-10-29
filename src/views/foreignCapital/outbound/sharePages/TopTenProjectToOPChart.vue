<template>
  <!-- 中国对外承包工程前十项目chart -->
  <div class="topTenProject-To-OPChart">
    <div class="echart-block">
      <div v-if="isShowTable" class="table-block"></div>
      <div class="container">
        <TableChart :totalData="totalData"></TableChart>
      </div>
    </div>
    <div class="select-block">
      <year :option="option" :value="option.value" @change="yearChange"></year>
    </div>
  </div>
</template>

<script>
import TableChart from "@/components/charts/TableChart";
import Year from "@/components/timeFrame/Year";
export default {
  components: { TableChart, Year },
  name: "topTenProjectToOPChart",
  data() {
    return {
      totalData: {
        title: {
          ch: "前十项目",
          en: "XXXXXXXXXXXXXXXXXXXXX"
        },
        tableTitle: {
          key: {
            text: "排名_Rank",
            width: "10%"
          },
          country: {
            text: "国家(地区)_Country/Region",
            width: "20%"
          },
          project: {
            text: "项目名称_Project",
            width: "35%"
          },
          enterprise: {
            text: "签约企业_Contracting enterprise",
            width: "35%"
          }
        },
        tableData: [
          {
            key: {
              text: "1",
              width: "10%"
            },
            country: {
              text: "埃及_Egypt",
              width: "20%"
            },
            project: {
              text:
                "新首都 2 期建设项目_New capital phase 2 construction project",
              width: "35%"
            },
            enterprise: {
              text: "中国建筑集团有限公司_China Construction Group Co., Ltd",
              width: "35%"
            }
          },
          {
            key: {
              text: "2",
              width: "10%"
            },
            country: {
              text: "埃及_Egypt",
              width: "20%"
            },
            project: {
              text:
                "新首都 2 期建设项目_New capital phase 2 construction project",
              width: "35%"
            },
            enterprise: {
              text: "中国建筑集团有限公司_China Construction Group Co., Ltd",
              width: "35%"
            }
          },
          {
            key: {
              text: "3",
              width: "10%"
            },
            country: {
              text: "埃及_Egypt",
              width: "20%"
            },
            project: {
              text:
                "新首都 2 期建设项目_New capital phase 2 construction project",
              width: "35%"
            },
            enterprise: {
              text: "中国建筑集团有限公司_China Construction Group Co., Ltd",
              width: "35%"
            }
          },
          {
            key: {
              text: "4",
              width: "10%"
            },
            country: {
              text: "埃及_Egypt",
              width: "20%"
            },
            project: {
              text:
                "新首都 2 期建设项目_New capital phase 2 construction project",
              width: "35%"
            },
            enterprise: {
              text: "中国建筑集团有限公司_China Construction Group Co., Ltd",
              width: "35%"
            }
          },
          {
            key: {
              text: "5",
              width: "10%"
            },
            country: {
              text: "埃及_Egypt",
              width: "20%"
            },
            project: {
              text:
                "新首都 2 期建设项目_New capital phase 2 construction project",
              width: "35%"
            },
            enterprise: {
              text: "中国建筑集团有限公司_China Construction Group Co., Ltd",
              width: "35%"
            }
          },
          {
            key: {
              text: "6",
              width: "10%"
            },
            country: {
              text: "埃及_Egypt",
              width: "20%"
            },
            project: {
              text:
                "新首都 2 期建设项目_New capital phase 2 construction project",
              width: "35%"
            },
            enterprise: {
              text: "中国建筑集团有限公司_China Construction Group Co., Ltd",
              width: "35%"
            }
          },
          {
            key: {
              text: "7",
              width: "10%"
            },
            country: {
              text: "埃及_Egypt",
              width: "20%"
            },
            project: {
              text:
                "新首都 2 期建设项目_New capital phase 2 construction project",
              width: "35%"
            },
            enterprise: {
              text: "中国建筑集团有限公司_China Construction Group Co., Ltd",
              width: "35%"
            }
          },
          {
            key: {
              text: "8",
              width: "10%"
            },
            country: {
              text: "埃及_Egypt",
              width: "20%"
            },
            project: {
              text:
                "新首都 2 期建设项目_New capital phase 2 construction project",
              width: "35%"
            },
            enterprise: {
              text: "中国建筑集团有限公司_China Construction Group Co., Ltd",
              width: "35%"
            }
          }
        ],
        updatedDate: {
          ch: "2020-10-23",
          en: "October 23,2020"
        }
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
  methods: {
    yearChange(year) {
      this.option.value = year;
    }
  }
};
</script>

<style lang="less" scoped>
.topTenProject-To-OPChart {
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
    padding: 0.078125rem;
    box-sizing: border-box;
  }
}
</style>
