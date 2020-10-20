<template>
  <div class="checkbox">
    <div class="icon-block" @click="change">
      <div v-if="option.checked" class="iconfont icon-mark">
        &#xe7b0;
      </div>
      <div v-else class="icon-square"></div>
    </div>
    <div class="label-block" :class="{ active: option.checked }">
      <div class="label-row">{{ option.ch }}</div>
      <div class="label-row">{{ option.en }}</div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    option: {},
    index: {}
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
  justify-content: space-between;
  width: 100%;
  padding: 0.0625rem 0;
}
.icon-block {
  width: 0.114583rem;
  height: 0.114583rem;
  line-height: 0.114583rem;
  text-align: center;
  color: #fff;
  cursor: pointer;
  user-select: none;
  .icon-mark {
    width: 100%;
    height: 100%;
    font-size: 0.083333rem;
    border-radius: 0.010417rem;
    background-color: rgba(29, 63, 108, 0.8);
  }
  .icon-square {
    width: 100%;
    height: 100%;
    border: 2px solid #bbbbbb;
    border-radius: 0.010417rem;
  }
}
.label-block {
  color: rgb(187, 184, 184);
  width: 70%;
  .label-row {
    width: 100%;
    height: 24px;
    line-height: 24px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
.active {
  color: rgba(29, 63, 108, 0.8);
}
</style>
