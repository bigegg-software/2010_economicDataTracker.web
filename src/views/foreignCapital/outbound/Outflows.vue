<template>
  <!-- 中国对外直接投资流量 -->
  <div :class="$store.state.fullScreen.isFullScreen==false?'fullContainer':'container'">
    <tab-component :tabList="tabList" :tabComponent="tabComponent" @change="changeTabCompnent"></tab-component>
    <share-body
      :describeData="describeList[tabComponent]['dataSources']"
      :tabComponent="tabComponent"
      :isShowTable="actionsList[0].checked"
    ></share-body>
    <actions-component
      :actionsList="actionsList"
      @handleClickAction="handleClickAction"
      @choose="choose"
    ></actions-component>
    <Describe :describeData="describeList[tabComponent]"></Describe>
  </div>
</template>

<script>
import describeList from "@/utils/describe.js";
import Describe from "@/components/Describe";
import TabComponent from "@/components/TabComponent";
import ShareBody from "@/components/ShareBody";
import ActionsComponent from "@/components/ActionsComponent";
// import { getImageDataUrl } from "@/utils/html2Canvas.js";
export default {
  name: "outflows",
  components: {
    TabComponent,
    ShareBody,
    ActionsComponent,
    Describe
  },
  data() {
    return {
      describeList,
      tabComponent: "outflowsChart",
      tabList: [
        {
          name: "outflowsChart",
          chinese: "中国对外直接投资流量",
          english: "China's FDI outflows"
        }
      ],

      actionsList: [
        {
          name: "chart",
          ch: "表格_图表",
          en: "Table_Chart",
          icon: "\ue61e_\ue63e",
          checked: false,
          toggle: true
        },
        {
          name: "download",
          ch: "下载",
          en: "Download",
          icon: "\ue635",
          checked: false,
          popup: true,
          children: [
            { name: "image", icon: "", ch: "图片", en: "Image(JPEG)" },
            { name: "data", icon: "", ch: "数据", en: "Data(xlsx)" }
          ]
        },
        {
          name: "embed",
          ch: "嵌入",
          en: "Embed",
          icon: "\ue616",
          checked: false,
          popup: true,
          children: [
            {
              name: "embed",
              icon: "",
              ch: "将这段代码粘贴到一个HTML页面中",
              en: "Paste this into an HTML page",
              src: ``
            }
          ]
        },
        {
          name: "share",
          ch: "分享",
          en: "Share",
          icon: "\ue63c",
          checked: false,
          popup: true,
          children: [
            { name: "", img: "twitter.png" },
            { name: "", img: "facebook.png" },
            { name: "", img: "wechat.png" },
            { name: "", img: "sina.png" },
            { name: "", img: "email.png" }
          ]
        },
        {
          name: "enlarge",
          ch: "全屏_取消全屏",
          en: "Full screen_Cancel the full screen",
          icon: "\ue600_\ue605",
          checked: false,
          toggle: true
        }
      ]
    };
  },
  mounted() {},
  watch:{
    tabComponent:{
      handler() {
        this.$store.commit('setCurrentTab',this.tabComponent);
      },
      immediate:true
    }
  },
  methods: {
    changeTabCompnent(name) {
      this.tabComponent = name;
    },

    initActionsList() {
      for (let i = 0; i < this.actionsList.length; i++) {
        this.actionsList[i].checked = this.actionsList[i].toggle
          ? this.actionsList[i].checked
          : false;
      }
    },
    handleClickAction(item, index) {
      if (item.name == "embed") {
        //设置嵌入链接
        item.children[0].src = `<iframe src="${window.location.origin}/#/${this.tabComponent}" width="100%" height="100%">`;
      }
      if (item.name == "chart") {
        this.$store.commit("setShowOperate", this.actionsList[0].checked);
      }
      if (item.name == "enlarge") {
        this.$store.commit("fullScreen");
      }
      this.initActionsList();
      this.actionsList[index].checked = !this.actionsList[index].checked;
    },
    // async choose(index, i) {
    //   console.log(index, i, "-");
    //   this.initActionsList();
    //   if ((index = 1 && i == 0)) {
    //     let base64Url = await getImageDataUrl(".echart-block");
    //     // console.log(base64Url, "base64Url");
    //     var a = document.createElement("a"); // 创建一个a节点插入的document
    //     var event = new MouseEvent("click"); // 模拟鼠标click点击事件
    //     a.download = "beautifulGirl"; // 设置a节点的download属性值
    //     a.href = base64Url; // 将图片的src赋值给a节点的href
    //     a.dispatchEvent(event); // 触发鼠标点击事件
    //   }
    //   if ((index = 1 && i == 1)) {
    //     console.log("下载表格");
    //   }
    // }
    choose(index, i, name) {
      if (name == "download" && i == 0) {
        console.log("下载图片");
        this.$EventBus.$emit("downLoadImg");
      }
      if (name == "download" && i == 1) {
        // console.log("下载表格");
        this.$store.commit("downloadExcel");
      }
      this.initActionsList();
    }
  }
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
