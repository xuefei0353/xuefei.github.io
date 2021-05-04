#!/usr/bin/env sh

# 确保脚本抛出遇到的错误
set -e
# 生成静态文件
npm run docs:build
git add -A
git commit -m 'update'
git push