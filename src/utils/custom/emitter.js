/*eslint-disable */
function broadcast(componentName, eventName, params) {
    this.$children.forEach(child => {
        var name = child.$options.componentName;

        if (name === componentName) {
            child.$emit.apply(child, [eventName].concat(params));
        } else {
            broadcast.apply(child, [componentName, eventName].concat([params]));
        }
    });
}
/* eslint-enable */
const now = () => new Date().getTime();

export default { 
    methods: {
        dispatch (componentName, eventName, params) {
            let parent = this.$parent || this.$root;
            let name = parent.$options.componentName;

            while (parent && (!name || name !== componentName)) {
                parent = parent.$parent;

                if (parent) {
                    name = parent.$options.componentName;
                }
            }
            if (parent) {
                parent.$emit.apply(parent, [eventName].concat(params));
            }
        },
        broadcast (componentName, eventName, params) {
            broadcast.call(this, componentName, eventName, params);
        },
        // 异步验证混入函数
        /*
         * beforeValid 非必填 返回true 表示直接通过验证
         * params 非必填 默认传参source对象 如果传入，就用 params 函数返回的 参数。
         */
        formValid (rule, value, callback, source) {
            if (typeof rule.beforeValid === 'function' && rule.beforeValid.call(this)) {
                callback();
                return;
            }
            if (this._currentValue === value) {
                callback(this._errorMsg);
                return;
            }
            let params = Object.assign({}, source);
            if (typeof rule.params === 'function') {
                params = rule.params.call(this);
            }
            if (rule.url) {
                this.validating = this.Http(rule.url, params).then(result => {
                    if (result.data) {
                        delete this._errorMsg;
                        callback();
                        if (rule.callback) {
                            rule.callback.call(this);
                        }
                    } else {
                        this._errorMsg = result.message || rule.message;
                        callback(this._errorMsg);
                        if (rule.callback) {
                            rule.callback.call(this);
                        }
                    }
                }).catch(errors => {
                    this._errorMsg = errors.message || rule.message;
                    callback(this._errorMsg);
                    if (rule.errorCallback) {
                        rule.errorCallback.call(this);
                    }
                }).finally(() => {
                    this.validating = false;
                    this._currentValue = value;
                });
            } else {
                this._errorMsg = '异步验证缺少参数:[url]';
                this.$message(this._errorMsg);
                callback(this._errorMsg);
            }
        },
        // 去抖
        _debounce (func, wait, immediate) {
            // immediate默认为false
            var timeout, args, context, timestamp, result;

            let later = function () {
                // 当wait指定的时间间隔期间多次调用 debounce返回的函数，则会不断更新timestamp的值，导致last < wait && last >= 0一直为true，从而不断启动新的计时器延时执行func
                var last = now() - timestamp;

                if (last < wait && last >= 0) {
                    timeout = setTimeout(later, wait - last);
                } else {
                    timeout = null;
                    if (!immediate) {
                        result = func.apply(context, args);
                        if (!timeout) context = args = null;
                    }
                }
            };

            return function () {
                context = this;
                args = arguments;
                timestamp = now();
                // 第一次调用该方法时，且immediate为true，则调用func函数
                var callNow = immediate && !timeout;
                // 在wait指定的时间间隔内首次调用该方法，则启动计时器定时调用func函数
                if (!timeout) timeout = setTimeout(later, wait);
                if (callNow) {
                    result = func.apply(context, args);
                    context = args = null;
                }

                return result;
            };
        },
        // 节流
        _throttle (func, wait, options) {
            /* options的默认值
             *  表示首次调用返回值方法时，会马上调用func；否则仅会记录当前时刻，当第二次调用的时间间隔超过wait时，才调用func。
             *  options.leading = true;
             * 表示当调用方法时，未到达wait指定的时间间隔，则启动计时器延迟调用func函数，若后续在既未达到wait指定的时间间隔和func函数又未被调用的情况下调用返回值方法，则被调用请求将被丢弃。
             *  options.trailing = true;
             * 注意：当options.trailing = false时，效果与上面的简单实现效果相同
             */
            let context, args, result;
            let timeout = null;
            let previous = 0;
            if (!options) options = {};
            let later = function () {
                previous = options.leading === false ? 0 : now();
                timeout = null;
                result = func.apply(context, args);
                if (!timeout) context = args = null;
            };
            return function () {
                let now = now();
                if (!previous && options.leading === false) previous = now;
                // 计算剩余时间
                let remaining = wait - (now - previous);
                context = this;
                args = arguments;
                // 当到达wait指定的时间间隔，则调用func函数
                // 精彩之处：按理来说remaining <= 0已经足够证明已经到达wait的时间间隔，但这里还考虑到假如客户端修改了系统时间则马上执行func函数。
                if (remaining <= 0 || remaining > wait) {
                    // 由于setTimeout存在最小时间精度问题，因此会存在到达wait的时间间隔，但之前设置的setTimeout操作还没被执行，因此为保险起见，这里先清理setTimeout操作
                    if (timeout) {
                        clearTimeout(timeout);
                        timeout = null;
                    }
                    previous = now;
                    result = func.apply(context, args);
                    if (!timeout) context = args = null;
                } else if (!timeout && options.trailing !== false) {
                    // options.trailing=true时，延时执行func函数
                    timeout = setTimeout(later, remaining);
                }
                return result;
            };
        }
    }
};
