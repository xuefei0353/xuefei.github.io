# this
1. 无论是否在严格模式下，在全局执行环境中（在任何函数体外部）this 都指向全局对象。
2. 在函数内部，this的值取决于函数被调用的方式。
3. 严格模式下，如果进入执行环境时没有设置 this 的值，this 会保持为 undefined。
4. 谁调用，this就指向谁。当没有调用者时，this就指向全局。
5. self是关键字，声明变量时不要用。
6. globalThis 提供了一个标准的方式来获取不同环境下的全局 this  对象（也就是全局对象自身）。不像 window 或者 self 这些属性，它确保可以在有无窗口的各种环境下正常工作。所以，你可以安心的使用 globalThis，不必担心它的运行环境。为便于记忆，你只需要记住，全局作用域中的 this 就是 globalThis。
      
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