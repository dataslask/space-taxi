var Crafty = require('craftyjs');

var world = require('./world.js');

Crafty.c('Ship', {
  required: '2D, Canvas, Color, Motion, Collision',

  init: function() {

    this.attr({
      w: 40,
      h: 20
    });
    this.color('green');

    this.checkHits('Platform, Solid');

    this.bind('HitOn', function(hitData) {
      if (!hitData[0].obj.has('Platform') || this.vy > 25 || this.vx > 10) {
        this.crash();
      } else {
        this.land();
      }
    });

    this.bind('KeyDown', function(e) {
      switch (e.key) {
        case Crafty.keys.UP_ARROW:
          this.ay = -30;
          break;
        case Crafty.keys.LEFT_ARROW:
          this.ax = -30;
          break;
        case Crafty.keys.RIGHT_ARROW:
          this.ax = 30;
          break;
      }
    });

    this.bind('KeyUp', function(e) {
      switch (e.key) {
        case Crafty.keys.UP_ARROW:
          this.ay = 35;
          break;
        case Crafty.keys.LEFT_ARROW:
          this.ax = 0;
          break;
        case Crafty.keys.RIGHT_ARROW:
          this.ax = 0;
          break;
      }
    });

  },
  fly: function() {

  },
  land: function(position) {
    this.resetMotion();
    if (position) {
      this.x = position.x;
      this.y = position.y;
    }
  },
  crash: function() {
    this.resetMotion();
    this.color('red');
  }
});
