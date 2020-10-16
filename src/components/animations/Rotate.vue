<template>
  <transition name="rotate">
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
.rotate-enter-active {
  animation: rotate 0.5s;
}
.rotate-leave-active {
  animation: rotate 0.3s reverse;
}
@keyframes rotateTriangle {
  0% {
    transform: rotate(-90deg);
  }
  100% {
    transform: rotate(0deg);
  }
}
</style>
