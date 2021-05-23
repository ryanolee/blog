import Particle from './Particle'
import p5Types from "p5"
import md5 from "md5"

class ParticleHandler {
    /**
     * Particles managed by handler
     */
    protected particles: Particle[]

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
     * P5 canvas reference
     */
    protected p5: p5Types

    /**
     * @param p5 P5 canvas reference
     * @param width Width of canvas to handle
     * @param height Height of canvas to handle
     */
    constructor(p5: p5Types, width: number, height: number) {
        this.particles = []
        this.width = width
        this.height = height
        this.p5 = p5
        this.tick = 0
    }

    /**
     * Updates motion of particles 
     */
    update(){
        this.tick++
        for(let particle of this.particles){
            particle.update()
            particle.aimTowards(this.p5, this.width, this.height)
        }
    }

    /**
     * Render line against config
     */
    draw(){
        this.particles.forEach((particle) => {
            particle.draw(this.p5)
        })
    }

    /**
     * Pushes a given number of particles in random places on the canvas
     * @param target Number of particles to generate
     */
    generateRandomParticles(target: number) {
        for (let i = 0; i < target; i++) {
            this.particles.push(new Particle(
                this.p5.random(this.width),
                this.p5.random(this.height)
            ))
        }
    }

    /**
     * Loads a 2 bit monochrome bitmap image used for updating placements of particles on the canvas 
     * @param imagePath Path to image to pull in
     * @param forceVectorPush Shoots particles towards target with sudden push
     */
    loadTargetImage(imagePath: string, forceVectorPush: boolean = false) {
        // load image in the background
        let tempImage = new Image()
        tempImage.src = imagePath

        tempImage.onload = () => {
            console.log("LOADED")
            //Inject a hidden canvas to handle our image loading / processing
            let dataFor = md5(imagePath)
            document.body.insertAdjacentHTML('beforeend', `<canvas style="display: none" data-for="${dataFor}"></canvas>`)
            let targetCanvas: HTMLCanvasElement = document.querySelector(`canvas[data-for="${dataFor}"]`)
            if (targetCanvas === null) {
                console.warn(`Failed to load target ${imagePath} (canvas not found)`)
            }

            // Resize canvas to fit loaded image
            targetCanvas.width = tempImage.width;
            targetCanvas.height = tempImage.height;

            //Draw image to canvas
            let context = targetCanvas.getContext('2d');
            context.drawImage(tempImage, 0, 0);
            let dataOrig = context.getImageData(0, 0, tempImage.width, tempImage.height).data;
            targetCanvas.remove()

            let fourths = [];
            let data = [];

            // Only read every 4th byte of the RGBA encoding
            for (let i = 0; i < dataOrig.length; i += 4) {//Remove RGBA color encoding
                fourths.push(dataOrig[i]);
            }

            //Free memory reference 
            dataOrig = null

            // Collapse memory representation to 2D array
            for (let i = 0; i < tempImage.height; i++) {
                data.push(fourths.slice(i * tempImage.width, (i + 1) * tempImage.width));
            }

            //Free memory reference
            fourths = null;

            let valid_points: [number, number][] = [];
            for (let y = 0; y < data.length; y++) {
                for (let x = 0; x < data[0].length; x++) {
                    if (data[y][x] == 0) {
                        valid_points.push(this.convertCords(x, y, tempImage.width, tempImage.height));
                    }
                }
            }

            //Free memory reference
            data = null

            for (let i = 0; i < this.particles.length; i++) {
                console.log([i, new Date().getTime()])
                let selectedPixel = valid_points[this.p5.round((valid_points.length / this.particles.length) * i)];
                this.particles[i].updateTargetPoint(selectedPixel[0], selectedPixel[1])
                this.particles[i].overrideForceVector(
                    (selectedPixel[0]-this.particles[i].x)/30,
                    (selectedPixel[1]-this.particles[i].y)/30
                )
            }
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
    convertCords(x: number, y: number, xTotal: number, yTotal: number): [number, number] {
        return [this.p5.round((x / xTotal) * this.width), this.p5.round((y / yTotal) * this.height)];
    }
}

export default ParticleHandler