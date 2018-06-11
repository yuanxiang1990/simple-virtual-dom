import {pushTarget, popTarget} from './dep'

export class Watcher {
    constructor(vm, expOrFn, cb) {
        this.vm = vm;
        vm._watchers.push(this)
        this.cb = cb;
        if (typeof expOrFn === 'function') {
            this.getter = expOrFn;
        } else {
            this.getter = this.parseGetter(expOrFn);
        }
        this.active = true;
        // 在收集依赖的时候会使用 newDeps来收集。
        // 收集结束的时候会把newDeps覆盖到deps里
        this.deps = []              // WatcherM.deps = [DepA, DepB]
        this.newDeps = []
        this.depIds = new Set()     // 对应this.dep的所有id set，避免重复添加同个Dep
        this.newDepIds = new Set()
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
        if (this.active) {
            let value = this.get();
            let oldValue = this.value;
            if (value != oldValue) {
                this.value = value;
                this.cb.call(this.vm, oldValue, value);
            }
        }
    }

    get() {
        pushTarget(this);
        let value
        const vm = this.vm
        value = this.getter.call(vm, vm)

        //结束收集依赖
        popTarget()

        // 在收集依赖的时候会使用 newDeps来收集。
        // 收集结束的时候会把newDeps覆盖到deps里
        this.cleanupDeps()
        return value
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

    addDep(dep) {
        const id = dep.id
        if (!this.newDepIds.has(id)) {
            this.newDepIds.add(id)
            this.newDeps.push(dep) // WatcherM.deps.push(DepA) // WatcherM.deps = [DepA, DepB]
            if (!this.depIds.has(id)) {
                dep.addSub(this)  //  DepA.subs.push(WatcherM) // DepA.subs = [WatcherM, WatcherN, WatcherX]
            }
        }
    }

    /**
     * Clean up for dependency collection.
     */
    // 在收集依赖的时候会使用 newDeps来收集。
    // 收集结束的时候会把newDeps覆盖到deps里
    cleanupDeps() {
        let i = this.deps.length
        while (i--) { // 把旧依赖处理好
            const dep = this.deps[i]
            if (!this.newDepIds.has(dep.id)) {
                dep.removeSub(this)
            }
        }
        // 把新依赖 newDeps 更新到 deps
        // newDeps 更新成初始状态，方便下次收集依赖
        let tmp = this.depIds
        this.depIds = this.newDepIds
        this.newDepIds = tmp
        this.newDepIds.clear()
        tmp = this.deps
        this.deps = this.newDeps
        this.newDeps = tmp
        this.newDeps.length = 0
    }
}
