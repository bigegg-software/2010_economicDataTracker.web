<template>
  <!-- 中国对外直接投资流量与存量 -->
  <div class="container">
    <tab-component :tabList="tabList"></tab-component>
    <outbound-body></outbound-body>
    <actions-component
      :actionsList="actionsList"
      @handleClickAction="handleClickAction"
      @choose="choose"
    ></actions-component>
  </div>
</template>

<script>
import TabComponent from "@/components/TabComponent";
import ActionsComponent from "@/components/ActionsComponent";
import OutboundBody from "./components/OutboundBody";
export default {
  name: "FlowsAndStocks",
  components: {
    TabComponent,
    ActionsComponent,
    OutboundBody
  },
  data() {
    return {
      tabList: [
        {
          chinese: "中国对外直接投资流量",
          english: "China's FDI outflows"
        },
        {
          chinese: "中国对外直接投资流量行业",
          english: "XXXXXXXXXXX"
        }
      ],
      actionsList: [
        {
          name: "chart",
          ch: "表格_图表",
          en: "table_chart",
          icon: "\ue61e_\ue63e",
          checked: true,
          toggle: true
        },
        {
          name: "download",
          ch: "下载",
          en: "download",
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
          en: "embed",
          icon: "\ue616",
          checked: false,
          popup: true,
          children: [
            {
              name: "embed",
              icon: "",
              ch: "将这段代码粘贴到一个HTML页面中",
              en: "Paste this into an HTML page",
              src: `<iframe src="https://www.test.net" width="200" height="500">`
            }
          ]
        },
        {
          name: "share",
          ch: "",
          en: "",
          icon: "\ue63c",
          checked: false,
          popup: true,
          children: [
            { name: "", img: "twitter.png" },
            { name: "", img: "facebook.png" },
            { name: "", img: "facebook.png" },
            { name: "", img: "wechat.png" },
            { name: "", img: "sina.png" },
            { name: "", img: "email.png" }
          ]
        },
        { name: "enlarge", ch: "", en: "", icon: "\ue600", checked: false }
      ]
    };
  },
  mounted() {
    document.addEventListener("click", e => {
      this.initActionsList();
    });
  },
  methods: {
    initActionsList() {
      for (let i = 0; i < this.actionsList.length; i++) {
        this.actionsList[i].checked = this.actionsList[i].toggle
          ? this.actionsList[i].checked
          : false;
      }
    },
    handleClickAction(index) {
      this.initActionsList();
      this.actionsList[index].checked = !this.actionsList[index].checked;
    },
    choose(index, i) {
      console.log(index, i);
      this.initActionsList();
    }
  }
};
</script>

<style lang="less" scoped>
.container {
  width: 6.09375rem;
}
</style>
