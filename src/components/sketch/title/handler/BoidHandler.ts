
import BoidPerformance from '../EntityPerformance'
import arrayShuffle from 'array-shuffle'
import config from '../config'
import Boid from '../entity/Boid'
import EntityHandler from './EntityHandler'
import PVector from "pvectorjs";


class BoidHandler extends EntityHandler<Boid> {

    protected mouseX: number
    protected mouseY: number

    /**
     * @param width Width of canvas to handle
     * @param height Height of canvas to handle
     */
    constructor(width: number, height: number) {
        super(width, height)
        this.tick = 0
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
     * Updates motion of particles 
     */
    public update(){
        this.tick++
        const boids = this.getEntitiesInRange(this.mouseX, this.mouseY, 300)
        boids.forEach(boid => {
            const diff = new PVector(this.mouseX, this.mouseY).sub(boid.position)
            boid.acceleration.sub(diff.norm().mult(0.4))
        })
        console.log(this.entities[0])
        this.each((boid) => boid.update(this))
        this.each((boid) => boid.move(this))
        
        //debugger
        // Tick the performance handle
        //this.performance.tick()
    }

    /**
     * The number of particles the manger is handling
     * @returns The number of particles
     */
    public getParticleCount(): number {
        return this.entities.length
    }

    /**
     * Pushes a given number of particles in random places on the canvas
     * @param target Number of particles to generate
     */
    public generateRandom() {
        //let target = this.performance.has() ?  this.performance.load() : config.max_particles
        for (let i = 0; i < 200; i++) {
            this.entities.push(new Boid(
                this.random(this.width),
                this.random(this.height)
            ))
        }
    }

    /**
     * Shuffles particle positions to align randomly 
     */
    public shuffleParticlePoses(){
        // Shuffle particles to make transitions ... cooler :D
        this.entities = arrayShuffle(this.entities)
    }

    /**
     * Destroys all particles managed by handler
     */
    public destroy(){
        this.entities.forEach(boid => {boid.destroy()})
        this.entities = []
    }

    /**
     * Runs a callback against each particle
     * @param {function} fn The callback to run the function against
     */
    each(fn: (p: Boid) => void): void{
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
     * Gets the width of the area bounded by the particle handler
     */
    public getWidth(): number{
        return this.width
    }

    /**
     * Gets the height of the area bounded by the particle handler
     */
     public getHeight(): number{
        return this.height
    }
}

export default BoidHandler