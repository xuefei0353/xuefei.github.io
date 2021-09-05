# vue2源码解析

[什么是AST抽象语法树](https://zhuanlan.zhihu.com/p/32189701)
[在线生成AST](https://astexplorer.net/)
[用AST修改源码](https://segmentfault.com/a/1190000016231512)
[Vue.js技术揭秘](https://ustbhuangyi.github.io/vue-analysis/v2/data-driven/)
## vue2架构
### 目录结构
- compiler 编译模板
- core vue的核心，包括双向数据绑定
- platforms 平台相关的代码，包括web，weex
- server 服务端渲染
- sfc 单文件的拆分
- shared 全局用到的工具函数

### 运行时，编译时
- vue的运行时是指，vue运行起来后，它在内存中常驻的一个状态
- 离线编译：上线之前编译，将vue用webpack打包成js
- 在线编译：上线之后编译，在浏览器运行时编译。比如Vue.comonent('button-counter',{template:''})，运行时，通过js来编译模板。
- runtime+compiler(在线编译使用的包)，如果用不到在线编译，就只用runtime的vue.js，体积会更小。
- vue编译时优化，react运行时优化



## 双向数据绑定的原理
`Object.defineProperty`监听对象属性值的变化，但是监听不了新增的属性。
监听数组时，如果进行新增或者删除操作，可能会多次触发get,set方法，比如unshift，数组所有的元素在原有的索引值上，都会往后移动一个位置。因此vue2，对数组进行了重写。
```js
var arr = [1, 2];
function defineReactive(data, key, value) {
Object.defineProperty(data, key, {
    get: function () {
        console.log('get ' + key);
        return value;
    },
    set: function (newVal) {
        console.log('set ' + key);
        value = newVal;
    }
});
}
function observe(data) {
    Object.keys(data).forEach((key) => {
        defineReactive(data, key, data[key]);
    });
}
observe(arr);
```
render函数里面会获取需要双向绑定的值，触发get。

## compiler
通过正则匹配，将html字符串转换成AST，生成render函数。  
AST 元素节点总共有 3 种类型，type 为 1 表示是普通元素，为 2 表示是表达式， 为 3 表示是纯文本。  
静态节点的优化：`markStaticRoots`方法，循环递归，给静态节点打标记`static:true`或者`staticRoot:true`，这样，当动态数据发生变化时，更新视图时，就不需要更新静态节点，提高了渲染性能。

## observer
把data里面的数据变成响应式数据，每个响应式数据都会被加上`__ob__`属性，嵌套对象要递归。proxy也不能代理嵌套对象，需要处理。


## watcher
维护render函数与数据之间的纽带。  
vue1中，一个指令对应一个watcher，不需要dom diff，占用大量内存，会很卡。  
vue2中，一个组件对应一个watcher，需要dom diff，提高性能。  
而react，没有watcher，需要对整个页面进行dom diff，js运行得多了，时间长，就会造成阻塞，所以需要运行时优化，提高性能。


## Dep
收集依赖

## 虚拟dom
虚拟dom和真实dom区别，真实dom里面包含了很多用不到到的属性。  
vue中通过对html进行正则匹配，生成ast，再把ast生成render函数。正则匹配有回溯的过程，如果html模板很大，速度就会慢。
