<template>
  <!-- 中国对外直接投资存量 -->
  <div :class="$store.state.fullScreen.isFullScreen==false?'fullContainer':'container'">
    <tab-component :tabList="tabList" :tabComponent="tabComponent" @change="changeTabCompnent"></tab-component>
    <share-body :describeData="describeList[tabComponent]['dataSources']" :tabComponent="tabComponent" :isShowTable="actionsList[0].checked"></share-body>
    <actions-component
      :actionsList="actionsList"
      @handleClickAction="handleClickAction"
      @choose="choose"
    ></actions-component>
    <Describe :describeData="describeList[tabComponent]"></Describe>
  </div>
</template>

<script>
import describeList from '@/utils/describe.js'
import Describe from "@/components/Describe";
import TabComponent from "@/components/TabComponent";
import ShareBody from "@/components/ShareBody";
import ActionsComponent from "@/components/ActionsComponent";
export default {
  name: "outstocks",
  components: {
    TabComponent,
    ShareBody,
    ActionsComponent,
    Describe
  },
  data() {
    return {
      describeList,
      tabComponent: "outstocksChart",
      isShowTable: false, // 控制每个 tab 里 table 是否显示
      tabList: [
        {
          name: "outstocksChart",
          chinese: "中国对外直接投资存量",
          english: "Outward FDI stocks"
        },
        {
          name: "flowsAndStocksChart",
          chinese: "中国对外直接投资流量与存量",
          english: "China's outward FDI flows vs. stocks"
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
  watch: {
    // tabComponent() {
    //   this.$set(this.actionsList[0], "checked", false);
    // }
    tabComponent:{
      handler() {
        this.$set(this.actionsList[0], "checked", false);
        this.$store.commit('setCurrentTab',this.tabComponent);
      },
      immediate:true
    }
  },
  mounted() {},
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
        item.children[0].src = `
            <iframe src="${window.location.origin}/#/${this.tabComponent}" width="600" height="400">
        `;
      }
      if (item.name == "chart") {
        this.isShowTable = !this.isShowTable;
      }
      if (item.name == "enlarge") {
        this.$store.commit("fullScreen");
      }
      this.initActionsList();
      this.actionsList[index].checked = !this.actionsList[index].checked;
    },
    choose(index, i, name) {
      if (name == "download" && i == 0) {
        
        this.$EventBus.$emit("downLoadImg");
      }
      if (name == "download" && i == 1) {
        this.$store.commit('downloadExcel');
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
