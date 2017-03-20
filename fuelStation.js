var _ = require("lodash");
var Platform = require("./platform");

function FuelStation(x, y, width, height, color, name, price) {
    var platform = new Platform(x, y, width, height, color, name);

    _.assignIn(this, platform, {
      isFuelStation:true,
      fillRate: 0.1,
      price
    });
}

module.exports = FuelStation;
