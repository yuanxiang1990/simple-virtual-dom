import Watcher from "./watcher";
import {remove} from "../common/util";
let number = 0;
export default class Dep {

    constructor(){
        this.uid = number++;
        this.subs = [];
    }

    addSub(sub){
        this.subs.push(sub);
    }

    removeSub(sub){
        remove(this.subs,sub);
    }

    depend(){
        if(Dep.target){
            Dep.target.addDep(this);
        }
    }

    notify(){
        for(let i = 0;i<this.subs.length;i++){
            this.subs[i].update();
        }
    }
}

Dep.target = null;
const targetStack = []

export function pushTarget (_target) {
    if (Dep.target) targetStack.push(Dep.target)
    Dep.target = _target
}

export function popTarget () {
    Dep.target = targetStack.pop()
    console.log(targetStack.pop())
}
