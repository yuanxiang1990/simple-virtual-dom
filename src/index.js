import Vue from "./instance/index";
/*
vm测试
*/
var vue = new Vue({
    template:
        `<div id='ttt'>
            <ul id='ul'>
                <li key='1'>111</li>
                <li key='2'>222</li>
            </ul>
           </div>`
});
console.log(vue);
