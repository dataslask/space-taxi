require("./infoPanel.css");

const _ = require("lodash");

var panel = document.createElement("DIV");

var elements = ["fps", "fuel", "speedX", "speedY", "thrustX", "thrustY", "message"];

module.exports = {
    speed(x, y){
      this._speedX.innerText = Math.abs(x).toFixed(1);
      this._speedY.innerText = Math.abs(y).toFixed(1);
    },
    thrust(x, y){
      this._thrustX.innerText = Math.abs(x).toFixed(3);
      this._thrustY.innerText = Math.abs(y).toFixed(3);
    },
    message(message) {
      this._message.innerText = message;
    },
    fps(fps){
      this._fps.innerText = Math.round(fps);
    },
    fuel(fuel){
      this._fuel.innerText = fuel.toFixed(2);
    },
    appendTo(element){
      element.appendChild(panel);
      panel.outerHTML = require("./infoPanel.html");

      _.each(elements, x => {
        this[`_${x}`] = document.getElementById(`infoPanel-${x}`);
      });
      this._fps.innerText = "crapshit";

      return this;
    }
  };
