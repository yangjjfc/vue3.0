import router from './router';
import store from './store';
import NProgress from 'nprogress'; // progress bar
import 'nprogress/nprogress.css';// progress bar style

NProgress.configure({ showSpinner: false });// NProgress Configuration

// permission judge function
const hasPermission = (roles, permissionRoles) => {
    if (roles.indexOf('admin') >= 0) return true; // admin permission passed directly
    if (!permissionRoles) return true;
    return roles.some(role => permissionRoles.indexOf(role) >= 0);
};

router.beforeEach((to, from, next) => {
    NProgress.start(); // start progress bar
    if (to.path === '/login') {
        next();
        NProgress.done(); // if current page is dashboard will not trigger	afterEach hook, so manually handle it
    } else {
        if (store.getters.addRouters && store.getters.addRouters.length) {
            next();
        } else {
            store.dispatch('currentUser').then(() => {
                // 没有登陆 跳到登陆页 what
                if (!store.getters.userNo) {
                    next('/login');
                    return; 
                }
                store.dispatch('GenerateRoutes', store.getters.roles).then((res) => { 
                    if (res.length) {
                        router.addRoutes(res);
                        store.dispatch('getSystemTitle').then(() => {
                            next({ ...to });
                        });
                    } else {
                        next('/login');
                    }
                });
            });
        }
        // if (store.getters.roles.length === 0) { // 判断当前用户是否已拉取完user_info信息
        //     store.dispatch('GetUserInfo').then(res => { // 拉取user_info
        //         const roles = res.data.roles; // note: roles must be a array! such as: ['editor','develop']
        //         store.dispatch('GenerateRoutes', { roles }).then(() => { // 根据roles权限生成可访问的路由表
        //             router.addRoutes(store.getters.addRouters); // 动态添加可访问路由表
        //             next({ ...to, replace: true }); // hack方法 确保addRoutes已完成 ,set the replace: true so the navigation will not leave a history record
        //         });
        //     }).catch((err) => {
        //         store.dispatch('FedLogOut').then(() => {
        //             Message.error(err || 'Verification failed, please login again');
        //             next({ path: '/' });
        //         });
        //     });
        // } else {
        //     // 没有动态改变权限的需求可直接next() 删除下方权限判断 ↓
        //     if (hasPermission(store.getters.roles, to.meta.roles)) {
        //         next();//
        //     } else {
        //         next({path: '/401', replace: true, query: { noGoBack: true }});
        //     }
        //     // 可删 ↑
        // }
    }
});

router.afterEach(() => {
    NProgress.done(); // finish progress bar
});
