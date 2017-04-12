var _ = require("lodash");
var messageBoard = require("./messageBoard");
var game = require("./game");

var WIDTH=5;
var WIDTH2=WIDTH*2;
var HEIGHT=10;
var HEIGHT2=HEIGHT*2;
var HEAD_RADIUS=HEIGHT/3;

function Customer(platform, name, destination){

  _.assignIn(this, {
      name,
      canMove: true,
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
        console.debug(`${this.name} disembarking at ${platform.name}`);
        this.enter(platform);
        this.ship = null;
        if (this.destination.name === platform.name){
          this.say("Thanx");
        }else {
          this.say("ASSHOLE!")
        }
        game.broadcast("DISEMBARKED", {customer:this, destination: this.destination, platform});
      },
      board(ship){
        console.debug(`${this.name} boarding Ship`, game);
        this.platform = null;
        this.ship = ship;
        this.x = -1000;
        this.y = -1000;
        this.box = this.recalculateBoundingBox();
        this.say(`Take me to ${this.destination.name}`);
        game.broadcast("BOARDED", {customer:this, destination: this.destination});
      },
      say(text){
        var location = this.platform ? this.platform.name : "Ship";
        messageBoard.addMessage(`${name}@${location}: ${text}`);
      },
      "LANDED"(payload){
        if (payload.platform === this.platform){
          this.board(payload.ship);
        } else if (this.ship) {
          this.disembark(payload.ship, payload.platform);
        }
      }
  });

  this.enter(platform);
  this.say("HEY TAXY!");
}

module.exports = Customer;
