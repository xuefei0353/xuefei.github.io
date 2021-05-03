# EventLoop 事件循环

什么是事件循环？先通过一段伪代码了解一下这个概念：
```js
// eventLoop是一个用作队列的数组
    // （先进，先出）
    var eventLoop = [];
    var event;
    // “永远”执行
    while (true) {
      // 一次tick
      if (eventLoop.length > 0) {
        // 拿到队列中的下一个事件
        event = eventLoop.shift();
        // 现在，执行下一个事件
        try {
          event();
        }
        catch (err) {
          reportError(err);
        }
      }
    }
```
你可以看到，有一个用 while 循环实现的持续运行的循环，循环的每一轮称为一个 tick。
对每个 tick 而言，如果在队列中有等待事件，那么就会从队列中摘下一个事件并执行。这些事件就是你的回调函数。

## 单线程
为什么会有事件循环？因为JavaScript是单线程的。
- 单线程是指js引擎中解析和执行js代码的线程只有一个（主线程），每次只能做一件事情。
- JS 为什么选择单线程？JavaScript主要服务于客户端，如果支持多线程，就可能会出现复杂的问题。例如，有两段js代码在并行执行，一段需要删除某个dom元素，一段需要修改这个dom元素，若dom已经被删除，这时候另一段js再执行，就会报错。因此决定了它只能是单线程，否则会带来很复杂的同步问题。
- 单线程就意味着，同一时间只能执行一个任务，所有任务都需要排队，前一个任务结束，才会执行后一个任务。如果前一个任务耗时很长，后一个任务就需要一直等着，可能出现页面卡死的状态。

那如何解决单线程带来的性能问题？答案是异步！把耗时的任务放到异步队列里。

于是，JavaScript的任务可以分为两种，同步和异步。
<strong>同步任务</strong>是直接放在主线程上排队依次执行，<strong>异步任务</strong>会放在任务队列中，若有多个异步任务则需要在任务队列中排队等待，任务队列类似于缓冲区，任务下一步会被移到调用栈然后主线程执行<strong>调用栈</strong>的任务。
::: tip 调用栈：
调用栈是一个栈结构，函数调用会形成一个栈帧，帧中包含了当前执行函数的参数和局部变量等上下文信息，函数执行完后，它的执行上下文会从栈中弹出。
:::
综上所述，检查调用栈是否为空以及讲某个任务添加到调用栈中的这个过程就是事件循环，这就是JavaScript实现异步的核心。

## JavaScript 内存

- 堆

对象被分配在堆中，堆是一个用来表示一大块（通常是非结构化的）内存区域的计算机术语。
- 栈

栈在javascript中又称执行栈，调用栈，是一种后进先出的数组结构 。函数调用形成了一个由若干帧组成的栈。
```js
function foo(b) {
  let a = 10;
  return a + b + 11;
}

function bar(x) {
  let y = 3;
  return foo(x * y);
}

console.log(bar(7)); // 返回 42
```
当调用 bar 时，第一个帧被创建并压入栈中，帧中包含了 bar 的参数和局部变量。 当 bar 调用 foo 时，第二个帧被创建并被压入栈中，放在第一个帧之上，帧中包含 foo 的参数和局部变量。当 foo 执行完毕然后返回时，第二个帧就被弹出栈（剩下 bar 函数的调用帧 ）。当 bar 也执行完毕然后返回时，第一个帧也被弹出，栈就被清空了。

- 队列

队列即任务队列Task Queue，是一种先进先出的一种数据结构。一个 JavaScript 运行时包含了一个待处理消息的消息队列。每一个消息都关联着一个用以处理这个消息的回调函数。

## 浏览器中的EventLoop

浏览器端事件循环中的异步队列有两种，<strong>宏任务</strong>队列和<strong>微任务</strong>队列。 

### 常见的macrotask：
- script全部代码
- setTimeout
- setInterval
- I/O操作
- UI渲染
  
### 常见的microtask：
- new Promise().then()
- MutationObserve
### window.requestAnimationFrame()
也属于异步执行的方法，但该方法既不属于宏任务，也不属于微任务。

window.requestAnimationFrame() 告诉浏览器——你希望执行一个动画，并且要求浏览器在下次重绘之前调用指定的回调函数更新动画。该方法需要传入一个回调函数作为参数，该回调函数会在浏览器下一次重绘之前执行。

requestAnimationFrame 是在GUI渲染之前执行，但在MicroTask之后，不过requestAnimationFrame 不一定会在当前帧必须执行，由浏览器根据当前的策略自行决定在哪一帧执行。

