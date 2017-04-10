var _ = require("lodash");
var messageBoard = require("./messageBoard");

var WIDTH=5;
var WIDTH2=WIDTH*2;
var HEIGHT=10;
var HEIGHT2=HEIGHT*2;
var HEAD_RADIUS=HEIGHT/3;

function Customer(platform, name, destination){


  _.assignIn(this, {
      name,
      origin: platform,
      destination,
      platform,
      type: "customer",
      redraw(ctx) {
        if (this.platform){
          ctx.strokeStyle = "black";
          ctx.moveTo(this.x - WIDTH, this.y);
          ctx.lineTo(this.x, this.y - HEIGHT);
          ctx.lineTo(this.x + WIDTH, this.y);
          ctx.moveTo(this.x, this.y - HEIGHT);
          ctx.lineTo(this.x, this.y - HEIGHT2);
          ctx.moveTo(this.x - WIDTH, this.y - HEIGHT);
          ctx.lineTo(this.x, this.y - HEIGHT2);
          ctx.lineTo(this.x + WIDTH, this.y - HEIGHT);
          ctx.moveTo(this.x, this.y - HEIGHT2);
          ctx.arc(this.x, this.y - HEIGHT2 - HEAD_RADIUS, HEAD_RADIUS, 0, Math.PI * 2, true);
          ctx.stroke();
        }
      },
      tick(world) {},
      hit() {},
      enter(platform){
        platform.addCustomer(this);
        this.platform = platform;
        this.x = platform.x + platform.width/4;
        this.y = platform.y;
        this.box = this.recalculateBoundingBox();
      },
      recalculateBoundingBox() {
          return {
              x1: this.x,
              y1: this.y - HEIGHT,
              x2: this.x + WIDTH,
              y2: this.y
          };
      },
      disembark(ship, platform){
        this.enter(platform);
        ship.removeCustomer(this);
        if (this.destination.name === platform.name){
          this.say("Thanx");
        }else {
          this.say("ASSHOLE!")
        }

      },
      board(ship){
        this.platform.removeCustomer();
        this.platform = null;
        ship.addCustomer(this);
        this.say(`Take me to ${destination.name}`);
      },
      say(text){
        messageBoard.addMessage(`${name}@${platform.name}: ${text}`);
      }
  });

  this.enter(platform);
  this.say("HEY TAXY!");
}

module.exports = Customer;
