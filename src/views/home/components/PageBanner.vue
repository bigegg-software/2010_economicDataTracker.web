<template>
  <div class="pageBanner">
    <div class="nav-container">
      <div class="nav-block">
        <div
          v-for="(item, index) in navList"
          :key="index"
          class="nav-item"
          :class="item.name&&$route.path.includes(item.name) ? 'active' : ''"
          @click="jumpPage(item)"
        >
          <div class="nav-text">{{ item.Chinese }}</div>
          <div class="nav-text">{{ item.English }}</div>
        </div>
      </div>
      <div class="input-block">
        <input
          v-model="searchValue"
          type="text"
          placeholder="关键字 keywords"
        />
        <div class="iconfont icon-search">&#xe6a6;</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "PageBanner",
  data() {
    return {
      navList: [
        {
          Chinese: "外资",
          English: "Foreign Direct Investment (FDI)",
          name: "foreignCapital"
        },
        { Chinese: "外贸", English: "Trade", name: "foreignTrade" },
        {
          Chinese: "宏观经济指标",
          English: "Macro-economic indicators",
          name: "economicIndicators"
        }
      ],
      searchValue: ""
    };
  },
  methods: {
    jumpPage(item) {
      this.$router.push({ name: item.name });
    }
  }
};
</script>

<style lang="less" scoped>
// banner
.pageBanner {
  position: relative;
  width: 100%;
  height: 1.958333rem;
  background: url("../../../assets/img/banner.jpg") center/cover no-repeat;
  .nav-container {
    position: absolute;
    bottom: 0;
    left: 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    height: 0.322917rem;
    padding: 0 1.041667rem;
    box-sizing: border-box;
    background-color: rgba(25, 56, 96, 0.7);
    .nav-block {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 100%;
      .nav-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        // width: 1.59375rem;
        padding: 0 0.15rem;
        height: 100%;
        color: #fff;
        font-size: 0.09375rem;
        .nav-text:first-child {
          height: 50%;
          line-height: 0.19rem;
        }
        &:hover {
          cursor: pointer;
          background-color: rgba(188, 196, 207);
          color: rgb(25, 56, 96);
        }
        &.active {
          background-color: #fff;
          cursor: not-allowed;
          pointer-events: none;
          color: rgb(25, 56, 96);
        }
      }
    }
    .input-block {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 1.5625rem;
      height: 0.197917rem;
      font-size: 0.09375rem;
      background-color: #fff;
      input {
        flex: 1;
        border: none;
        outline: none;
        padding-left: 0.05rem;
        box-sizing: border-box;
      }
      .icon-search {
        padding: 0 0.05rem;
      }
    }
  }
}
</style>
