require('./ship.js');

var world = require('./world.js');

var Crafty = require('craftyjs');

Crafty.init(world.w, world.h);

Crafty.background('black');

Crafty.c('Solid', {
  required: '2D, DOM, Color'
});

Crafty.c('Platform', {
  required: '2D, DOM, Color'
});

Crafty.e('Solid')
  .attr({
    x: 500,
    y: 300,
    w: 100,
    h: 50
  })
  .color('yellow');


var ground = Crafty.e('Platform')
  .attr({
    x: 0,
    y: world.h - 5,
    w: world.w,
    h: 5
  })
  .color('blue');

var platform1 = Crafty.e('Platform')
  .attr({
    x: 200,
    y: 400,
    w: 100,
    h: 5
  })
  .color('blue');


var ship = Crafty.e('Ship');

ship.land({
  x: world.w / 2,
  y: world.h - ship.h - ground.h
});

var txt = Crafty.e('2D, DOM, Text')
  .attr({
    x: 10,
    y: 10
  })
  .textColor('yellow')
  .text('hei');

Crafty.bind('EnterFrame', function() {
  txt.text('vx=' + ship.vx + ', vy=' + ship.vy);
});
