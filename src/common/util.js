var _ = {};
import {Element} from "../vdom/element";
_.setAttr = function setAttr(node, key, value) {
    switch (key) {
        case 'style':
            node.style.cssText = value
            break
        case 'value':
            var tagName = node.tagName || ''
            tagName = tagName.toLowerCase()
            if (
                tagName === 'input' || tagName === 'textarea'
            ) {
                node.value = value
            } else {
                // if it is not an input or textarea, use `setAttribute` to set
                node.setAttribute(key, value)
            }
            break
        default:
            node.setAttribute(key, value)
            break
    }
}

_.type = function (obj) {
    return /\[object\s+(\w+)\]/.exec(Object.prototype.toString.call(obj))[1];
}

_.isString = function (obj) {
    return this.type(obj) === "String";
}

_.isObject = function (obj) {
    return this.type(obj) === "Object";
}

_.isEmptyObject = function (obj) {
    var name;
    for (name in obj) {
        return false;
    }
    return true;
}
_.clone = function (obj) {
    var copy;
    if(obj instanceof Array){
        copy = [];
    }
    else if(obj instanceof Element){
        copy = new Element();
    }
    else{
        copy = {};
    }

    for (var key in obj) {
        if (obj.hasOwnProperty(key)) {
            if (typeof obj[key] == "object") {
                copy[key] = _.clone(obj[key]);
            }
            else {
                copy[key] = obj[key];
            }
        }
    }
    return copy;
}

function noop () {};

export {_,noop};