### 浏览器中event loop过程如下图：

![](/img/jsEventLoop.jpg "")
1. 检查宏任务队列是否为空，非空则到2，为空则到3。
2. 执行宏任务中的一个任务。
3. 继续检查微任务队列是否为空，若有则到4，否则到5。
4. 取出微任务中的任务执行，执行完成后返回到步骤3。
5. 执行视图更新。
  
::: tip
当某个宏任务执行完后,会查看是否有微任务队列。如果有，先执行微任务队列中的所有任务，如果没有，会读取宏任务队列中排在最前的任务，执行宏任务的过程中，遇到微任务，依次加入微任务队列。栈空后，再次读取微任务队列里的任务，依次类推。
:::
## node中的EventLoop
node中event loop过程如下图：

![](/img/nodeEventLoop.png "")
1. V8引擎解析JavaScript脚本。
2. 解析后的代码，调用Node API。
3. libuv库负责Node API的执行。它将不同的任务分配给不同的线程，形成一个Event Loop，以异步的方式将任务的执行结果返回给V8引擎。
4. V8引擎再将结果返回给用户。
### 六大阶段
其中libuv引擎中的事件循环分为6个阶段，它们会按照顺序反复运行。每当进入某一个阶段的时候，都会从对应的回调队列中取出函数去执行。当队列为空或者执行的回调函数数量到达系统设定的阈值，就会进入下一阶段。

![](/img/nodeEventLoopApi.png "")

1. timers 阶段:这个阶段执行timer (setTimeout、 setInterval) 的回调，并且是由poll阶段控制的。 
2. I/O callbacks 阶段:处理一些上一轮循环中的少数未执行的I/0 回调
3. idle, prepare 阶段:仅node内部使用
4. poll 阶段:获取新的I/O事件，适当的条件下node将阻塞在这里
5. check阶段: 执行setlmmediate()的回调
6. lose callbacks 阶段: 执行socket 的close事件回调

### NodeJS中宏队列主要有4个   
1. Timers Queue 
2. IO Callbacks Queue 
3. Check Queue 
4. Close Callbacks Queue

这4个都属于宏队列，但是在浏览器中，可以认为只有一个宏队列，所有的macrotask都会被加到这个宏队列中， 但是在NodeJS中， 不同的macrotask会被放置在不同的宏队列中。
### NodeJS中微队列主要有2个   
1. Next Tick Queue: 是放置process.next Tick(calback)的回调任务的。
2. Other Micro Queue:放置其他microtask, 比如Promise等。
在浏览器中，也可以认为只有一个微队列，所有的microtask都会被加到込一个微队列中，但是在NodeJS中，不同的microtask会被放置在不同的微队列。
### NodeJS中的EventLoop过程

1. 执行全局Script的同步代码
2. 执行microtask微任务， 先执行所有Next Tick Queue中的所有任务，再执行Other Microtask Queue中的所有任务
3. 幵始执行macrotask宏任务，共6个阶段，从第1个阶段开始执行相应每一个阶段macrotask中的所有任务，注意，这里是所有每个阶段宏任务队列的所有任务，在浏览器的Event Loop中是只取宏从列的第一个任务出来执行，毎一个阶段的macrotask任务执行完毕后， 幵始执行微任务，也就是步骤2 
4. Timers Queue ->步骤2 -> I/O Queue ->步骤2 -> Check Queue ->步骤2 -> Close Callback Queue ->步骤2 -> Timers Queue ... 
5. 这就是Node的Event Loop
   
## 练习
练习1
```js
async function async1() {
  console.log('async1 start');
  await async2();
  console.log('async1 end');
}
async function async2() {
  console.log('async2');
}
async1();
console.log('script');
// 执行结果：
// async1 start 
// async2 
// script 
// async1 end
// 上述代码等价于
async function async1() {
  console.log('async1 start');
  new Promise(resolve => {
    console.log('async2');
    resolve();
  }).then(res => {
    console.log('async1 end');
  })
}
async1();
console.log('script');
```   
练习2
```js
async function async1() {
  console.log(1);
  await new Promise(resolve => {
    console.log(2);
  });
  console.log(3);
  return 4;
}
console.log(5);
async1().then(res => console.log(res));
console.log(6);
// 执行结果： 5 1 2 6
// 注意：await 后面的 promise 没有resolve,所以async1()的then方法永远不会被执行。
```