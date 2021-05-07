# js基础
## 变量提升
1. 函数声明和变量声明（用var）都会被提升到函数的顶端。但是函数表达式却不会被提升。
2. 是函数会首先被提升，然后才是变量。
3. 重复的 var 声明会被忽略掉，但出现在后面的函数声明还是可以覆盖前面的。
4. js在执行时，是被包裹在一个大的匿名函数中。

```js
var a = 2;
function a() {
  console.log(1);
}
console.log(a);//2
a = function () {
  console.log(2);
}
console.log(a);//function(){console.log(2);}
```
```js
if (false) {
  var a = 1;
}
console.log(a);//输出undefined,因为js编译阶段，变量a的声明被提升到了if外面
```
```js
var a = 1;
{
  a = 2;
  console.log(a);
  let a;
}
// Uncaught ReferenceError: Cannot access 'a' before initialization
```
## this
1. 谁调用，this就指向谁。当没有调用者时，this就指向全局。
2. self是关键字，声明变量时不要用。
3. globalThis 提供了一个标准的方式来获取不同环境下的全局 this  对象（也就是全局对象自身）。不像 window 或者 self 这些属性，它确保可以在有无窗口的各种环境下正常工作。所以，你可以安心的使用 globalThis，不必担心它的运行环境。为便于记忆，你只需要记住，全局作用域中的 this 就是 globalThis。
```js
this.a = 20;
var test = {
  a: 50,
  init: function () {
    var go = function(){
      console.log(this.a);
    }
    go();//没有对象调用go方法，所以go方法里面的this指向全局
  }
}
test.init();//20
```

## 箭头函数
箭头函数表达式的语法比函数表达式更简洁，并且没有自己的this，arguments，super或new.target。箭头函数表达式更适用于那些本来需要匿名函数的地方，并且它不能用作构造函数。

引入箭头函数有两个方面的作用：更简短的函数并且不绑定this。
- 箭头函数不会创建自己的this,它只会从自己的作用域链的上一层继承this。
```js
this.a = 20;
var test = {
  a: 50,
  init: function () {//这行等价于 init(){ ，但是和箭头函数 init:()=>{ 不一回事
    var go = () => {
      console.log(this.a);//使用了箭头函数，此时this指向了test
    }
    go();
  }
}
test.init();//50
```  
```js
this.age = 2;
function Person() {
    this.age = 0;
    setTimeout(function () {
        this.age++;//this指向了window
        console.log(this.age);
    }, 1000);
}
var p = new Person();// 3
```
```js
// 使用箭头函数
this.age = 2;
function Person() {
    this.age = 0;
    setTimeout(() => {
        this.age++; // this 正确地指向 p 实例
        console.log(this.age);
    }, 1000);
}
var p = new Person();//1
```

- 箭头函数不绑定Arguments 对象。
```js
var arguments = [1, 2, 3];
var arr = () => arguments[0];

arr(); // 1

function foo(n) {
  // 隐式绑定 foo 函数的 arguments 对象. 
  // arguments[0] 是 n,即传给foo函数的第一个参数
  var f = () => arguments[0] + n; 
  return f();
}

foo(1); // 2
foo(2); // 4
foo(3); // 6
foo(3,2);//6
```  
- 箭头函数不能用作构造器，和 new一起用会抛出错误。
- 箭头函数没有prototype属性。
-  yield 关键字通常不能在箭头函数中使用（除非是嵌套在允许使用的函数内）。因此，箭头函数不能用作函数生成器。

