module.exports = {
  publicPath: './',
  devServer: {
    proxy: {
      '/api': {
        target: 'http://localhost:9000/shop',
        changeOrigin: true,
        pathRewrite: {
          '^/api': ''
        }
      },
      '/pdf':{
        target: 'http://8.129.217.34:80',
        changeOrigin: true
      }
    }
  }
}