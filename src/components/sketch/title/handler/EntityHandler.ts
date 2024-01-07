//import Particle from './Particle'
import EntityPerformance from '../EntityPerformance'
import arrayShuffle from 'array-shuffle'
import * as PIXI from "pixi.js"
import Entity from '../entity/Entity'
import ParticleImage from '../ParticleImage'
import { Slide } from '../../../../interfaces/Header'
import config from '../config'
import HandlerBehaviour from '../behaviours/HandlerBehaviour'
import RunAwayBehaviour from '../behaviours/RunAwayBehavior'

enum Side{
    UP = 1,
    DOWN = 2,
    LEFT = 3,
    RIGHT = 4
}

class EntityHandler {
    /**
     * The x position of the mouse
     */
    protected mouseX: number

    /**
     * The Y position of the mouse
     */
    protected mouseY: number

    /**
     * Entities managed by handler
     */
    public entities: Entity[]

    /**
     * Frames rendered since the website loaded
     */
    protected tick: number

    /**
     * Width of canvas
     */
    protected width: number

    /**
     * Height of canvas
     */
    protected height: number

    /**
     * Performance handler
     */
    protected performance: EntityPerformance | null = null;

    protected behaviour: HandlerBehaviour | null

    protected app: PIXI.Application

    /**
     * Entities marked for death
     */
    public purgeQueue: Entity[] = []

    /**
     * @param width Width of canvas to handle
     * @param height Height of canvas to handle
     */
    constructor(width: number, height: number, app: PIXI.Application) {
        this.app = app
        this.entities = []
        this.width = width
        this.height = height
        this.tick = 0
        this.performance = new EntityPerformance(this)
    }

    /**
     * Updates motion of entity 
     */
    public update(){
        this.tick++
        for(let entity of this.entities){
            entity.update(this)
        }

        for(let entity of this.purgeQueue){
            entity.update(this)
        }

        // Tick the performance handle
        if(this.performance){
            this.performance.tick()
        }
    }

    /**
     * Removes a given number of entities from the handler
     * @param count 
     */
    public removeEntities(count: number, instant = true){
        // Tear out entities
        const particlesToDestroy = this.entities.splice(0, count)
        if(instant){
            particlesToDestroy.forEach((entity) => {
                entity.destroy()
            })
            this?.behaviour?.onEntitiesAdded([])
        } else {
            particlesToDestroy.forEach(entity => entity.setBehaviour(new RunAwayBehaviour(entity)))
            this.purgeQueue.push(...particlesToDestroy)
            this?.behaviour?.onEntitiesAdded([])
        }   
    }

    public addEntities(count: number){
        for(let i = 0; i < count; i++){
            this.createEntity(...this.getRandomPointOnEdge())
        }

        this.behaviour?.onEntitiesAdded([])
    }

    /**
     * Sets a target number of entites
     */
    public setEntities(count: number, instant: boolean = true){
        const entityCount = this.getEntityCount()
        count > entityCount ?
            this.addEntities(count - entityCount) :
            this.removeEntities(entityCount - count, instant)
    }

    /**
     * Renders entities on frame canvas
     */
    public draw(){
        this.entities.forEach((entity) => {
            entity.draw()
        })

        this.purgeQueue.forEach((entity) => {
            entity.draw()
        })
    }

    /**
     * The number of entities the manger is handling
     * @returns The number of entities
     */
    public getEntityCount(): number {
        return this.entities.length
    }

    /**
     * Shuffles entities positions to align randomly 
     */
    public shuffleEntitiyPoses(){
        // Shuffle entitities to make transitions look ... cooler
        this.entities = arrayShuffle(this.entities)
    }

    /**
     * Destroys all particles managed by handler
     */
    public destroy(){
        this.entities.forEach(entity => {entity.destroy()})
        this.entities = []
    }

    /**
     * 
     * @param entity Removes item from the purge queue
     */
    public flushEntity(entity: Entity){
        this.purgeQueue = this.purgeQueue.filter(item => entity !== item)
    }

