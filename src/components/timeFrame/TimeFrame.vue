<template>
  <div class="timeFrame">
    <div class="tab-list">
      <div
        v-for="(item, key) in options"
        :key="key"
        class="tab-list-item"
        :class="key == activeKey ? 'active' : ''"
        @click="changeActiveKey(key)"
      >
        <div class="ch">{{ item.ch }}</div>
        <div class="en">{{ item.en }}</div>
      </div>
    </div>
    <div class="tab-area">
      <div v-if="activeKey == 'yearly'">
        <div
          v-for="(option, key) in options[activeKey].list"
          :key="key"
          class="tab-area-item"
        >
          <year-component
            :option="option"
            :value="option.value"
            @change="changeValue(key, $event)"
          ></year-component>
        </div>
      </div>

      <div v-if="activeKey == 'quarterly'">
        <div
          v-for="(option, key) in options[activeKey].list"
          :key="key"
          class="tab-area-item"
        >
          <quarter-component
            :option="option"
            :value="option.value"
            @change="changeValue(key, $event)"
          ></quarter-component>
        </div>
      </div>
      <div v-if="activeKey == 'monthly'">
        <div
          v-for="(option, key) in options[activeKey].list"
          :key="key"
          class="tab-area-item"
        >
          <month-component
            :option="option"
            :value="option.value"
            @change="changeValue(key, $event)"
          ></month-component>
        </div>
      </div>
    </div>
    <progress-bar
      :options="options[activeKey]"
      :activeKey="activeKey"
      @change="changeProgress"
    ></progress-bar>
  </div>
</template>

<script>
import YearComponent from "@/components/timeFrame/Year";
import QuarterComponent from "@/components/timeFrame/Quarter";
import MonthComponent from "@/components/timeFrame/Month";
import ProgressBar from "@/components/timeFrame/ProgressBar";

export default {
  props: {
    options: {}
  },
  components: {
    YearComponent,
    QuarterComponent,
    MonthComponent,
    ProgressBar
  },
  data() {
    return {
      activeKey: "yearly"
    };
  },
  watch: {
    activeKey: {
      handler(a, b) {
        this.$emit("changeActiveKey", a);
      }
    }
  },
  mounted() {},
  methods: {
    changeProgress(value) {
      this.$emit("update", this.activeKey, value);
    },
    //  值，这个值是哪个组件的值，
    changeValue(key, value) {
      //   console.log(this.activeKey, key, value, "111");
      this.$emit("change", this.activeKey, key, value);
    },
    changeActiveKey(key) {
      this.activeKey = key;
    }
  }
};
</script>

<style lang="less" scoped>
.timeFrame {
  width: 100%;
  user-select: none;
}
.tab-area {
  width: 100%;
  padding-top: 0.072917rem;
  .tab-area-item {
    padding: 0.072917rem 0;
  }
}
.tab-list {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  .tab-list-item {
    flex: 1;
    cursor: pointer;
    font-size: 0.072917rem;
    text-align: center;
    border-right: 1.5px solid #d8d8d8;
    border: 1.5px solid #d8d8d8;
    border-right: none;
    background-color: #fff;

    &:first-child {
      border-top-left-radius: 0.026042rem;
      border-bottom-left-radius: 0.026042rem;
    }
    &:last-child {
      border-right: 1.5px solid #d8d8d8;
      border-top-right-radius: 0.026042rem;
      border-bottom-right-radius: 0.026042rem;
    }
    .ch {
      color: #333;
    }
    .en {
      color: #999;
    }
  }
  .active {
    background-color: rgba(29, 63, 108, 0.8);
    .ch {
      color: #fff;
    }
    .en {
      color: #fff;
    }
  }
}
</style>
