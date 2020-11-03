<template>
  <div class="actions-block" id="actions-block">
    <div
      v-for="(item, index) in actionsList"
      :key="index"
      class="action"
      :class="{ active: item.checked }"
      @mouseleave="mouseleave"
      @click.stop="handleClickAction(item, index)"
    >
      <div class="iconfont icon-action">{{ handelText(item.toggle, item.checked, item.icon) }}</div>
      <div class="text">
        <div>{{ handelText(item.toggle, item.checked, item.en) }}</div>
        <div>{{ handelText(item.toggle, item.checked, item.ch) }}</div>
      </div>
      <fade-in-out>
        <!-- 下载 -->
        <div v-if="item.popup && item.name == 'download' && item.checked" class="download-block">
          <div
            v-for="(action, i) in item.children"
            :key="i"
            class="download"
            @click.stop="choose(index, i,item.name)"
          >
            <div>{{ action.ch }}</div>
            <div>{{ action.en }}</div>
          </div>
        </div>
        <!-- 嵌入 -->
        <div v-if="item.popup && item.name == 'embed' && item.checked" class="embed-block">
          <div v-for="(action, i) in item.children" :key="i" class="embed">
            <div>{{ action.ch }}</div>
            <div>{{ action.en }}</div>
            <div>{{ action.src }}</div>
          </div>
        </div>
        <!-- 分享 -->
        <div v-if="item.popup && item.name == 'share' && item.checked" class="share-block">
          <div
            v-for="(action, i) in item.children"
            :key="i"
            class="share"
            @click.stop="choose(index, i,item.name)"
          >
            <img :src="require('../assets/img/' + action.img)" alt />
          </div>
        </div>
      </fade-in-out>
    </div>
  </div>
</template>

<script>
import QRCode from "qrcodejs2";
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
  mounted() {
    document.addEventListener("click", () => {
      if (document.getElementById("qrcode")) {
        document.getElementById("qrcode").remove();
      }
      this.actionsList.forEach(item => {
        if (item.name != "chart") {
          item.checked = false;
        }
      });
    });
  },

  methods: {
    handelText(toggle, checked, text) {
      return toggle && checked ? text.split("_")[1] : text.split("_")[0];
    },
    handleClickAction(item, index) {
      if (document.getElementById("qrcode")) {
        document.getElementById("qrcode").remove();
      }
      this.$emit("handleClickAction", item, index);
    },

    choose(index, i, name) {
      this.$emit("choose", index, i, name);
      if (name == "share" && i == 0) {
        this.sharetoTwitter();
      }
      if (name == "share" && i == 1) {
        this.sharetoFacebook();
      }
      if (name == "share" && i == 3) {
        this.sharetoWeChat();
      }
      if (name == "share" && i == 4) {
        this.sharetoSina();
      }
      if (name == "share" && i == 5) {
        this.sharetoEmail();
      }
    },
    mouseleave() {
      // clearTimeout(this.timer);
      // setTimeout(() => {
      //   this.$emit("mouseleave");
      // }, 500);
    },
    //分享到 Twitter
    sharetoTwitter() {
      window.open(
        //twitter.com/share?url=' + encodeURIComponent(url) + '&text=' + encodeURIComponent(title), '',
        "http://twitter.com/share?url=" +
          encodeURIComponent(window.location.href)
      );
    },
    //分享到 facebook
    sharetoFacebook() {
      window.open(
        "http://www.facebook.com/sharer/sharer.php?u=" +
          encodeURIComponent(window.location.href)
      );
    },
    // 分享到微信
    sharetoWeChat() {
      let qrcodeDiv = document.createElement("div");
      qrcodeDiv.id = "qrcode";
      qrcodeDiv.style.position = "absolute";
      qrcodeDiv.style.bottom = "0.36rem";
      qrcodeDiv.style.left = "4.68rem";
      qrcodeDiv.style.zIndex = "4";
      qrcodeDiv.style.boxShadow = "darkgrey 0px 0px 10px 1px";
      let container = document.getElementById("actions-block");
      container.insertBefore(qrcodeDiv, container.firstChild);
      let qrcode = new QRCode("qrcode", {
        width: 100,
        height: 100,
        text: encodeURIComponent(window.location.href) // 设置二维码内容或跳转地址
      });
    },
    //点击此元素之外的地方  隐藏
    HideOther(thisDiv) {
      document.body.addEventListener("click", e => {
        if (!this.$el.contains(e.target)) {
          thisDiv.style.display = "none";
        }
      });
    },
    sharetoSina() {
      window.open(
        "http://service.weibo.com/share/share.php?url=" +
          encodeURIComponent(window.location.href)
      );
    },
    //分享到邮箱
    sharetoEmail() {
      window.open(
        "mailto:?cc=&bcc=&subject=&body=" +
          encodeURIComponent(window.location.href)
      );
    }
  }
};
</script>

<style lang="less" scoped>
.actions-block {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.action {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20.5%;
  height: 0.296875rem;
  border-bottom: 2px solid #cbcbcb;
  border-right: 2px solid #cbcbcb;
  color: #999;
  cursor: pointer;
  user-select: none;
  &:first-child {
    color: #186497 !important; // 让第一个常亮
    border-left: 2px solid #cbcbcb;
  }
  &:last-child {
    width: 18.8%;
  }
  .icon-action {
    font-size: 0.145833rem;
    margin-right: 0.052083rem;
  }
  .text {
    font-size: 0.104167rem;
    line-height: 0.09375rem;
    & :last-child{
      font-size: 0.072917rem;
    }
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
    display: none;
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
  color: #186497;
}
</style>
