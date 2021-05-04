
module.exports = {
    title: '博客',
    description: '学习笔记',
    serviceWorker: true, // 是否开启 PWA
    base: '/', // 这是部署到github相关的配置
    markdown: {
        lineNumbers: true // 代码块显示行号
    },
    themeConfig: {
        nav: [
            { text: '主页', link: '/' },
            { text: 'Github', link: 'https://github.com/xuefei0353' }
        ],
        sidebar: {
            '/note/': [
                {
                    title: 'javascript',
                    children: getRoute('javascript', [
                        '闭包',
                        'EventLoop',
                        'js基础',
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
