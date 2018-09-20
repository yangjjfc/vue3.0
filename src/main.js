import Vue from 'vue';
import 'normalize.css/normalize.css';

// import ElementUI from 'element-ui';
import Element from 'element-ui';
// import './element-variables.scss';
import 'element-ui/lib/theme-chalk/index.css';

// import '../static/offlineMap/map.js';
// import '../static/offlineMap/map_city.js';
import store from './store';
import axios from './utils/axios/';
import router from './router';
import App from './App';
import './utils/icons'; // icon
import './permission'; // permission control
import './errorLog';// error log
import MyDialog from '@/components/MyDialog'; // 弹框组件
import pagination from '@/components/Pagination'; // 分页组件
import myConfirm from '~/cus-$confirm';
// import './plugins/element.js';
import '@/styles/index.scss'; // global css
Vue.use(Element);
Vue.prototype.Http = axios; // 添加vue请求方法
Vue.prototype.$myConfirm = myConfirm(Vue.prototype); // 添加vue请求方法
Vue.config.productionTip = false;
Vue.component('pagination', pagination);
// 全局组件
Vue.component('MyDialog', MyDialog);

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app');
