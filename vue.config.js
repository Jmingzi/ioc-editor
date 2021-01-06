module.exports = {
  publicPath: './',
  devServer: {
    host: '0.0.0.0',
    hot: true,
    disableHostCheck: true,
  },
  css: {
    extract: false,
    loaderOptions: {
      less: {
        lessOptions:{
          javascriptEnabled: true,
        }
      }
    }
  }
}
