<template>
  <div class="navigator">
    <div v-for="(nav, index) in navList" :key="index" class="nav-block">
      <!-- 1级 -->
      <ul
        class="primary"
        :class="{ 'primary-active': nav.active }"
        @click="showSubnav(index)"
      >
        <li class="text">
          <div>{{ nav.chinese }}</div>
          <div>{{ nav.english }}</div>
        </li>
        <li
          class="arrow-icon iconfont"
          :class="{ 'rotate primary-active': nav.active }"
        >
          &#xe609;
        </li>
      </ul>
      <!-- 2级 -->
      <ul v-if="nav.active" class="secondary">
        <li
          v-for="(subnav, i) in nav.children"
          :key="i"
          class="subnav"
          :class="{ 'secondary-active': subnav.active }"
          @click="handleClickSubnav(subnav, index, i)"
        >
          <ul class="text">
            <li>{{ subnav.chinese }}</li>
            <li>{{ subnav.english }}</li>
          </ul>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: "",
  props: {},
  data() {
    return {
      navList: [
        {
          name: "",
          chinese: "中国对外投资",
          english: "China’s outbound investment",
          active: false,
          children: [
            {
              name: "",
              chinese: "中国对外直接投资流量与存量",
              english: "China’s outward FDI flows vs. Stocks",
              active: false
            },
            {
              name: "",
              chinese: "中国对外直接投资存量",
              english: "China’s FDI stocks",
              active: false
            },
            {
              name: "",
              chinese: "中国对外直接投资存量按国家和地区统计",
              english: "China’s FDI stocks by destination",
              active: false
            },
            {
              name: "",
              chinese: "中国对外直接投资流量",
              english: "China’s FDI outflows",
              active: false
            },
            {
              name: "",
              chinese: "中国对外直接投资流量按国家和地区统计",
              english: "China’s FDI outflows by destination",
              active: false
            },
            {
              name: "",
              chinese: "中国对外直接投资流量行业分布情况",
              english: "China’s FDI outflows by industry",
              active: false
            },
            {
              name: "",
              chinese: " 中国对“一带一路”沿线国家投资情况",
              english:
                "China’s FDI outflows in Belt and Road Initiative (BRI) countries",
              active: false
            },
            {
              name: "",
              chinese: "中国对外承包工程",
              english: "China’s overseas projects",
              active: false
            },
            {
              name: "",
              chinese: "中国对外劳务合作",
              english: "China’s international labor",
              active: false
            }
          ]
        },
        {
          name: "",
          chinese: "外商投资中国",
          english: "China’s inbound investment",
          active: false,
          children: [
            {
              name: "",
              chinese: "实际使用外资",
              english: "China’s FDI inflows",
              active: false
            },
            {
              name: "",
              chinese: "主要对华投资国家/地区",
              english: "Major foreign investors of China",
              active: false
            },
            {
              name: "",
              chinese: "外商直接投资主要行业",
              english: "Foreign investment to China by industry",
              active: false
            },
            {
              name: "",
              chinese: "外商投资企业税收统计",
              english: "Tax revenue from foreign investment enterprises",
              active: false
            },
            {
              name: "",
              chinese: "“一带一路”沿线国家对华投资情况",
              english:
                "Investment from Belt and Road Initiative (BRI) countries",
              active: false
            }
          ]
        },
        {
          name: "",
          chinese: "双向直接投资",
          english: "China’s FDI outflows vs. inflows",
          active: false,
          children: [
            {
              name: "",
              chinese: "双向直接投资",
              english: "China’s FDI outflows vs. inflows",
              active: false
            }
          ]
        }
      ]
    };
  },
  methods: {
    showSubnav(index) {
      // 旋转当前点击 icon 还原其他 icon
      // 改变字体颜色
      for (let i = 0; i < this.navList.length; i++) {
        this.navList[index].active = !this.navList[index].active;
      }
    },
    handleClickSubnav(subnav, index, i) {
      console.log(subnav, index, i);
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
  width: 1.59375rem;
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

.primary {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 0 0.083333rem;
  box-sizing: border-box;
  color: #666666;
  font-size: 0.083333rem;
  cursor: pointer;
  .text {
    padding: 0.052083rem 0;
    div {
      // height: 0.13rem;
      // line-height: 0.13rem;
    }
  }
  .arrow-icon {
    color: #dbdbdb;
    font-weight: bold;
    transform: rotateZ(-90deg);
  }
}
.secondary {
  width: 100%;
  background: #f6f6f6;
  .subnav {
    width: 100%;
    padding: 0 0.041667rem;
    box-sizing: border-box;
    color: #999999;
    cursor: pointer;
    .text {
      width: 100%;
      padding: 0 0.041667rem;
      box-sizing: border-box;
      border-bottom: 0.007813rem solid #d9d9d9;
      li {
        &:first-child {
          padding: 0.03125rem 0 0.010417rem;
        }
        &:last-child {
          padding: 0.010417rem 0 0.03125rem;
        }
      }
    }
    &:last-child .text {
      border: none;
    }
  }
}

.rotate {
  transform: rotateZ(0) !important;
  animation: ratateTriangle 0.5s;
}
.primary-active {
  color: #1d3f6c !important;
}
.secondary-active {
  color: #fff !important;
  background-color: #1d3f6c !important;
}
@keyframes ratateTriangle {
  0% {
    transform: rotate(-90deg);
  }
  100% {
    transform: rotate(0deg);
  }
}
</style>
