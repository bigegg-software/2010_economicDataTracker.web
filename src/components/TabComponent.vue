<template>
  <div class="tab-block">
    <div
      v-for="item in tabList"
      :key="item.name"
      class="tab-item"
      :class="{ active: tabComponent == item.name }"
      @click="handleClickTab(item.name)"
    >
      <div class="text">{{ item.english }}</div>
      <div class="text">{{ item.chinese }}</div>
      <div v-if="tabComponent == item.name" class="under-line"></div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    tabList: {},
    tabComponent: {}
  },
  data() {
    return {};
  },
  mounted() {},
  methods: {
    getUnderLineWidth() {},
    handleClickTab(name) {
      this.$emit("change", name);
    }
  }
};
</script>

<style lang="less" scoped>
.tab-block {
  display: flex;
  align-items: center;
  width: 100%;
  .tab-item {
    // width: 30%;
    position: relative;
    color: #898989;
    cursor: pointer;
    margin-right: 0.020833rem;
    padding: 0.072917rem 0.1rem;
    background-color: #E1E1E1;
    border-top-left-radius: 0.041667rem;
    border-top-right-radius: 0.041667rem;
    &:last-child {
      margin-right: 0;
    }
    .text {
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 1;
      overflow: hidden;
      width: 100%;
      font-family:Calibri-Bold;
      font-size: 0.104167rem;
      &:last-child {
        font-family:SimHei,'黑体';
        font-size: 0.083333rem;
      }
    }
  }
  .active {
    width: auto;
    color: #186497;
    background-color: #fff;
    border: 2px solid #cccccc;
    border-bottom: none;
    white-space: nowrap;
    .text {
      font-size: 0.083333rem;
      &:first-child {
        font-size: 0.104167rem;
      }
    }
  }
  .under-line {
    position: absolute;
    left: 0px;
    bottom: -2px;
    z-index: 1;
    width: 100%;
    height: 0.020833rem;
    background-color: #186497;
  }
}
</style>
