<template>
  <transition name="fade">
    <slot></slot>
  </transition>
</template>

<script>
export default {
  data() {
    return {};
  },
  methods: {}
};
</script>

<style lang="less" scoped>
.fade-enter-active {
  animation: fadeInOut 0.5s;
}
.fade-leave-active {
  animation: fadeInOut 0.3s reverse;
}
@keyframes fadeInOut {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
</style>