    /**
     * Runs a callback against each particle
     * @param {function} fn The callback to run the function against
     */
     public each(fn: (p: Entity) => void): void{
        this.entities.forEach(fn)
    }

    /**
     * Gets the width of the area bounded by the entity handler
     */
    public getWidth(): number{
        return this.width
    }

    /**
     * Gets the height of the area bounded by the entity handler
     */
     public getHeight(): number{
        return this.height
    }

    /**
     * Generates a random number between 1 and upper
     * @param upper 
     * @returns The random number
     */
    protected random(upper: number): number{
        return Math.floor(Math.random() * upper+1); 
    }

    /**
     * Gets particles in a given circle
     * @param x Center of the circle x pos
     * @param y Center of the circle y pos
     * @param r radius
     * @param excludeSelf Excludes direct matches
     * @returns {Entity[]}
     */
    public getEntitiesInRange(x: number, y: number, r: number, excludeSelf: boolean = false): Entity[]{
        return this.entities.filter((particle) => {
            const distance = Math.hypot(Math.abs(x - particle.x), Math.abs(y - particle.y))
            return distance < r && (!excludeSelf || distance !== 0)
        })
    }

    /**
     * Gets the closest particle in a given radius
     */
    public getClosestEntityInRange(x: number, y: number, r: number): Entity | null{
        let closest: Entity | null = null
        let closestDistance = Infinity
        for(let entity of this.entities){
            const distance = Math.hypot(Math.abs(x - entity.x), Math.abs(y - entity.y))
            if(distance < r && distance < closestDistance && distance !== 0){
                closestDistance = distance
                closest = entity
            }
        }

        return closest
    }

    /**
     * Sets the mouse position
     * @param x 
     * @param y 
     */
    public setMousePos(x: number, y: number){
        this.mouseX = x
        this.mouseY = y
    }

    /**
     * Creates an enitity and registers it with the thing
     * @param x 
     * @param y 
     * @returns 
     */
    public createEntity(x: number, y: number){
        const entity = new Entity(x, y)

        this.entities.push(entity)
        const graphic = entity.getGraphic()
        this.app.stage.addChild(graphic)
        return entity
    }

    /**
     * Converts a coordonate from an arbitrary scale to one fitting the area managed by 
     * @param x x pos in arbitrary canvas space to the aria managed by the particle handle
     * @param y y pos in arbitrary canvas space to the aria managed by the particle handle
     * @param xTotal Width of arbitrary space
     * @param yTotal Height of arbitrary space
     * @returns Converted coordonates
     */
    public convertCords(x: number, y: number, xTotal: number, yTotal: number): [number, number] {
        return [Math.round((x / xTotal) * this.width), Math.round((y / yTotal) * this.height)];
    }

    /**
     * Resizes canvas
     * @param width 
     * @param height 
     */
    public resize(width: number, height: number){
        this.width = width
        this.height = height
        this.behaviour?.onResize()
        
    }

    /**
     * Gets the current handler behaviour
     * @returns behaviour
     */
    public getBehaviour(): HandlerBehaviour|null{
        return this.behaviour
    }

    public setBehaviour(behaviour: HandlerBehaviour){
        console.log("Set behaviour")
        this.behaviour = behaviour
        
        // Register performance handler
        this.performance?.setConfig(behaviour.entityPerformanceConfig)

        //  Pass in entities so that handlers can manage entities
        this.behaviour.onEntitiesAdded(this.entities)

        
    }

    protected getRandomPointOnEdge(): [number, number]{
        const side = this.random(4)

        switch(side){
            case Side.UP: //UP
                return [this.random(this.width), 0]
            case Side.DOWN:
                return [this.random(this.width), this.height]
            case Side.LEFT:
                return [0, this.random(this.height)]
            case Side.RIGHT:
                return [this.width, this.random(this.height)]
        }

        throw new Error("Invalid side")
    
    }
}

export default EntityHandler