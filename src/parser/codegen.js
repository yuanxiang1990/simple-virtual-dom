/**
 * 拼接构造虚拟dom的函数
 * @param ast
 * @returns {{render: string}}
 */
export function gen(ast) {
    const code = ast ? getNode(ast) : '_c("div",{},[])';
    return {
        render: ("with(this){return " + code + "}")
    }

}

function getElement(el) {
    let code
    const children = genChildren(el.children);
    code = `_c('${el.tag}'
        ${
        el.attrs ? `,${genText(el.attrs)}` : ',{}' // attr
        }
        ${
        children ? `,${children}` : '' // children
        })`;

    return code
}
function genChildren(el) {
    return `[${el.map(getNode).join(",")}]`;
}

function getNode(el) {
    if (el.type == 3) {//文本节点
        if(el.expression){
            return el.expression;
        }
        else {
            return genText(el.text);
        }
    }
    else if(el.type==1){
        return getElement(el);
    }
}

function genText(text) {
    return JSON.stringify(text);
}