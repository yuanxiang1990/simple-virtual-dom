import {_} from "./util";
let index = 0;
const REPLACE = 0;
const REORDER = 1;
const ATTR = 2;
const TEXT = 3;

function patch(rootNode, pathches) {
    walk(rootNode, pathches);
}

function walk(rootNode, pathches) {
    var children = rootNode.childNodes;
    var pathch = pathches[index];
    if (pathch) {
        applyPatch(rootNode,pathch);
    }
    for (var i = 0; i < children.length; i++) {
        index++;
        walk(children[i], pathches);
    }

}

function applyPatch(node,pathch) {
    pathch.forEach(p => {
        console.log(p.type)
        switch (p.type) {
            case REPLACE:
                let newNode = (typeof p.node === 'string')
                    ? document.createTextNode(p.node)
                    : p.node.render()
                node.parentNode.replaceChild(newNode, node)
                break;
            case TEXT:
                if (node.textContent) {
                    node.textContent = p.content
                } else {
                    // for ie
                    node.nodeValue = p.content
                }
                break;
            case ATTR:
                for(let key in p.attrs){
                    if(p.attrs[key]==undefined){
                        node.removeAttribute(key)
                    }
                    else{
                        _.setAttr(node,key,p.attrs[key]);
                    }
                }
                break;
            case REORDER:
                var moves = p.moves;
                moves.forEach(m=>{
                    if(m.type==0){//remove
                        node.removeChild(node.childNodes[m.index]);
                    }
                    else if(m.type==1){//insert
                        if(node.childNodes[m.index]){
                            var newNode = (typeof m.item =="string")
                                    ? document.createTextNode(m.item)
                                    : m.item.render()
                            node.insertBefore(newNode,node.childNodes[m.index]);
                        }
                        else{
                            var newNode = (typeof m.item =="string")
                                ? document.createTextNode(m.item)
                                : m.item.render()
                           node.appendChild(newNode);
                        }
                    }
                })
                break;
        }
    });
}

export default patch;