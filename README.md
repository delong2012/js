工作内容<br/>
项目：云平台管理系统<br/>
网站使用angularjs框架，同时使用jqueryjs,<br/>
1.关于路由，考虑到页面里的tab页面加载，angular本身不支持路由嵌套功能，所以使用angular插件angular-ui-router(https://github.com/angular-ui/ui-router),实现路由嵌套功能，同时在页面切换的时候添加一个loading效果，<br/>
2.关于按需加载，angularjs本身没有诸如AMD或者CMD的机制，所有依赖项必须提前加载，可是如果全部模块同时加载也不现实，所以每个页面的controller按需加载，同时directives,filters,service文件提前加载，使用grunt 合并压缩文件，angular,jquery,angular-ui使用http://www.staticfile.org/ 的 cdn 文件。<br/>
3.关于文件目录结构，将属于同一个模块的templete、js文件都放在同一个文件夹下。<br/>
表单验证，使用的validate.js(http://rickharrison.github.io/validate.js/)，添加鼠标离开及时验证功能，删掉不需要的验证规则。
验证码，使用google recaptcha (http://www.google.com/recaptcha)<br/>
自己写组件，dialog,calendar，textarea-customerscroll,pagination，<br/>
封装增删改查交互方法，组织数据请求到页面展示的流程。
