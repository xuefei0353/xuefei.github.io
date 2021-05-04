#!/usr/bin/env sh

# 确保脚本抛出遇到的错误
set -e
echo "params : $1"
# 生成静态文件
# npm run docs:build

# 进入生成的文件夹
# git checkout master
# git status
# git add -A
# git commit -m 'update'
# git push
cd docs/.vuepress/dist
git add -A
git commit -m 'update'
git push git@github.com:xuefei0353/xuefei0353.github.io.git gh-pages