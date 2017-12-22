import {parseHTML} from "./html-parser";
import {gen} from "./codegen";
import {_} from "../common/util";
function parse (template) {
    let stack = [];
    let root // ast的根节点
    let currentParent // 当前节点的父亲节点
    parseHTML(template,{
        start (tag, attrs, unary) {
            const element = {
                type: 1,
                tag,
                parent: currentParent,
                attrs:{},
                children: []
            }
            if (!root) {
                root = element
            }
            if (currentParent) {
                currentParent.children.push(element)
            }
            attrs.forEach(function (val,i) {
               element.attrs[val["name"]]=val["value"];
            });
            if (!unary) { // 如果不是单标签，就压入堆栈
                currentParent = element
                stack.push(element)
            }
        },
        end () { // 处理 EndToken
            stack.length -= 1;
            currentParent = stack[stack.length - 1]
        },
        chars (text) { // 处理 CharsToken
            if (!currentParent) {
                return
            }
            const children = currentParent.children;
            text = text.trim();
            if (text) { // 文本节点
                children.push({
                    type: 3,
                    text
                })
            }
        }
    });
    return root;
}

function makeFunction (code, errors) {
    return new Function(code)
}

export default function compile (template) {
    const ast = parse(template.trim());
    const code = gen(ast);
    return {
        ast,
        render: makeFunction(code.render)
    }
}