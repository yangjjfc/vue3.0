import Cookies from 'js-cookie';
import Http from '@/utils/axios';
const app = {
    state: {
        sidebar: {
            opened: !+Cookies.get('sidebarStatus'),
            withoutAnimation: false
        },
        device: 'desktop',
        language: Cookies.get('language') || 'en',
        sysTitle: '' // 系统标题
    },
    mutations: {
        TOGGLE_SIDEBAR: state => {
            if (state.sidebar.opened) {
                Cookies.set('sidebarStatus', 1);
            } else {
                Cookies.set('sidebarStatus', 0);
            }
            state.sidebar.opened = !state.sidebar.opened;
            state.sidebar.withoutAnimation = false;
        },
        CLOSE_SIDEBAR: (state, withoutAnimation) => {
            Cookies.set('sidebarStatus', 1);
            state.sidebar.opened = false;
            state.sidebar.withoutAnimation = withoutAnimation;
        },
        TOGGLE_DEVICE: (state, device) => {
            state.device = device;
        },
        SET_LANGUAGE: (state, language) => {
            state.language = language;
            Cookies.set('language', language);
        },
        SET_TITLE: (state, title) => {
            state.sysTitle = title;
        }
    },
    actions: {
        toggleSideBar ({ commit }) {
            commit('TOGGLE_SIDEBAR');
        },
        closeSideBar ({ commit }, { withoutAnimation }) {
            commit('CLOSE_SIDEBAR', withoutAnimation);
        },
        toggleDevice ({ commit }, device) {
            commit('TOGGLE_DEVICE', device);
        },
        setLanguage ({ commit }, language) {
            commit('SET_LANGUAGE', language);
        },
        changeSystemTitle ({ commit }, title) {
            commit('SET_TITLE', title);
        },
        // 获取系统名称
        getSystemTitle ({ state, commit }, title) {
            return new Promise((resolve, reject) => {
                state.sysTitle ? resolve(state.sysTitle) 
                    : Http('/media/cfg/sysTitleGet').then(res => {
                        commit('SET_TITLE', res.msg);
                        resolve(res.msg);
                    });
            });
        }
    }
};

export default app;
