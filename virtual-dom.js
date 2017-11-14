var index = -1;
var patch = [];
var REPLACE = 0;
var REORDER = 1;
var PROPS = 2;
var TEXT = 3;

function type(obj) {
    return Object.prototype.toString.call(obj).match(/\[object\s*(\w+)\]/)[1];
}

function contains(a, obj) {
    var i = a.length;
    while (i--) {
        if (a[i] === obj) {
            return true;
        }
    }
    return false;
}

/**
 * virtualdom节点
 * @param tagName
 * @param props
 * @param children
 * @constructor
 */
function Element(tagName, props, children) {
    this.tagName = tagName;
    this.props = props || null;
    this.children = children || [];
    this.ele = this.render();

}

Element.prototype = {
    render: function () {

    }
}

function sameVnode(vnode1, vnode2) {
    return (
        vnode1 && vnode2 && vnode1.tagName === vnode2.tagName &&
        vnode1.props === vnode2.props
    )
}

/**
 * 新旧树节点比较
 * @param oldVnode
 * @param newVnode
 */
function differ(oldVnode, newVnode, patch) {
    index++;
    if (!sameVnode(oldVnode, newVnode)) {
        patch.push({
            type: REPLACE,
            node: newVnode,
            index: index
        });
    }

    else if (type(oldVnode) == "String" && type(newVnode) == "String") {
        if (oldVnode != newVnode) {
            patch.push({
                type: TEXT,
                node: newVnode,
                index: index
            });
        }
    }

    else {
        for (var i = 0; i < oldVnode.children.length; i++) {
            differ(oldVnode.children[i], newVnode.children[i], patch);
        }
    }
}


function differChildren(oldChildren, newChildren) {
    var newAdd = [], simulateArray = [];
    for (var i = 0; i < oldChildren.length; i++) {
        if (!contains(newChildren, oldChildren[i])) {
            oldChildren.splice(i, 1);
        }
    }
    for (var i = 0; i < newChildren.length; i++) {
        if (!contains(oldChildren, newChildren[i])) {
            newAdd.push(newChildren[i]);
        }
    }
    simulateArray = oldChildren.concat(newAdd);

    var i = 0, j = 0;//i:simulate indx j:new array index
    while (j < newChildren.length) {
        var newItem = newChildren[j];
        if (simulateArray[i] == newChildren[j]) {
            i++;
            j++;
            continue;
        }
        if (simulateArray[i]) {
            if (simulateArray[i + 1] == newItem) {
                simulateArray.splice(i, 1);
                i++;
                j++;
            }
            else {
                simulateArray.splice(i, 1, newItem);
                j++;
                i++;
            }
        }
        else {
            simulateArray.push(newItem);
            i++;
            j++;
        }
    }

    /**
     * 移除多余的dom元素
     */
    while(simulateArray.length>newChildren.length){
        simulateArray.splice(simulateArray.length-1, 1);
    }

    return simulateArray;
}

console.log(differChildren([11, 1,1,31], [1]));
/*
var oldTree = new Element('div',null,[new Element("p",null,["aaa"]),new Element("a")]);
var newTree = new Element('div',null,[new Element("a",null,["bbb"]),new Element("p")]);
differ(oldTree,newTree,patch);
console.log(patch);*/
