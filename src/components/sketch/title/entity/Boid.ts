import PVector from "pvectorjs";
import config from "../config";
import BoidHandler from "../handler/BoidHandler"
import Entity from "./Entity";

/*
 * @name Interactivity 1
 * @frame 720,425
 * @description The circle changes color when you click on it.
 */

// for red, green, and blue color values
//let r = 0
//let W = 720
//let H = 400
//let x = 0
//let y = 0
//function setup() {
//  createCanvas(720, 400);
//  // Pick colors randomly
//}
//
//function draw() {
//  clear()
//  x= cos((2 * PI) /360 * r);
//  y= sin((2 * PI) /360 * r);
//  line(W/2, H/2, (W/2) + x * 100, (H/2) + y *100)
//  
//  r+= 1
//  console.log(r)
//  if(r === 360){
//    r=0
//  }
//}
//
//// When the user clicks the mouse
//function mousePressed() {
//  // Check if mouse is inside the circle
//  
//  console.log(r)
//  
//}

export default class Boid extends Entity{
    public position: PVector
    public velocity: PVector
    public acceleration: PVector

    public rotation: number;

    constructor(x: number, y: number, xv: number = 0, yv: number = 0){
        super(x, y, xv, yv)
        this.position = new PVector(x, y)
        this.velocity = new PVector(0, 0)
        this.acceleration = new PVector()
        this.rotation = Math.floor(Math.random() * 360)
    }


    public update(bh: BoidHandler): void {
        const closestBoids : Boid[] = bh.getEntitiesInRange(this.position.x, this.position.y, config.boid_sight_range, true) as Boid[]
        //
        //if(bh.entities[0].x === this.x){
        //    console.log(closestBoids)
        //}
        
        //////////////////
        //// separation //
        //////////////////
        let separation = this.separate(closestBoids).mult(0.2)
//
        /////////////////
        //// alignment //
        /////////////////
        let alignment = this.align(closestBoids).mult(0.2)
//
        ////////////////
        //// cohesion //
        ////////////////
        let cohesion = this.cohesion(closestBoids).mult(0.2)


        this.acceleration
        //    .add(this.pull(closestBoids).mult(-0.2))
        //    .add(this.wind())
            .add(separation)
            .add(alignment)
            .add(cohesion)
        
    }

    move(bh: BoidHandler){
        this.velocity
            .add(this.acceleration)
            .maxMag(config.boid_speed)

        this.position.add(this.velocity)        
        const w = bh.getWidth()
        const h = bh.getHeight()

        // Wrap screen
        this.position.y = (this.position.y + h) % h
        this.position.x = (this.position.x + w) % w
        this.x = this.position.x
        this.y = this.position.y
        // Reset accelaration
        this.acceleration.mult(0)//.maxMag(5)
    }



    protected separate(boids: Boid[]): PVector{
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

    protected align(boids: Boid[]): PVector{
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

    protected cohesion(boids: Boid[]): PVector {
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

    /**
     * Update graphic state to trigger redraw
     */
     draw() {
        //this.graphic.x = this.x
        //this.graphic.y = this.y
        //this.graphic.lineTo(this.x + this.xv, this.y + this.yv)
        this.graphic.clear()
        this.graphic.beginFill(this.color)
        this.graphic.drawCircle(this.position.x, this.position.y, config.particle_size)
        this.graphic.lineStyle(config.particle_size, this.color)
        this.graphic.moveTo(this.x, this.y)
        this.graphic.lineTo(this.x + this.xv, this.y + this.yv)
        this.graphic.endFill()  
    }

    protected updateTurn(){
        this.rotation
    }
}