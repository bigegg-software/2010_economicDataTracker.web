<template>
  <div class="select-radio">
    <div class="label-block">
      <div class="label-row">{{ option.ch }}</div>
      <div class="label-row">{{ option.en }}</div>
    </div>
    <div class="select-block" @click="handleClick" @mouseleave="mouseleave">
      <div class="text">
        {{ `(${result.length})` }}
      </div>
      <div class="iconfont icon-arrow">&#xe609;</div>
      <fade-in-out>
        <div v-if="show" class="drop-down" @mouseenter="mouseenter">
          <div class="left">
            <div class="action-block">
              <search-component :value.sync="inputValue"></search-component>
            </div>
            <div class="list-block">
              <check-box
                v-for="(op, index) in option.op"
                :key="index"
                :option="op"
                @change="change(op, index)"
              ></check-box>
            </div>
          </div>
          <div class="right">
            <div class="action-block">
              <div class="iconfont close-icon">&#xe608;</div>
            </div>
          </div>
        </div>
      </fade-in-out>
    </div>
  </div>
</template>

<script>
import FadeInOut from "@/components/animations/FadeInOut";
import SearchComponent from "@/components/select/selectCheckBox/Search";
import CheckBox from "@/components/select/selectCheckBox/CheckBox";

export default {
  props: {
    option: {},
    result: {}
  },
  components: {
    FadeInOut,
    SearchComponent,
    CheckBox
  },
  data() {
    return {
      show: true,
      timer: null,
      inputValue: ""
    };
  },
  watch: {
    inputValue: {
      handler(a, b) {
        console.log(a, "inputValue 变化啦");
      }
    }
  },
  methods: {
    // 显示弹出框
    handleClick() {
      this.show = true;
      this.rotateArrowIcon();
    },
    rotateArrowIcon() {
      let className = "icon-arrow iconfont";
      let dom = document.querySelector(".select-block .icon-arrow");
      dom.className = this.show
        ? className + " rotate "
        : className + " _rotate";
    },
    change(op, index) {
      this.$emit("change", op);
    },
    mouseenter() {
      //   clearTimeout(this.timer);
    },
    mouseleave() {
      //   clearTimeout(this.timer);
      //   this.timer = setTimeout(() => {
      //     this.show = false;
      //     this.rotateArrowIcon();
      //   }, 300);
    }
  }
};
</script>

<style lang="less" scoped>
.drop-down .left {
  flex: 0.65;
  height: 100%;
  border-right: 2px solid #ccc;
  .action-block {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 18%;
    padding: 0 0.052083rem;
  }
  .list-block {
    width: 100%;
    height: 82%;
    padding: 0 0.078125rem;
    overflow: auto;
    cursor: default;
  }
}
.drop-down .right {
  flex: 0.35;
  height: 100%;
  .action-block {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    width: 100%;
    height: 18%;
    padding: 0 0.1rem;
    box-sizing: border-box;
    .close-icon {
      color: #999;
      font-size: 0.083333rem;
    }
  }
}

.select-radio {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  user-select: none;
  .drop-down {
    display: flex;
    align-items: center;
    position: absolute;
    left: 0;
    top: 0.229167rem;
    width: ceil(200%);
    height: 2.083333rem;
    overflow: auto;
    border-radius: 0.026042rem;
    background-color: #fff;
    box-shadow: darkgrey 0px 0px 5px 1px;
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
    width: 60%;
    height: 0.197917rem;
    line-height: 0.15625rem;
    padding: 0 0.052083rem;
    border: 2px solid #ccc;
    border-radius: 0.026042rem;
    cursor: pointer;
    .text {
      width: 70%;
      height: 100%;
      color: #0c9aff;
      font-size: 0.083333rem;
    }
  }
}
// 滚动条样式
.list-block::-webkit-scrollbar {
  width: 0.026042rem;
}
.list-block::-webkit-scrollbar-track {
  background: #fff;
}
.list-block::-webkit-scrollbar-thumb {
  background: #bfbfbf;
  border-radius: 0.010417rem;
}
.list-block::-webkit-scrollbar-thumb:hover {
  background: #999;
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
