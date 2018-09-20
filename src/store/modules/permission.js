import { asyncRouterMap, constantRouterMap } from '@/router';

/**
 * 通过meta.role判断是否与当前用户权限匹配
 * @param roles
 * @param route
 */
const hasPermission = (roles, route) => {
    if (route.meta && route.meta.roles) {
        return roles.some(role => route.meta.roles.indexOf(role) >= 0);
    } else {
        return true;
    }
};

/**
 * 递归过滤异步路由表，返回符合用户角色权限的路由表
 * @param asyncRouterMap
 * @param roles
 */
const filterAsyncRouter = (asyncRouterMap, roles) => {
    const accessedRouters = asyncRouterMap.filter(route => {
        if (hasPermission(roles, route)) {
            if (route.children && route.children.length) {
                route.children = filterAsyncRouter(route.children, roles);
            }
            return true;
        }
        return false;
    });
    return accessedRouters;
};

const permission = {
    state: {
        routers: constantRouterMap,
        addRouters: []
    },
    mutations: {
        SET_ROUTERS: (state, routers) => {
            state.addRouters = routers;
            state.routers = constantRouterMap.concat(routers);
        }
    },
    actions: {
        GenerateRoutes ({ commit }, roles) {
            return new Promise(resolve => {
                let accessedRouters;
                if (roles.indexOf('admin') >= 0) {
                    accessedRouters = asyncRouterMap;
                } else {
                    accessedRouters = filterAsyncRouter(asyncRouterMap, roles);
                }
                commit('SET_ROUTERS', accessedRouters);
                resolve(accessedRouters);
            });
        }
    }
};

export default permission;
