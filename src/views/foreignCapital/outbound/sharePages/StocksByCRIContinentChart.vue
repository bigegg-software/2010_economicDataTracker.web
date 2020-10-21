<template>
  <!-- 中国对外直接投资存量按各洲内国家/地区统计chart -->
  <div class="stocks-by-CRI-continent-chart">
    <div class="echart-block">
      <div class="title">
        <div>{{this.totalData.title.ch}}</div>
        <div>{{this.totalData.title.en}}</div>
      </div>
      <div class="content">
        <div class="unit">
          <div>{{this.totalData.yName.ch}}</div>
          <div>{{this.totalData.yName.en}}</div>
        </div>
        <div class="chart">
          <treemap-chart :totalData="totalData"></treemap-chart>
        </div>
        <div class="updated">
          <div>
            <div>{{this.totalData.updated.ch}}</div>
            <div>{{this.totalData.updated.en}}</div>
          </div>
          <div>{{this.totalData.updated.date}}</div>
        </div>
      </div>
    </div>
    <div class="select-block">
      <div class="frame">
        <time-frame :options="options" @change="change" @update="update"></time-frame>
      </div>
    </div>
  </div>
</template>

<script>
import dayjs from "dayjs";
import TreemapChart from "@/components/charts/Treemap";
import TimeFrame from "@/components/timeFrame/TimeFrame";

export default {
  components: {
    TimeFrame,
    TreemapChart
  },
  name: "stocksByCRIContinentChart",
  data() {
    return {
      totalData: {
        title: {
          ch: "按各洲内国家/地区统计",
          en: "Statistics by continent country / Region"
        },
        yName: {
          ch: "百万美元",
          en: "USD min"
        },
        updated: {
          ch: "数据最后更新时间",
          en: "Data last updated",
          date: "2020-10-21"
        },
        seriesData: [
            { name: "树、插花_xxxxxxxx", value: "292" },
            { name: "蔬菜_xxxxxx", value: "2037" },
            { name: "水果_xxxxxx", value: "8682" },
            { name: "咖啡茶_xxxxxx", value: "633" },
            { name: "谷物_xxxxxx", value: "5793" },
            { name: "淀粉_xxxxxx", value: "1178" },
            { name: "含油子仁果实_xxxxxx", value: "4079" },
            { name: "树胶树脂_xxxxxx", value: "313" },
            { name: "编结植物_xxxxxx", value: "142" }
          ]
      },
      options: {
        yearly: {
          // ch: "年度",
          // en: "yearly",
          list: {
            start: {
              ch: "年度",
              en: "Yearly",
              frame: "1990_2020",
              value: "1990"
            }
          }
        }
      }
    };
  },
  methods: {
    //  时间范围组件 update and change
    update(activeKey, value) {
      this.options[activeKey].list.start.value = value[0];
    },
    change(activeKey, key, value) {
      let start =
        key == "start" ? dayjs(`${value}`) : dayjs(`${list.start.value}`);
      this.options[activeKey].list[key].value = value;
    }
  }
};
</script>

<style lang="less" scoped>
.stocks-by-CRI-continent-chart {
  display: flex;
  .echart-block {
    width: 77%;
    height: 664px;
    background-color: #fff;
    border: 2px solid #cacaca;
    border-right: none;
    .title {
      width: 100%;
      display: flex;
      flex-flow: column nowrap;
      align-items: center;
    }
    .content {
      .chart {
        width: 100%;
        height: 2.6rem;
        border: 1px solid red;
      }
      .updated {
        display: flex;
        align-items: center;
      }
    }
  }
  .select-block {
    width: 23%;
    height: 664px;
    background-color: #f0f0f0;
    border: 2px solid #cacaca;
  }
}
</style>
