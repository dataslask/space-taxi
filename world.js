var Victor = require('victor');

var g = new Victor(0.00, 0.01);

module.exports = {
  w:800,
  h:600,
  g: function(x, y){
      return g;
    }
};
