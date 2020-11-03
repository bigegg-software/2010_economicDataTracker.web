<template>
  <div class="checkbox">
    <div class="icon-block" @click="change">
      <div v-if="option.checked" class="iconfont icon-mark">&#xe7b0;</div>
      <div v-else class="icon-square"></div>
    </div>
    <div class="label-block">
      <div class="label-row">{{ option.en }}</div>
      <div class="label-row">{{ option.ch }}</div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    option: {}
  },
  data() {
    return {};
  },
  methods: {
    change() {
      this.$emit("change");
    }
  }
};
</script>

<style lang="less" scoped>
.checkbox {
  display: flex;
  align-items: center;
  width: 100%;
  padding: 0.0625rem 0;
}
.icon-block {
  width: 0.104167rem;
  height: 0.104167rem;
  line-height: 0.104167rem;
  text-align: center;
  color: #fff;
  margin-right: 0.145833rem;
  cursor: pointer;
  .icon-mark {
    width: 100%;
    height: 100%;
    font-size: 0.083333rem;
    border-radius: 0.010417rem;
    background-color: #1d3f6c;
  }
  .icon-square {
    width: 100%;
    height: 100%;
    border: 2px solid #bbbbbb;
    border-radius: 0.010417rem;
  }
}
.label-block {
  color: #666;
  font-size: 0.09375rem;
  .label-row {
    height: 0.104167rem;
    line-height: 0.104167rem;
      &:last-child{
      font-size:  0.072917rem;
      }
  }
  
}
</style>
