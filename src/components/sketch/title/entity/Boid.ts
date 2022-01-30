import config from "../config";
import Particle from "./Particle";
import ParticleHandler from "./../entity/ParticleHandler";

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

export default class Boid extends Particle{
    public rotation: number;

    constructor(x: number, y: number, xv: number = 0, yv: number = 0){
        super(x, y, xv, yv)
        this.rotation = Math.floor(Math.random() * 360)
    }


    public update(ph: ParticleHandler): void {
        // Compute motion vector
        this.xv = Math.cos((2 * Math.PI) / 360 * this.rotation) * config.boid_speed
        this.yv = Math.sin((2 * Math.PI) / 360 * this.rotation) * config.boid_speed

        // Move towards closest boid in range
        //const closestBoid : Boid = ph.getClosestParticleInRange(this.x, this.y, config.boid_sight_range) as Boid
        
        //if(closestBoid !== null){
        //    this.rotation += (closestBoid.rotation - this.rotation) / 45
        //}

        const closestBoids : Boid[] = ph.getParticlesInRange(this.x, this.y, config.boid_sight_range) as Boid[]
        const avg = closestBoids.reduce((acc, boid) => acc + boid.rotation , 0) / closestBoids.length
//
        this.rotation += (avg - this.rotation)  / 45
        if(this.rotation > 360){
            this.rotation -= 360
        }

        if(this.rotation < 0) {
            this.rotation + 360
        }
    }

    protected updateTurn(){
        this.rotation
    }

    public applyForce(xv: any, yv: any): void {}
    public aimTowards(w, h){
        this.x += this.xv
        this.y += this.yv
        
        if(this.y > h){
            this.y = 0 
        } else if( this.y < 0){
            this.y = h
        }

        if(this.x > w){
            this.x = 0 
        } else if( this.x < 0){
            this.x = w
        }
    }
}