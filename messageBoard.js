require("./messageBoard.css");

var messages = document.createElement("OL");
messages.className = "messageBoard";

module.exports = {
    appendTo(element){
      element.appendChild(messages);
      return this;
    },
    addMessage(text){
      var message = document.createElement("LI");
      message.innerText = text;
      messages.appendChild(message);
      return this;
    }
};
