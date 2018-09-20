// vue.config.js
const path = require('path');
/* eslint-disable */
function resolve (dir) {
    return path.join(__dirname, dir);
}
/* eslint-elable */
module.exports = {
    chainWebpack: config => {
        config.resolve.alias
            .set('~', resolve('src/utils/custom'))
            .set('static$', resolve('static'));
    },
    css: {
        // modules: true,
        loaderOptions: {
            // 给 sass-loader 传递选项
            sass: {
                // @/ 是 src/ 的别名
                // 所以这里假设你有 `src/variables.scss` 这个文件
                data: '@import "@/styles/base.scss";'
            }
        }
    },
    // 是否使用eslint
    lintOnSave: process.env.NODE_ENV !== 'production',
    productionSourceMap: false,
    devServer: {
        overlay: {
            // warnings: true,
            errors: true
        },
        port: 8085, // 端口号
        host: 'localhost',
        https: false, // https:{type:Boolean}
        open: true, // 配置自动启动浏览器
        proxy: {
            '/yjgb': {
                target: 'http://yjgb.poopp.cn',
                ws: true,
                changeOrigin: true
            }
        }  
    }
};