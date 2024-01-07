import { Slide } from "../../../../interfaces/Header"
import EntityHandler from "../handler/EntityHandler"
import ParticleImage from "../ParticleImage"
import HandlerBehaviour from "./HandlerBehaviour"
import Entity from "../entity/Entity"
import HoverAroundPointBehaviour from "./HoverAroundPointBehaviour"
import { EntityPerformanceConfig } from "../EntityPerformance"

class ParticleImageBehaviour extends HandlerBehaviour {
    protected particleImage: ParticleImage
    protected slide: Slide | null

    public entityPerformanceConfig: EntityPerformanceConfig = {
        cacheKey: "ImagePerfCache-v3",
        min: 1000,
        max: 5000,
        step: 250
    }
    
    constructor(eh: EntityHandler, slide: Slide){
        super(eh)
        this.particleImage = new ParticleImage(eh)
        this.slide = slide
        this.handleSlideBreakpoint()
    }

    onResize(): void {
        this.handleSlideBreakpoint()
        this.particleImage.rescale()
        this.particleImage.retargetParticles()
    }

    public onEntitiesAdded(_entities: Entity[]){
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

     /**
     * @param slide 
     */
    public setSlide(slide: Slide){
        this.slide = slide
        this.handleSlideBreakpoint()
    }

    /**
     * Attempts to load image based on closest breakpoint to image
     * @param params 
     */
    public handleSlideBreakpoint() {
        let targetBreakpoints = Object.keys(this?.slide?.breakpoints ?? {})
            .map(i => parseInt(i))
            .sort((a, b) => {return a - b})
            
        let targetBreakpoint = targetBreakpoints[0]
        
        for(let bp of targetBreakpoints){
            if(this.handler.getWidth() > bp){
                
                targetBreakpoint = bp
            }
        }
        
        let toLoad = this?.slide?.breakpoints[targetBreakpoint]
        let path = this?.slide?.path?.split(".") ?? ""
        let loadPath = `${path[0]}-${toLoad}.${path[1]}`
        this.particleImage.loadTargetImage(loadPath)
    }
}

export default ParticleImageBehaviour