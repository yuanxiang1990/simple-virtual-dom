import Vue from "./instance/index";
/*
vm测试
*/
var vue = new Vue({
    ele:"vm",
    data:{
        a:111,
        b:222
    },
    computed:{
        c:function () {
            return this.a + this.b ;
        }
    },
    template:
        `<div id='ttt'>
            <ul id='ul'>
                <li key='1'>{{a}}</li>
                <li key='2'>{{b}}</li>
                <li key='3'>{{c}}</li>
            </ul>
           </div>`
});
vue.a = 1024;
setTimeout(function () {
    vue.a = 2048;
},1000)
//console.log(vue);
