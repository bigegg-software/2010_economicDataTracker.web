<template>
  <div class="container">
    <div class="title">
      <div class="titleCh">{{this.totalData.title.ch}}</div>
      <div class="titleEn">{{this.totalData.title.en}}</div>
    </div>
    <div class="tableChart" ref="box">
      <div class="tableTitle">
        <div
          class="tableCols"
          v-for="(item,title) in totalData.tableTitle"
          :key="title"
          :style="`width:${item.width}`"
        >
          <div>{{item.text.split("_")[0]}}</div>
          <div>{{item.text.split("_")[1]}}</div>
        </div>
      </div>
      <div class="tableBody">
        <div class="tableRow" v-for="(item,index) in totalData.tableData" :key="index">
          <div class="tableCols" v-for="(items,i) in item" :key="i" :style="`width:${items.width}`">
            <div>{{items.text.split("_")[0]}}</div>
            <div>{{items.text.split("_")[1]}}</div>
          </div>
        </div>
      </div>
    </div>
    <div class="updated">
      <div>
        <div>数据最后更新时间</div>
        <div>Date last updated</div>
      </div>
      <div class="updatedDate">{{this.totalData.updatedDate.ch}}</div>
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
  onLoad() {},
  mounted() {},
  methods: {}
};
</script>
<style lang="less" scoped>
.container {
  width: 100%;
  height: 3.458333rem;
  padding: 0.104167rem;
  box-sizing: border-box;
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
  .tableChart {
    display: flex;
    flex-flow: column nowrap;
    height: 82%;
    overflow: hidden;
    margin: 0.06rem 0;
    font-size: 0.072917rem;
    border: 1px solid #ddd;
    .tableTitle {
      display: flex;
      padding-right: 0.04rem;
      box-sizing: border-box;
      border-bottom: 1px solid #ddd;
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
      overflow: auto;
    } 
    .tableBody::-webkit-scrollbar {
      width: 0.04rem;
    }
    .tableBody::-webkit-scrollbar-track{
      background:#f6f6f6;
    }
    .tableBody::-webkit-scrollbar-thumb{
      background: #ddd;
    }
   
  }
  .updated {
    display: flex;
    align-items: center;
    font-size: 0.078125rem;
    color: #333;
    .updatedDate {
      margin-left: 0.07rem;
    }
  }
}
</style>

