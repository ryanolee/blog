import p5Types from "p5";
import config from "./config"

class Particle {
    /**
     * X position of particle
     */
    public x: number;

    /**
     * Y position of particle
     */
    public y: number;

    /**
     * X position of particle
     */
    public xv: number;

    /**
     * Y position of particle
     */
    public yv: number;

    /**
     * Target X position of particle
     */
    public tx: number;

    /**
     * Target y position of particle
     */
    public ty: number;

    /**
     * Speed
     */
    public speed: number;

    /**
     * 
     * @param {number} x Initial X pos
     * @param y Initial Y pos
     * @param xv Initial X velocity
     * @param yv Initial Y velocity
     */
    constructor(x: number, y: number, xv: number = 0, yv: number = 0) {
        this.x = x
        this.y = y
        this.xv = xv
        this.yv = yv
        this.tx = x
        this.ty = y
    }

    /**
     * Updates current position
     */
    update() {
        this.x += this.xv
        this.y += this.yv
    }

    draw(p5: p5Types) {
        p5.line(this.x, this.y, this.x + this.xv, this.y + this.yv)
    }

    /**
     * Updates velocities towards data
     * @param p5 The p5 instance
     * @param width Width of canvas
     * @param height Height of canvas
     */
    aimTowards(p5: p5Types, width: number, height: number) {
        // Y component wall bounce
        if (p5.abs(this.x - this.tx) > 3) {
            if (this.tx > this.x) {
                this.xv += config.particle_speed * p5.abs(this.tx - this.x);
            }
            else {
                this.xv -= config.particle_speed * p5.abs(this.tx - this.x);
            }
        }

        // X component wall bounce
        if (this.x > width || this.x < 0) {
            if (p5.abs(this.xv * config.dampening_factor) < 1) {
                this.xv = (p5.abs(this.xv) / this.xv) * -1;
            }
            else {
                this.xv *= -config.dampening_factor;
            }
            if (p5.abs(this.x - width) > p5.abs(this.x)) {
                this.x = config.edge_padding
            }
            else {
                this.x = width - config.edge_padding
            }
        }

        // Y component (move towards target)
        if (p5.abs(this.y - this.ty) > 3) {
            if (this.ty > this.y) {
                this.yv += config.particle_speed * p5.abs(this.ty - this.y);
            }
            else {
                this.yv -= (config.particle_speed * p5.abs(this.ty - this.y));
            }
        }

        // Y component (Wall bounce)
        if (this.y > height || this.y < 0) {
            if (p5.abs(this.yv * config.dampening_factor) < 1) {
                this.yv = (p5.abs(this.yv) / this.yv) * -1;
            }
            else {
                this.yv *= -config.dampening_factor;
            }
            if (p5.abs(this.y - height) > p5.abs(this.y)) {
                this.y = config.edge_padding
            }
            else {
                this.y = height - config.edge_padding
            }
        }

        // Apply dampening so we can get to a target
        let dx = p5.abs(this.x - this.tx)
        let dy = p5.abs(this.y - this.ty)


        if (dx < 50 || dy < 50) {
            this.yv = p5.min(this.yv * config.force_correction_to_target, 20)
            this.xv = p5.min(this.xv * config.force_correction_to_target, 20)
        }
    }

    /**
     * @param x  Target x position
     * @param y  Target y position
     */
    updateTargetPoint(x: number, y: number) {
        this.tx = x
        this.ty = y
    }

    /**
     * @param x  Target x position
     * @param y  Target y position
     */
    overrideForceVector(x: number, y: number) {
        this.xv = x
        this.yv = y
    }
}

export default Particle