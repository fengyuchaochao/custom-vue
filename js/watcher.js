/**
 * Watcher类主要要实现两个功能：
 * 1. Watcher实例化的时候，要将当前实例添加到Dep类的subs中。
 * 2. 当数据发生变化时，要通知所有的watcher实例，执行相应的操作。
 * */

class Watcher {
    constructor (vm, key, cb) {
        this.vm = vm;
        this.key = key;
        this.cb = cb;
        //当Watcher初始化时，需要将当前Watcher实例记录到Dep类的静态属性target当中，
        Dep.target = this;
        //同时，触发get方法，在get方法中执行addSub, 从而将当前Watcher实例添加到Dep类的subs中。
        this.oldVal = vm[key];
        Dep.target = null; //添加到Dep中subs之后，要置为空
    }
    update () {
        let newVal = this.vm[this.key];
        if (newVal === this.oldVal) return;
        this.cb(newVal);
    }

}
