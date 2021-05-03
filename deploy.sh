#!/usr/bin/env sh

# 确保脚本抛出遇到的错误
set -e

# 生成静态文件
npm run docs:build

# 进入生成的文件夹
git checkout gh-pages
git status
git add -A
git commit -m 'deploy'
git push