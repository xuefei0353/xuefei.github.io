
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
                    title: 'javascript',
                    children: getRoute('javascript', [
                        '对象',
                        '原型',
                        '闭包',
                        'EventLoop',
                        '变量提升',
                        '严格模式',
                        '箭头函数',
                        'this',
                    ])
                },
                {
                    title: 'TypeScript',
                    children: getRoute('TypeScript', [
                        '基础',
                    ])
                },
            ],

        },
        sidebarDepth: 2, // 侧边栏显示2级
    }
};
function getRoute(prefix, arr) {
    return arr.map(item => prefix + '/' + item);
}
