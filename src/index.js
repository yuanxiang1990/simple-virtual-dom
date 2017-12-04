import {el} from "./vdom/element";
import d from "./vdom/differ";
import {_} from "./common/util";
import p from "./vdom/patch";
var dom = el("div", {key:1,id:"ttt"}, [
    el("ul", {id: "u1"}, [
        el("li", {key:1}, ["111"]),
        el("li", {key:2}, ["222"]),
        "aa"
    ]),
    el("p", {id: "p1"}, [
        "aaa"
    ]),
]);
document.getElementById("dom").appendChild(dom.render());
var dom1 = el("div", {key:1,a:1,id:"ttt"}, [
    el("ul", {id: "u1"}, [
        el("li", {key:2}, ["2220"]),
        el("li", {key:1}, ["111"]),
        "sssssasass"
    ]),
    el("p", {id: "p2"}, [
        "aaaq"
    ])
]);
var domTemp = _.clone(dom);
p(document.getElementById("ttt"),d(domTemp, dom1));
dom = dom1;