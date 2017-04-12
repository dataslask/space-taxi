require("./game.css");

const names = ["Smith", "Clara", "James", "Susan", "Bob", "Eve", "Hank", "Mary", "Mike", "Emily"];

var hub = require("./hub");
var Customer = require("./customer");

var lastTicks = 0;

var game = {

    hitTest(a, b) {
        if (a.box.x1 < b.box.x2 &&
            a.box.x2 > b.box.x1 &&
            a.box.y1 < b.box.y2 &&
            a.box.y2 > b.box.y1) {

            a.hit(b);
            b.hit(a);
        }
    },

    handle(eventName) {
        if (this.hasOwnProperty(eventName)) {
            if (this[eventName]()) {
                return true;
            }
        }
        return this.world.handle(eventName);
    },
    tick() {
        this.world.tick(this.hitTest);
        this.world.redraw();
        if (!this.ship.crashed()) {
            window.requestAnimationFrame(() => this.tick());
        } else {
            console.debug("Ship has crashed. Stopping game loop.")
        }
    },

    restart() {
        console.debug("Starting game loop...")
        this.ship.startAt(this.startingPlatform);
        this.tick();
    },

    spawnCustomer(avoid) {
      var home = this.world.pickPlatform(avoid);
      var destination =  this.world.pickPlatform(avoid, home);
      var name = names[Math.round(Math.random() * (names.length - 1))];
      var customer = new Customer(home, name, destination);
      this.world.add(customer);
    },

    start(world, ship) {
        this.world = world;
        this.ship = ship;
        var start =  this.world.pickPlatform();
        this.spawnCustomer(start);
        this.startingPlatform = start;
        this.restart();
    },

    "keyup(Space)" () {
        if (this.ship.crashed()) {
            this.restart();
            return true;
        }
        return false;
    },

    attachToHub(){
      this.subscription = hub.attach(this);
    },
    "BOARDED"(payload){
      console.debug(`${payload.customer.name} boarded taxi`);
    },
    "DISEMBARKED"(payload){
      var result = payload.destination === payload.platform ? "destination" : "wrong platform"
      console.debug(`${payload.customer.name} disembarked taxi at ${result}`);
    }
};

game.attachToHub();

window.addEventListener("keydown", e => {
    var eventName = `keydown(${e.code})`;
    if (game.handle(eventName)) {
        e.preventDefault();
    } else {
        console.debug(`Unhandled event: ${eventName}`);
    }
});

window.addEventListener("keyup", e => {
    var eventName = `keyup(${e.code})`;
    if (game.handle(eventName)) {
        e.preventDefault();
    } else {
        console.debug(`Unhandled event: ${eventName}`);
    };
});

module.exports = game;
