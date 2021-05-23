import config from "./config"
import * as PIXI from "pixi.js"
import randomcolor from 'randomcolor' 

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
     * Shape to keep track of / render against
     */
    public graphic: PIXI.Graphics;

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
        this.setupShape()
    }

    setupShape(){
        let line  = new PIXI.Graphics();
        let color = randomcolor({luminosity: 'light'}).replace("#", '')
        //console.log(color)
        line.beginFill(parseInt(`0x${color}`));
        //line.lineStyle(1);
        line.drawCircle(0, 0, config.particle_size);
        line.endFill();

        this.graphic = line
    }

    /**
     * Updates current position
     */
    update() {
        this.x += this.xv
        this.y += this.yv
    }

    /**
     * Update graphic state to trigger redraw
     */
    draw() {
        this.graphic.x = this.x
        this.graphic.y = this.y
        //this.graphic.lineTo(this.x + this.xv, this.y + this.yv)
    }

    /**
     * Yields graphic to use in rendering
     * @returns {PIXI.Graphics} graphic
     */
    getGraphic(): PIXI.Graphics{
        return this.graphic
    }

    /**
     * Cleans up particle
     */
     destroy(){
        return this.graphic.destroy(true)
    }

    /**
     * Updates velocities towards data
     * @param p5 The p5 instance
     * @param width Width of canvas
     * @param height Height of canvas
     */
    aimTowards(width: number, height: number) {
        // Y component wall bounce
        if (Math.abs(this.x - this.tx) > 3) {
            if (this.tx > this.x) {
                this.xv += config.particle_speed * Math.abs(this.tx - this.x);
            }
            else {
                this.xv -= config.particle_speed * Math.abs(this.tx - this.x);
            }
        }

        // X component wall bounce
        if (this.x > width || this.x < 0) {
            if (Math.abs(this.xv * config.dampening_factor) < 1) {
                this.xv = (Math.abs(this.xv) / this.xv) * -1;
            }
            else {
                this.xv *= -config.dampening_factor;
            }
            if (Math.abs(this.x - width) > Math.abs(this.x)) {
                this.x = config.edge_padding
            }
            else {
                this.x = width - config.edge_padding
            }
        }

        // Y component (move towards target)
        if (Math.abs(this.y - this.ty) > 3) {
            if (this.ty > this.y) {
                this.yv += config.particle_speed * Math.abs(this.ty - this.y);
            }
            else {
                this.yv -= (config.particle_speed * Math.abs(this.ty - this.y));
            }
        }

        // Y component (Wall bounce)
        if (this.y > height || this.y < 0) {
            if (Math.abs(this.yv * config.dampening_factor) < 1) {
                this.yv = (Math.abs(this.yv) / this.yv) * -1;
            }
            else {
                this.yv *= -config.dampening_factor;
            }
            if (Math.abs(this.y - height) > Math.abs(this.y)) {
                this.y = config.edge_padding
            }
            else {
                this.y = height - config.edge_padding
            }
        }

        // Apply dampening so we can get to a target
        let dx = Math.abs(this.x - this.tx)
        let dy = Math.abs(this.y - this.ty)


        if (dx < 50 || dy < 50) {
            this.yv = Math.min(this.yv * config.force_correction_to_target, 20)
            this.xv = Math.min(this.xv * config.force_correction_to_target, 20)
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