import Particle from './Particle'
import md5 from "md5"
import arrayShuffle from 'array-shuffle'
import * as PIXI from "pixi.js"


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
     * Store frame data
     */
    protected frameData:  [number, number][]

    /**
     * Stores the path to the currently selected image as a sting
     */
    protected selectedImage: string

    /**
     * @param p5 P5 canvas reference
     * @param width Width of canvas to handle
     * @param height Height of canvas to handle
     */
    constructor(width: number, height: number) {
        this.particles = []
        this.width = width
        this.height = height
        this.tick = 0
        this.frameData = []
        this.selectedImage = ""
    }

    /**
     * Updates motion of particles 
     */
    update(){
        this.tick++
        for(let particle of this.particles){
            particle.update()
            particle.aimTowards(this.width, this.height)
        }
    }

    /**
     * Render line against config
     */
    registerParticles(app: PIXI.Application){
        this.particles
            .map(particle => particle.getGraphic())
            .forEach((particle) => {app.stage.addChild(particle)})
    }


    draw(){
        this.particles.forEach((particle) => {
            particle.draw()
        })
    }

    /**
     * Pushes a given number of particles in random places on the canvas
     * @param target Number of particles to generate
     */
    generateRandomParticles(target: number) {
        for (let i = 0; i < target; i++) {
            this.particles.push(new Particle(
                this.random(this.width),
                this.random(this.height)
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
        this.selectedImage = imagePath
        let tempImage = new Image()
        tempImage.src = imagePath

        tempImage.onload = () => {
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

            // Store frame data for future reference
            this.frameData = data

            // Shuffle particles to make transitions ... cooler :D
            this.particles = arrayShuffle(this.particles)

            // Retarget particles to newly stored frame buffer
            this.retargetParticles(forceVectorPush)
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
        return [Math.round((x / xTotal) * this.width), Math.round((y / yTotal) * this.height)];
    }

    /**
     * Destroys all particles managed by handler
     */
    destroy(){
        this.particles.forEach(particle => {particle.destroy()})
        this.particles = []
    }

    // Resizes area handled by particle handler
    resize(width: number, height: number){
        this.width = width
        this.height = height
        this.retargetParticles()
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

    public getCurrentlySelectedImage():string {
        return this.selectedImage
    }

    /**
     * Updates targets of data inside resize buffer to new location
     * @param forceVectorPush 
     * @returns 
     */
    protected retargetParticles(forceVectorPush: boolean = false){
        if (this.frameData === []){
            return
        }

        let valid_points: [number, number][] = [];
        for (let y = 0; y < this.frameData.length; y++) {
            for (let x = 0; x < this.frameData[0].length; x++) {
                if (this.frameData[y][x] == 0) {
                    valid_points.push(this.convertCords(x, y, this.frameData[0].length, this.frameData.length));
                }
            }
        }

        for (let i = 0; i < this.particles.length; i++) {
            //console.log(Math.ceil(((valid_points.length / this.particles.length) * i) - 1));
            let selectedPixel = valid_points[Math.floor(((valid_points.length / this.particles.length) * i))];
            this.particles[i].updateTargetPoint(selectedPixel[0], selectedPixel[1])
            if(forceVectorPush){
                this.particles[i].overrideForce(
                    (selectedPixel[0]-this.particles[i].x)/30,
                    (selectedPixel[1]-this.particles[i].y)/30
                )
            }
        }
    }
}

export default ParticleHandler