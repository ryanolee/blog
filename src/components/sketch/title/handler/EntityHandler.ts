//import Particle from './Particle'
import EntityPerformance from '../EntityPerformance'
import arrayShuffle from 'array-shuffle'
import * as PIXI from "pixi.js"
import Entity from '../entity/Entity'



abstract class EntityHandler<T> {
    /**
     * Entities managed by handler
     */
    public entities: (T&Entity)[]

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

    /**
     * @param width Width of canvas to handle
     * @param height Height of canvas to handle
     */
    constructor(width: number, height: number) {
        this.entities = []
        this.width = width
        this.height = height
        this.tick = 0
    }

    /**
     * Updates motion of entity 
     */
    public update(){
        this.tick++
        for(let entity of this.entities){
            entity.update(this)
        }

        // Tick the performance handle
        this.performance.tick()
    }

    /**
     * Removes a given number of entities from the handler
     * @param count 
     */
    public removeEntities(count: number){
        // Tear out entities
        this.entities.splice(0, count).forEach((entity) => {
            entity.destroy()
        })
    }

    /**
     * Render line against config
     */
    public registerEntities(app: PIXI.Application){
        this.entities
            .map(entity => entity.getGraphic())
            .forEach((entity) => {app.stage.addChild(entity)})
    }

    /**
     * Renders entities on frame canvas
     */
    public draw(){
        this.entities.forEach((entity) => {
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
     * Pushes a given number of enitites in random places on the canvas
     * @param target Number of entites to generate
     */
    abstract generateRandom()

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
     * Runs a callback against each particle
     * @param {function} fn The callback to run the function against
     */
    each(fn: (p: T) => void): void{
        this.entities.forEach(fn)
    }

    /**
     * Resizes canvas
     * @param width 
     * @param height 
     */
    public resize(width: number, height: number){
        this.width = width
        this.height = height
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
     * Generates a random number between 0 and upper
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
    public getEntitiesInRange(x: number, y: number, r: number, excludeSelf: boolean = false): T[]{
        return this.entities.filter((particle) => {
            const distance = Math.hypot(Math.abs(x - particle.x), Math.abs(y - particle.y))
            return distance < r && (!excludeSelf || distance !== 0)
        })
    }

    /**
     * Gets the closest particle in a given radius
     */
    public getClosestEntityInRange(x: number, y: number, r: number): T | null{
        let closest: T | null = null
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
     * Update state of entity updates
     */
    refresh(){}
}

export default EntityHandler