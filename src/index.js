import {el} from "./vdom/element";
import d from "./vdom/differ";
import {_} from "./common/util";
import p from "./vdom/patch";
import {parse} from './parser/index';
/*
vm测试
*/
var dom = parse("<div id='ttt'>"
    + "<ul id='ul'>"
    + "<li key='1'>111</li>"
    + "<li key='2'>222</li>"
    + "</ul></div>");
document.getElementById("dom").appendChild(dom.render());
var dom1 = parse("<div id='ttt'>"
    + "<ul id='ul'>"
    + "<li key='2'>222</li>"
    + "<li key='1'>21122</li>"
    + "</ul></div>");
console.log(dom)
var domTemp = _.clone(dom);
p(document.getElementById("ttt"), d(domTemp, dom1));
dom = dom1;
//console.log(parse("<div id='aaa' name='123'><p id='123'>sss</p>sssssss</div>"))