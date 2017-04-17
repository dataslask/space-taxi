require("./modal.css");

var modal = document.createElement("DIV");
var temp = document.createElement("DIV");
temp.appendChild(modal);
modal.outerHTML = require("./modal.html");
console.log("A:", temp, modal);
modal = temp.childNodes[0];
console.log("2:", temp, modal);

module.exports = {
  appendTo(element){
    element.appendChild(modal);
    return this;
  },
  show(html) {
    console.log(modal, modal.getElementsByClassName("modalContent"));
    modal.getElementsByClassName("modalContent")[0].innerHTML = html;
  }
};
