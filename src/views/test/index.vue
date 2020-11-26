<template>
  <div id="test">
    <div class="a">
      <check-box
        v-for="(item, index) in select"
        :key="index"
        :option="item"
        @change="changeSelect(index)"
      ></check-box>
    </div>
    <div class="a">
      <time-frame
        :options="options"
        @change="change"
        @update="update"
      ></time-frame>
    </div>
    <div class="a">
      <!-- <select-radio
        :option="radio"
        :value="value"
        @change="changeRadio"
      ></select-radio> -->
    </div>
    <div class="a">
      <select-check-box
        :option="checkBox"
        :result="result"
        @change="changeOption"
        @changeInputValue="changeInputValue"
      ></select-check-box>
    </div>
  </div>
</template>

<script>
import dayjs from "dayjs";
import TimeFrame from "@/components/timeFrame/TimeFrame";
import CheckBox from "@/components/select/selectCheckBox/CheckBox";
import SelectRadio from "@/components/select/SelectRadio";
import SelectCheckBox from "@/components/select/selectCheckBox/SelectCheckBox";
export default {
  components: {
    TimeFrame,
    CheckBox,
    // SelectRadio,
    SelectCheckBox
  },
  data() {
    return {
      result: [],
      value: {
        ch: "巴基斯坦",
        en: "bjstbbbbbbbb"
      },
      checkBox: {
        ch: "国家",
        en: "country",
        op: [
          {
            ch: "中国",
            en: "china",
            checked: false
          },
          {
            ch: "巴基斯坦",
            en: "bjstbbbbbbbb",
            checked: false
          },
          {
            ch: "俄罗斯",
            en: "els",
            checked: false
          },
          {
            ch: "日本",
            en: "japan",
            checked: false
          },
          {
            ch: "朝鲜",
            en: "cx",
            checked: false
          },
          {
            ch: "加拿大",
            en: "jnd",
            checked: false
          },
          {
            ch: "英国",
            en: "english",
            checked: false
          }
        ]
      },
      radio: {
        ch: "大洲",
        en: "Continent",
        op: [
          {
            ch: "中国",
            en: "china",
            checked: false
          },
          {
            ch: "巴基斯坦",
            en: "bjstbbbbbbbb",
            checked: false
          },
          {
            ch: "俄罗斯",
            en: "els",
            checked: false
          },
          {
            ch: "日本",
            en: "japan",
            checked: false
          },
          {
            ch: "朝鲜",
            en: "cx",
            checked: false
          },
          {
            ch: "加拿大",
            en: "jnd",
            checked: false
          },
          {
            ch: "英国",
            en: "english",
            checked: false
          }
        ]
      },
      select: [
        {
          checked: false,
          ch: "同比",
          en: "Year on year"
        },
        {
          checked: false,
          ch: "人民币计价",
          en: "In RMB"
        }
      ],
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
    changeInputValue(value) {
      console.log(value, "inputvalue");
      // 然后重新发请求修改 checkBox.op
    },
    // 下拉多选框
    changeOption(op) {
      // 判断存不存在 存在就删掉， 不存在就加进去
      let index = this.result.findIndex(v => v.en == op.en);
      if (index == -1) {
        this.result.push(op);
      } else {
        this.result.splice(index, 1);
      }

      let i = this.checkBox.op.findIndex(v => v.en == op.en);
      this.checkBox.op[i].checked = !this.checkBox.op[i].checked;
      // console.log(this.result, "this.result");
    },
    // 下拉单选框
    changeRadio(item) {
      this.value = item;
    },
    // checkBox
    changeSelect(index) {
      this.select[index].checked = !this.select[index].checked;
    },
    // timeFrame
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
        this.$message.warn('开始时间不得大于结束时间');
        return;
      }
      this.options[activeKey].list[key].value = value;
    }
  }
};
</script>

<style lang="less" scoped>
#test {
  display: flex;
  align-items: center;
  flex-direction: column-reverse;
  justify-content: center;
  width: 100%;
  height: 100%;
}
.a {
  width: 270px;
  padding: 50px 0;
}
</style>
