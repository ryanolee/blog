import Particle from '../entity/Particle'
import ParticleImage from '../ParticleImage'
import config from "../config"
import * as PIXI from "pixi.js"
import { Slide } from '../../../../interfaces/Header'
import EntityHandler from './EntityHandler'
import EntityPerformance from '../EntityPerformance'

class ParticleHandler extends EntityHandler<Particle> {
    public entities: Particle[]

    /**
     * Particle image reference
     */
     protected particleImage: ParticleImage

     /**
      * Current slide
      */
     protected slide: Slide|null

    /**
     * @param width Width of canvas to handle
     * @param height Height of canvas to handle
     */
    constructor(width: number, height: number) {
        super(width, height)
        this.particleImage = new ParticleImage(this)
        this.tick = 0
    }

    /**
     * Updates motion of particles 
     */
    public update(){
        this.tick++
        for(let particle of this.entities){
            particle.update(this)
            particle.aimTowards(this.width, this.height)
        }

        // Tick the performance handle
        this.performance.tick()
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
        this.entities.forEach((particle) => {
            particle.draw()
        })
    }

    /**
     * Pushes a given number of particles in random places on the canvas
     * @param target Number of particles to generate
     */
    public generateRandom() {
        if(this.performance === null){
            this.performance = new EntityPerformance(this, config.particle_performace_cache_key, config.min_particles)
        }

        let target = this.performance.has() ?  this.performance.load() : config.max_particles
        for (let i = 0; i < target; i++) {
            this.entities.push(new Particle(
                this.random(this.width),
                this.random(this.height)
            ))
        }
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