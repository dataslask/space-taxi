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

function pickPlatform(avoid){
  var platform;

  do {
    platform = Math.round(Math.random() * (platforms.length - 1));
  }
  while(platform === avoid);

  return platform;
}

var home = pickPlatform();
var destination =  pickPlatform(home);
var start =  pickPlatform(home);

console.debug("Home=", platforms[home].name, ", destination=", platforms[destination].name, ", start=", platforms[start].name);

world.add(new Solid(0, 0, 10, world.height - 20, "blue", "Wall1"));
world.add(new Solid(world.width - 10, 0, 10, world.height - 20, "blue", "Wall2"));
world.add(new Customer(platforms[home], "Smith", platforms[destination]));
world.add(ship);

var game = require("./game");

game.start(world, ship, platforms[start]);

window.onresize = function() {
  world.resize(window.innerWidth, window.innerHeight);
};
