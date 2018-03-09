export class Watcher {
    constructor(vm, expOrFn, cb) {
        this.vm = vm;
        this.cb = cb;
        if (typeof expOrFn === 'function') {
            this.getter = expOrFn;
        } else {
            this.getter = this.parseGetter(expOrFn);
        }

        this.value = this.get();//保存watcher初始化时的原始值
    }

    /**
     * 更新
     */
    update() {
        this.run();
    }

    /**
     * 执行
     */
    run() {
        let value = this.get();
        let oldValue = this.value;
        if (value != oldValue) {
            this.value = value;
            this.cb.call(this.vm, oldValue, value);
        }
    }

    get() {
        //Dep.target = this;
        var value = this.getter.call(this.vm, this.vm);
        //Dep.target = null;
        return value;
    }

    parseGetter(expOrFn) {
        if (/[^\w.$]/.test(expOrFn)) {
            return
        }
        let exps = expOrFn.split(".");
        return function (obj) {
            for (let i = 0; i <= exps.length - 1; i++) {
                if (!obj) return;
                obj = obj[exps[i]];
            }
        }
    }

}