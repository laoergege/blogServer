## 前言
2017年9月20日更新。此次博客项目分为三个部分: 
- [博客前台展示](!https://github.com/laoergege/myBlog)
- [博客后台管理](!https://github.com/laoergege/blogAdmin)
- [restful api 后台服务](!https://github.com/laoergege/blogServer)

其实一个博客项目也很没多大难度，市面上已有各种各样的写作平台，github上也有很多开源的博客项目。别问我为什么要写一个博客，或许就像某位大神说的一样，**Just Fun！**
确实，一个博客项目难度不算大，是学习一门新技术练手的不错的demo，能够从中不断发现问题并提升对新技术的掌握。

起初奔博客项目最先是采用 Angular 写的。但由于本人初接触 MVVM
 框架就选了最难 Angular ，而且第一次接触多种新思想，如组件化、数据绑定、单向数据流等。一边学习一边写，结果可想而知，当然踩了不少坑，而且代码写得一团糟糕。后来采用 Vue 重构了整个项目，学过 Angular 自然学起 Vue 也就轻快了很多。

本项目前端主要采用 vue 技术栈: vue-cli + vue + vue-router + vuex + axios  
后台主要采用:node.js + mongodb + mongoose + express + typescript.

## 项目架构
总体来说，分为 *client* 部分和 *server* 部分。

![image.png](https://raw.githubusercontent.com/laoergege/laoergege-blog/master/assets//o24UYhYnVxGAKCBx1Jr80fOb.PNG)

###  Client
客户端又分为两部分:
- [博客前台展示](!https://github.com/laoergege/myBlog)
- [博客后台管理](!https://github.com/laoergege/blogAdmin)

**博客前台展示** 主要也就是从 restful api 后台服务拿到数据并渲染出来。文章保存的内容是markdown格式，使用 [showdown](https://github.com/showdownjs/showdown), 文章样式使用 [github-markdown-css](https://github.com/sindresorhus/github-markdown-css), 语法高亮使用 [highlight.js](https://github.com/isagalaev/highlight.js) ,highlight.js 支持的语法高亮太多了，我并没用全部引入，只是引入单个需要的文件。值得一说的是这个评论系统，当初想到要自己写一个挺烦的。幸好 github 上大神多，有大大基于 github 的 issue 开发了一个评论系统，（PS: 先容许我喊波 6666）起初用的是 [gitment](https://github.com/imsun/gitment), 不过该库有个麻烦就是每篇文章都必须自己手动初始化（PS: 截止本文发布这个问题还没解决）,后来听说隔壁的 [gittalk](https://github.com/gitalk/gitalk) 没用这问题，并且样式动画要好看多，就采用了 gittalk。

**博客后台管理** 本人很喜欢 [简书](http://www.jianshu.com/) 的写作页面，先贴一张

![image.png](https://raw.githubusercontent.com/laoergege/laoergege-blog/master/assets/iQmVX_GlqpBV5ytcF6FrBkzW.PNG)

后来就写了类似简书这样的三栏结构管理页面


![pc.png](https://raw.githubusercontent.com/laoergege/laoergege-blog/master/assets/Y7aw-IdpQ0qYUNuBHRGxhWh_.PNG)

左边为导航栏，中间为列表，右边为主要内容。
也做了 tablet 和 mobile 的适应。

![image.png](https://raw.githubusercontent.com/laoergege/laoergege-blog/master/assets/LccyZH4MHCGuY1iNezR_jQwK.PNG)

![image.png](https://raw.githubusercontent.com/laoergege/laoergege-blog/master/assets/eKHrtveJSWvQeuTX3HUcTyyC.PNG)

其实我并没有采用类似 bootstrap 的栅格系统，我只是使用 js 监听窗口大小，监听两个临界值。这两值我也是参考其他栅格系统的。

mobile ---[573 px]--- tablet ---[993 px]--- pc

当然监听的过程 节流操作 是必不可少的。这里使用的是 [rxjs](https://github.com/ReactiveX/rxjs) 库的，不过后来发觉使用 [lodash](https://github.com/lodash/lodash) 也不错。
```
// 订阅  window resize事件, 并 节流 操作
    this.subscription = Observable.fromEvent(window, 'resize')
      .debounceTime(200)
      .subscribe(() => {
        this.resizeHandle();
      })
```

markdown 编辑器我并没有采用 第三方的 markdown 编辑器，而是自己写了一个类似 简书的 简易的 markdown 编辑器组件。

![image.png](https://raw.githubusercontent.com/laoergege/laoergege-blog/master/assets/fdGNmo7Wyb477Quvmt2bNld2.PNG)

该编辑器组件支持**全屏写作**、**分屏预览**、**添加标签**、**图片拖动上传**、**撤销与恢复**、保存（保存方面做到了**自动保存**、**离线保存**，其实每次编辑后我都首先保存在 localstorage 里，并没有直接上传到服务器，页面刷新和 url 更新两个动作才会触发上传。离线保存 也就保存 localstorage 里，待上线再与服务器版本比较后更新。）。该编辑器最大的缺陷就是不支持多种键盘快捷键。。。

该后台管理目前只实现了对 文集和文章的 CURD 操作，其他模块功能待后续上线。

### Server
服务端部分采用 express 作为开发框架，提供api接口服务给前端调用，后端不做页面模板的渲染和路由的导航工作，这部分都由前端的 vue 来处理，所以该博客其实是一个前后端分离，以RESTful api来通信的单页应用。在 node 服务的前面还有一层就是 nginx 了， 
nginx 层监听浏览器默认访问的 80 端口，把不同域名的请求调用不同的资源，如访问 [https://blog.laoergege.cn/](https://blog.laoergege.cn/) 或 [https://admin.laoergege.cn/](https://admin.laoergege.cn/) 就会把不同项目vue-cli 打包的 css,js 等静态资源的话就直接返回给浏览器。如果是 vue-cli 打包的 css,js 等静态资源的话就直接返回给浏览器，如果是前端 ajax 访问 [https://api.laoergege.cn/](https://api.laoergege.cn/) 的发来的 http 请求就会把该请求反向代理到 node 的服务上。node 接收到 nginx 反向代理过来的请求就会进行相应的 api 匹配然后去查询数据库处理相关的逻辑，然后返回给 nginx 再由 nginx 返回给浏览器，大致的过程就是如此。本博客配置了 https ， https 监听的是443端口，但是我们用户输入时一般不是输入协议名称 https:xxx 这样来访问，这样的话默认访问的就是80端口了，所以 nginx 这里要把浏览器过来的 http:xxx80 端口全部重定向到 https:xxx 的443端口。下面是我 nginx 的部分配置

```
server{
    listen80;
    server_name admin.laoergege.cn;
    #charset koi8-r;
    #access_log logs/host.access.log main;
    #永久重定向到 https 站点
    return301 https: //$host$request_uri;
}

server{
    listen80;
    server_name blog.laoergege.cn;
    #charset koi8-r;
    #access_log logs/host.access.log main;
    return301 https: //$host$request_uri;
}

server{
    listen80;
    server_name api.laoergege.cn;
    #charset koi8-r;
    #access_log logs/host.access.log main;
    return301 https: //$host$request_uri;
}
```

```
server{
    listen443 ssl;
    server_name  blog.laoergege.cn;

    ssl_certificate      ../sslkey/1_blog.laoergege.cn_bundle.crt;
    ssl_certificate_key  ../sslkey/2_blog.laoergege.cn.key;

    ssl_session_cache    shared:SSL: 1m;
    ssl_session_timeout5m;

    ssl_ciphers  HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers  on;

    location /{
        root html/blog;
    index index.html index.htm;
    }
}

server{
    listen443 ssl;
    server_name  admin.laoergege.cn;

    ssl_certificate      ../sslkey/1_admin.laoergege.cn_bundle.crt;
    ssl_certificate_key  ../sslkey/2_admin.laoergege.cn.key;

    ssl_session_cache    shared:SSL: 1m;
    ssl_session_timeout5m;

    ssl_ciphers  HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers  on;

    location /{
        root html/blogAdmin;
    index index.html index.htm;
    }
}

server{
    listen443 ssl;
    server_name  api.laoergege.cn;

    ssl_certificate      ../sslkey/1_api.laoergege.cn_bundle.crt;
    ssl_certificate_key  ../sslkey/2_api.laoergege.cn.key;

    ssl_session_cache    shared:SSL: 1m;
    ssl_session_timeout5m;

    ssl_ciphers  HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers  on;

    location /{
        
        proxy_pass http: //127.0.0.1:3000;
        index index.html index.htm;
    }
}
```

## 问题与难点
### 跨域
总的来说此次项目就包括三个域名，访问 [https://api.laoergege.cn/](https://api.laoergege.cn/) 获取数据时就会遇到跨域问题。

```
No 'Access-Control-Allow-Origin' header is present on the requested resource.
```
本次项目采用了 CORS 跨域解决方案，再服务端代码配置如下:

```
router.all('*', (req, res, next) => {

    // Set Header
    const allowedOrigins = config.ORIGINS;
    const origin = req.headers.origin || '';
    if (allowedOrigins.indexOf(origin) != -1 || origin.indexOf('localhost') != -1) {
        res.setHeader('Access-Control-Allow-Origin', origin);
    };
    res.header("Access-Control-Allow-Headers", "authorization, Origin, No-Cache, X-Requested-With, If-Modified-Since, Pragma, Last-Modified, Cache-Control, Expires, Content-Type, X-E4M-With");
    res.header("Access-Control-Allow-Methods", "PUT,PATCH,POST,GET,DELETE,OPTIONS");
    res.header("Content-Type", "application/json;charset=utf-8");
    res.header("X-Powered-By", 'Nodepress 1.0.0');

    // OPTIONS
    if (req.method == 'OPTIONS') {
        res.sendStatus(200);
        res.end();
    }else{
        next('route');
    }
});
```

### Session or JWT
本次项目的用户认证机制采用 JWT 机制，而不是传统的 session 回话机制。使用 [jsonwebtoken](https://github.com/auth0/node-jsonwebtoken) 库，JWT 大体流程如下:
1. 用户通过Web表单将自己的用户名和密码发送到服务器的接口
2. 服务端核对用户名和密码
3. 核对用户名和密码成功后，应用将用户的id作为JWT Payload的一个属性，将其与头部分别进行Base64编码拼接后签名，形成一个JWT。这里的JWT就是一个形同lll.zzz.xxx的字符串。
4. 把 JWT 发送给客户端，保存在 localstorage 中。
5. 客户端每次访问服务器， 把 JWT 保存在 Authorization 请求头中
6. 服务端检查签名是否正确；检查Token是否过期。

关于为什么选择 JWT ，JWT 有什么优点？主要如下:
- 便于传输，jwt的构成非常简单，字节占用很小，所以它是非常便于传输的。
- 它不需要在服务端保存会话信息, 所以它易于应用的扩展

## 现状与目标
目前该博客项目只是完成了后台文章的管理和前台博文的展示阅读基本要求。
目前最大的缺陷问题是，比如我想把这篇《博客项目总结》地址
[https://blog.laoergege.cn/#/其他/0daae177cdccf77ab5aacf976f7a0da0](https://blog.laoergege.cn/#/其他/0daae177cdccf77ab5aacf976f7a0da0) 分享发送给其他人，别人直接访问是会报错的，因为这还是单页面应用，文章页面所依赖应用的数据是在主页初始化时才获取，所有不通过主页后访问文章就会造成该问题，该问题解决可以在文章组件初始化时根据 url 上的数据直接访问服务器获取数据。但本人打算采用直接后台渲染完成，所以
接下来目标是
> 完成博客的 SSR（后台渲染）。
