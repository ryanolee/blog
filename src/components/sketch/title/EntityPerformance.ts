import globalConfig from "./config";
import Entity from "./entity/Entity";
import EntityHandler from "./handler/EntityHandler";

// Number of frames to render before making choice on which direction to ratchet performance
const SAMPLE_SIZE = 10;

const LOWER_FPS_TARGET_MS = 1000 / 50
const UPPER_FPS_TARGET_MS = 1000 / 60 

const CYCLE_DETECTION_TARGET = 20;

enum Direction {
    DOWN = 0,
    UP = 1
}

export interface EntityPerformanceConfig {
    /**
     * Minimum number of entities that can be handled performance handler
     */
    min: number

    /**
     * The maximum number of entities allowed by the performance handler
     */
    max: number

    /**
     * The cache key for the handler
     */
    cacheKey: string 

    /** 
     * The increments to increment or decrement in based on the maximum and min values given
     */
    step?: number
}

/**
 * Handler to compute how many entities a given device can actually handle and scale back from the max until we have a known good amount
 */
export default class EntityPerformance {
    /**
     * The entity handler bound to the handler
     */
    protected entityHandler: EntityHandler

    /**
     * A buffer to store frame times under for testing system performance
     */
    protected frameTimes: number[]

    /**
     * If cache has been loaded from
     */
    protected loaded: boolean

    /**
     * Tracks if this is the first time we are loading from cache
     */
    protected initialLoad: boolean

    /**
     * The cache key for number of entities loaded
     */
    protected cacheKey: string

    /**
     * The minumum count of entities that can be rendered
     */
    protected minimum: number|null = null

    /**
     * Maximum number of entities that can be rendered
     */
    protected maximum: number|null = null

    /**
     * The steps to take
     */
    protected step: number|null 

    /**
     * Keep track of the directions we are going in so we do not get stuck
     */
    protected directions: Direction[] = []

    constructor(entityHandler: EntityHandler){
        this.entityHandler = entityHandler
        this.frameTimes = []
        this.directions = []
        
        // Set as initially loaded as we begin setting performance when
        // config is set by the entity handler
        this.loaded = true
    }

    /**
     * 
     * @param cacheKey Sets the performance cache key for a given entity
     */
    public setConfig(config: EntityPerformanceConfig){
        this.cacheKey = config.cacheKey
        this.minimum = config.min
        this.maximum = config.max
        this.step = config?.step ?? globalConfig.performance_step
        
        this.loaded = false
        this.initialLoad = this.has()
        this.frameTimes = []
        
        this.setTarget() // Try and update bound entity handler from cache
    }

    public tick(){
        if(this.loaded){
            return
        }
        this.takeSample()
        this.makeChoice()
        
    }

    /**
     * Makes choice on which direction to travel or if to stop
     */
    protected makeChoice() {
        // Don't bother if our sample size is too small
        if(this.frameTimes.length < SAMPLE_SIZE){
            return
        }

        const averageFrameRateMs = this.getAverage()
        console.log([averageFrameRateMs, LOWER_FPS_TARGET_MS, UPPER_FPS_TARGET_MS])
        if(this.entityHandler.getEntityCount() <= this.minimum){
            console.warn('Warning: Performance below recommended. Lag is expected.')
            this.save(this.minimum)
            this.loaded = true
        }

        if(this.entityHandler.getEntityCount()  >= this.maximum) {
            console.warn('Warning: Computer is reporting times faster than maximum. Capping performance.')
            this.save(this.maximum)
            this.loaded = true
        }

        if(averageFrameRateMs < LOWER_FPS_TARGET_MS){
            this.stepUp()
        }

        // Too slow
        if(averageFrameRateMs > UPPER_FPS_TARGET_MS){
            this.stepDown()
        }

        if(this.directions.length > CYCLE_DETECTION_TARGET){
            const avgDirection = this.getAverageDirection()
            console.log(this.getAverageDirection())
            if(avgDirection > 0.40  && avgDirection < 0.60){
                console.warn(`Cannot determine an exact per value so storing at ${this.entityHandler.getEntityCount()} here.`)
                this.save(this.entityHandler.getEntityCount())
                this.loaded = true
            }
        }

        if(averageFrameRateMs < LOWER_FPS_TARGET_MS && averageFrameRateMs > UPPER_FPS_TARGET_MS){
            this.save(this.entityHandler.getEntityCount())
            this.loaded = true
            console.info(`Saved performance at ${this.entityHandler}`)
        }
        
    }

    protected takeSample() {
        this.frameTimes.push(Date.now())
    }

    /**
     * Puts browser under more load
     */
    protected stepUp() {
        console.log("Adding particles as we have the room")
        this.frameTimes = []
        this.entityHandler.addEntities(this.step)
        this.directions.push(Direction.UP)
    }

    /**
     * Puts browser under less load
     */
    protected stepDown() {
        console.log("Removing particles to speed up")
        this.frameTimes = []
        this.entityHandler.removeEntities(this.step)
        this.directions.push(Direction.DOWN)
    }

    protected setTarget() {
        const target = this.load()
        if(target === null){
            // Set target to be mid point of range if we do not have one
            const guessTarget = this.minimum + (this.maximum - this.minimum) / 2
            this.entityHandler.setEntities(guessTarget, false)
        } else {
            this.entityHandler.setEntities(target)
        }
    }

    protected getAverageDirection() {
        const lastNChanges = this.directions.slice(Math.max(0, this.directions.length - CYCLE_DETECTION_TARGET))
        const totalNChanges = lastNChanges.reduce((acc, i) => acc + i, 0)
        return totalNChanges / CYCLE_DETECTION_TARGET
    }

    // Computes average time in the last Sample size
    protected getAverage(): number{
        let avg = 1
        for(let i = 1; i < this.frameTimes.length; i++){
            avg += (this.frameTimes[i] - this.frameTimes[i-1]) 
        }

        return (avg / (this.frameTimes.length - 1))
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
     * @returns The known good particle count or null on no metric
     */
    public load(): number | null{
        if(this.has()){
            this.loaded = true
            const data = localStorage.getItem(this.cacheKey)
            return JSON.parse(data ?? "")
        }
        return null
        
    }

    /**
     * Gets if the performance on the page is set to be cached or not
     * @returns If the instance has a cached trigger or not
     */
    public has(): boolean{
        return localStorage.getItem(this.cacheKey) !== null
    }
}

