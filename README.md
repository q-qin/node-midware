


## 技术栈

nodejs + express + mongodb + mongoose + es6/7


## 项目运行

```
项目运行之前，请确保系统已经安装以下应用
1、node
2、mongodb
3、GraphicsMagick 
```

```

npm install

npm start

```


# 项目布局

```
.
├── InitData                        初始化数据
│   ├── cities.js                   城市列表
│   └── admin.js                    超级管理员 admin/234567
├── config                          运行配置
│   ├── default.js                  默认配置
│   └── development.js              开发环境
├── controller                      处理中心，负责路由及数据库的具体操作
├── logs                            日志文件
├── middlewares                     中间介
├── models                          模型(数据库)
├── mongodb                         连接数据库
├── prototype                       基础功能Class
├── routes                          路由配置
├── .babelrc 
├── .gitignore
├── app.js                          基础配置
├── index.js                        入口文件
├── package.json
├── README.md                  
.

```



