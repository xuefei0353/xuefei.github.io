
# react + css next + ts + webpack5

## webpack5配置
### 配置图片、字体的loader
（项目中图片格式推荐webp格式，因为体积更小）
```js
module.exports={
    module:{
        rules:[
            {
                test: /\.(png|jpeg|gif|eot|woff|woff2|ttf|svg|otf|webp)$/,
                type:"asset"//内置了file-loader、url-loader
            }
        ]
    }
}
```
### 使用 css next
解析css next需要安装
```sh
npm i postcss-loader postcss-preset-env -D
```