<template>
  <div class="actions-block">
    <div v-for="(item, index) in actionsList" :key="index" class="action">
      <div class="iconfont icon-action">{{ item.icon }}</div>
      <div class="text">
        <div>{{ item.ch }}</div>
        <div>{{ item.en }}</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Actions",
  data() {
    return {
      actionsList: [
        { ch: "表格", en: "table", icon: "\ue61e" },
        { ch: "下载", en: "download", icon: "\ue635" },
        { ch: "嵌入", en: "embed", icon: "\ue616" },
        { ch: "", en: "", icon: "\ue63c" },
        { ch: "", en: "", icon: "\ue600" }
      ]
    };
  },
  methods: {}
};
</script>

<style lang="less" scoped>
.actions-block {
  display: flex;
  align-items: center;
  justify-content: space-between;
  .action {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 19.25%;
    height: 0.296875rem;
    border: 2px solid #cbcbcb;
    border-right: none;
    color: #999;
    cursor: pointer;
    user-select: none;
    &:last-child {
      width: 23%;
      border-right: 2px solid #cbcbcb;
    }
    .icon-action {
      font-size: 0.145833rem;
      margin-right: 0.052083rem;
    }
    .text {
      font-size: 0.072917rem;
      line-height: 0.09375rem;
    }
  }
}
</style>
