<template>
  <div id="test">
    <div class="a">
      <time-frame :options="options" @change="change"></time-frame>
    </div>
  </div>
</template>

<script>
import dayjs from "dayjs";
import TimeFrame from "@/components/timeFrame/TimeFrame";
export default {
  components: {
    TimeFrame
  },
  data() {
    return {
      result: {},
      options: {
        yearly: {
          ch: "年度",
          en: "yearly",
          list: {
            start: {
              ch: "开始",
              en: "Start",
              frame: "2000_2020",
              value: "2000"
            },
            end: {
              ch: "结束",
              en: "End",
              frame: "2000_2020",
              value: "2020"
            }
          }
        },
        quarterly: {
          ch: "季度",
          en: "quarterly",
          list: {
            start: {
              ch: "开始",
              en: "Start",
              frame: "2000_2020",
              value: "2000-03"
            },
            end: {
              ch: "结束",
              en: "End",
              frame: "2000_2020",
              value: "2020-12"
            }
          }
        },
        monthly: {
          ch: "月度",
          en: "monthly",
          list: {
            start: {
              ch: "开始",
              en: "Start",
              frame: "2000_2020",
              value: "2000-03"
            },
            end: {
              ch: "结束",
              en: "End",
              frame: "2000_2020",
              value: "2020-12"
            }
          }
        }
      }
    };
  },
  mounted() {},
  methods: {
    change(activeKey, key, value) {
      let list = JSON.parse(JSON.stringify(this.options[activeKey].list));
      let start =
        key == "start" ? dayjs(`${value}`) : dayjs(`${list.start.value}`);
      let end = key == "end" ? dayjs(`${value}`) : dayjs(`${list.end.value}`);
      if (end.isBefore(start)) {
        return console.log("开始时间不得大于结束时间");
      }
      this.options[activeKey].list[key].value = value;
      // 赋值之后还原其余两个组件的初始时间
    }
  }
};
</script>

<style lang="less" scoped>
#test {
  display: flex;
  justify-content: center;
  width: 100%;
  height: 100%;
  margin: 200px auto;
}
.a {
  width: 270px;
}
</style>
