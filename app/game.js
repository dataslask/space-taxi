require("./game.css");

const _ = require("lodash");

const SPAWN_PROBABILITY = 1 / 60 / 3;

const names = ["Smith", "Clara", "James", "Susan", "Bob", "Eve", "Hank", "Mary", "Mike", "Emily"];

var game = {};

module.exports = game;

var world = require("./world");
var Customer = require("./customer");

var lastTicks = 0;

_.assignIn(game, {

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
        if (!this.world.any("customer")){
          if (Math.random() < SPAWN_PROBABILITY){
            this.spawnCustomer();
          }
        }
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
        this.startingPlatform = this.world.pickPlatform();
        this.restart();
    },

    "keyup(Space)" () {
        if (this.ship.crashed()) {
            this.restart();
            return true;
        }
        return false;
    },
    broadcast(eventName, payload) {
      if (this.hasOwnProperty(eventName)) {
        this[eventName](payload);
      }
      this.world.broadcast(eventName, payload);
    },
    "BOARDED"(payload){
      console.debug(`${payload.customer.name} boarded taxi`);
    },
    "DISEMBARKED"(payload){
      var result = payload.destination === payload.platform ? "destination" : "wrong platform"
      console.debug(`${payload.customer.name} disembarked taxi at ${result}`);
      this.world.remove(payload.customer);
    }
});

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
