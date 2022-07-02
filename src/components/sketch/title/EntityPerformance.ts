import config from "./config";
import Entity from "./entity/Entity";
import EntityHandler from "./handler/EntityHandler";

/**
 * Handler to compute how many entities a given device can actually handle and scale back from the max until we have a known good amount
 */
class EntityPerformance {
    /**
     * The entity handler bound to the handler
     */
    protected entityHandler: EntityHandler

    /**
     * A buffer to store frame times under for testing system performance
     */
    protected frameTimes: number[]

    /**
     * If cache has loaded
     */
    protected loaded: boolean

    /**
     * The cache key for number of entities loaded
     */
    protected cacheKey: string

    /**
     * The minumum count of entities that can be rendered
     */
    protected minimum: number

    constructor(entityHandler: EntityHandler, minimum: number){
        this.entityHandler = entityHandler
        this.frameTimes = []
        this.loaded = false
        this.minimum = minimum
    }

    public tick(){
        if(this.loaded){
            return
        }

        this.frameTimes.push(Date.now())

        if(this.frameTimes.length > config.performance_sample){
            let avg = this.getAverage()
            // In the event we are still too slow begin a cleanup
            if(avg > this.getTarget()){
                let decrementAmount = this.getDecrementAmount() * Math.max(Math.ceil(avg - this.getTarget()), 10)
                if(this.entityHandler.getEntityCount() - this.getDecrementAmount() < this.minimum){

                    // Do not allow us to drop out too many particles
                    decrementAmount = this.entityHandler.getEntityCount() - this.minimum
                    console.log(`Poor performance detected bare minimum of ${this.minimum} set to be used by config handler`)
                    this.loaded = true
                    this.save(this.minimum)
                }

                this.entityHandler.removeEntities(decrementAmount)

                this.entityHandler.refresh()
                console.log(`Particle count reduced to: ${this.entityHandler.getEntityCount()}`)
                this.frameTimes = []
            } else {
                console.log(`Scaled particle performance. System can handle ${this.entityHandler.getEntityCount()} particles @ ${config.frame_rate} fps`)
                // Otherwise save the known good amount and mark the request as loaded
                this.save(this.entityHandler.getEntityCount())
                this.loaded = true
            }
        }
    }

    // Computes average time in the last Sample size
    protected getAverage(): number{
        let avg = 1
        for(let i = 1; i < this.frameTimes.length; i++){
            avg += (this.frameTimes[i] - this.frameTimes[i-1]) 
        }

        return avg / (this.frameTimes.length - 1)
    }

    protected getTarget(): number{
        return 1000 / config.frame_rate
    }

    protected getDecrementAmount(): number{
        return Math.round(config.max_particles / config.performance_step)
    }

    /**
     * Saves the known good particle count
     * @param goodCount 
     */
    protected save(goodCount: number) {
        localStorage.setItem(this.cacheKey, JSON.stringify(goodCount))
    }

    /**
     * Loads the known good particle count
     * @returns The known good particle count or -1 on no metric
     */
    public load(): number {
        if(this.has()){
            this.loaded = true
            const data = localStorage.getItem(this.cacheKey)
            return JSON.parse(data ?? "")
        }
        return -1
        
    }

    /**
     * Gets if the performance on the page is set to be cached or not
     * @returns If the instance has a cached trigger or not
     */
    public has(): boolean{
        return localStorage.getItem(this.cacheKey) !== null
    }
}

export default EntityPerformance