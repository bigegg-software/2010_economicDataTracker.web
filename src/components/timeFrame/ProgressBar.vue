<template>
  <div class="progessBar">
    <a-slider
      v-if="years.length"
      :value="frame"
      range
      :min="0"
      :max="years.length - 1"
      :step="1"
      :tip-formatter="formatter"
      @change="change"
    />
  </div>
</template>

<script>
export default {
  props: {
    options: {},
    activeKey: {}
  },
  data() {
    return {
      years: [],
      frame: []
    };
  },
  watch: {
    activeKey: {
      handler() {
        this.getProgressFrame();
      },
      deep: true
    },
    options: {
      handler(a, b) {
        let start = a.list.start.value.split("-")[0];
        let end = a.list.end.value.split("-")[0];
        let i = this.years.findIndex(v => v == start);
        let j = this.years.findIndex(v => v == end);
        this.frame = [i, j];
      },
      deep: true
    }
  },
  mounted() {
    this.getProgressFrame();
  },
  methods: {
    change(val) {
      this.frame = val;
      let result;
      let start = this.years[val[0]];
      let end = this.years[val[1]];
      if (this.activeKey == "yearly") {
        start = `${this.years[val[0]]}`;
        end = `${this.years[val[1]]}`;
      }
      if (this.activeKey == "quarterly") {
        start = `${start}-03`;
        end = `${end}-03`;
      }
      if (this.activeKey == "monthly") {
        start = `${start}-01`;
        end = `${end}-01`;
      }
      result = [start, end];
      this.$emit("change", result);
    },
    getProgressFrame() {
      let frame = this.options.list.start.frame.split("_");
      let len = frame[1] - frame[0];
      let years = [];
      for (let i = 0; i <= len; i++) {
        years.push(Number(frame[0]) + i);
      }
      years.sort();
      this.years = years;
      this.frame = [0, this.years.length - 1];
    },
    formatter(value) {
      return `${this.years[value]}`;
    }
  }
};
</script>

<style lang="less" scoped>
.progressBar {
  width: 100%;
}
.ant-slider {
  margin: 0.072917rem 0.052083rem 0.052083rem;
}
.ant-slider /deep/ .ant-slider-track {
  background-color: #476387;
}
.ant-slider /deep/ .ant-slider-handle {
  width: 0.09375rem;
  height: 0.09375rem;
  margin-top: -0.03125rem;
  border: 0.010417rem solid #476387;
}
.ant-slider /deep/ .ant-slider-rail {
  background-color: #cacaca;
}
</style>
