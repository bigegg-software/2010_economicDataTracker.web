<template>
  <div class="tab-block">
    <div
      v-for="(item, index) in tabList"
      :key="index"
      class="tab-item"
      :class="{ active: activeIndex == index }"
      @click="handleClickTab(index)"
    >
      <div class="text">{{ item.chinese }}</div>
      <div class="text">{{ item.english }}</div>
      <div v-if="activeIndex == index" class="under-line"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ForeignTrade",
  props: {
    tabList: {}
  },
  data() {
    return {
      activeIndex: 0
    };
  },
  watch: {
    activeIndex() {}
  },
  mounted() {},
  methods: {
    getUnderLineWidth() {},
    handleClickTab(index) {
      this.activeIndex = index;
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
    position: relative;
    color: #666666;
    margin-right: 4px;
    padding: 0.072917rem 0.145833rem;
    background-color: #f0f0f0;
    border-top-left-radius: 0.041667rem;
    border-top-right-radius: 0.041667rem;
  }
  .active {
    color: #1d3f6c;
    background-color: #fff;
    border: 2px solid #cccccc;
    border-bottom: none;
  }
  .under-line {
    position: absolute;
    left: -1px;
    bottom: -2px;
    width: ceil(100%+1px);
    height: 0.020833rem;
    background-color: #1d3f6c;
  }
}
</style>
