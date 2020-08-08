module.exports = {
  publicPath: './',
  devServer: {
    proxy: {
      '/shop': {
        target: 'http://localhost:9000/shop',
        changeOrigin: true,
        pathRewrite: {
          '^/shop': ''
        }
      },
      '/pdf':{
        target: 'http://8.129.217.34:80',
        changeOrigin: true
      }
    }
  }
}