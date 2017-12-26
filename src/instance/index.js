import compile from "../parser/index";
import {el} from "../vdom/element";
import differ from "../vdom/differ";
import patch from "../vdom/patch";
import {
    observe,
    proxy
} from "../observer/index";

/**
 * vue实例
 * @param opt
 * @constructor
 */
function Vue(opt) {
    this.$opt = opt;
    this._initData(this.$opt.data);
    this._data = opt.data;
    observe(this._data, this);
    this.$mount();
}

Vue.prototype._c = el;
Vue.prototype._s = function (a) {
    return a;
};
Vue.prototype._initData = function (data) {
    const vm = this
    for (let key in data) {
        proxy(this, "_data", key);
    }
}
Vue.prototype._render = function () {
    var f = compile(this.$opt.template);
    return f.render.call(this);
}
Vue.prototype._update = function () {
    const vm = this
    const prevVnode = vm._vnode
    // 调用 render 函数得到 VNode 树
    const vnode = vm._render();
    // _vnode 为上一次的 VNode 树
    vm._vnode = vnode
    if (prevVnode) {
        // patch前后两个VNode，渲染到 Dom 树
        patch(document.getElementById("ttt"), differ(prevVnode, vnode));
    }
    else {
        document.getElementById("vm").appendChild(vnode.render())
    }
}

Vue.prototype.setData = function (data) {
    this._initData(data)
    this._update();
}

Vue.prototype.$mount = function (el) {
    const vm = this
    this._update()
}
export default Vue;