module.exports = {

  chainWebpack: config => {

    config.module

      .rule('less')

      .oneOf('vue')

      .use('px2rem-loader')

      .loader('px2rem-loader')

      .before('postcss-loader') // this makes it work.

      .options({
        remUnit: 192,
        remPrecision: 8
      }) // remUnit: 192代表以1920px为整体，如果设计稿的尺寸是750px，这里的值为75

      .end()

  },
  // outputDir: 'serve', //build输出目录
  // assetsDir: 'assets', //静态资源目录（js, css, img）
  // lintOnSave: false, //是否开启eslint
  // devServer: {
  //   proxy: {
  //     //配置跨域
  //     '/api': {
  //       target: "https://qyapi.weixin.qq.com",
  //       ws: true,
  //       changOrigin: true,
  //       pathRewrite: {
  //         '^/api': '/'
  //       }
  //     },
  //   }
  // }
}
