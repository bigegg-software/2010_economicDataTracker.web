<template>
<!-- 中国对外直接投资流量按各洲内国家/地区统计chart -->
  <div class="flows-by-CRI-continent-chart">
    <div v-if="isShowTable" class="table-block"></div>
    <div class="echart-block">
      <treemap-chart :totalData="totalData"></treemap-chart>
    </div>
    <div class="select-block">
      <div class="year-select">
        <Yearly :option="option" :value="option.value" @change="changeValue"></Yearly>
      </div>
      <SelectRadio
        :option="selectOption"
        :value="selectOption.value"
        @change="changeSelect($event)"
      ></SelectRadio>
    </div>
  </div>
</template>

<script>

import TreemapChart from "@/components/charts/Treemap";
import Yearly from "@/components/timeFrame/Year";
import SelectRadio from "@/components/select/SelectRadio";

export default {
   components: {
    TreemapChart,
    Yearly,
    SelectRadio
  },
   props: {
    isShowTable: {}
  },
  name: "flowsByCRIContinentChart",
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
        seriesData: {
          all: "全部_ALL",
          data: [
            { name: "树、插花_xxfgdbbfx", value: 292 },
            { name: "蔬菜_vffxfbdx", value: 234 },
            { name: "水果_xbdfv", value: 75 },
            { name: "咖啡茶_dvfxxx", value: 251 },
            { name: "谷物_ffff", value: 452 },
            { name: "淀粉_ewwwwwwwwwwww", value: 90 },
            { name: "含油子仁果实_dscxx", value: 145 },
            { name: "树胶树脂_dscdx", value: 120 },
            { name: "编结植物_xsdvx", value: 20 }
          ]
        },
        updatedDate:{
          ch:"2020-10-23",
          en:"October 23,2020"
        }
      },
      option: {
        ch: "年度",
        en: "yearly",
        frame: "1990_2020",
        value: "2020"
      },
      selectOption: {
        ch: "大洲",
        en: "xxxxxx",
        value: {
          ch: "亚洲",
          en: "yazhou"
        },
        op: [
          {
            ch: "非洲",
            en: "yazhou"
          },
          {
            ch: "亚洲",
            en: "yazhou"
          },
          {
            ch: "南美洲",
            en: "yazhou"
          },
          {
            ch: "欧洲",
            en: "yazhou"
          },
          {
            ch: "北美洲",
            en: "yazhou"
          },
          {
            ch: "南极洲",
            en: "yazhou"
          }
        ]
      }
    };
  },
  methods: {
      changeValue(value) {
      this.option.value = value;
    },
    changeSelect(item) {
      this.selectOption.value = item;
    }
  }
};
</script>

<style lang="less" scoped>
.flows-by-CRI-continent-chart {
  position: relative;
  display: flex;
  .table-block {
    position: absolute;
    left: 0;
    top: 0;
    z-index: 3;
    width: 100%;
    height: 100%;
    background-color: #ccc;
  }
  .echart-block {
    width: 77%;
    height: 3.458333rem;
    background-color: #fff;
    border: 2px solid #cacaca;
    border-right: none;
  }
  .select-block {
    width: 23%;
    height: auto;
    padding: 0.078125rem;
    box-sizing: border-box;
    background-color: #f0f0f0;
    border: 2px solid #cacaca;
    .year-select {
      margin-bottom: 0.078125rem;
    }
  }
}
</style>
