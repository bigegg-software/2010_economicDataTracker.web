<template>
  <div id="app">
    <!-- <router-link to="/about">About</router-link> -->
    <router-view />
  </div>
</template>

<style lang="less">
* {
  margin: 0;
  padding: 0;
}
html,
body,
#app {
  width: 100%;
  margin: 0;
  padding: 0;
  font-family:Arial,"Microsoft Yahei";
}
::-webkit-scrollbar {
  width: 8px;
}
::-webkit-scrollbar {
  height: 8px;
}
::-webkit-scrollbar-track {
  background-color: #eee;
} // 后背景
::-webkit-scrollbar-thumb {
  background-color: #aab0b8;
} // 原前背景aab0b8
::-webkit-scrollbar-thumb:hover {
  background-color: #143257;
} //鼠标放上
::-webkit-scrollbar-thumb:active {
  background-color: #aab0b8;
} // 选中前背景
</style>
