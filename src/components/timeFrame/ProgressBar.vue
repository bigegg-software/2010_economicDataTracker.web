<template>
  <div class="progessBar">
    <a-slider
      v-if="frame.length"
      :value="frame"
      range
      :min="min"
      :max="max"
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
      frame: [],
      mim: 0,
      max: 100
    };
  },
  watch: {
    activeKey: {
      handler() {
        this.initProgress();
      },
      deep: true
    }
  },
  mounted() {
    this.initProgress();
  },
  methods: {
    initProgress() {
      this.min = Number(this.options.list.start.frame.split("_")[0]);
      this.max = Number(this.options.list.start.frame.split("_")[1]);
      this.frame = [this.min, this.max];
    },
    change(val) {
      this.frame = val;
      let result;
      let start = val[0];
      let end = val[1];
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
    formatter(value) {
      return `${value}`;
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
