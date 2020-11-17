<template>
  <div class="search-block">
    <input :value="value" placeholder="Keywords" @input="onInput" />
    <div class="iconfont search-icon">&#xe6a6;</div>
  </div>
</template>

<script>
export default {
  props: {
    value: {}
  },
  data() {
    return {};
  },
  methods: {
    // 搜索
    onInput(e) {
      this.$emit("update:value", e.target.value);
    }
  }
};
</script>

<style lang="less" scoped>
.search-block {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 0 0.052083rem;
  box-sizing: border-box;
  background-color: #fff;
  border: 2px solid #ccc;
  border-radius: 0.026042rem;
  input {
    width: 80%;
    border: none;
    outline: none;
  }
}
</style>
