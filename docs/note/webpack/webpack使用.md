# webpack4使用
## 准备
[nrm](https://www.npmjs.com/package/nrm) 管理npm镜像   
[npx](https://www.npmjs.com/package/npx) 调用项目内部安装的模板   
[npx用法详解](https://www.ruanyifeng.com/blog/2019/02/npx.html)  

## 命令行打包
webpack-cli的作用是可以让我们在命令行中执行一些webpack命令，单独对一些文件进行打包。  
比如打包./src/index.js
```sh
npx webpack ./src/index.js
```
## 使用配置文件webpack.config.js
```js
const path = require('path');
module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'main.js'
  }
};
```
命令行执行`npx webpack`
## package.json 里面添加打包命令
```json
"scripts": {
    "build:dev": "webpack --mode development",
    "build:prod": "webpack --mode production"
  }
```
## 使用loader
[loader](https://v4.webpack.docschina.org/loaders/)是文件预处理器。  
webpack默认只能处理js和json文件，其他文件需要用loader转换。  
:::tip 注意
如果安装了相应的loader，配置也没问题，执行webpack时还是报错，问题可能是当前loader版本和webpack版本不匹配，一般情况下，webpack版本不轻易升级，可以修改对应的loader版本。  
查看npm包所有版本，比如查看`file-loader`，使用命令`npm views file-loader versions`。
:::
### file-loader
将文件发送到输出文件夹，并返回（相对）URL。  
比如我们想要打包一个图片，用`file-loader`，它的执行过程如下：
1. 发现图片模块
2. 打包到dist目录下，并改一个名字
3. 得到图片的完整路径
4. 将图片路径作为返回值，返回给我们引入的图片的变量

注意：file-loader 从 5.0 版本开始，将默认输出改成了 esModule 模块，开发环境需要改成输出commonJS模块，
配置 `esModule:false` 。
### less-laoder
```js
module.exports = {
  ...
  module: {
    rules: [{
      test: /\.less$/,
      use: [{
        loader: 'style-loader' // 创建style标签，将css注入到html的head里面
      }, {
        loader: 'css-loader' // 解析 CSS 文件后，使用 import 加载，并且返回 CSS 代码
      }, {
        loader: 'less-loader' // 加载和转译 LESS 文件
      }]
    }]
  }
};
```
style-laoder，每引入一个css文件，就会创建一个style标签。  
当有多个loader时，loader的执行顺序是 从右到左，从下到上。
### sass-loader
```sh
npm i node-sass sass-loader -D
```
```js
module.exports = {
  ...
  module: {
    rules: [{
      test: /\.scss$/,
      use: [{
        loader: 'style-loader' // 创建style标签，将css注入到html的head里面
      }, {
        loader: 'css-loader' // 解析 CSS 文件后，使用 import 加载，并且返回 CSS 代码
      }, {
        loader: 'sass-loader' // 加载和转译 scss 文件
      }]
    }]
  }
};
```

### url-loader
和file-loader类似，不过当文件大小小于一个特定值时，会返回base64。
limit的值设置为5kb，表示当文件小于等于5kb时，都会被打包成一个base64字符串，出现在js文件中，不会再出现在static/img目录下。
```js
{
    loader: 'url-loader',
    options: {
        name: 'static/img/[name].[contenthash:5].[ext]',
        limit: 1024 * 5,
        esModule: false //注意：从 3.0 版本开始，将默认输出改成了 esModule 模块，开发环境需要改成输出commonJS模块
    }
}
```
### postcss-loader
处理css兼容问题，自动加前缀
`webpack.config.js`中配置如下：
```js
{
    loader: 'postcss-loader',
    options: {
        plugins: [require('autoprefixer')]
    }
}
```
同时，`package.json`里面添加浏览器兼容配置：
```json
"browserslist": [
    "last 2 version",
    "> 1%"
]
```
使用`npx browserslist`命令查看配置中具体兼容了哪些浏览器版本。   
也可以在项目根目录新建`postcss.config.js`配置，内容如下：
```js
module.exports = {
  plugins: [
    require('autoprefixer')
  ]
}
```
此时，`webpack.config.js`中无需再配置options。
## 使用plugin
### html-webpack-plugin
该插件将为你生成一个 HTML5 文件， 其中包括使用 script 标签的 body 中的所有 webpack 包，输出目录是dist/index.html。
```js
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'static/js/main.[hash:5].js'
  },
  plugins: [new HtmlWebpackPlugin()]
};
```
如果我们想指定模板，则配置如下：
```js
plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html'
    })
]
```
### clean-webpack-plugin
会自动清除dist目录，再生成新的打包文件
```js
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
...
plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: './src/index.html'
    })
]
```
### webpack.ProvidePlugin
这个插件可以自动引入模块。
1. 比如引入jquery，这样在代码任何地方都可以直接使用$或者jQuery，无须再import。
2. 自动引入模块中的某个方法，比如lodash中的map方法。
```js
const { ProvidePlugin } = require('webpack');
//...
plugins: [
  new ProvidePlugin({
    $: 'jquery',
    jQuery: 'jquery',
    _map: ['lodash', 'map']
  })
]
```
3. 引入自己定义的某个模块。比如定义$service变量，表示`src/common`下的`service.js`，注意路径需要用path.resolve解析。如果`service.js`使用`export default`导出模块，则配置需要加`default`。

```js
const path = require('path');
const { ProvidePlugin } = require('webpack');
//...
plugins: [
  new ProvidePlugin({
    $service: [path.resolve(path.join(__dirname, 'src/common/service'))],
    // $service: [path.resolve(path.join(__dirname, 'src/common/service')),'default']
  })
]
```
```js
// src/common/service.js
export function fn1() {
  console.log('service fn1');
}
```
## 多个入口文件
```js
module.exports = {
  entry: {
    main: './src/index.js',
    sub: './src/sub.js'
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'static/js/[name].[hash:5].js'
  }
}
```
如果打包后的资源需要放在cdn上，则可以配置publicPath如下，会自动加上资源前缀
```js
module.exports = {
  //...
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'static/js/[name].[hash:5].js',
    publicPath: 'http://cdn.example.com/assets/[hash]/'
  }
}
```
## sourceMap 调试代码，定位错误
```js
module.exports = {
  devtool:''
}
```
- 开发模式下推荐 `devtool: 'cheap-module-eval-source-map'`，可以定位到源码具体的行数
- 生产环境下推荐`devtool: 'none'`，不生成source map
- 如果生产环境需要定位错误，使用`devtool:'cheap-module-source-map'`，不会暴露源码
## devServer
`webpack --watch` 监听文件变化，自动重新打包，但是不适合用于开发环境。  
开发环境可以使用`webpack-dev-server`，修改源代码时，无需生成dist目录，即可自动重新加载，刷新页面。  
在 `package.json` 中配置如下：
```json
{
    "scripts": {
        "dev": "webpack-dev-server"
    }
}
```
在 `webpack.config.js` 中配置如下：
```js
module.exports = {
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    port: 9000,
    proxy: {//代理某些url
      '/api': 'http://localhost:3000'
    }
  }
```
请求到 /api/users 现在会被代理到请求 http://localhost:3000/api/users。
### 热更新
[HMR原理](https://v4.webpack.docschina.org/concepts/hot-module-replacement/)  
模块热替换(HMR - hot module replacement)功能会在应用程序运行过程中，替换、添加或删除 模块，而无需重新加载整个页面。
## 使用 babel 
### 方式一
转换es6+的新语法为向后兼容的js
```sh
npm install -D babel-loader @babel/core @babel/preset-env
```
使用 @babel/polyfill 补充低版本浏览器缺失的语法
```sh
npm install --save @babel/polyfill
```
在项目入口index.js引入
```js
import '@babel/polyfill';
```
[babel](https://babeljs.io/docs/en/babel-preset-env)
此时，打包后的js体积很大，是因为我们引入了polyfill里面的全部方法，实际开发中，我们肯定希望按需引入，需要配置
`useBuiltIns`选项为`usage`，此时，入口文件里`import '@babel/polyfill';`就可以删除了。
```js
{
    test: /\.m?js$/,
    exclude: /(node_modules|bower_components)/, //排除
    use: {
        loader: 'babel-loader',
        options: {
            presets: [
                [
                    '@babel/preset-env',
                    {
                        useBuiltIns: 'usage',
                        corejs: 3
                    }
                ]
            ]
        }
    }
}
```
配置完再打包，发现打包后的js体积小了很多，只打包了我们用到的方法。   
打包的时候，webpack提示我们要设置corejs的版本，如果我们要使用最新的api，需设置corejs为3版本。
```sh
npm install --save core-js@3
```
### 方式二
@babel/polyfill，是以全局变量的形式将方法注入的，会污染我们的全局环境，在开发业务中影响不大，但对我们开发组件库或者类库有影响。此时，我们需要换一种方式引入。
@babel/plugin-transform-runtime 以闭包形式注入，保证全局环境不被污染。
```sh
npm install --save-dev @babel/plugin-transform-runtime
npm install --save @babel/runtime
npm install --save @babel/runtime-corejs3
```
项目目录下新建`.babelrc`文件，配置如下：
```json
{
  "plugins": [
    [
      "@babel/plugin-transform-runtime",
      {
        "corejs": 3
      }
    ]
  ]
}
```
## TreeShaking
剔除无用的代码，即使引入了某个方法，但是没有使用，就不会被打包。
webpack4中，当mode为development时，没有进行TreeShaking优化，只有为production时才优化。
而webpack3中，默认都没有优化，需要用户额外配置uglifyjs-webpack-plugin。  
示例一：
```js
import { fn1, fn2 } from './common/util';
fn1();
//或者
import * as util from './common/util';
util.fn1();
```
```js
// util.js
export function fn1() {
  console.log('fn1');
}
export function fn2() {
  console.log('fn2');
}
```
示例二：
`util.js` 使用了 `export default` 导出，这种写法会打包整个util里面的方法，并不能treeShaking，所以不推荐。
```js
import util from './common/util';
util.fn1();
```
```js
// util.js
export default {
  fn1() {
    console.log('fn1');
  },
  fn2() {
    console.log('fn2');
  }
};
```






