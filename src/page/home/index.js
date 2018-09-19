import "./index.less";
console.log(require("./index.html"))
class Test {
  a = 1
  constructor() {
    alert(this.a)
  }
}

new Test();