var height = 20;
var width = 20;
var width2 = width * 2;
var corner = 5;
var corner2 = corner * 2;
var antenna = {
    height: 10,
    radius: 5
};
var landingGearHeight = 15;
var thruster = {
    main: 600,
    side: 3
}

module.exports = {
    getLandingGearHeight() {
        return landingGearHeight;
    },
    recalculateBoundingBox(ship) {
        var extra = ship.landingGearDeployed ? landingGearHeight : 0;
        return {
            x1: ship.x - width,
            y1: ship.y - height - antenna.height - antenna.radius,
            x2: ship.x + width,
            y2: ship.y + extra
        };
    },
    drawShip(ctx, ship) {
        var x = ship.x;
        var y = ship.y;

        ctx.fillStyle = ship.crashed() ? "red" : "blue";

        this.drawBody(ctx, x, y);
        this.drawCanopy(ctx, x, y);
        this.drawAntenna(ctx, x, y);

        if (ship.landingGearDeployed) {
            this.drawLandingGear(ctx, x, y);
        }
        if (ship.thrust.x) {
            this.drawSideThruster(ctx, x, y, ship.thrust.x > 0 ? -1 : 1, 0);
        }
        if (ship.thrust.y > 0) {
            this.drawMainThruster(ctx, x, y, ship.thrust.y);
        }
        if (ship.thrust.y < 0) {
            this.drawSideThruster(ctx, x, y, 1, 3);
            this.drawSideThruster(ctx, x, y, -1, 3);
        }
    },
    drawBody(ctx, x, y) {
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x - width + corner, y);
        ctx.lineTo(x - width, y - corner);
        ctx.lineTo(x - width, y - height + corner);
        ctx.lineTo(x + width, y - height + corner);
        ctx.lineTo(x + width, y - corner);
        ctx.lineTo(x + width - corner, y);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
    },
    drawCanopy(ctx, x, y) {
        ctx.beginPath();
        ctx.moveTo(x - width, y - height + corner);
        ctx.lineTo(x - width + corner2, y - height);
        ctx.lineTo(x + width - corner2, y - height);
        ctx.lineTo(x + width, y - height + corner);
        ctx.stroke();
    },
    drawAntenna(ctx, x, y) {
        ctx.beginPath();
        ctx.moveTo(x, y - height);
        ctx.lineTo(x, y - height - antenna.height);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(x, y - height - antenna.height, antenna.radius, 0, Math.PI * 2, true);
        ctx.fill();
        ctx.stroke();
    },
    drawLandingGear(ctx, x, y) {
        ctx.beginPath();
        ctx.moveTo(x - width + corner2, y);
        ctx.lineTo(x - width + corner2 - corner, y + landingGearHeight);
        ctx.moveTo(x - width, y + landingGearHeight);
        ctx.lineTo(x - width + corner2, y + landingGearHeight);

        ctx.moveTo(x + width - corner2, y);
        ctx.lineTo(x + width - corner2 + corner, y + landingGearHeight);
        ctx.moveTo(x + width, y + landingGearHeight);
        ctx.lineTo(x + width - corner2, y + landingGearHeight);
        ctx.stroke();
    },
    drawSideThruster(ctx, x, y, side, offset) {
        ctx.strokeStyle = "red";
        ctx.fillStyle = "yellow";
        ctx.beginPath();
        ctx.moveTo(x + width * side, y - corner);
        ctx.lineTo(x + (width + corner2) * side, y - corner - thruster.side - (thruster.side * offset));
        ctx.lineTo(x + width * side, y - corner - thruster.side * 2);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
    },
    drawMainThruster(ctx, x, y, thrust) {
        ctx.strokeStyle = "red";
        ctx.fillStyle = "yellow";
        ctx.beginPath();
        ctx.moveTo(x - corner, y);
        ctx.lineTo(x + corner, y);
        ctx.lineTo(x, y + thruster.main * thrust);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
    }
};
