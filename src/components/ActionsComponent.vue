<template>
  <div class="actions-block" id="actions-block">
    <template v-for="(item, index) in actionsList">
      <div
        v-if="!item.hide && ((item.name!='download'&&item.name!='embed')||((item.name=='download'||item.name=='embed')&&$store.getters.userInfo.sessionToken))"
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
            <template v-for="(action, i) in item.children">
              <div
                v-if="actionsList[0].checked!=true || action.name!='image'&&actionsList[0].checked==true"
                :key="i"
                class="download"
                @click.stop="choose(index, i,item.name)"
              >
                <div>{{ action.en }}</div>
                <div>{{ action.ch }}</div>
              </div>
            </template>
          </div>
          <!-- 嵌入 -->
          <div v-if="item.popup && item.name == 'embed' && item.checked" class="embed-block">
            <div v-for="(action, i) in item.children" :key="i" class="embed">
              <div>{{ action.en }}</div>
              <div>{{ action.ch }}</div>
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
    </template>
    <a-modal v-model="visible" title="请使用微信扫描下方二维码" footer>
      <div id="qrcodeMark"></div>
    </a-modal>
  </div>
</template>

<script>
import QRCode from "qrcodejs2";
import FadeInOut from "@/components/animations/FadeInOut";
import chartDataFun from "@/utils/chartDataFun";

export default {
  props: {
    actionsList: {}
  },
  components: {
    FadeInOut
  },
  data() {
    return {
      visible: false,
      timer: null,
      sty: { width: "2rem" },
      urlTitle: ""
    };
  },

  async created() {
    let arr = await chartDataFun.getAllMenuItem();
    this.urlTitle = arr.filter(item => {
      return item.name == this.$route.name;
    });
    console.log(this.urlTitle);
    console.log(this.urlTitle[0].en + this.urlTitle[0].ch);
  },

  mounted() {
    document.addEventListener("click", () => {
      if (document.getElementById("qrcode")) {
        document.getElementById("qrcode").remove();
      }
      this.actionsList.forEach(item => {
        if (item.name != "chart" && item.name != "enlarge") {
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
      if (name == "share" && i == 2) {
        this.sharetoWeChat();
      }
      if (name == "share" && i == 3) {
        this.sharetoSina();
      }
      if (name == "share" && i == 4) {
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
        // twitter.com/share?url=' + encodeURIComponent(url) + '&text=' + encodeURIComponent(title), '',
        "http://twitter.com/share?url=" +
          encodeURIComponent(window.location.href) +
          "&text=" +
          encodeURIComponent(this.urlTitle[0].en + this.urlTitle[0].ch),
        "",)

    },
    //分享到 facebook
    sharetoFacebook() {
      window.open(
        "http://www.facebook.com/sharer/sharer.php?u=" +
          encodeURIComponent(window.location.href) +
          "&t=" +
          encodeURIComponent(this.urlTitle[0].en + this.urlTitle[0].ch),
        "sharer",
        "toolbar=0,status=0,width=626,height=436"
      );
    },
    // 分享到微信
    sharetoWeChat() {
      this.visible = true;
      setTimeout(() => {
        let container = document.getElementById("qrcodeMark");
        container.innerHTML = "";
        let qrcode = new QRCode("qrcodeMark", {
          width: 160,
          height: 160,
          text: encodeURIComponent(window.location.href) // 设置二维码内容或跳转地址
        });
      }, 0);
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
/deep/ .ant-modal-content {
  margin: auto;
  width: 1.8rem;
}
/deep/ .ant-modal-body {
  width: 1.8rem;
  height: 1.8rem;
  display: flex;
  flex-flow: row nowrap;
  justify-content: center;
  align-items: center;
}
/deep/ .ant-modal-title {
  font-size: 0.09375rem;
}
/deep/ .ant-modal-close {
  font-size: 0.083333rem;
}
.actions-block {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: flex-end;
}
.action {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20.24%;
  height: 0.296875rem;
  border-bottom: 2px solid #cbcbcb;
  border-right: 2px solid #cbcbcb;
  color: #999;
  cursor: pointer;
  user-select: none;
  &:first-child {
    // color: #186497 !important; // 让第一个常亮
    border-left: 2px solid #cbcbcb;
  }
  &:last-child {
    width: 19.05%;
  }
  .icon-action {
    font-size: 0.145833rem;
    margin-right: 0.052083rem;
  }
  .text {
    font-size: 0.104167rem;
    line-height: 0.09375rem;
    & :last-child {
      font-size: 0.072917rem;
    }
  }
  .download-block {
    position: absolute;
    bottom: 0.325rem;
    left: 0;
    z-index: 5;
    width: 100%;
    box-shadow: darkgrey 0px 0px 10px 1px;
    .download {
      display: flex;
      flex-direction: column;
      justify-content: center;
      // width: 0.604167rem;
      height: 0.276042rem;
      padding: 0 0.083333rem;
      line-height: 0.104167rem;
      background-color: #f5f5f5;
      border-bottom: 1.5px solid #c9c9c9;
      div {
        &:first-child {
          color: #666;
          font-size: 0.083333rem;
        }
        &:last-child {
          color: #666;
          font-size: 0.072917rem;
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
    color: #666;
    .embed {
      line-height: 0.114583rem;
      font-size: 0.072917rem;
      div {
        &:first-child {
          font-size: 0.09375rem;
          font-family: "Calibri";
        }
        &:last-child {
          height: 0.395833rem;
          padding: 0.052083rem;
          margin-top: 0.03125rem;
          user-select: all;
          font-size: 0.0625rem;
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
// .ant-modal-content{
//   width: 2rem !important;
// }
</style>
