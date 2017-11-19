var _ = {};

_.setAttr = function setAttr (node, key, value) {
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

_.type = function (obj){
    return /\[object\s+(\w+)\]/.exec(Object.prototype.toString.call(obj))[1];
}

_.isString = function (obj){
    return this.type(obj) === "String";
}

export {_};