import compile from "../parser/index";
import {el} from "../vdom/element";
import differ from "../vdom/differ";
import patch from "../vdom/patch";
import {
    observe,
    proxy
} from "../observer/index";
import {
    noop
} from "../common/util";
import {Watcher} from "../observer/watcher";
const sharedPropertyDefinition = {
    enumerable: true,
    configurable: true,
    get: noop,
    set: noop
}
/**
 * vue实例
 * @param opt
 * @constructor
 */
function Vue(opt) {
    this.$opt = opt;
    this._initData(this.$opt.data);
    this._data = opt.data;
    this._watchers = [];
    observe(this._data, this);
    if(opt.computed){
        initComputed(this,opt.computed);
    }
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
    const vnode = vm._render();
    let $ele = document.getElementById(vm.$opt.ele);
    let rootVNode = _wrapVNode($ele,vnode);
    vm._vnode = rootVNode;
    if (prevVnode) {
        // patch前后两个VNode，渲染到 Dom 树
        patch(document.getElementById(vm.$opt.ele), differ(prevVnode, rootVNode));
    }
    else {
        $ele.parentNode.replaceChild(rootVNode.render(),$ele);
    }
}

Vue.prototype.setData = function (data) {
    this._initData(data)
    this._update();
}

Vue.prototype.$mount = function (el) {
    const vm = this;
    this._update();
    vm._watcher = new Watcher(this,this._update,noop);//初始化默认watcher
}

/**
 * 计算所得的属性
 * @param vm
 * @param c
 */
function initComputed(vm,c) {
    Object.keys(c).forEach(function (curVal,i) {
        defineComputed(vm,curVal,c[curVal]);
    })
}

function defineComputed(target,key,userDef) {
    if(typeof userDef == "function"){
        sharedPropertyDefinition.get = function () {
            return userDef.call(target)
        };
        sharedPropertyDefinition.set = noop;
    }
    else{
        sharedPropertyDefinition.get = userDef.get ? userDef.get : noop
        sharedPropertyDefinition.set = userDef.set ? userDef.set : noop
    }
    Object.defineProperty(target,key,sharedPropertyDefinition);
}


/**
 * 包含虚拟dom
 */
function _wrapVNode($ele,vnode) {
    let attrs = $ele.attributes;
    let vNodeAttr = {};
    for(let i=0;i<attrs.length;i++){
        vNodeAttr[attrs[i].nodeName] = attrs[i].nodeValue;
    }
    let rootNode = el($ele.tagName,vNodeAttr,[vnode]);
    return rootNode;
}
export default Vue;