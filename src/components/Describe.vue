<template>
  <div :class="$store.state.fullScreen.isFullScreen==true?'container':'fullContainer'">
    <div class="concept">
      <!-- 小标题 -->
      <div class="subhead">
        <div class="en">Definition</div>
        <div class="ch">概念</div>
      </div>
      <!-- 内容 -->
      <div class="conceptDetail">
        <div class="enTitle">{{describeData.concept.enTitle}}</div>
        <!-- （T5）特殊 开始 英文-->
        <div class="enText" v-for="(item,i) in describeData.enTextT5" :key="'en'+i">
          <span class="textName">{{item.split("_")[0]}}</span>
          {{item.split("_")[1]}}
        </div>
        <!-- （T5）特殊 结束-->
        <div class="enText" v-html="describeData.concept.enText">
         <span>{{describeData.concept.enText.split("_")[0]}}</span>
          <a
            :href="describeData.concept.textLink"
            target="_blank"
          ><span>{{describeData.concept.enText.split("_")[1]}}</span></a>
          <span>{{describeData.concept.enText.split("_")[2]}}</span>
        </div>
        <div class="enText"><span>{{describeData.concept.enTextThird}}</span></div>
        <div class="enTitle"><span>{{describeData.concept.enTitleSecond}}</span></div>
        <div class="enText"><span>{{describeData.concept.enTextSecond}}</span></div>
        <div class="enSource">
          <span>{{describeData.concept.enSource.split("_")[0]}}</span>
          <a
            :href="describeData.concept.enLink"
            target="_blank"
          ><span>{{describeData.concept.enSource.split("_")[1]}}</span></a>
          <span>{{describeData.concept.enSource.split("_")[2]}}</span>
        </div>
        <div class="chTitle">{{describeData.concept.chTitle}}</div>
        <!-- （T5）特殊 开始 中文-->
        <div class="chText" v-for="(item,index) in describeData.chTextT5" :key="index">
          <span class="textName">{{item.split("_")[0]}}</span>
          {{item.split("_")[1]}}
        </div>
        <!-- （T5）特殊 结束-->
        <div class="chText">
          <span>{{describeData.concept.chText.split("_")[0]}}</span>
          <a
            :href="describeData.concept.textLink"
            target="_blank"
          ><span>{{describeData.concept.chText.split("_")[1]}}</span></a>
          <span>{{describeData.concept.chText.split("_")[2]}}</span>
        </div>
        <div class="chTitle">{{describeData.concept.chTitleSecond}}</div>
        <div class="chText">
          <span>{{describeData.concept.chTextSecond.split("_")[0]}}</span>
          <a
            :href="describeData.concept.textLink"
            target="_blank"
          ><span>{{describeData.concept.chTextSecond.split("_")[1]}}</span></a>
          <span>{{describeData.concept.chTextSecond.split("_")[2]}}</span>
        </div>
        <div class="chSource">
          <span>{{describeData.concept.chSource.split("_")[0]}}</span>
          <a
            :href="describeData.concept.chLink"
            target="_blank"
          ><span>{{describeData.concept.chSource.split("_")[1]}}</span></a>
          <span>{{describeData.concept.chSource.split("_")[2]}}</span>
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
          <div>
            <span>{{describeData.dataSources.en.split("_")[0]}}</span>
            <a
              :href="describeData.sourceLink"
              target="_blank"
            ><span>{{describeData.dataSources.en.split("_")[1]}}</span></a>
            <span>{{describeData.dataSources.en.split("_")[2]}}</span>
          </div>
          <div class="noteSecond" v-if="describeData.dataSources.enSecond">
            <span>{{describeData.dataSources.enSecond.split("_")[0]}}</span>
            <a
              :href="describeData.sourceLinkSecond"
              target="_blank"
            ><span>{{describeData.dataSources.enSecond.split("_")[1]}}</span></a>
            <span>{{describeData.dataSources.enSecond.split("_")[2]}}</span>
          </div>
          <div class="noteSecond" v-if="describeData.dataSources.enThird">
            <span>{{describeData.dataSources.enThird.split("_")[0]}}</span>
            <a
              :href="describeData.sourceLinkThird"
              target="_blank"
            ><span>{{describeData.dataSources.enThird.split("_")[1]}}</span></a>
            <span>{{describeData.dataSources.enThird.split("_")[2]}}</span>
          </div>
        </div>
        <div class="chSourceContent">
          <div>
            <span>{{describeData.dataSources.ch.split("_")[0]}}</span>
            <a
              :href="describeData.sourceLink"
              target="_blank"
            ><span>{{describeData.dataSources.ch.split("_")[1]}}</span></a>
            <span>{{describeData.dataSources.ch.split("_")[2]}}</span>
          </div>
          <div class="noteSecond" v-if="describeData.dataSources.chSecond">
            <span>{{describeData.dataSources.chSecond.split("_")[0]}}</span>
            <a
              :href="describeData.sourceLinkSecond"
              target="_blank"
            ><span>{{describeData.dataSources.chSecond.split("_")[1]}}</span></a>
            <span>{{describeData.dataSources.chSecond.split("_")[2]}}</span>
          </div>
          <div class="noteSecond" v-if="describeData.dataSources.chThird">
            <span>{{describeData.dataSources.chThird.split("_")[0]}}</span>
            <a
              :href="describeData.sourceLinkThird"
              target="_blank"
            ><span>{{describeData.dataSources.chThird.split("_")[1]}}</span></a>
            <span>{{describeData.dataSources.chThird.split("_")[2]}}</span>
          </div>
        </div>
      </div>
      <div class="dataSources">
        <div class="subhead">
          <div class="en">Note</div>
          <div class="ch">备注</div>
        </div>
        <div class="noteContent">
          <div>{{describeData.noteContent.en}}</div>
          <div class="noteSecond">{{describeData.noteContent.enSecond}}</div>
          <div class="noteSecond">{{describeData.noteContent.enThird}}</div>
          <div class="noteSecond">{{describeData.noteContent.enFour}}</div>
					<div class="noteSecond">{{describeData.noteContent.enForth}}</div>
        </div>
        <div class="enNoteContent">
          <div>{{describeData.noteContent.ch}}</div>
          <div class="noteSecond">{{describeData.noteContent.chSecond}}</div>
          <div class="noteSecond">{{describeData.noteContent.chThird}}</div>
          <div class="noteSecond">{{describeData.noteContent.chFour}}</div>
					<div class="noteSecond">{{describeData.noteContent.chForth}}</div>
        </div>
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
  }
};
</script>

