import * as PIXI from "pixi.js"
import randomcolor from 'randomcolor' 
import EntityHandler from "./../handler/EntityHandler";

class Entity {
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
     * The color of an entity
     */
    public color: number;

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
        this.setupShape()
    }

    setupShape(){
        let line  = new PIXI.Graphics();
        let color = randomcolor({luminosity: 'light'}).replace("#", '')
        this.color = parseInt(`0x${color}`)
        //console.log(color)
        //line.beginFill(parseInt(`0x${color}`));
        //line.lineStyle(1);
        //line.drawCircle(0, 0, config.particle_size);
        //line.lineStyle(config.particle_size, parseInt(`0x${color}`))
        //line.line
        //line.endFill();

        this.graphic = line
    }

    /**
     * Updates current position
     */
    update(_ph: EntityHandler<unknown>) {}

    /**
     * Update graphic state to trigger redraw
     */
    draw() {}

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
}

export default Entity