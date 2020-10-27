<template>
  <div class="container">
    <div class="label-block">
      <div>{{ option.ch }}</div>
      <div>{{ option.en }}</div>
    </div>
    <div class="time-block">
      <div class="text">{{ option.value }}</div>
      <div
        class="icon iconfont"
        @mouseenter="openCalendar"
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
                v-for="(item, index) in month"
                :key="index"
                class="month"
                :class="
                  item.text == option.value.split('-')[1] ? 'current' : ''
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
      month: [
        { text: "01" },
        { text: "02" },
        { text: "03" },
        { text: "04" },
        { text: "05" },
        { text: "06" },
        { text: "07" },
        { text: "08" },
        { text: "09" },
        { text: "10" },
        { text: "11" },
        { text: "12" }
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
    if(this.value){
      this.getPageIndex();
    }
  },
  methods: {
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
    getPageIndex() {
      this.pageIndex = this.years.findIndex(v => {
        return v == this.value.split("-")[0];
      });
    },
    handleClick(item) {
      //   console.log(`${this.years[this.pageIndex]}-${item.month}`);
      this.$emit("change", `${this.years[this.pageIndex]}-${item.text}`);
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
  padding: 0 0.052083rem 0.052083rem;
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
    .month {
      width: 0.208333rem;
      height: 0.208333rem;
      margin: 0.05rem;
      text-align: center;
      border-radius: 50%;
      background-color: #eee;
      cursor: pointer;
    }
    .current {
      color: #fff;
      background-color: rgba(29, 63, 108, 0.8);
    }
  }
}
.label-block {
  font-size: 0.0625rem;
  line-height: 0.104167rem;
}
.time-block {
  display: flex;
  align-items: center;
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
