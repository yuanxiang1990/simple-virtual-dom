var index = -1;
var patch = [];
var REPLACE = 0;
var REORDER = 1;
var PROPS = 2;
var TEXT = 3;

function type(obj) {
    return Object.prototype.toString.call(obj).match(/\[object\s*(\w+)\]/)[1];
}
/**
 * virtualdom节点
 * @param tagName
 * @param props
 * @param children
 * @constructor
 */
function Element (tagName, props, children) {
    this.tagName = tagName;
    this.props = props||null;
    this.children = children||[];
}
function sameVnode (vnode1, vnode2) {
    return (
        vnode1&&vnode2&&vnode1.tagName === vnode2.tagName &&
        vnode1.props == vnode2.props
    )
}

/**
 * 新旧树节点比较
 * @param oldVnode
 * @param newVnode
 */
function differ(oldVnode,newVnode,patch) {
    index++;
    if(!sameVnode(oldVnode,newVnode)){
        patch.push({
            type:REPLACE,
            node:newVnode,
            index:index
        });
    }

    else if(type(oldVnode)=="String"&&type(newVnode)=="String"){
        if(oldVnode!=newVnode){
            patch.push({
                type:TEXT,
                node:newVnode,
                index:index
            });
        }
    }

    else{
       for(var i = 0;i<oldVnode.children.length;i++){
           differ(oldVnode.children[i],newVnode.children[i],patch);
       }
    }
}
var oldTree = new Element('div',null,[new Element("p",null,["aaa"]),new Element("a")]);
var newTree = new Element('div',null,[new Element("a",null,["bbb"]),new Element("p")]);
differ(oldTree,newTree,patch);
console.log(patch);