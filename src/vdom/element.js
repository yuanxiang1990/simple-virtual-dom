import { _ } from "../common/util";
class Element {
    constructor(tagName, attrs, children) {
        this.tagName  = tagName;
        this.attrs    = attrs;
        this.children = children;
        // 设置this.key属性，为了后面list diff做准备
        this.key = attrs
            ? attrs.key
            : void 0;
        this.vnode = 1//虚拟dom标记
    }

    render(){
        let ele = document.createElement(this.tagName);
        //设置属性
        for(let a in this.attrs){
            if(this.attrs.hasOwnProperty(a)){
                _.setAttr(ele,a,this.attrs[a]);
            }
        }
        //遍历子节点
        this.children.forEach(function(value,index,array){
            let child;
            if(value instanceof Element){
                child = value.render();
            }
            else{
                child = document.createTextNode(value);
            }
            ele.appendChild(child)
        });
        //this.ele = ele;
        return ele;
    }
}
function el (tagName, attrs, children) {
    return new Element(tagName, attrs, children)
}
export  {el,Element};