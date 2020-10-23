<template>
  <div class="actions-block">
    <div
      v-for="(item, index) in actionsList"
      :key="index"
      class="action"
      :class="{ active: item.checked }"
      @mouseleave="mouseleave"
      @click.stop="handleClickAction(item, index)"
    >
      <div class="iconfont icon-action">
        {{ handelText(item.toggle, item.checked, item.icon) }}
      </div>
      <div class="text">
        <div>{{ handelText(item.toggle, item.checked, item.ch) }}</div>
        <div>{{ handelText(item.toggle, item.checked, item.en) }}</div>
      </div>
      <fade-in-out>
        <!-- 下载 -->
        <div
          v-if="item.popup && item.name == 'download' && item.checked"
          class="download-block"
        >
          <div
            v-for="(action, i) in item.children"
            :key="i"
            class="download"
            @click.stop="choose(index, i)"
          >
            <div>{{ action.ch }}</div>
            <div>{{ action.en }}</div>
          </div>
        </div>
        <!-- 嵌入 -->
        <div
          v-if="item.popup && item.name == 'embed' && item.checked"
          class="embed-block"
        >
          <div v-for="(action, i) in item.children" :key="i" class="embed">
            <div>{{ action.ch }}</div>
            <div>{{ action.en }}</div>
            <div>{{ action.src }}</div>
          </div>
        </div>
        <!-- 分享 -->
        <div
          v-if="item.popup && item.name == 'share' && item.checked"
          class="share-block"
        >
          <div
            v-for="(action, i) in item.children"
            :key="i"
            class="share"
            @click.stop="choose(index, i)"
          >
            <img :src="require('../assets/img/' + action.img)" alt="" />
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
    actionsList: {}
  },
  components: {
    FadeInOut
  },
  data() {
    return { timer: null };
  },
  methods: {
    handelText(toggle, checked, text) {
      return toggle && checked ? text.split("_")[1] : text.split("_")[0];
    },
    handleClickAction(item, index) {
      this.$emit("handleClickAction", item, index);
    },
    choose(index, i) {
      this.$emit("choose", index, i);
    },
    mouseleave() {
      // clearTimeout(this.timer);
      // setTimeout(() => {
      //   this.$emit("mouseleave");
      // }, 500);
    }
  }
};
</script>

<style lang="less" scoped>
.actions-block {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.action {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 19.25%;
  height: 0.296875rem;
  border-bottom: 2px solid #cbcbcb;
  border-right: 2px solid #cbcbcb;
  color: #999;
  cursor: pointer;
  user-select: none;
  &:first-child {
    color: #1d3f6c !important; // 让第一个常亮
    border-left: 2px solid #cbcbcb;
  }
  &:last-child {
    width: 23%;
  }
  .icon-action {
    font-size: 0.145833rem;
    margin-right: 0.052083rem;
  }
  .text {
    font-size: 0.072917rem;
    line-height: 0.09375rem;
  }
  .download-block {
    position: absolute;
    top: -0.59375rem;
    left: 0;
    z-index: 5;
    box-shadow: darkgrey 0px 0px 10px 1px;
    .download {
      display: flex;
      flex-direction: column;
      justify-content: center;
      width: 0.729167rem;
      height: 0.270833rem;
      padding: 0 0.083333rem;
      line-height: 0.104167rem;
      font-size: 0.072917rem;
      background-color: #f5f5f5;
      border-bottom: 1.5px solid #c9c9c9;
      div {
        &:first-child {
          color: #333;
        }
        &:last-child {
          color: #999;
        }
      }
      &:last-child {
        border-bottom: none;
      }
    }
  }
  .embed-block {
    position: absolute;
    top: -0.8125rem;
    left: 0;
    z-index: 5;
    box-shadow: darkgrey 0px 0px 10px 1px;
    height: 0.770833rem;
    padding: 0.052083rem 0.072917rem;
    line-height: 0.104167rem;
    background-color: #f5f5f5;
    color: #333;
    .embed {
      line-height: 0.114583rem;
      font-size: 0.072917rem;
      div {
        &:last-child {
          height: 0.395833rem;
          padding: 0.052083rem;
          margin-top: 0.03125rem;
          color: #656565;
          user-select: all;
          background-color: #fff;
        }
      }
    }
  }
  .share-block {
    position: absolute;
    top: -0.59375rem;
    left: 0;
    z-index: 5;
    box-shadow: darkgrey 0px 0px 10px 1px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 0.552083rem;
    background-color: #f5f5f5;
    .share {
      padding: 0 0.052083rem;
      img {
        width: 0.166667rem;
        height: 0.166667rem;
      }
    }
  }
}
.active {
  color: #1d3f6c;
}
</style>
