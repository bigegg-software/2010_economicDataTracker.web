<template>
  <!-- 外商投资企业进出口总值 -->
  <div :class="$store.state.fullScreen.isFullScreen==false?'fullContainer':'container'">
  
  </div>
</template>

<script>

export default {
  name: "foreignInvestedEnterprises",
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
