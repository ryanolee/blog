import ParticleHandler from "./ParticleHandler";
import config from "./config";

const PERFORMANCE_CACHE_KEY = "ParticlePerf-v2"

/**
 * Handler to compute how many particles a given device can actually handle and scale back from the max until we have a known good amount
 */
class ParticlePerformance {
    protected ph: ParticleHandler
    protected frameTimes: number[]
    protected loaded: boolean

    constructor(ph: ParticleHandler){
        this.ph = ph
        this.frameTimes = []
        this.loaded = false
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
                if(this.ph.getParticleCount() - this.getDecrementAmount() < config.min_particles){

                    // Do not allow us to drop out too many particles
                    decrementAmount = this.ph.getParticleCount() - config.min_particles
                    console.log(`Poor performance detected bare minimum of ${config.min_particles} set to be used by config handler`)
                    this.loaded = true
                    this.save(config.min_particles)
                }

                this.ph.removeParticles(decrementAmount)
                this.ph.refresh()
                console.log(`Particle count reduced to: ${this.ph.getParticleCount()}`)
                this.frameTimes = []
            } else {
                console.log(`Scaled particle performance. System can handle ${this.ph.getParticleCount()} particles @ ${config.frame_rate} fps`)
                // Otherwise save the known good amount and mark the request as loaded
                this.save(this.ph.getParticleCount())
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
        localStorage.setItem(PERFORMANCE_CACHE_KEY, JSON.stringify(goodCount))
    }

    /**
     * Loads the known good particle count
     * @returns The known good particle count or -1 on no metric
     */
    public load(): number {
        if(this.has()){
            this.loaded = true
            return JSON.parse(localStorage.getItem(PERFORMANCE_CACHE_KEY))
        }
        return -1
        
    }

    /**
     * Gets if the performance on the page is set to be cached or not
     * @returns If the instance has a cached trigger or not
     */
    public has(): boolean{
        return localStorage.getItem(PERFORMANCE_CACHE_KEY) !== null
    }
}

export default ParticlePerformance