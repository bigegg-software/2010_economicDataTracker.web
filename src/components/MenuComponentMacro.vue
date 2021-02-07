<template>
  <div class="navigator" ref="navigator">
    <!-- <div v-for="(nav, index) in navList" :key="index" class="nav-block iconfont"> -->
      <!-- 1级 -->
      <!-- <ul class="primary" :class="{ 'primary-active': nav.active }" @click="showSubnav(index)">
        <li class="text">
          <div>{{ nav.en }}</div>
          <div>{{ nav.ch }}</div>
        </li>
        <li class="arrow-icon iconfont">&#xe609;</li>
      </ul> -->
      <!-- 2级 -->
      <fade-in>
        <ul  class="secondary">
          <li
            v-for="(subnav, i) in navList"
            :key="i"
            class="subnav"
            :class="{ 'secondary-active': $route.name==subnav.name}"
            @click="handleClickSubnav(subnav, i)"
          >
            <ul class="text" :class="{'indent':subnav.isIndent }">
              <li>{{ subnav.en}}</li>
              <li>{{ subnav.ch}}</li>
            </ul>
          </li>
        </ul>
      </fade-in>
    </div>
  <!-- </div> -->
</template>

<script>
import FadeIn from "@/components/animations/FadeIn";
export default {
  props: {
    navList: {}
  },
  components: {
    FadeIn
  },
  data() {
    return {};
  },
  mounted() {

  },
  methods: {
//     showSubnav(index) {
//       let dom = this.$refs.navigator.querySelectorAll(".primary .arrow-icon");
//       for (let i = 0; i < this.navList.length; i++) {
//         this.navList[i].active = index == i ? !this.navList[i].active : false;
//         dom[i].className = this.navList[i].active
//           ? "arrow-icon rotate primary-active"
//           : "arrow-icon _rotate";
//       }
//     },
    handleClickSubnav(subnav,  i) {
      this.$router.push({ name: subnav.name });
    }
  }
};
</script>
<style scoped lang="less">
* {
  margin: 0;
  padding: 0;
  list-style: none;
  user-select: none;
}
.navigator {
  width: 1.817708rem;
  box-shadow: darkgrey 0px 0px 20px 3px;
}
.nav-block {
  width: 100%;
  background: white;
  border-bottom: 0.007813rem solid #cbcbcb;
  &:last-child {
    border: none;
  }
}

.secondary {
  width: 100%;
  background: #fff;
  .subnav {
    width: 100%;
    padding: 0 0.041667rem;
    box-sizing: border-box;
    color: #999999;
    cursor: pointer;
    &:hover {
      background: #e0eef7;
    }
    .text {
      width: 100%;
      padding: 0 0.041667rem;
      box-sizing: border-box;
      border-bottom: 0.007813rem solid #d9d9d9;
      li {
        &:first-child {
          padding: 0.03125rem 0 0.010417rem;
          font-size: 0.114583rem;
          font-family: Calibri;
        }
        &:last-child {
          padding: 0.010417rem 0 0.03125rem;
          font-size: 0.083333rem;
          font-family: SimHei, "黑体";
        }
      }
    }
    &:last-child .text {
      border: none;
    }
  }
}
.indent {
  padding-left: 0.15rem !important;
  box-sizing: border-box;
}

.defaultRotate {
  transform: rotateZ(0deg) !important;
}
.rotate {
  transform: rotateZ(0deg) !important;
  animation: _rotate 0.5s;
}
._rotate {
  transform: rotateZ(-90deg) !important;
  animation: rotate 0.5s;
}
.primary-active {
  color: #186497 !important;
}
.secondary-active {
  color: #fff !important;
  background-color: #8aa8bb !important;
}

@keyframes rotate {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(-90deg);
  }
}
@keyframes _rotate {
  0% {
    transform: rotate(-90deg);
  }
  100% {
    transform: rotate(0deg);
  }
}
</style>
