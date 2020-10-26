<template>
  <!-- 中国对“一带一路”沿线国家投资情况 -->
  <div class="container">
    <tab-component
      :tabList="tabList"
      :tabComponent="tabComponent"
      @change="changeTabCompnent"
    ></tab-component>
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
  name: "outflowsBeltAndRoad",
  components: {
    TabComponent,
    ShareBody,
    ActionsComponent
  },
  data() {
    return {
      tabComponent: "nonFinancialToBRIChart",
      isShowTable: false,
      tabList: [
        {
          name: "nonFinancialToBRIChart",
          chinese: "中国对“一带一路”沿线国家非金融类直接投资情况",
          english: " China’s non-financial FDI outflows to BRI countries"
        },
        {
          name: "newContractAmountToBRIChart",
          chinese: "新签合同额",
          english: "Total value of new contract"
        },
        {
          name: "amountGrowthToBRIChart",
          chinese: "完成营业额",
          english: "Total value of new contract y-o-y growth"
        }
      ],

      actionsList: [
        {
          name: "chart",
          ch: "表格_图表",
          en: "table_chart",
          icon: "\ue61e_\ue63e",
          checked: false,
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
              src: ``
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
            { name: "", img: "instgram.png" },
            { name: "", img: "wechat.png" },
            { name: "", img: "sina.png" },
            { name: "", img: "email.png" }
          ]
        },
        { name: "enlarge", ch: "", en: "", icon: "\ue600", checked: false }
      ]
    };
  },
  watch:{
    tabComponent() {
      this.$set(this.actionsList[0],'checked',false);
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
