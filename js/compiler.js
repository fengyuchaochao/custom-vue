/**
 * Compiler类的主要作用就是：解析html，
 *
 * 因为html中可能包含 差值表达式，指令等自定义语法，需要我们手动去解析这些语法，然后替换成真实的数据。
 *
 * */
class Compiler {
    constructor (vm) {
        this.el = vm.$el;
        this.vm = vm;

        this.compile(this.el);
    }

    //编译模版，处理我们的文本节点和元素节点
    compile (el) {
        let childNodes = el.childNodes;
        Array.from(childNodes).forEach(node => {
            if (this.isTextNode(node)) {
                this.compileText(node);
            } else if (this.isElementNode(node)) {
                this.compileElement(node);
            }
            //判断node是否有子节点，如果有，则需要递归调用compile
            if (node.childNodes && node.childNodes.length) {
                this.compile(node);
            }
        })
    }

    //编译元素节点，处理指令
    compileElement (node) {
        Array.from(node.attributes).forEach(attr => {
            let attrName = attr.name;
            if (this.isDirective(attrName)) {
                attrName = attrName.substr(2);
                let key = attr.value;
                this.update(node, key, attrName);
            }
        })
    }
    //统一处理指令的方法
    update (node, key, attrName) {
        let updateFn = this[`${attrName}Updater`];
        updateFn && updateFn.call(this, node, key, this.vm[key]);
    }
    //处理v-text指令
    textUpdater (node, key, value) {
        node.textContent = value;

        //创建watcher实例，当数据改变时更新视图
        new Watcher(this.vm, key, (newVal) => {
            node.textContent = newVal;
        })
    }
    //处理v-model指令
    modelUpdater (node, key, value) {
        node.value = value;
        //实现双向绑定
        node.addEventListener('input', () => {
            this.vm[key] = node.value;
        });

        //创建watcher实例，当数据改变时更新视图
        new Watcher(this.vm, key, (newVal) => {
            node.value = newVal;
        })
    }
    //处理文本节点，处理差值表达式
    compileText (node) {
        let reg = /\{\{(.+?)\}\}/g;
        let value = node.textContent;
        if (reg.test(value)) {
            let key = RegExp.$1.trim();
            // node.textContent = value.replace(reg, this.vm[key]);
            node.textContent = this.vm[key];

            //创建watcher实例，当数据改变时更新视图
            new Watcher(this.vm, key, (newVal) => {
                node.textContent = newVal;
            })
        }
    }
    // 判断元素属性是否是指令
    isDirective (attrName) {
        return attrName.startsWith('v-');
    }
    //判断节点是否是文本节点
    isTextNode (node) {
        return node.nodeType === 3;
    }
    //判断节点是否是元素节点
    isElementNode (node) {
        return node.nodeType === 1;
    }
}

