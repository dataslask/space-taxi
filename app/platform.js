var _ = require("lodash");
var Solid = require("./solid");

function Platform(x, y, width, height, color, name) {

  var solid = new Solid(x, y, width, height, color, name);

  _.assignIn(this, solid, {
    type:"platform",
    redraw(ctx){
      solid.redraw(ctx);
      ctx.textAlign="center";
      ctx.textBaseline ="middle";
      ctx.fillStyle="black";
      ctx.fillText(this.name, this.x + this.width / 2, this.y + this.height / 2);
    }
  });
}

module.exports = Platform;
