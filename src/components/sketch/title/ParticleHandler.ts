import Particle from './Particle'
import ParticleImage from './ParticleImage'
import ParticlePerformance from './ParticlePerformance'
import config from "./config"
import arrayShuffle from 'array-shuffle'
import * as PIXI from "pixi.js"
import { Slide } from '../../../interfaces/Header'


class ParticleHandler {
    /**
     * Particles managed by handler
     */
    public particles: Particle[]

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
     * Particle image reference
     */
    protected particleImage: ParticleImage

    /**
     * Current slide
     */
    protected slide: Slide|null

    /**
     * Performance handler
     */
    protected performance: ParticlePerformance

    /**
     * @param width Width of canvas to handle
     * @param height Height of canvas to handle
     */
    constructor(width: number, height: number) {
        this.particles = []
        this.width = width
        this.height = height
        this.particleImage = new ParticleImage(this)
        this.performance = new ParticlePerformance(this)
        this.tick = 0
    }

    /**
     * Updates motion of particles 
     */
    public update(){
        this.tick++
        for(let particle of this.particles){
            particle.update()
            particle.aimTowards(this.width, this.height)
        }

        // Tick the performance handle
        this.performance.tick()
    }

    /**
     * Removes a given number of particles from the handler
     * @param count 
     */
    public removeParticles(count: number){
        // Tear out particles
        this.particles.splice(0, count).forEach((particle) => {
            particle.destroy()
        })
    }

    /**
     * Render line against config
     */
    public registerParticles(app: PIXI.Application){
        this.particles
            .map(particle => particle.getGraphic())
            .forEach((particle) => {app.stage.addChild(particle)})
    }

    /**
     * @param slide 
     */
    public setSlide(slide: Slide){
        this.slide = slide
        this.handleSlideBreakpoint()
        //this.refresh()
    }

    /**
     * Attempts to load image based on closest breakpoint to image
     * @param params 
     */
    public handleSlideBreakpoint() {
        let targetBreakpoints = Object.keys(this.slide.breakpoints)
            .map(i => parseInt(i))
            .sort((a, b) => {return a - b})
            
        let targetBreakpoint = targetBreakpoints[0]
        
        for(let bp of targetBreakpoints){
            if(this.width > bp){
                
                targetBreakpoint = bp
            }
        }
        
        let toLoad = this.slide.breakpoints[targetBreakpoint]
        let path = this.slide.path.split(".")
        let loadPath = `${path[0]}-${toLoad}.${path[1]}`
        this.particleImage.loadTargetImage(loadPath)
    }

    /**
     * Renders particles on frame
     */
    public draw(){
        this.particles.forEach((particle) => {
            particle.draw()
        })
    }

    /**
     * The number of particles the manger is handling
     * @returns The number of particles
     */
    public getParticleCount(): number {
        return this.particles.length
    }

    /**
     * Pushes a given number of particles in random places on the canvas
     * @param target Number of particles to generate
     */
    public generateRandomParticles() {
        let target = this.performance.has() ?  this.performance.load() : config.max_particles
        for (let i = 0; i < target; i++) {
            this.particles.push(new Particle(
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
        this.particles = arrayShuffle(this.particles)
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
     * Destroys all particles managed by handler
     */
    public destroy(){
        this.particles.forEach(particle => {particle.destroy()})
        this.particles = []
    }

    /**
     * Runs a callback against each particle
     * @param {function} fn The callback to run the function against
     */
    each(fn: (p:Particle) => void): void{
        this.particles.forEach(fn)
    }

    /**
     * Resizes canvas
     * @param width 
     * @param height 
     */
    public resize(width: number, height: number){
        this.width = width
        this.height = height
        this.handleSlideBreakpoint()
        this.refresh()
        
    }

    /**
     * Recomputes internal image data
     */
    public refresh(){
        this.particleImage.rescale()
        this.particleImage.retargetParticles()
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
     * @returns {Particle[]}
     */
    public getParticlesInRange(x: number, y: number, r: number): Particle[]{
        return this.particles.filter((particle) => {
            return Math.hypot(Math.abs(x - particle.x), Math.abs(y - particle.y)) < r
        })
    }

    /**
     * Loads a new image for a given target
     * @param img Path to image
     */
    public loadTargetImage(img: string){
        this.particleImage.loadTargetImage(img)
    }

    /**
     * Gets the currently selected image
     * @returns the currently selected image
     */
    public getCurrentlySelectedImage():string {
        return this.particleImage.getCurrentlySelectedImage()
    }
}

export default ParticleHandler