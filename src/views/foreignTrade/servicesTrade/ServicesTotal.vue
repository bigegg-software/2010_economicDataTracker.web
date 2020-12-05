<template>
  <!-- 中国服务贸易进出口总值 -->
  <div :class="$store.state.fullScreen.isFullScreen==false?'fullContainer':'container'">
  
  </div>
</template>

<script>

export default {
  name: "servicesTotal",
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
