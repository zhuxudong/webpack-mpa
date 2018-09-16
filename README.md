# webpack-mpa
webpack配置多页面应用脚手架

# 开始
```
git clone https://github.com/zhuxudong/webpack-mpa.git
npm install
```


# 开发
```
npm run dev
```

# 发布
```
npm run build
```
# 支持功能
* 在src/page/下面创建页面文件夹，会自动根据文件夹名生成页面
* 各种模块语法:commonJS,AMD,UMD,ES6模块
* ES新语法,如class 
* ES新API,如Promise
* less编译
* 根据模板自动生成HTML,并自动处理CSS,JS依赖关系
* 抽离公共模块到common.js
* 拷贝/static到生产环境
* 哈希命名,防止版本缓存
* 代码压缩
* CSS浏览器兼容
* 抽离CSS文件
