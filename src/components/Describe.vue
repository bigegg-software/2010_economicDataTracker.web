<template>
  <div class="container">
    <div class="concept">
      <!-- 小标题 -->
      <div class="subhead">
        <div class="en">Definition</div>
        <div class="ch">概念</div>
      </div>
      <!-- 内容 -->
      <div class="conceptDetail">
        <div class="enTitle">{{describeData.concept.enTitle}}</div>
        <div class="enText">{{describeData.concept.enText}}</div>
        <div class="enText">{{describeData.concept.enTextEnd}}</div>
        <div class="enItalic">{{describeData.concept.enItalic}}</div>
        <div class="chTitle">{{describeData.concept.chTitle}}</div>
        <div class="chText">{{describeData.concept.chText}}</div>
        <div class="chText">{{describeData.concept.chTextEnd}}</div>
        <div class="chItalic">
          <a :href="describeData.concept.conceptLink">{{describeData.concept.chItalic}}</a>
        </div>
      </div>
    </div>
    <div class="rightContainer">
      <div class="dataSources">
        <div class="subhead">
          <div class="en">Source</div>
          <div class="ch">数据来源</div>
        </div>
        <div class="sourceContent">
          <a href="http://">{{describeData.dataSources}}</a>
        </div>
      </div>
      <div class="dataSources">
        <div class="subhead">
          <div class="en">Note</div>
          <div class="ch">备注</div>
        </div>
        <div class="noteContent">{{describeData.noteContent}}</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    describeData: {}
  },
  data() {
    return {};
  },
  mounted() {
    console.log(this.describeData);
  }
};
</script>

<style lang="less" scoped>
.container {
  display: flex;
  justify-content: space-between;
  margin-top: 0.14rem;
}
.subhead {
  display: flex;
  flex-flow: column nowrap;
  position: relative;
  font-size: 0.166667rem;
  line-height: 0.14rem;
  color: #186497;
  .ch {
    font-size: 0.09375rem;
  }
  &::before {
    content: "";
    position: absolute;
    left: -0.08rem;
    top: 0.015rem;
    width: 0.035rem;
    height: 0.1rem;
    background: #186497;
  }
}
.concept {
  width: 5.83rem;
  background: #f0f0f0;
  padding: 0.1rem 0.13rem 0.1rem 0.26rem;
  box-sizing: border-box;
  .conceptDetail {
    .enTitle {
      margin: 0.052083rem 0 0.08rem;
      font-size: 0.114583rem;
      font-weight: bold;
      color: #222;
    }
    .enText {
      margin-bottom: 0.08rem;
      font-size: 0.104167rem;
      line-height: 0.13rem;
      color: #666;
    }
    .enItalic {
      font-style: oblique;
      font-size: 0.09375rem;
      color: #999;
    }
    .chTitle {
      margin: 0.15rem 0 0.1rem;
      font-size: 0.104167rem;
      font-weight: bold;
      color: #222;
    }
    .chText {
      margin-bottom: 0.09rem;
      font-size: 0.09375rem;
      line-height: 0.14rem;
      color: #666;
    }
    .chItalic {
      a {
        font-style: oblique;
        font-size: 0.083333rem;
        color: #999;
      }
    }
  }
}
.rightContainer {
  display: flex;
  flex-flow: column nowrap;
  .dataSources {
    width: 1.40625rem;
    margin-bottom: 0.052083rem;
    background: #f0f0f0;
    padding: 0.06rem 0.13rem 0.1rem 0.16rem;
    box-sizing: border-box;
    .sourceContent {
      margin-top: 0.06rem;
      font-size: 0.083333rem;
      a {
        text-decoration: underline;
        color: #006599;
      }
    }
    .noteContent {
      margin-top: 0.06rem;
      font-size: 0.083333rem;
      color: #666;
    }
  }
}
</style>
