import compile from "../parser/index";
import {el} from "../vdom/element";
import differ from "../vdom/differ";
import patch from "../vdom/patch";
/**
 * vue实例
 * @param opt
 * @constructor
 */
function Vue(opt) {
    this._initData(opt.data);
    this.opt = opt;
    this.$mount();
}
Vue.prototype._c = el;
Vue.prototype._s = function (a) {
    return a;
};
Vue.prototype._initData = function (data) {
    const vm = this
    for (let key in data) {
        vm[key] = data[key]
    }
}
Vue.prototype._render = function () {
    var f = compile(this.opt.template);
    return f.render.call(this);
}
Vue.prototype._update = function () {
    const vm = this

    // 调用 render 函数得到 VNode 树
    const vnode = vm._render()
    const prevVnode = vm._vnode
    // _vnode 为上一次的 VNode 树
    vm._vnode = vnode
    if(prevVnode) {
        // patch前后两个VNode，渲染到 Dom 树
        patch(document.body, differ(prevVnode, vnode));
    }
    else{
        document.body.appendChild(vnode.render())
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