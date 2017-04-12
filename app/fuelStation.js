var _ = require("lodash");
var game = require("./game");
var Platform = require("./platform");

function FuelStation(x, y, width, height, color, name, price) {
    var platform = new Platform(x, y, width, height, color, name);

    _.assignIn(this, platform, {
      isFuelStation:true,
      fillRate: 0.1,
      price,
      tick() {
        if (this.refuling) {
          var filled = this.refuling.addFuel(this.fillRate);
          this.totalFilled += filled;
          this.totalCost = this.totalFilled * this.price;
          if (!filled) {
            this.stopRefuling(`Full tank. Total filled ${this.totalFilled.toFixed(2)} * ${this.price} = ${this.totalCost.toFixed(2)}`);
          }
        }
      },
      stopRefuling(reason) {
        console.debug(`Refuling stopped. ${reason}`);
        var ship = this.refuling;
        this.refuling = null;
        game.broadcast("REFULED", {ship, totalFilled: this.totalFilled, totalCost: this.totalCost});
      },
      refule(ship){
        console.debug("Refuling ", ship.name);
        this.refuling = ship;
        this.totalFilled = 0;
        game.broadcast("REFULING", {ship, price: this.price});
      },
      "LANDED"(payload){
        if (payload.platform === this){
          console.debug("Ship landed at fule station", this.name);
          this.refule(payload.ship);
        }
      },
      "FLYING"(payload){
        if (payload.ship === this.refuling){
          this.stopRefuling("Ship took off!");
        }
      }
    });
}

module.exports = FuelStation;
