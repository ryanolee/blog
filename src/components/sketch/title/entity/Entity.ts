import * as PIXI from "pixi.js"
import randomcolor from 'randomcolor' 
import EntityBehaviour from "../behaviours/EntityBehaviour";
import config from "../config";
import EntityHandler from "./../handler/EntityHandler";
import { isBoidBehaviour } from "../behaviours/BoidBehaviour";

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
     * Bound behaviour for entity
     */
    public behaviour: EntityBehaviour | null = null

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
    update(eh: EntityHandler) {
        if(this.behaviour !== null){
            this.behaviour.update(eh)
        }
    }

    /**
     * Applies a set force vector to the particle
     * @param xv 
     * @param yv 
     */
    applyForce(xv, yv){
        this.xv += xv 
        this.yv += yv
    }

    /**
     * Directly sets a given force
     * @param xv 
     * @param yv 
     */
    setForce(xv, yv){
        this.xv += xv 
        this.yv += yv
    }

    /**
     * 
     * @param behaviour 
     */
    move(){
        this.x += this.xv
        this.y += this.yv
    }


    setBehaviour(behaviour: EntityBehaviour){
        this.behaviour = behaviour
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
     * Update graphic state to trigger redraw
     */
     draw() {
        this.graphic.x = this.x
        this.graphic.y = this.y
        //this.graphic.clear()
        //this.graphic.beginFill(this.color)
        //
        //this.graphic.lineStyle(config.particle_size, this.color)
        //this.graphic.moveTo(this.x, this.y)
        //this.graphic.lineTo(this.x + this.xv, this.y + this.yv)
        //this.graphic.endFill()
    }
}

export default Entity