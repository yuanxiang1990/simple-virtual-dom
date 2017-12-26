import Vue from "./instance/index";
/*
vm测试
*/
var vue = new Vue({
    data:{
        a:"aaa",
        b:"bbb"
    },
    template:
        `<div id='ttt'>
            <ul id='ul'>
                <li key='1'>{{a}}</li>
                <li key='2'>{{b}}</li>
            </ul>
           </div>`
});
vue.a = "ddsd";
console.log(vue)
