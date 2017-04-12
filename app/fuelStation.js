var _ = require("lodash");
var hub = require("./hub");
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
          if (!filled) {
            this.stopRefuling("Full tank");
          }
        }
      },
      stopRefuling(reason) {
        console.debug(`Refuling stopped. ${reason}`);
        this.refuling = null;
      },
      refule(ship){
        console.debug("Refuling ", ship.name);
        this.refuling = ship;
      },
      attachToHub(){
        this.subscription = hub.attach(this);
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

    this.attachToHub();
}

module.exports = FuelStation;
