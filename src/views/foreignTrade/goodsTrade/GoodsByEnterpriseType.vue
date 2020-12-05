<template>
  <!-- 货物进出口按企业性质统计 -->
  <div :class="$store.state.fullScreen.isFullScreen==false?'fullContainer':'container'">
  
  </div>
</template>

<script>

export default {
  name: "goodsByEnterpriseType",
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
