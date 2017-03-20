var _ = require("lodash");

function Solid(x, y, width, height, color, name) {

    _.assignIn(this, {
        x,
        y,
        width,
        height,
        color,
        name,
        type: "solid",
        redraw(ctx) {
            ctx.fillStyle = this.color;
            ctx.fillRect(this.x, this.y, this.width, this.height);
        },
        tick(world) {},
        box: {
            x1: x,
            y1: y,
            x2: x + width,
            y2: y + height
        },
        hit() {}
    });

}

module.exports = Solid;
