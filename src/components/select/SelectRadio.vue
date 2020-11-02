<template>
  <div class="select-radio">
    <div class="label-block">
      <div class="label-row">{{ option.ch }}</div>
      <div class="label-row">{{ option.en }}</div>
    </div>
    <div class="select-block" @click="handleClick" @mouseleave="mouseleave">
      <div class="text">
        <div>{{ value.ch }}</div>
        <!-- <div>{{ value.en }}</div> -->
      </div>
      <div class="iconfont icon-arrow">&#xe609;</div>
      <fade-in-out>
        <div v-if="show" class="drop-down" @mouseenter="mouseenter">
          <div
            v-for="(item, index) in option.op"
            :key="index"
            class="drop-down-item"
            :style="getCheckedStyle(item)"
            @click="change(item)"
          >
            <div>{{ item.ch }}</div>
            <div>{{ item.en }}</div>
          </div>
        </div>
      </fade-in-out>
    </div>
  </div>
</template>

<script>
import FadeInOut from "@/components/animations/FadeInOut";

export default {
  props: {
    option: {},
    value: {}
  },
  components: {
    FadeInOut
  },
  data() {
    return {
      show: false,
      timer: null
    };
  },
  methods: {
    getCheckedStyle(item) {
      return item.en == this.value.en ? "color:#0C9AFF;" : "color:#666";
    },
    handleClick() {
      this.show = !this.show;
      this.rotateArrowIcon();
    },
    rotateArrowIcon() {
      let className = "icon-arrow iconfont";
      let dom = document.querySelector(".select-block .icon-arrow");
      dom.className = this.show
        ? className + " rotate "
        : className + " _rotate";
    },
    change(item) {
      this.$emit("change", item);
    },
    mouseenter() {
      clearTimeout(this.timer);
    },
    mouseleave() {
      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        this.show = false;
        this.rotateArrowIcon();
      }, 300);
    }
  }
};
</script>

<style lang="less" scoped>
.select-radio {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  user-select: none;
  .drop-down {
    position: absolute;
    right: 0px;
    top: 0.229167rem;
    width: ceil(170%);
    height: 1.09375rem;
    overflow: auto;
    border-radius: 0.026042rem;
    background-color: #fff;
    box-shadow: darkgrey 0px 0px 5px 1px;
    :hover {
      background-color: #eee;
    }
    .drop-down-item {
      display: flex;
      align-items: center;
      width: 100%;
      padding: 6px 10px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      cursor: pointer;
      & div:first-child {
        margin-right: 0.052083rem;
      }
    }
  }
  .label-block {
    .label-row {
      height: 0.104167rem;
      line-height: 0.104167rem;
    }
  }
  .select-block {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 75%;
    height: 0.197917rem;
    line-height: 0.197917rem;
    padding: 0 0.052083rem;
    border: 2px solid #ccc;
    border-radius: 0.026042rem;
    cursor: pointer;
    background:#fff;
    .text {
      display: flex;
      align-items: center;
      width: 70%;
      height: 100%;
      color: #666;
      font-size: 0.083333rem;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      & div:first-child {
        margin-right: 0.052083rem;
      }
    }
  }
}
// 滚动条样式
.drop-down::-webkit-scrollbar {
  width: 5px;
}
.drop-down::-webkit-scrollbar-track {
  background: rgb(223, 222, 222);
  border-radius: 0.010417rem;
}
.drop-down::-webkit-scrollbar-thumb {
  background: #bfbfbf;
  border-radius: 0.010417rem;
}
.drop-down::-webkit-scrollbar-thumb:hover {
  background: #999;
}
.drop-down::-webkit-scrollbar-corner {
  background: #fff;
}
// 箭头旋转动画
.rotate {
  transform: rotateZ(180deg) !important;
  animation: rotate 0.5s;
}
._rotate {
  transform: rotateZ(0) !important;
  animation: _rotate 0.5s;
}
@keyframes rotate {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(180deg);
  }
}
@keyframes _rotate {
  0% {
    transform: rotate(180deg);
  }
  100% {
    transform: rotate(0deg);
  }
}
</style>
