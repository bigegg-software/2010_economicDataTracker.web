<template>
  <div class="selectRadioBySearch">
    <div class="label-block">
      <div class="label-row">{{ option.en }}</div>
      <div class="label-row">{{ option.ch }}</div>
    </div>
    <div class="select-block" @click="handleClick">
      <div class="text">{{ result.en }} {{ result.ch }}</div>
      <div class="iconfont icon-arrow">&#xe609;</div>
      <!-- 弹出框 -->
      <fade-in-out>
        <div v-if="show" class="drop-down">
          <div class="action-block">
            <search-component :value.sync="inputValue"></search-component>
            <div class="iconfont close-icon" @click.stop="close">
              &#xe608;
            </div>
          </div>
          <div class="list-block">
            <div
              v-for="(item, index) in option.op"
              :key="index"
              class="list-item"
              :style="getCheckedStyle(item)"
              @click.stop="onChange(item)"
            >
              <div>{{ item.en }}</div>
              <div>{{ item.ch }}</div>
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
export default {
  props: {
    option: {
      default: () => {}
    },
    result: {
      default: () => {}
    }
  },
  components: {
    FadeInOut,
    SearchComponent
  },
  data() {
    return {
      show: false,
      timer: null,
      inputValue: ""
    };
  },
  watch: {
    inputValue: {
      handler(a, b) {
        this.$emit("changeInputValue", a);
      }
    }
  },
  methods: {
    // 显示弹出框
    handleClick() {
      this.show = true;
      this.rotateArrowIcon();
    },
    close() {
      this.show = false;
      this.rotateArrowIcon();
    },
    rotateArrowIcon() {
      let className = "icon-arrow iconfont";
      let dom = document.querySelector(".select-block .icon-arrow");
      dom.className = this.show
        ? className + " rotate "
        : className + " _rotate";
    },
    onChange(item) {
      this.$emit("changeRadio", item);
      this.show = false;
      this.rotateArrowIcon();
    },
    getCheckedStyle(item) {
      return item.en == this.result.en ? "color:#0C9AFF;" : "color:#666";
    }
  }
};
</script>

<style lang="less" scoped>
.drop-down {
  .action-block {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 18%;
    padding: 0 0.052083rem;
    border-bottom: 1px solid #d8d8d8;
    /deep/ .search-block {
      height: 60%;
      margin: 0 0.05rem;
    }
    .close-icon {
      color: #999;
      font-size: 0.083333rem;
      padding: 0 0.05rem;
    }
  }
  .list-block {
    width: 100%;
    height: 82%;
    padding: 0.07rem 0.07rem;
    overflow: auto;
    cursor: default;
    font-size: .083333rem;
    /deep/ .ant-radio-wrapper {
      display: flex;
      align-items: center;
      padding: 0.02rem 0;
    }
    .list-item {
      cursor: pointer;
        margin-bottom: 0.04rem;
      div{
        line-height: .12rem;
      }
    }
  }
}
.selectRadioBySearch {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  user-select: none;
  .drop-down {
    position: absolute;
    right: 0;
    top: 0.229167rem;
    z-index: 10;
    width: 165%;
    height: 2.083333rem;
    overflow: auto;
    border-radius: 0.026042rem;
    background-color: #fff;
    box-shadow: darkgrey 0px 0px 5px 1px;
  }
  .label-block {
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
    width: 0.75rem;
    height: 0.197917rem;
    line-height: 0.15625rem;
    padding: 0 0.052083rem;
    border: 1px solid #ccc;
    border-radius: 0.026042rem;
    cursor: pointer;
    .text {
      width: 80%;
      color: #0c9aff;
      font-size: 0.083333rem;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
}
// 滚动条样式
.left .list-block::-webkit-scrollbar,
.right .list-block::-webkit-scrollbar {
  width: 0.026042rem;
}
.left .list-block::-webkit-scrollbar-track,
.right .list-block::-webkit-scrollbar-track {
  background: #fff;
}
.left .list-block::-webkit-scrollbar-thumb,
.right .list-block::-webkit-scrollbar-thumb {
  background: #bfbfbf;
  border-radius: 0.010417rem;
}
.left .list-block::-webkit-scrollbar-thumb:hover,
.right .list-block::-webkit-scrollbar-thumb:hover {
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
