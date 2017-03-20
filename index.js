var _ = require("lodash").noConflict();

var world = require("./world").resize(window.innerWidth, window.innerHeight).appendTo(document.body);

var messageBoard = require("./messageBoard").appendTo(document.body);
messageBoard.addMessage("Welcome");

var Solid = require("./solid");
var Platform = require("./platform");
var FuelStation = require("./fuelStation");
var Customer = require("./customer");

var platform1 = new Platform(100, 300, 250, 20, "green", "Platform1");
var platform2 = new Platform(500, 400, 210, 20, "green", "Platform2");

var ship = require('./ship.js');

world.add(platform1);
world.add(platform2);
world.add(new FuelStation(550, 500, 80, 20, "green", "Platform3", 13.3));
world.add(new Platform(0, world.height - 20, world.width, 20, "brown", "Ground"));
world.add(new Solid(0, 0, 10, world.height - 20, "blue", "Wall1"));
world.add(new Solid(world.width - 10, 0, 10, world.height - 20, "blue", "Wall2"));
world.add(new Customer(platform2, "Smith", platform1));
world.add(ship);

var game = require("./game");

game.start(world, ship, platform1);

window.onresize = function() {
  world.resize(window.innerWidth, window.innerHeight);
};
