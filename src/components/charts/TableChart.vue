<template>
  <div @contextmenu.prevent
    class="unselectable"
    :class="
      $store.state.fullScreen.isFullScreen == false
        ? 'fullContainer'
        : 'container'
    "
  >
    <div class="title">
      <div class="titleCh">{{ this.totalData.title.en }}</div>
      <div class="titleEn">{{ this.totalData.title.ch }}</div>
    </div>
    <div class="unit">
      <div>{{ this.totalData.unit ? this.totalData.unit.en : "" }}</div>
      <div>{{ this.totalData.unit ? this.totalData.unit.ch : "" }}</div>
    </div>
    <div class="tableChart" ref="box">
      <div class="tableTitle">
        <div
          class="tableCols"
          v-for="(item, title) in totalData.tableTitle"
          :key="title"
          :style="`width:${item.width}`"
        >
          <div>{{ item.text.split("_")[1] }}</div>
          <div>{{ item.text.split("_")[0] }}</div>
        </div>
      </div>
      <div class="tableBody">
        <div
          class="tableRow"
          v-for="(item, index) in totalData.tableData"
          :key="index"
        >
          <div
            class="tableCols"
            v-for="(items, i) in item"
            :key="i"
            :style="`width:${items.width}`"
          >
            <div>
              {{
                items.text.includes("_") && items.text.split("_")[1]
                  ? items.text.split("_")[1]
                  : ""
              }}
            </div>
            <div>
              {{
                items.text.includes("_") && items.text.split("_")[0]
                  ? items.text.split("_")[0]
                  : ""
              }}
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="updated">
      <div>
        <div>Data last updated</div>
        <div class="updatedCh">数据最后更新时间</div>
      </div>
      <div class="updatedDate">{{ this.totalData.updatedDate }}</div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tableHeight: 0
    };
  },
  props: { totalData: {} },
  mounted() {
  },
  methods: {}
};
</script>
<style lang="less" scoped>
.unselectable {
  -moz-user-select: none;
  -webkit-user-select: none;
  -ms-user-select: none;
  -khtml-user-select: none;
  user-select: none;
  width: 100%;
}
.container {
  width: 5.875rem;
  height: 3.916667rem;
  padding: 0.1rem;
  box-sizing: border-box;
}
.fullContainer {
  width: 7.4rem;
  height: 4.933333rem;
  padding: 0.1rem;
  box-sizing: border-box;
  .tableChart {
    width: 100%;
    height: 88%;
  }
}
.title {
  width: 100%;
  display: flex;
  flex-flow: column nowrap;
  align-items: center;
  .titleCh {
    font-size: 0.09375rem;
    font-weight: bold;
    color: #333;
  }
  .titleEn {
    font-size: 0.083333rem;
    color: #999;
  }
}
.unit {
  position: absolute;
  top: 0.24rem;
  line-height: 0.08rem;
  font-size: 0.09375rem;
  color: #666;
  & div:last-child {
    font-size: 0.072917rem !important;
  }
}
.tableChart {
  display: flex;
  flex-flow: column nowrap;
  width: 100%;
  height: 85%;
  overflow: hidden;
  margin: 0.06rem 0;
  font-size: 0.072917rem;
  border: 1px solid #ddd;
  background: url("../../assets/img/waterMark.png") no-repeat center center;
  background-size: 50%;
  .tableTitle {
    display: flex;
    padding-right: 0.04rem;
    box-sizing: border-box;
    border-bottom: 1px solid #ddd;
    width: 100%;
  }
  .tableRow {
    display: flex;
    border-bottom: 1px solid #ddd;
  }
  .tableCols {
    display: flex;
    flex-flow: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    padding: 0.052083rem 0;
    box-sizing: border-box;
  }
  .tableBody {
    width: 100%;
    overflow: auto;
  }
  .tableBody::-webkit-scrollbar {
    width: 0.04rem;
  }
  .tableBody::-webkit-scrollbar-track {
    background: #f6f6f6;
  }
  .tableBody::-webkit-scrollbar-thumb {
    background: #ddd;
  }
}
.updated {
  // transform: scale(0.9, 0.9);
  transform-origin: left top;
  display: flex;
  align-items: center;
  font-size: 0.09375rem;
  color: #666;
  font-family: Calibri;
  .updatedCh {
    font-size: 0.072917rem;
    font-family: SimHei;
  }
  .updatedDate {
    margin-left: 0.07rem;
    font-size: 0.104167rem;
  }
}
</style>
