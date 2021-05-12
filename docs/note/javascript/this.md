# this
## 为什么使用this
this 提供了一种更优雅的方式来隐式“传递”一个对象引用，因此可以将 API 设计
得更加简洁并且易于复用。

## this绑定规则

1. 默认绑定。独立函数调用，可以把这条规则看作是无法应用其他规则时的默认规则。如果使用严格模式（strict mode），那么全局对象将无法使用默认绑定，因此 this 会绑定到 undefined。
```js
function foo() {
  console.log(this.a);
}
var a = 2;
foo(); // 2
```
2. 隐式绑定。当函数引用有上下文对象时，隐式绑定规则会把函数调用中的 this 绑定到这个上下文对象。且对象属性引用链中只有最顶层或者说最后一层会影响调用位置。
```js
function foo() {
  console.log(this.a);
}
var obj = {
  a: 2,
  foo: foo
};
obj.foo(); // 2
```
3. 显式绑定。使用call或apply，直接指定 this 的绑定对象。
```js
function foo() {
  console.log(this.a);
}
var obj = {
  a: 2
};
foo.call(obj); // 2
```   
硬绑定，使用 ES5 中提供的内置的方法 Function.prototype.bind。
```js
function foo(something) {
  console.log(this.a, something);
  return this.a + something;
}
var obj = {
  a: 2
};
var bar = foo.bind(obj);
var b = bar(3); // 2 3
console.log(b); // 5
```
4. new 绑定
```js
function foo(a) {
  this.a = a;
}
var bar = new foo(2);
console.log(bar.a); // 2
```      
使用 new 来调用 foo(..) 时，我们会构造一个新对象并把它绑定到 foo(..) 调用中的 this
上。new 是最后一种可以影响函数调用时 this 绑定行为的方法，我们称之为 new 绑定。

## 总结
1. this 是在运行时进行绑定的，this 的绑定和函数声明的位置没有任何关系，只取决于函数的调用方式。
2. 谁调用，this就指向谁。当没有调用者时，this就指向全局。
3. 无论是否在严格模式下，在全局执行环境中（在任何函数体外部）this 都指向全局对象。
4. 严格模式下，如果进入执行环境时没有设置 this 的值，this 会保持为 undefined。
  
::: tip
1. self是关键字，声明变量时不要用。
2. globalThis 提供了一个标准的方式来获取不同环境下的全局 this  对象（也就是全局对象自身）。不像 window 或者 self 这些属性，它确保可以在有无窗口的各种环境下正常工作。所以，你可以安心的使用 globalThis，不必担心它的运行环境。为便于记忆，你只需要记住，全局作用域中的 this 就是 globalThis。
:::   

      
练习一
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
练习二
```js
this.a = 20;
function go() {
  console.log(this.a);
  this.a = 30;
}
go.prototype.a = 40;
var test = {
  a: 50,
  init: function (fn) {
    fn();
    console.log(this.a);
    return fn;
  }
};
let s=new go();//40
console.log(s.a);//30
var p = test.init(go);//20 50
p();//30
```
解析：查找某个实例的属性时，先从构造函数上找，如果找不到，再去原型上找。执行new go()的时候，在第3行，属性a还没有被赋值，所以又去原型上找，结果是40，等new go()执行完，this就指向了新创建的实例s，实例s的属性a就是构造函数里的30。17行，go作为一个参数，在init方法里面被调用，go方法里面的this指向全局，此时全局作用域里面的a为20，所以先打印20，接着执行this.a=30，全局作用域里面的a就被重新赋值为30。p即为go方法的引用，执行p方法，就是调用go方法，此时go方法里面的this指向全局，全局上的a就是30。