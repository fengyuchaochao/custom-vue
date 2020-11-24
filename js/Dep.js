/**
 * Dep类的作用：
 * 主要就是负责收集依赖，这里的依赖其实就是收集watcher实例，并且存储到subs里，
 * 当数据发生变化时，执行notify方法去通知更新视图。
 *
 * */
class Dep {
    constructor () {
        this.subs = []; //存储所有的观察者
    }
    //添加观察者
    addSub (sub) {
        if (sub && sub.update) {
            this.subs.push(sub);
        }
    }
    //发送通知
    notify () {
        this.subs.forEach(sub => {
            sub.update();
        })
    }
}
