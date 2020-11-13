<template>
  <div class="container">
    <div class="label-block">
      <div>{{ option.en }}</div>
      <div>{{ option.ch }}</div>
    </div>
    <div class="time-block" @click="openCalendar">
      <div class="text">{{ handleText(value) }}</div>
      <div
        class="icon iconfont"
        @mouseenter="mouseenter"
        @mouseleave="closeCalendar"
      >
        <div>&#xe72a;</div>
        <fade-in-out>
          <div v-if="show" class="calendar-block">
            <div class="page">
              <div class="prev iconfont" @click="prev">&#xe6a2;</div>
              <div>年份：{{ years[pageIndex] }}</div>
              <div class="next iconfont" @click="next">&#xe604;</div>
            </div>
            <div class="calendar">
              <div
                v-for="(item, index) in quarter"
                :key="index"
                class="quarter"
                :class="
                  item.month == option.value.split('-')[1] ? 'current' : ''
                "
                @click="handleClick(item)"
              >
                {{ item.text }}
              </div>
            </div>
          </div>
        </fade-in-out>
      </div>
    </div>
  </div>
</template>

<script>
import FadeInOut from "@/components/animations/FadeInOut";

export default {
  props: {
    option: {},
    value: {}
  },
  components: {
    FadeInOut
  },
  data() {
    return {
      show: false,
      years: [],
      pageIndex: 0,
      timer: null,
      quarter: [
        { text: "Q1", month: "03" },
        { text: "Q2", month: "06" },
        { text: "Q3", month: "09" },
        { text: "Q4", month: "12" }
      ]
    };
  },
  watch: {
    value: {
      handler(a, b) {
        this.getPageIndex();
      }
    }
  },
  mounted() {
    this.getYears();
    if (this.value) {
      this.getPageIndex();
    }
  },
  methods: {
    getPageIndex() {
      this.pageIndex = this.years.findIndex(v => {
        return v == this.value.split("-")[0];
      });
    },
    // 生成所有年份
    getYears() {
      let frame = this.option.frame.split("_");
      let len = frame[1] - frame[0];
      let years = [];
      for (let i = 0; i <= len; i++) {
        years.push(Number(frame[0]) + i);
      }
      years.sort();
      this.years = years;
    },
    handleClick(item) {
      this.$emit("change", `${this.years[this.pageIndex]}-${item.month}`);
    },
    next() {
      if (this.pageIndex < this.years.length - 1) {
        this.pageIndex++;
      }
    },
    prev() {
      if (this.pageIndex > 0) {
        this.pageIndex--;
      }
    },
    handleText(value) {
      if (!value) {
        return "请选择";
      }
      let val = this.quarter.find(v => {
        return v.month == value.split("-")[1];
      });
      return value.split("-")[0] + "-" + val.text;
    },
    mouseenter() {
      clearTimeout(this.timer);
    },
    openCalendar() {
      clearTimeout(this.timer);
      this.show = true;
    },
    closeCalendar() {
      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        this.show = false;
      }, 100);
    }
  }
};
</script>

<style lang="less" scoped>
.container {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  font-size: 0.083333rem;
  color: #656565;
  user-select: none;
}
.calendar-block {
  position: absolute;
  left: 25%;
  top: 100%;
  z-index: 1;
  width: 100%;
  padding: 0 0.052083rem 0.104167rem;
  border-radius: 0.026042rem;
  box-shadow: darkgrey 0px 0px 5px 1px;
  background-color: #fff;
  .page {
    display: flex;
    align-items: center;
    justify-content: space-evenly;
    padding: 0.0625rem 0.052083rem;
    .iconfont {
      width: 0.125rem;
      height: 0.125rem;
      line-height: 0.125rem;
      text-align: center;
      color: #999;
      font-size: 0.09375rem;
      cursor: pointer;
      border-radius: 50%;
      background-color: #eee;
    }
  }
  .calendar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    .quarter {
      width: 0.208333rem;
      height: 0.208333rem;
      text-align: center;
      border-radius: 0.02rem;
      // background-color: #eee;
      cursor: pointer;
    }
    .current {
      color: #fff;
      background-color: rgba(145, 173, 195,);
    }
  }
}
.label-block {
  line-height: 0.104167rem;
  font-size: 0.072917rem;
  & div:first-child{
  font-size: 0.09375rem;
  }
}
.time-block {
  display: flex;
  align-items: center;
  cursor: pointer;
  justify-content: space-between;
  width: 75%;
  height: 0.197917rem;
  line-height: 0.197917rem;
  font-size: 0.072917rem;
  border: 0.007813rem solid #cacaca;
  border-radius: 0.026042rem;
  background-color: #fff;
  .text {
    padding: 0 0.072917rem;
  }
  .icon {
    cursor: pointer;
    padding: 0 0.0625rem;
  }
}
</style>
