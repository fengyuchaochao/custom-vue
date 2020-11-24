/**
 *
 * 1. 通过属性保存选项的数据
   2. 调用data中的成员将其转换成getter/setter，并且注入到vue实例中
   3. 调用observer对象，监听数据的变化
   4. 调用compiler对象，解析指令和差值表达式
 * */
class Vue {
    constructor (options) {
        //1. 通过属性保存选项的数据
        this.$options = options || {};
        this.$data = options.data || {};
        this.$el = typeof options.el === 'string' ? document.querySelector(options.el) : options.el;

        //2. 调用data中的成员将其转换成getter/setter，并且注入到vue实例中
        this._proxyData(this.$data);

        //3. 调用observer对象，监听数据的变化
        new Observer(this.$data);

        //4. 调用compiler对象，解析指令和差值表达式
        new Compiler(this);
    }
    _proxyData (data) {
        //遍历data中的属性，并且转换成getter/setter，将其注入vue实例中
        Object.keys(data).forEach(key => {
            Object.defineProperty(this, key, {
                enumerable: true,
                configurable: true,
                get () {
                    return data[key];
                },
                set (newVal) {
                    if (newVal === data[key]) {
                        return;
                    }
                    data[key] = newVal;
                }
            })
        })
    }
}
