<template>
  <div class="select-radio">
    <div class="label-block">
      <div class="label-row">{{ option.en }}</div>
      <div class="label-row">{{ option.ch }}</div>
    </div>
    <div
      class="select-block"
      @click="handleClick"
      @mouseleave="mouseleave"
      :style="{ width: this.option.en == 'Type' ? '75%' : '64%' }"
    >
      <div class="text">
        <!-- <div>{{ value.ch }}</div> -->
        {{ value.en }}
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
            <div>{{ item.en }}</div>
            <div>{{ item.ch }}</div>
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
    z-index: 9;
    position: absolute;
    right: 0px;
    top: 0.229167rem;
    // width: ceil(170%);//显示不全
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
      flex-flow: column nowrap;
      // align-items: center;
      width: 100%;
      padding: 0.01rem 0.052083rem;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      font-size: 0.09375rem;
      line-height: 0.12rem;
      cursor: pointer;
      & div:first-child {
        margin-right: 0.052083rem;
      }
      & div:last-child {
        // font-family: " SimHei ";
        font-size: 0.072917rem;
        // margin-top: -0.06rem;
      }
    }
  }
  .label-block {
    letter-spacing: -0.003rem;
    line-height: 0.104167rem;
    font-size: 0.072917rem;
    color: #666;
    & div:first-child {
      font-size: 0.09375rem;
      font-family: Calibri;
    }
  }
  .select-block {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: space-between;
    // width: 75%;//行内
    height: 0.197917rem;
    line-height: 0.197917rem;
    margin-left: 0.02rem;
    padding: 0 0.052083rem;
    border: 1px solid #cacaca;
    border-radius: 0.026042rem;
    cursor: pointer;
    background: #fff;
    .text {
      width: 0.5rem;
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
