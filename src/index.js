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
                <li key='1'>aaa</li>
                <li key='2'>111{{b}}222{{a}}</li>
            </ul>
           </div>`
});
console.log(vue);
