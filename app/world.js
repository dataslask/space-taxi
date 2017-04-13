var _ = require("lodash");

require("./world.css");

var canvas = document.createElement("CANVAS");
canvas.className = "world";

var ctx = canvas.getContext("2d");

var world = {
    entities: [],
    width: canvas.width,
    height: canvas.height,
    gravity(x, y) {
        return {
            x: 0,
            y: 0.025
        };
    },
    appendTo(element) {
        element.appendChild(canvas);
        return this;
    },
    resize(width, height) {
        console.debug(`Resize: ${width}, ${height}`);
        this.width = width;
        this.height = height;
        canvas.width = width;
        canvas.height = height;
        return this;
    },
    add(entity) {
        this.entities.push(entity);
        return this;
    },
    remove(entity) {
        _.pull(this.entities, entity);
        return this;
    },
    any(entityType) {
        return _.some(this.entities, {type:entityType});
    },
    tick(hitTest) {

        _.forEach(this.entities, entity => {
            entity.tick(this);
        });
        for (var i = 0; i < this.entities.length; i++) {
            for (var j = i + 1; j < this.entities.length; j++) {
              if (this.entities[i].canMove || this.entities[j].canMove)
                hitTest(this.entities[i], this.entities[j]);
            }
        }
        return this;
    },
    handle(eventName) {
        if (this.hasOwnProperty(eventName)) {
            this[eventName]();
            return tru;
        }
        return _.some(this.entities, entity => {
            if (entity.hasOwnProperty(eventName)) {
                entity[eventName]();
                return true;
            }
            return false;
        });
    },
    broadcast(eventName, payload) {
      _.each(this.entities, entity => {
        if (entity.hasOwnProperty(eventName)) {
          entity[eventName](payload);
        }
      });
    },
    redraw() {
      ctx.clearRect(0, 0, world.width, world.height);
        _.forEach(this.entities, entity => {
            entity.redraw(ctx);
        });
        return this;
    },
    pickPlatform(){
      var platforms = _.filter(this.entities, x => x.type === "platform" && !_.includes(arguments, x));

      return platforms[Math.round(Math.random() * (platforms.length - 1))];
    }
};

module.exports = world;
