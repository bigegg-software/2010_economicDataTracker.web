<template>
  <!-- 货物进出口总值按国别/地区统计 -->
  <div :class="$store.state.fullScreen.isFullScreen==false?'fullContainer':'container'">
  
  </div>
</template>

<script>

export default {
  name: "goodsByOrigin",
  components: {
   
  },
  data() {
    return {
    }
  },
  watch: {
   
  },
  mounted() {},
  methods: {}
};
</script>

<style lang="less" scoped>
.container {
  width: 7.28125rem;
}
.FullContainer {
  width: 9.166667rem;
}
</style>
