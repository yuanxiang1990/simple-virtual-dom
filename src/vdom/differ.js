import {_} from "../common/util";


const REPLACE = 0;
const REORDER = 1;
const ATTR = 2;
const TEXT = 3;

function sameNode(vnode1, vnode2) {
    if (typeof vnode1 == "string" && typeof vnode1 == "string") {
        return vnode1 == vnode2;
    }
    return (
        vnode1 && vnode2 && vnode1.tagName === vnode2.tagName && vnode1.key === vnode2.key
    )
}

function contains(a, obj) {
    var i = 0;
    while (i < a.length) {
        if (sameNode(a[i], obj)) {
            return a[i];
        }
        i++;
    }
    return false;
}

/**
 * 新旧树节点比较
 * @param oldVnode
 * @param newVnode
 */
function differ(oldTree, newTree) {
    let index = 0;
    let patches = {};
    walk(oldTree, newTree, index, patches)
    return patches;
};

var key_id = 0;

function walk(oldNode, newNode, index, patches) {
    let currentPatch = [];
    // 如果oldNode被remove掉了，即 newNode === null的时候
    if (newNode === null || newNode === undefined) {
        // 先不做操作, 具体交给 list diff 处理
    }
    else if (_.isString(oldNode) && _.isString(newNode)) {
        if (newNode !== oldNode) currentPatch.push({type: TEXT, content: newNode})
    }
    else if (sameNode(oldNode, newNode)) {
        //比较属性
        let attrPatch = differAttr(oldNode, newNode);
        if (!_.isEmptyObject(attrPatch)) {
            currentPatch.push({
                type: ATTR,
                attrs: attrPatch
            });
        }
        let diffs = differChildren(oldNode.children, newNode.children);
        oldNode.children = diffs.children;
        if (diffs.moves.length) {
            let reorderPatch = {type: REORDER, moves: diffs.moves}
            currentPatch.push(reorderPatch)
        }
        key_id = index;
        oldNode.children.forEach((child, i) => {
            let newChild = newNode.children[i];
            key_id++;
            // 递归继续比较
            walk(child, newChild, key_id, patches)
        })
    }
    else {
        currentPatch.push({type: REPLACE, node: newNode})
    }
    if (currentPatch.length) {
        patches[index] = currentPatch
    }
}

function differAttr(oldNode, newNode) {
    let oldAttr = oldNode.attrs;
    let newAttr = newNode.attrs;
    let attrsPatches = {};
    for (let key in oldAttr) {
        if (oldAttr.hasOwnProperty(key)) {
            if (newAttr[key] != oldAttr[key]) {
                attrsPatches[key] = newAttr[key];
            }
        }
    }
    for (let key in newAttr) {
        if (!oldAttr.hasOwnProperty(key)) {
            attrsPatches[key] = newAttr[key];
        }
    }
    return attrsPatches;
}

function differChildren(oldChildren, newChildren) {
    var newAdd = [], simulateArray = [], moves = [];
    var oldCopy = [].concat(oldChildren);
    for (var i = 0; i < oldCopy.length; i++) {
        var newNode = contains(newChildren, oldCopy[i]);
        if (!newNode) {
            oldCopy.splice(i, 1);
            remove(i);
            i--;
        }
    }
    var newAddIndex = 0;
    for (var i = 0; i < newChildren.length; i++) {
        if (!contains(oldCopy, newChildren[i])) {
            newAdd.push(newChildren[i]);
            insert(oldCopy.length + newAddIndex, newChildren[i]);
            newAddIndex++;
        }
    }
    simulateArray = oldCopy.concat(newAdd);

    var i = 0, j = 0;//i:simulate indx j:new array index
    while (j < newChildren.length) {
        var newItem = newChildren[j];
        if (sameNode(simulateArray[i], newChildren[j])) {
            i++;
            j++;
            continue;
        }
        if (simulateArray[i]) {
            if (sameNode(simulateArray[i + 1], newItem)) {
                simulateArray.splice(i, 1);
                remove(i);
                i++;
                j++;
            }
            else {
                simulateArray.splice(i, 0, newItem);
                insert(i, newItem);
                i++;
                j++;
            }
        }
        else {
            simulateArray.push(newItem);
            insert(i, newItem);
            i++;
            j++;
        }
    }

    // 记录remove操作
    function remove(index) {
        let move = {index: index, type: 0}
        moves.push(move)
    }

    // 记录insert操作
    function insert(index, item) {
        let move = {index: index, item: item, type: 1};
        moves.push(move)
    }

    /**
     * 移除多余的dom元素
     */
    while (simulateArray.length > newChildren.length) {
        simulateArray.splice(simulateArray.length - 1, 1);
        remove(simulateArray.length - 1);
    }

    return {
        moves: moves,
        children: simulateArray
    }
}
export default differ;

