> 本文摘抄自冴羽的博客 [JavaScript深入系列15篇正式完结](https://github.com/mqyqingfeng/Blog/issues/17)](https://github.com/mqyqingfeng/Blog)

本文将先从 JavaScript作用域 聊起，然后从执行上下文的创建过程分析 JavaScript 作用域链 以及 相关的活动变量。

## 静态作用域

**作用域**
作用域规定了如何查找变量，也就是确定当前执行代码对变量的访问权限。
JavaScript 采用词法作用域(lexical scoping)，也就是**静态作用域**。
因为 JavaScript 采用的是词法作用域，函数的作用域在函数定义的时候就决定了。
而与词法作用域相对的是动态作用域，函数的作用域是在函数调用的时候才决定的。

```
var value = 1;

function foo() {
    console.log(value);
}

function bar() {
    var value = 2;
    foo();
}

bar();

// 结果是 ???
```
总之一句话：
> 函数的作用域在函数定义的时候就决定了

函数会沿着作用域链去查找变量。

那么为什么 JavaScript 是静态作用域呢？JavaScript 引擎是怎么处理函数的呢？
以下将进行详解。

## 执行上下文栈
如果要问到 JavaScript 代码执行顺序的话，想必写过 JavaScript 的开发者都会有个直观的印象，那就是顺序执行，毕竟：
```
var foo = function () {

    console.log('foo1');

}

foo();  // foo1

var foo = function () {

    console.log('foo2');

}

foo(); // foo2
```

然而去看这段代码：

```
function foo() {

    console.log('foo1');

}

foo();  // foo2

function foo() {

    console.log('foo2');

}

foo(); // foo2
```

打印的结果却是两个 foo2。

刷过面试题的都知道这是因为 JavaScript 引擎并非一行一行地分析和执行程序，而是**一段一段**地分析执行。当执行一段代码的时候，会进行一个“准备工作”，比如第一个例子中的变量提升，和第二个例子中的函数提升。

但是本文真正想让大家思考的是：**这个“一段一段”中的“段”究竟是怎么划分的呢？**

其实是以**函数**为段。
每当 JavaScript引擎 执行到一个函数的时候，就会创建一个执行空间（执行上下文）。

接下来问题来了，我们写的函数多了去了，如何管理创建的那么多执行上下文呢？

所以 JavaScript 引擎 创建了**执行上下文栈（Execution context stack，ECS）**来管理执行上下文

试想当 JavaScript 开始要解释执行代码的时候，最先遇到的就是全局代码，所以初始化的时候首先就会向执行上下文栈压入一个全局执行上下文。当执行一个函数的时候，就会创建一个执行上下文，并且压入执行上下文栈，当函数执行完毕的时候，就会将函数的执行上下文从栈中弹出。

那么 执行上下文 有什么用？

## 执行上下文
执行代码计算时，总需要得知 变量 的来源及值，那么怎么获取该变量？当然是要从代码执行的上下文查找。

对于每个执行上下文，都有三个重要属性：
- 变量对象(Variable object，VO)
- 作用域链(Scope chain)
- this

> JavaScript 引擎会沿着作用域链去查找变量。

作用域链是如何产生？我们应该先了解 JavaScript 引擎 在创建 执行上下文 的具体处理过程。

## 作用域链

### 具体分析产生

我们分析第一段代码：
```
var scope = "global scope";
function checkscope(){
    var scope = "local scope";
    function f(){
        return scope;
    }
    return f();
}
checkscope();
```
执行过程如下：

1.执行全局代码，创建全局执行上下文，全局上下文被压入执行上下文栈
```
    ECStack = [
        globalContext
    ];
```
2.全局上下文初始化
```
    globalContext = {
        VO: [global, scope, checkscope],
        Scope: [globalContext.VO],
        this: globalContext.VO
    }
```
2.初始化的同时，checkscope 函数被创建，保存作用域链到函数的内部属性[[scope]]。
每个函数有一个内部属性 [[scope]]，当函数创建的时候，就会保存所有父变量对象到其中，你可以理解 [[scope]] 就是所有父变量对象的层级链，但是注意：[[scope]] 并不代表完整的作用域链！
```
    checkscope.[[scope]] = [
      globalContext.VO
    ];
```
3.执行 checkscope 函数，创建 checkscope 函数执行上下文，checkscope 函数执行上下文被压入执行上下文栈

    ECStack = [
        checkscopeContext,
        globalContext
    ];
4.checkscope 函数执行上下文初始化：

1. 复制函数 [[scope]] 属性创建作用域链，
2. 用 arguments 创建活动对象，
3. 初始化活动对象，即加入形参、函数声明、变量声明，
4. 将活动对象压入 checkscope 作用域链顶端(执行至此，该函数的作用域链才完整)。
5. 同时 f 函数被创建，保存作用域链到 f 函数的内部属性[[scope]]
```
    checkscopeContext = {
        AO: {
            arguments: {
                length: 0
            },
            scope: undefined,
            f: reference to function f(){}
        },
        Scope: [AO, globalContext.VO],
        this: undefined
    }
```
5.执行 f 函数，创建 f 函数执行上下文，f 函数执行上下文被压入执行上下文栈
```
    ECStack = [
        fContext,
        checkscopeContext,
        globalContext
    ];
```
6.f 函数执行上下文初始化, 以下跟第 4 步相同：

1. 复制函数 [[scope]] 属性创建作用域链
2. 用 arguments 创建活动对象
3. 初始化活动对象，即加入形参、函数声明、变量声明
4. 将活动对象压入 f 作用域链顶端
```
    fContext = {
        AO: {
            arguments: {
                length: 0
            }
        },
        Scope: [AO, checkscopeContext.AO, globalContext.VO],
        this: undefined
    }
```
7.f 函数执行，沿着作用域链查找 scope 值，返回 scope 值

8.f 函数执行完毕，f 函数上下文从执行上下文栈中弹出
```
    ECStack = [
        checkscopeContext,
        globalContext
    ];
```
9.checkscope 函数执行完毕，checkscope 执行上下文从执行上下文栈中弹出
```
    ECStack = [
        globalContext
    ];
```
### 总结
当查找变量的时候，会先从当前上下文的变量对象中查找，如果没有找到，就会从父级(词法层面上的父级)执行上下文的变量对象中查找，一直找到全局上下文的变量对象，也就是全局对象。这样由多个执行上下文的变量对象构成的链表就叫做作用域链。
> 由上可知，作用域链是由 变量对象/活动对象 构成的。

## 活动变量
变量对象是与执行上下文相关的数据作用域，存储了在上下文中定义的变量和函数声明。因为不同执行上下文下的变量对象稍有不同，全局上下文中的变量对象就是全局对象。

在函数上下文中，我们用活动对象(activation object, AO)来表示变量对象。

活动对象和变量对象其实是一个东西，只是变量对象是规范上的或者说是引擎实现上的，不可在 JavaScript 环境中访问，只有到当进入一个执行上下文中，这个执行上下文的变量对象才会被激活，所以才叫 activation object 呐，而只有被激活的变量对象，也就是活动对象上的各种属性才能被访问。

活动对象是在进入函数上下文时刻被创建的，它通过函数的 arguments 属性初始化。arguments 属性值是 Arguments 对象。

### 函数执行产生活动变量过程

执行上下文的代码会分成两个阶段进行处理：分析和执行，我们也可以叫做：

- 进入执行上下文
- 代码执行

当进入执行上下文时，这时候还没有执行代码，

变量对象会包括：

1. 函数的所有形参 (如果是函数上下文)
   * 由名称和对应值组成的一个变量对象的属性被创建
   * 没有实参，属性值设为 undefined
2. 函数声明
   * 由名称和对应值（函数对象(function-object)）组成一个变量对象的属性被创建
   * 如果变量对象已经存在相同名称的属性，则完全替换这个属性
3. 变量声明

   * 由名称和对应值（undefined）组成一个变量对象的属性被创建；
   * 如果变量名称跟已经声明的形式参数或函数相同，则变量声明不会干扰已经存在的这类属性

举个例子：
```
function foo(a) {
  var b = 2;
  function c() {}
  var d = function() {};

  b = 3;

}

foo(1);
```

在进入执行上下文后，这时候的 AO 是：
```
AO = {
    arguments: {
        0: 1,
        length: 1
    },
    a: 1,
    b: undefined,
    c: reference to function c(){},
    d: undefined
}
```
在代码执行阶段，会顺序执行代码，根据代码，修改变量对象的值

还是上面的例子，当代码执行完后，这时候的 AO 是：
```
AO = {
    arguments: {
        0: 1,
        length: 1
    },
    a: 1,
    b: 3,
    c: reference to function c(){},
    d: reference to FunctionExpression "d"
}
```
### 活动变量 总结
到这里变量对象的创建过程就介绍完了，让我们简洁的总结我们上述所说：

1. 全局上下文的变量对象初始化是全局对象

2. 函数上下文的变量对象初始化只包括 Arguments 对象

3. 在进入执行上下文时会给变量对象添加形参、函数声明、变量声明等初始的属性值

4. 在代码执行阶段，会再次修改变量对象的属性值