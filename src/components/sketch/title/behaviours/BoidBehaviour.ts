import PVector from "pvectorjs";
import config from "../config";
import EntityBehaviour from "./EntityBehaviour";
import EntityHandler from "../handler/EntityHandler";
import Entity from "../entity/Entity";

export function isBoidBehaviour(entityBehaviour: EntityBehaviour): entityBehaviour is BoidBehaviour {
    return !!entityBehaviour && "position" in entityBehaviour
}

export default class BoidBehaviour extends EntityBehaviour {
    public position: PVector
    public velocity: PVector
    public acceleration: PVector

    public rotation: number;

    constructor(entity: Entity){
        super(entity)
        this.position = new PVector(this.entity.x, this.entity.y)
        this.velocity = new PVector(this.entity.xv, this.entity.yv)
        this.acceleration = new PVector()
    }


    public update(bh: EntityHandler): void {

        this.velocity.x = this.entity.xv
        this.velocity.y = this.entity.yv

        const closestBoids: BoidBehaviour[] = bh.getEntitiesInRange(this.position.x, this.position.y, config.boid_sight_range, true)
            .map(entity => entity.behaviour)
            .filter(isBoidBehaviour)
  
        //////////////////
        //// separation //
        //////////////////
        let separation = this.separate(closestBoids).mult(0.2)

        /////////////////
        //// alignment //
        /////////////////
        let alignment = this.align(closestBoids).mult(0.2)

        ////////////////
        //// cohesion //
        ////////////////
        let cohesion = this.cohesion(closestBoids).mult(0.1)


        this.acceleration
        //    .add(this.pull(closestBoids).mult(-0.2))
        //    .add(this.wind())
            .add(separation)
            .add(alignment)
            .add(cohesion)
        
        this.move(bh)
    }

    move(bh: EntityHandler){
        this.velocity
            .add(this.acceleration)
            .maxMag(config.boid_speed)

        this.position.add(this.velocity)        
        const w = bh.getWidth()
        const h = bh.getHeight()

        // Wrap screen
        this.position.y = (this.position.y + h) % h
        this.position.x = (this.position.x + w) % w

        this.entity.x = this.position.x
        this.entity.y = this.position.y
        this.entity.xv = this.velocity.x
        this.entity.yv = this.velocity.y

        // Reset accelaration
        this.acceleration.mult(0)//.maxMag(5)
    }



    protected separate(boids: BoidBehaviour[]): PVector{
        let avoidence = new PVector();
        let avoidenceCount = 0;

        for (let boid of boids) {
            const distance = this.position.copy().dist(boid.position)
            if ((distance > 0) && (distance < config.boid_avoid_range)) {
                const diff = this.position.clone()
                    .sub(boid.position)
                    .norm()
                    .div(distance)

                avoidence.add(diff)
                avoidenceCount++
            }
        }

        if (avoidenceCount > 0) {
            avoidence.div(avoidenceCount);
        }

        if (avoidence.mag() > 0) {
    
            avoidence.norm()
                .mult(config.boid_speed)
                .sub(this.velocity)
                .maxMag(config.boid_speed)
        }

        return avoidence
    }

    protected align(boids: BoidBehaviour[]): PVector{
        const average = new PVector()

        if(boids.length === 0){
            return average
        }

        for(let boid of boids){
            average.add(boid.velocity)
        }

        average.div(boids.length)
            .norm()
            .mult(config.boid_speed)

        const target = average.sub(this.velocity)
        target.maxMag(config.boid_speed)

        return target
    }

    protected cohesion(boids: BoidBehaviour[]): PVector {
        const cohesion = new PVector() 

        if(boids.length === 0){
            return cohesion
        }

        for(let boid of boids){
            cohesion.add(boid.position)
        }

        cohesion.div(boids.length)

        // Seek
        let desired = cohesion.sub(this.position)

        desired
            .norm()
            .mult(config.boid_speed)

        let steer = desired.sub(this.velocity)
        steer.maxMag(config.boid_speed)
        return steer
    }
}