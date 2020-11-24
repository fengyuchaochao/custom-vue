/**
 * Observer类的主要功能如下：
 *  核心功能就是将data数据变成响应式数据，当然其中会有一些细节：
 *  1. 首先将vue对象初始化传入的对象 变成响应式对象
 *  2. 当手动给某个属性赋值了一个对象时，也需要将这个新对象变成响应式对象
 *  3. 当添加一个新的属性和属性值时，也需要将该数据变成响应式
 *
 * */

class Observer {
    constructor (data) {
        this.walk(data)
    }
    //遍历data所有属性，
    walk (data) {
        if (!data || typeof data !== 'object') {
            return;
        }
        Object.keys(data).forEach(key => {
           this.defineReactive(data, key, data[key]);
        });
    }
    //将data所有属性值变成响应式数据
    defineReactive (obj, key, val) {
        let that = this;
        let dep = new Dep(); //负责收集依赖，并且发送通知
        this.walk(val); //如果data的属性值也是对象，则需要再次遍历
        Object.defineProperty(obj, key, {
            enumerable: true,
            configurable: true,
            get () {
                Dep.target && dep.addSub(Dep.target); //收集依赖
                return val;
            },
            set (newVal) {
                if (newVal === val) return;
                val = newVal;
                that.walk(val); //当data的属性被赋值为一个对象时，需要我们手动将新赋值的对象变成响应式数据。
                dep.notify(); //发送通知
            }
        })
    }
}
