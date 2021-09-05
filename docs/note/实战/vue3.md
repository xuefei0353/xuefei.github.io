# Vue3+TS+Vite

## 初始化一个项目
```sh
npm init @vitejs/app
```
参考[vitejs](https://vitejs.cn)
## 配置vite.config.ts
- `@types/node` nodejs类型定义
```sh
npm i @types/node -D
```
- resolve.alias 路径别名
- server.proxy 代理
## 代码规范
### 代码格式化 [prettier](https://prettier.io/docs/en/index.html)   
1. 安装npm包
```sh
npm i prettier -D
```  
2. 在项目根目录新建配置文件，`prettier.config.js`，配置内容如下：
```js
module.exports = {
  trailingComma: 'es5', //在逗号分隔的多行语法结构中，尽可能输出尾随的逗号
  tabWidth: 2, //指定每个缩进级别的空格数
  semi: true, //是否要分号
  singleQuote: true, //是否用单引号
  printWidth: 100, //单行字符长度大于多少时换行
};
```
3. 新建`.prettierignore`文件，用于设置不需要格式化的文件。
4. 编辑器下载对应的prettier插件，以vscode为例，下载完插件后，可以设置保存文件时，自动格式化代码。
vscode的prettier插件是自动读取项目下`.prettierrc`配置文件的，如果想读取`prettier.config.js`，需要修改插件配置，如下图。同时，设置文件保存时自动格式化。
![](/img/prettierConfigPath.png "")
![](/img/autoFormat.png "")

### 检验代码格式，统一代码风格，避免一些代码错误 
[eslint.vuejs.org](https://eslint.vuejs.org/user-guide/#installation)
[eslint.org](https://eslint.org/)
[自定义eslint插件](https://www.npmjs.com/package/generator-eslint)
1. 安装npm包
```sh
npm i eslint eslint-plugin-vue -D
```
2. 通过eslint脚手架生成eslint配置文件
```sh
npx eslint --init
```
选项如下：
![](/img/eslint.png "")
安装完之后根目录多了`.eslintrc.js`，将extends中的vue插件改为vue3的
```js
module.exports = {
  extends: [
    // 'plugin:vue/essential',//vue2
    'plugin:vue/vue3-recommended',//vue3
    'airbnb-base',
  ],
};
```
编辑器启用eslint插件，就可以生效了。

3. 新建`.eslintignore`文件，设置不需要检验的文件。
4. 处理prettier和eslint之间的关系，保持一致性 
```sh
npm i eslint-config-prettier eslint-plugin-prettier -D
```
修改`.eslintrc.js`，extends中添加配置如下：
```js
extends: [
  'plugin:prettier/recommended'
]
```

### git commit 时检测代码
[husky](https://typicode.github.io/husky/#/)  
你可以使用它来检测提交消息、运行测试、检测代码等等。Husky支持所有Git钩子。
```sh
git init
npx husky-init && npm install
```
执行完命令后，项目根目录下多了`.husky`文件夹，打开`pre-commit`，删除`npm test`,添加命令`npx lint-staged`。
下一步，在`package.json`里面添加配置如下：
```json
"lint-staged":{
    "*.{js,ts,vue}":"eslint --fix"
}
```
[lint-staged](https://github.com/okonet/lint-staged)  一个对暂存的git文件运行lint的工具
是什么？该项目包含一个脚本，该脚本将运行任意shell任务，参数是由指定的glob模式筛选的暂存文件列表。  
为什么使用？因为在提交代码之前运行代码检验更有意义。这样做，可以确保没有错误进入代码仓库，并且强制统一代码风格。但是在整个项目上运行各种代码检测是比较慢的。因此，我们只需要检查将要提交的文件。

最后，执行以下命令，测试配置是否生效。
```sh
git add .
git commit -m "feat: init project"
```
[commitlint](https://github.com/conventional-changelog/commitlint)  检测git提交信息  
安装`.husky/commit-msg`并在根目录添加配置文件`commitlint.config.js`
```sh
# Install commitlint cli and conventional config
npm install --save-dev @commitlint/{config-conventional,cli}
# Configure commitlint to use conventional config
echo "module.exports = {extends: ['@commitlint/config-conventional']}" > commitlint.config.js
```
在`.husky/commit-msg`文件中添加校验git提交信息的命令行
```sh
# Add hook
npx husky add .husky/commit-msg 'npx --no-install commitlint --edit "$1"'
```
然后，执行以下命令，测试配置是否生效。
```sh
git add .
git commit -m "add comment section"
```
结果显示不通过，改为如下符合规范的提交信息即可。
```sh
git commit -m "feat(blog): add comment section"
```
注意冒号后面必须有一个空格。
## 安装组件库
[ant-design-vue](https://www.antdv.com/docs/vue/introduce-cn/)开发和服务于企业级后台产品
```sh
#默认是vue2的，这里要安装vue3的，需要加上版本号@2
npm install ant-design-vue@2 --save
```

