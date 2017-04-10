var _ = require("lodash").noConflict();

var world = require("./world").resize(window.innerWidth, window.innerHeight).appendTo(document.body);

var messageBoard = require("./messageBoard").appendTo(document.body);
messageBoard.addMessage("Welcome");

var Solid = require("./solid");
var Platform = require("./platform");
var FuelStation = require("./fuelStation");
var Customer = require("./customer");

var platforms = [
  new Platform(100, 300, 250, 20, "green", "Platform1"),
  new Platform(500, 400, 210, 20, "green", "Platform2"),
  new FuelStation(550, 500, 80, 20, "green", "Platform3 (fuel)", 13.3),
  new Platform(600, 150, 210, 60, "green", "Platform4"),
  new Platform(0, world.height - 20, world.width, 20, "brown", "Ground")
];

var ship = require('./ship.js');

for(var i = 0; i < platforms.length; i++){
  world.add(platforms[i]);
}

world.add(new Solid(0, 0, 10, world.height - 20, "blue", "Wall1"));
world.add(new Solid(world.width - 10, 0, 10, world.height - 20, "blue", "Wall2"));
world.add(ship);

var game = require("./game");

game.start(world, ship);

window.onresize = function() {
  world.resize(window.innerWidth, window.innerHeight);
};
