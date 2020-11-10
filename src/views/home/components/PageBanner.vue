<template>
  <div class="pageBanner">
    <div :class="$store.state.fullScreen.isFullScreen==true?'nav-container':'nav-fullContainer'">
      <div class="nav-container">
        <div class="nav-block">
          <div
            v-for="(item, index) in navList"
            :key="index"
            class="nav-item"
            :class="item.name&&$route.path.includes(item.name) ? 'active' : ''"
            @click="jumpPage(item)"
          >
            <div class="nav-text">{{ item.English}}</div>
            <div class="nav-text">{{ item.Chinese}}</div>
          </div>
        </div>
        <nav-search></nav-search>
      </div>
    </div>
  </div>
</template>

<script>
import NavSearch from "@/components/NavSearch";
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
  components: { NavSearch },
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
  .nav-fullContainer {
    display: none;
  }
  .nav-container {
    position: absolute;
    bottom: 0;
    left: 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    height: 0.379167rem;
    padding: 0 0.429688rem;
    box-sizing: border-box;
    background-color: rgba(25, 100, 151, 0.6);
    .nav-block {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 100%;
      .nav-item {
        display: flex;
        flex-direction: column;
        // width: 1.59375rem;
        padding: 0 0.15rem;
        height: 100%;
        color: #fff;
        font-size: 0.083333rem;
        .nav-text:first-child {
          height: 50%;
          line-height: 0.24rem;
          font-size: 0.125rem;
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
          color: #186497;
        }
      }
    }
  }
}
</style>
