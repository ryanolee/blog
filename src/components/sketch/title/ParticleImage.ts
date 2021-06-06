import ParticleHandler from "./ParticleHandler";

class ParticleImage {
    protected ph: ParticleHandler
    protected width: number
    protected height: number
    protected imageWidth: number
    protected imageHeight: number

    /**
     * Store frame data
     */
    protected frameData:  [number, number][]

    /**
     * Stores the path to the currently selected image as a sting
     */
     protected selectedImage: ParticleImage

    constructor(ph: ParticleHandler){
        this.ph = ph
        this.width = 1
        this.height = 1
        this.imageWidth = 1
        this.imageHeight = 1
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

    convertCoords(x, y) {
        // Calculate bounds for top corner
        let leftBound = (this.ph.getWidth()/2) - (this.width/2)
        let topBound = (this.ph.getHeight()/2) - (this.height/2)

        // Rescale image against measurement (offset by edge bound)
        return  [leftBound + Math.round((x / this.imageWidth) * this.width), topBound + Math.round((y / this.imageHeight) * this.height)]
    }

    rescale(){

        // Normalize scale units
        let widthScaleUnit = this.ph.getWidth() / this.imageWidth
        let HeightScaleUnit = this.ph.getHeight() / this.imageHeight
        
        // Handle width
        let isWidthRelativelyLarger = widthScaleUnit > HeightScaleUnit
        
        this.width = isWidthRelativelyLarger ? 
            HeightScaleUnit *  this.ph.getHeight() :
            this.ph.getWidth()
        
        this.height = isWidthRelativelyLarger ? 
            this.ph.getHeight() : 
            widthScaleUnit *  this.ph.getWidth()
        
    }
}