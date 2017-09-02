本文学习总结于  
- [太狼 关于“angular2中数据状态管理方案有哪些？”的回答](https://www.zhihu.com/question/46662780)  
- [Angular 2 Change Detection - 2](https://segmentfault.com/a/1190000008754052#articleHeader5)
- [Angular - What is Unidirectional Data Flow ? Learn How the Angular Development Mode Works, why it's important to use it and how to Troubleshoot it](http://blog.angular-university.io/angular-2-what-is-unidirectional-data-flow-development-mode/)


### 数据
在Angular中，我们所说的数据，即组件持有的数据模型。


```
import { Component } from '@angular/core';
import {Course} from "./course";

export interface Course {
    id:number;
    description:string;
}

@Component({
  selector: 'app-root',
  template: `
    <div class="course">
        <span class="description">{{course.description}}</span>
    </div>
`})
export class AppComponent {


    course: Course = {
        id: 1,
        description: "Angular For Beginners"
    };
    
}
```
Angular通过模板把数据模型转换成视图。

### 模板在Angular内部的使用
Angular应用中，模板指的的是@Component装饰器的template或templateUrl指向的HTML页面
例如：

```
@Component({
  selector: 'app-root',
  template: `
    <div class="course">
        <span class="description">{{course.description}}</span>
    </div>
`})
export class AppComponent {


    course: Course = {
        id: 1,
        description: "Angular For Beginners"
    };
    
}
```
在模板出现问题时，比如少了一个关闭标签，在控制台我们会收到有用的错误消息。 所以很明显Angular不是简单地用一个字符串来处理模板。 那么这是如何工作的？  
在Angular中，Angular并不是把数据通过替换一些变量来创建基于模板的实际HTML然后将此HTML传递给浏览器然后浏览器解析HTML并生成DOM数据结构浏览器渲染引擎然后在屏幕上呈现视图。
> Angular不会生成HTML字符串，它直接生成DOM数据结构。

实际上，Angular把组件类中的数据模型应用于一个函数（DOM component renderer）。 该函数的输出是对应于此HTML模板的DOM数据结构。

该函数的定义大体如下：

```
View_AppComponent_0.prototype.createInternal = function(rootSelector) {
        var self = this;
        
        var parentRenderNode = self.renderer.createViewRoot(self.parentElement);
        
        self._text_0 = self.renderer.createText(parentRenderNode,'\n',self.debug(0,0,0));
        
        self._el_1 = jit_createRenderElement5(self.renderer,parentRenderNode,'div',
               new jit_InlineArray26(2,'class','course'),self.debug(1,1,0));
        
        self._text_2 = self.renderer.createText(self._el_1,'\n\n    ',self.debug(2,1,20));
        
        self._el_3 = jit_createRenderElement5(self.renderer,self._el_1,'span',
              new jit_InlineArray26(2,'class','description'),self.debug(3,3,4));
        
        self._text_4 = self.renderer.createText(self._el_3,'',self.debug(4,3,30));
        
        self._text_5 = self.renderer.createText(self._el_1,'\n\n',self.debug(5,3,59));
        
        self._text_6 = self.renderer.createText(parentRenderNode,'\n',self.debug(6,5,6));
        
        self.init(null,(self.renderer.directRenderer? null: [
                self._text_0,
                self._el_1,
                self._text_2,
                self._el_3,
                self._text_4,
                self._text_5,
                self._text_6
            ]
        ),null);
        return null;
    };
```
从其中createViewRoot，createText一些方法和parentElement，parentRenderNode命名，可以大概知道该函数正在创建一个DOM数据。

一旦数据状态发生改变，Angular数据检测器检测到，将重新调用
该DOM component renderer。

如何查看自己的组件的DOM component renderer，以及该函数的产生时机，请参考[[Angular - What is Unidirectional Data Flow ? Learn How the Angular Development Mode Works, why it's important to use it and how to Troubleshoot it](http://blog.angular-university.io/angular-2-what-is-unidirectional-data-flow-development-mode/)](http://blog.angular-university.io/angular-2-what-is-unidirectional-data-flow-development-mode/)中的**Where can I find this function for my components ?** 和 **When is this code generated ?** 章节。

### 引起数据模型变化的来源
数据模型一旦发生改变，视图就要相应发生变化，这也是现在流行的Model Driven View。那么就客户端（浏览器）来说，引起数据模型发生变化的事件源有：
- Events：click, mouseover, keyup ...
- Timers：setInterval、setTimeout
- XHRs：Ajax(GET、POST ...)

这些事件源有一个共同的特性，即它们都是异步操作。那我们可以这样认为，所有的异步操作都有可能会引起模型的变化。


### 变更检测和单向数据流规则
每一个异步操作都有可能引起数据状态的变更, Angular封装 Zone来拦截跟踪异步（这里不对Zone进行解释说明，请自行查阅）。
- 每一次异步操作后Angular会发生一次数据检测，从根组件遍历每一个叶子组件，该过程是单向的。
![Angular变化检测](http://upload-images.jianshu.io/upload_images/3368741-c026a64a4241ba8d.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
- 一旦检测到组件数据状态改变，就重新调 DOM ompoent render渲染，把数据模型转换成DOM数据结构，该数据流是单向的。

>在Angular中，单向数据流规则是指当数据模型发生变化，Angular发动变更检测，调用DOM ompoent render把数据模型转化为DOM数据结构，应用中的数据只会单向转向成DOM数据结构，不可发生其他改变的方向。

![单向数据流规则](http://upload-images.jianshu.io/upload_images/3368741-84da83134008dabe.PNG?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)


>注：Angular从组件树的顶部到底部的整个渲染扫描过程也是单向的。

Angular为什么要遵循单向数据流规则呢？

### 为什么要单向数据流？

在AngularJS中，数据的流动是双向，稍微复杂的情况下，这种流动会变得不可预测，有可能到导致整个应用陷入“无限震荡”中。

我们希望确保在将数据转换为视图的过程中，不会进一步修改数据。数据从组件类流向代表它们的DOM数据结构，生成这些DOM数据结构的行为本身不会对数据进行进一步修改。但在Angular的变更检测周期中，组件的生命周期钩子会被调用，这意味着我们编写的代码在该过程中被调用，该代码有可能引发数据状态发生改变。


![Angular组件生命周期](http://upload-images.jianshu.io/upload_images/3368741-1023095d76136e34.PNG?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)


例如

```
import {Component, AfterViewChecked} from '@angular/core';
import {Course} from "./course";

@Component({
    selector: 'app-root',
    template: `
    <div class="course">
        <span class="description">{{course.description}}</span>
    </div>
`})
export class AppComponent implements AfterViewChecked {

    course: Course = {
        id: 1,
        description: "Angular For Beginners"
    };

    ngAfterViewChecked() {
        this.course.description += Math.random();
    }

}
```
上述代码会在Angular变更检测周期发生错误。我们在该组件ngAfterViewChecked()方法中修改了数据状态。导致了视图渲染后，数据跟视图状态不一致。

解决：

```
ngAfterViewChecked() {
    setTimeout(() => {
        this.course.description += Math.random();
    });
}
```
我们可以使用setTimeout将数据修改延迟到下一个变更周期。

除了组件生命周期回调的钩子可能触发数据状态的改变还有其他，
例如
```
import { Component } from '@angular/core';
import {Course} from "./course";

@Component({
    selector: 'app-root',
    template: `
    <div class="course">
        <span class="description">{{description}}</span>
    </div>
`})
export class AppComponent {

    course: Course = {
        id: 1,
        description: "Angular For Beginners"
    };

    get description() {
        return this.course.description + Math.random();
    }
}
```
Angular每次检测description时，它都会返回一个不同值。

> 在Angular变更检测周期，任意会改变数据状态的行为都会抛出异常从而终止。

如果Angular没有制止该行为，数据和视图会保持在不一致的状态，其中渲染过程完成后的视图不反映数据的实际状态。或者重复检测，直到数据稳定可能会导致性能问题。

### 单向数据流重要性
- 首先是因为它有助于从渲染过程中获得很好的性能。

- 它确保了当我们的事件处理程序返回并且框架接管渲染结果时，没有什么不可预测的发生。

- 防止数据vs查看不一致的错误。

### 变化检测性能优化

变化检测前：


![变化检测前](http://upload-images.jianshu.io/upload_images/3368741-07046a9cd2382c74.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)


变化检测时：


![变化检测时](http://upload-images.jianshu.io/upload_images/3368741-8761fea20c16f32b.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)


每次变化检测都是从根组件开始，从上往下执行，遍历每个组件。
由于框架已经自动为模版生成的代码做了非常多的优化，即使是在未使用优化过的 model 的情况下都已经可以达到 ng 1脏检测性能的 3－10 倍(同样绑定数量，同样检测次数)。视频中提到了这是因为 ng 2 在生成模版代码时，会动态生成让 js 引擎易于优化的代码，大概原理就是保持每次 check change 前后对象“形状 ”的一致。而如果在性能有瓶颈的地方，可以使用下面两种方式进行高阶优化：

- OnPush变化检测策略+Immutable
- OnPush变化检测策略+Observable

#### OnPush变化检测策略

OnPush 策略：若输入属性没有发生变化，组件的变化检测将会被跳过

#### OnPush变化检测策略+Immutable

> Angular对复杂数据类型即对象的检测只是检测对该对象的引用是否改变

当对象属性值改变，但对其引用没改变，Angular会默该改数据没发生变化。

实践例子可参考：[Angular 2 Change Detection - 2](https://segmentfault.com/a/1190000008754052#articleHeader2/) 的OnPush策略章节。

因此当我们使用 OnPush 策略时，需要使用的 Immutable 的数据结构（Immutable 即不可变，表示当数据模型发生变化的时候，我们不会修改原有的数据模型，而是创建一个新的数据模型），才能保证程序正常运行。

为了提高变化检测的性能，我们应该尽可能在组件中使用 OnPush 策略，为此我们组件中所需的数据，*应仅依赖于输入属性*。  

#### OnPush变化检测策略+Observable

使用 immutable 时 change detection cycle 依旧从 root component 开始往下，依次检测。


![](http://upload-images.jianshu.io/upload_images/3368741-8cbd871dd2423668.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)


上图每个 component 都使用了 immutable model ，白色的部分是变更的部分，则在一个 change detection cycle 中只会 recheck & render 白色的部分，从而大大减少处理变更的代价。

而使用 OnPush变化检测策略 和 Observable 时，情况就不一样了，它的变更很可能是从一个非常下层的子 component 中开始发生的，比如：


![](http://upload-images.jianshu.io/upload_images/3368741-5d4bfb471e72021a.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)


在图中一个子 component 通过 observable 观察到了一次数据的变更。这个时候我们需要告知 Angular 这个部分发生了变更，它将会把这个 component 与它的父 component 一直到 root component 标记出来，并单独检测这一部分的变更：



![](http://upload-images.jianshu.io/upload_images/3368741-4f1e0939a2fffd74.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)



#### ChangeDetectorRef
ChangeDetectorRef 是组件的变化检测器的引用，我们可以在组件中的通过依赖注入的方式来获取该对象,来手动控制组件的变化检测行为：

ChangeDetectorRef 变化检测类中主要方法有以下几个：

```
export abstract class ChangeDetectorRef {
  abstract markForCheck(): void;
  abstract detach(): void;
  abstract detectChanges(): void;
  abstract reattach(): void;
}
```

其中各个方法的功能介绍如下：

- markForCheck() - 在组件的 metadata 中如果设置了 changeDetection: ChangeDetectionStrategy.OnPush 条件，那么变化检测不会再次执行，除非手动调用该方法。
- detach() - 从变化检测树中分离变化检测器，该组件的变化检测器将不再执行变化检测，除非手动调用 reattach() 方法。
- reattach() - 重新添加已分离的变化检测器，使得该组件及其子组件都能执行变化检测
- detectChanges() - 从该组件到各个子组件执行一次变化检测


```
import { Component, Input, OnInit, ChangeDetectionStrategy, 
         ChangeDetectorRef } from '@angular/core';
import { Observable } from 'rxjs/Rx';

@Component({
    selector: 'exe-counter',
    template: `
      <p>当前值: {{ counter }}</p>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CounterComponent implements OnInit {
    counter: number = 0;

    @Input() addStream: Observable<any>;

    constructor(private cdRef: ChangeDetectorRef) { }

    ngOnInit() {
        this.addStream.subscribe(() => {
            this.counter++;
            this.cdRef.markForCheck();
        });
    }
}
```

### 总结
- Angular变更检测周期，数据从组件类到DOM，遵循着单向数据流的规则。  

- Angular是一颗有向树，默认情况下，变化检测系统将会走遍整棵树，但我们可以使用 OnPush 变化检测策略，使用Immutable 能解决大部分问题，而使用Observables 对象，进而利用 ChangeDetectorRef 实例提供的方法，能让你更灵活地控制检测器的行为，最终提高系统的整体性能。

在此，非常感谢 [semlinker](http://www.jianshu.com/u/a7e8aedb4ca1) 的帮助!