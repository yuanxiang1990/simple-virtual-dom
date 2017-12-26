import {_} from "../common/util";

/**
 *数据响应式
 */
export function observe(val, vm) {
    if (!_.isObject(val)) {
        return;
    }
    Object.keys(val).forEach(function (curVal, index) {
        defineReactive(val, curVal, val[curVal], vm)
    })

}

export function defineReactive(obj, key, val, vm) {
    observe(val, vm);
    Object.defineProperty(obj, key, {
        enumerable: true,
        configurable: true,
        get: function reactiveGetter() {
            return val
        },
        set: function reactiveSetter(newVal) {
            const value = val
            console.log(val)
            if (newVal === value) {
                return
            }

            val = newVal
            observe(newVal, vm)

            // 当发生写操作的时候 要更新视图
            vm && vm._update();
        }
    })
}

/**
 * 将vm上的属性挂载到_data上
 * @param obj
 * @param vm
 */
export function proxy(target, sourceKey, key) {
    Object.defineProperty(target, key, {
        enumerable: true,
        configurable: true,
        get: function () {

            return this[sourceKey][key];
        },
        set: function (newVal) {
            console.log(newVal)
            this[sourceKey][key] = newVal;
        }
    });
}
