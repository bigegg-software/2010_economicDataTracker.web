<template>
  <div id="test">
    <div class="a">
      <time-frame
        :options="options"
        @change="change"
        @update="update"
      ></time-frame>
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
              frame: "1990_2020",
              value: "1990"
            },
            end: {
              ch: "结束",
              en: "End",
              frame: "1990_2020",
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
              frame: "2010_2020",
              value: "2010-03"
            },
            end: {
              ch: "结束",
              en: "End",
              frame: "2010_2020",
              value: "2020-12"
            }
          }
        }
      }
    };
  },
  mounted() {},
  methods: {
    update(activeKey, value) {
      // console.log(activeKey, value, "666");
      // value = [开始，结束] list.start.value = value[0] list.end.value = value[1]
      this.options[activeKey].list.start.value = value[0];
      this.options[activeKey].list.end.value = value[1];
    },
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
