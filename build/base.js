/**代码压缩选项*/
const compressOption = {
  warnings: false, /**取消警告*/
  drop_debugger: true, /**取消debugerInfo*/
  drop_console: true /**取消console打印信息*/
}
module.exports = {
  host: "0.0.0.0", /**可以通过localhost或者本机IP访问*/
  port: 8080,
  publicPath: '/', /**url如果要使用CDN在这里改写*/
  urlLimit: 10000, /**小于8K使用base64*/
  copyDir: "static", /** 复制/copyDir资源到dist/copyDir */
  compress: compressOption
}