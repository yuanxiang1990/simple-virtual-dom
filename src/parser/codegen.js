import {el} from "../vdom/element"

export function gen(ast) {
    return createElement(ast);
}

function createElement(obj) {
    if (obj.type == 3) {//文本节点
        return obj.text;
    }
    else if (obj.type == 1) {
        return el(obj.tag, obj.attrs, createChild(obj.children))
    }
}

function createChild(children) {
    var child = [];
    children.forEach(function (val, i) {
        child.push(createElement(val));
    });
    return child;
}