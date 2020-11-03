<template>
  <!-- 中国对外直接投资存量按国家和地区统计 -->
  <div class="container">
    <tab-component :tabList="tabList" :tabComponent="tabComponent" @change="changeTabCompnent"></tab-component>
    <share-body :tabComponent="tabComponent" :isShowTable="actionsList[0].checked"></share-body>
    <actions-component
      :actionsList="actionsList"
      @handleClickAction="handleClickAction"
      @choose="choose"
    ></actions-component>
  </div>
</template>

<script>
import TabComponent from "@/components/TabComponent";
import ShareBody from "@/components/ShareBody";
import ActionsComponent from "@/components/ActionsComponent";
export default {
  name: "outstocksByDestination",
  components: {
    TabComponent,
    ShareBody,
    ActionsComponent
  },
  data() {
    return {
      tabComponent: "stocksByContinentChart",
      isShowTable: false,
      tabList: [
        {
          name: "stocksByContinentChart",
          chinese: "按大洲统计",
          english: "By continent"
        },
        {
          name: "stocksByCRIContinentChart",
          chinese: "按各洲内国家/地区统计",
          english: "By country/region within a continent"
        },
        {
          name: "stocksByDestinationChart",
          chinese: "按国家和地区统计",
          english: "China’s FDI stocks by destination"
        },
        {
          name: "stocksTwentyDestinationChart",
          chinese: "历年前20位国家",
          english: "Top 20 destinations of China's FDI stocks"
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
            { name: "", img: "instgram.png" },
            { name: "", img: "wechat.png" },
            { name: "", img: "sina.png" },
            { name: "", img: "email.png" }
          ]
        },
        { name: "enlarge", ch: "全屏_取消全屏", en: "Full screen_Cancel the full screen", icon: "\ue600", checked: false }
      ]
    };
  },
  watch: {
    tabComponent() {
      this.$set(this.actionsList[0], "checked", false);
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
            <iframe src="${window.location.host}/#/${this.tabComponent}" width="600" height="400">
        `;
      }
      if (item.name == "chart") {
        this.isShowTable = !this.isShowTable;
      }
      this.initActionsList();
      this.actionsList[index].checked = !this.actionsList[index].checked;
    },
    choose(index, i, name) {
      console.log(index, i, name, "111");
      if (name == "download" && i == 0) {
        console.log("下载图片");
        console.log(this.tabComponent);
        this.$EventBus.$emit("downLoadImg");
      }
      if (name == "download" && i == 1) {
        console.log("下载表格");
      }
      this.initActionsList();
    }
  }
};
</script>

<style lang="less" scoped>
.container {
  width: 7.223958rem;
}
</style>
