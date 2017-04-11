const _ = require("lodash");

var nextToken = 1;
var subscriptions = {};

var hub = {
  broadcast(eventName, payload){
    console.debug(eventName, payload);
    _.each(subscriptions, handler => handler(eventName, payload));
  },
  attach(handler){
    subscriptions[nextToken] = handler;
    return nextToken++;
  },
  detach(token) {
    delete subscriptions[token];
  }
};

module.exports = hub;
