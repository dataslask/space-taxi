var FLYING = "flying";
var LANDED = "landed";
var CRASHED = "crashed";
var REFULING = "refuling";
var G = 0.025;
var SIDE_THRUSTER = G * 0.5;
var MAIN_THRUSTER = G * 1.75;
var LANDING_THRUSTER = G * 0.95;
var DOWN_THRUSTER = G * 0.5;
var MAX_SPEED_WITH_LANDING_GEAR = 2.0;
var MAX_HORIZONTAL_LANDING_SPEED = 0.5;
var MAX_VERTICAL_LANDING_SPEED = 1.5;
var FULL_TANK = 100;

var shipShape = require("./shipShape");
var hub = require("./hub");

module.exports = {

    showBox: false,
    x: 100,
    y: 100,
    landingGearDeployed: false,
    state: FLYING,
    vx: 0,
    vy: 0,
    thrust: {
        x: 0,
        y: 0
    },
    type: "ship",
    canMove: true,
    name: "TheShip",
    redraw(ctx) {
        var w2 = this.width / 2;
        var corner2 = this.corner * 2;

        ctx.textAlign = "left";
        ctx.textBaseline = "alphabetic";
        ctx.strokeStyle = "black";
        ctx.fillStyle = "black";

        switch (this.state) {
            case CRASHED:
                ctx.fillText(`CRASHED! ${this.message}!`, 15, 15);
                break;
            case LANDED:
            case REFULING:
                ctx.fillText(`${this.message}`, 15, 15);
                break;
            default:
                ctx.fillText(`Speed: [${this.vx.toFixed(3)}, ${this.vy.toFixed(3)}] (${this.thrust.x.toFixed(2)}, ${this.thrust.y.toFixed(2)})`, 15, 15);
        }
        var fuel = this.fuel > 0 ? this.fuel.toFixed(2) : "EMPTY!";

        ctx.fillText(`Fuel: ${fuel}`, 15, 30);

        shipShape.drawShip(ctx, this);

        if (this.showBox) {
            ctx.strokeStyle = "yellow";
            ctx.strokeRect(this.box.x1, this.box.y1, this.box.x2 - this.box.x1, this.box.y2 - this.box.y1);
        }
    },
    crashed() {
        return this.state === CRASHED;
    },
    crash(reason) {
        console.debug(`CRASH! ${reason}! Current speed: [${this.vx.toFixed(3)}, ${this.vy.toFixed(3)}]`)
        this.vx = 0;
        this.vy = 0;
        this.state = CRASHED;
        this.message = reason;
    },
    noFuel() {
        console.debug(`No more fuel`);

        this.fuel = 0;
        this.thrust = {
            x: 0,
            y: 0
        };
    },
    fly() {
        console.debug(`Flying`);

        this.state = FLYING;
        this.landedAt = null;
    },
    refule() {
        console.debug(`Refuling`);
        this.state = REFULING;
        this.message = `Refuling at ${this.landedAt.name}`;
    },
    land(platform) {
        console.debug(`Landing at ${platform.name}`);

        this.landedAt = platform;
        this.vy = 0;
        this.vx = 0;
        this.state = LANDED;
        this.y = platform.y - shipShape.getLandingGearHeight(this);
        this.box = shipShape.recalculateBoundingBox(this);
        this.message = `Landed on ${platform.name}`;
        // if (this.customer) {
        //     this.customer.disembark(this, this.landedAt);
        // } else if (this.landedAt.customer) {
        //     this.landedAt.customer.board(this);
        // }
        // if (this.landedAt.isFuelStation && this.fuel < FULL_TANK) {
        //     this.refule();
        // }
        hub.broadcast("LANDED", {ship:this, platform});
    },
    startAt(platform) {
        this.fuel = FULL_TANK;
        this.landingGearDeployed = true;
        this.x = platform.x + platform.width / 2;
        this.land(platform);
    },
    hit(entity) {
        console.debug(`Ship hits ${entity.name}`);

        if (entity.type === "platform") {
            if (this.box.x1 < entity.box.x1 ||
                this.box.x2 > entity.box.x2 ||
                this.box.y1 > entity.box.y1) {
                this.crash("Hit the platform");
            } else if (!this.landingGearDeployed) {
                this.crash("Cannot land without landing gear");
            } else if (this.vx > MAX_HORIZONTAL_LANDING_SPEED || this.vy > MAX_VERTICAL_LANDING_SPEED) {
                this.crash("Landing to hard");
            } else if (this.box.y2 - entity.box.y1 > MAX_VERTICAL_LANDING_SPEED) {
                this.crash("Landig gear deploy to low");
            } else {
                this.land(entity);
            }
        } else {
            this.crash(`Hit ${entity.name}`);
        }
    },
    tick(world) {
        switch (this.state) {
            case FLYING:
                if (this.landingGearDeployed && (Math.abs(this.vx) > MAX_SPEED_WITH_LANDING_GEAR || Math.abs(this.vy) > MAX_SPEED_WITH_LANDING_GEAR)) {
                    this.crash("Flying to fast with landing gear deployed");
                    return;
                }

                var gravity = world.gravity(this.x, this.y);

                if (this.fuel <= 0) {
                    this.noFuel();
                }

                this.vx += gravity.x + this.thrust.x;
                this.vy += gravity.y - this.thrust.y;
                this.x += this.vx;
                this.y += this.vy;
                this.box = shipShape.recalculateBoundingBox(this);

                break;

            case REFULING:
                if (this.fuel < FULL_TANK) {
                    this.fuel += this.landedAt.fillRate;
                }
                if (this.fuel > FULL_TANK) {
                    this.fuel = FULL_TANK;
                    this.land(this.landedAt);
                }
                break;
            default:

        }
        this.fuel -= (Math.abs(this.thrust.x) + Math.abs(this.thrust.y));
    },
    "keydown(Space)" () {},
    "keyup(Space)" () {
        if (this.state === CRASHED) return;

        this.fly();
        this.landingGearDeployed = !this.landingGearDeployed;
        if (this.thrust.y) {
            this["keydown(ArrowUp)"]();
        }
    },
    thrustNone(){
      this.thrust = {left:0, right:0, up:0, down:0};
    },
    thrustX(thrust) {
        if (this.state === CRASHED) return;
        if (this.state === LANDED) {
            this.crash("Side thruster fired while landed");
        } else {
            this.thrust.x = thrust;
        }
    },
    thrustY (thrust) {
        if (this.state === CRASHED) return;
        this.thrust.y = thrust;
    },
    "keydown(ArrowRight)" () { this.thrustX(SIDE_THRUSTER); },
    "keydown(KeyD)" () { this.thrustX(SIDE_THRUSTER); },
    "keyup(ArrowRight)" () { this.thrustX(0); },
    "keyup(KeyD)" () { this.thrustX(0); },
    "keydown(ArrowLeft)" () { this.thrustX(-SIDE_THRUSTER); },
    "keydown(KeyA)" () { this.thrustX(-SIDE_THRUSTER); },
    "keyup(ArrowLeft)" () { this.thrustX(0); },
    "keyup(KeyA)" () { this.thrustX(0); },
    "keydown(ArrowUp)" () { this.thrustY(this.landingGearDeployed ? LANDING_THRUSTER : MAIN_THRUSTER); },
    "keydown(KeyW)" () { this.thrustY(this.landingGearDeployed ? LANDING_THRUSTER : MAIN_THRUSTER); },
    "keyup(ArrowUp)" () { this.thrustY(0); },
    "keyup(KeyW)" () { this.thrustY(0); },
    "keydown(ArrowDown)" () { this.thrustY(-DOWN_THRUSTER); },
    "keydown(KeyX)" () { this.thrustY(-DOWN_THRUSTER); },
    "keyup(ArrowDown)" () { this.thrustY(0); },
    "keyup(KeyX)" () { this.thrustY(0); }
};