<style lang="less" scoped>
.container {
  display: flex;
  justify-content: space-between;
  margin-top: 0.14rem;
}
.fullContainer {
  display: none;
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
      a {
        color: #666;
        border-bottom: 1px solid #999;
      }
      .textName {
        font-weight: bold;
        color: #222;
      }
    }
    .enSource {
      font-style: oblique;
      font-size: 0.09375rem;
      color: #999;
      a {
        color: #999;
        border-bottom: 1px solid #999;
      }
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
      a {
        color: #666;
        border-bottom: 1px solid #999;
      }
      .textName {
        font-weight: bold;
        color: #222;
      }
    }
    .chSource {
      font-style: oblique;
      font-size: 0.083333rem;
      color: #999;
      a {
        color: #999;
        border-bottom: 1px solid #999;
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
      font-size: 0.09375rem;
      color: #006599;
      a {
        text-decoration: underline;
        color: #006599;
      }
    }
    .chSourceContent {
      margin-top: 0.06rem;
      font-size: 0.083333rem;
      color: #006599;
      a {
        text-decoration: underline;
        color: #006599;
      }
    }
    .noteContent {
      font-family: "Calibri";
      margin-top: 0.06rem;
      font-size: 0.09375rem;
      color: #666;
      line-height: 0.14rem;
    }
    .enNoteContent {
      margin-top: 0.08rem;
      font-size: 0.083333rem;
    }
  }
}
.noteSecond {
  margin-top: 0.04rem;
}
</style>
