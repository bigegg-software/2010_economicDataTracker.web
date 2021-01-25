<template>
  <div class="progessBar">
    <a-slider
      v-if="options"
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
      min: 0,
      max: 0
    };
  },
  watch: {
    activeKey: {
      handler() {
        console.log(this.options)
        this.initProgress();
      },
      deep: true
    },
    "options.list.start.value": {
      handler(a, b) {
        let time = Number(`${a}`.split("-")[0]);
        if (time) {
          this.$set(this.frame, 0, time);
        }
      },
      deep: true
    },
    "options.list.end.value": {
      handler(a, b) {
        let time = Number(`${a}`.split("-")[0]);
        if (time) {
          this.$set(this.frame, 1, time);
        }
      },
      deep: true
    },
    "options.list": {
      handler(a, b) {
        if (a.start.frame != "" && a.start.value != "") {
          this.initProgress();
        }
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
      let start = Number(`${this.options.list.start.value}`.split("-")[0]);
      let end = Number(`${this.options.list.end.value}`.split("-")[0]);
      // this.frame = [this.min, this.max];
      this.frame = [start, end];
    },
    change(val) {
      let vuexMaxMinDate=this.$store.getters.DBMinMaxDateQM;
      this.frame = val;
      let result;
      let start = `${val[0]}`;
      let end = `${val[1]}`;
      if (this.activeKey == "quarterly") {
        if(start==vuexMaxMinDate.min){
          start = `${start}-${vuexMaxMinDate.minQM}`;
        }else if(start==vuexMaxMinDate.max){
          start = `${start}-${vuexMaxMinDate.maxQM}`;
        }else{
          start = `${start}-${this.options.list.start.value.split('-')[1]}`;
        }
        if(end==vuexMaxMinDate.max){
          end = `${end}-${vuexMaxMinDate.maxQM}`;
        }else if(end==vuexMaxMinDate.min){
          end = `${end}-${vuexMaxMinDate.minQM}`;
        }else{
          end = `${end}-${this.options.list.end.value.split('-')[1]}`;
        }
        // start = `${start}-${this.options.list.start.value.split('-')[1]}`;
        // end = `${end}-${this.options.list.end.value.split('-')[1]}`;
      }
      if (this.activeKey == "monthly") {
        if(start==vuexMaxMinDate.min){
          start = `${start}-${vuexMaxMinDate.minM}`;
        }else if(start==vuexMaxMinDate.max){
          start = `${start}-${vuexMaxMinDate.maxM}`;
        }else{
          start = `${start}-${this.options.list.start.value.split('-')[1]}`;
        }
        if(end==vuexMaxMinDate.max){
          end = `${end}-${vuexMaxMinDate.maxM}`;
        }else if(end==vuexMaxMinDate.min){
          end = `${end}-${vuexMaxMinDate.minM}`;
        }else{
          end = `${end}-${this.options.list.end.value.split('-')[1]}`;
        }
        // start = `${start}-${this.options.list.start.value.split('-')[1]}`;
        // end = `${end}-${this.options.list.end.value.split('-')[1]}`;
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
  background-color: rgba(145, 173, 195);
}
.ant-slider /deep/ .ant-slider-handle {
  width: 0.09375rem;
  height: 0.09375rem;
  margin-top: -0.03125rem;
  border: 0.010417rem solid rgba(145, 173, 195, 0.5);
}
.ant-slider /deep/ .ant-slider-rail {
  background-color: #cacaca;
}
</style>
