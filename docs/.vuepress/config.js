
module.exports = {
    title: '博客',
    description: '学习笔记',
    serviceWorker: true, // 是否开启 PWA
    base: '/', // 这是部署到github相关的配置
    markdown: {
        lineNumbers: true // 代码块显示行号
    },
    themeConfig: {
        lastUpdated: '更新时间', // string | boolean
        nav: [
            { text: '主页', link: '/' },
            { text: 'Github', link: 'https://github.com/xuefei0353' }
        ],
        sidebar: {
            '/note/': [
                {
                    title: 'HTTP',
                    children: getRoute('HTTP', [
                        'HTTP简介',
                        'HTTP缓存',
                        'HTTPS'
                    ])
                },
                {
                    title: '性能优化',
                    children: getRoute('性能优化', [
                        '性能分析',
                    ])
                },
                {
                    title: 'webpack',
                    children: getRoute('webpack', [
                        'webpack使用',
                        '打包优化',
                    ])
                },
                {
                    title: 'javascript',
                    children: getRoute('javascript', [
                        // '函数式编程',
                        '对象',
                        '原型',
                        '闭包',
                        'EventLoop',
                        '变量提升',
                        '严格模式',
                        '箭头函数',
                        'this',
                        '知识点',
                        // '手写js',
                        'JavaScript modules 模块'
                    ])
                },
                {
                    title: 'TypeScript',
                    children: getRoute('TypeScript', [
                        '基础',
                    ])
                },
                {
                    title: '前端框架',
                    children: getRoute('前端框架', [
                        'vue源码解析',
                    ])
                },
                {
                    title: '实战',
                    children: getRoute('实战', [
                        'vue3',
                        // 'react'
                    ])
                },
            ],

        },
        sidebarDepth: 2, // 侧边栏显示2级
    },
    plugins: [
        ['image']
    ]
};
function getRoute(prefix, arr) {
    return arr.map(item => prefix + '/' + item);
}
