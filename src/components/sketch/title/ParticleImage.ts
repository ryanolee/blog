import EntityHandler from "./handler/EntityHandler"
import md5 from "md5"
import HoverAroundPointBehaviour from "./behaviours/HoverAroundPointBehaviour"

class ParticleImage {
    protected ph: EntityHandler
    protected width: number
    protected height: number
    protected imageWidth: number
    protected imageHeight: number

    /**
     * Store frame data
     */
    protected frameData:  number[][]

    /**
     * Stores the path to the currently selected image as a sting
     */
    protected selectedImage: string

    constructor(ph: EntityHandler){
        this.ph = ph
        this.width = 1
        this.height = 1
        this.imageWidth = 1
        this.imageHeight = 1
        this.frameData = []
        this.selectedImage = ""
    }

     /**
     * Loads a 2 bit monochrome bitmap image used for updating placements of particles on the canvas 
     * @param imagePath Path to image to pull in
     * @param forceVectorPush Shoots particles towards target with sudden push
     */
    loadTargetImage(imagePath: string, forceVectorPush: boolean = false) {
        if(this.selectedImage === imagePath) return

        // load image in the background
        this.selectedImage = imagePath
        let tempImage = new Image()
        tempImage.src = imagePath

        tempImage.onload = () => {
            //Inject a hidden canvas to handle our image loading / processing
            let dataFor = md5(imagePath)
            document.body.insertAdjacentHTML('beforeend', `<canvas style="display: none" data-for="${dataFor}"></canvas>`)
            let targetCanvas: HTMLCanvasElement | null = document.querySelector(`canvas[data-for="${dataFor}"]`)
            if (targetCanvas === null) {
                console.warn(`Failed to load target ${imagePath} (canvas not found)`)
                return
            }

            // Resize canvas to fit loaded image
            targetCanvas.width = tempImage.width;
            targetCanvas.height = tempImage.height;

            //Draw image to canvas
            let context = targetCanvas.getContext('2d');

            if(context == null) return

            context.drawImage(tempImage, 0, 0);
            let dataOrig: Uint8ClampedArray|null = context.getImageData(0, 0, tempImage.width, tempImage.height).data;
            
            //Take copies of the new image data values
            this.imageWidth = tempImage.width
            this.imageHeight = tempImage.height

            targetCanvas.remove()

            let fourths: number[]|null = [];
            let data: number[][]|null = [];

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

            // Shuffle particle positions
            this.ph.shuffleEntitiyPoses()

            // Rescale and retarget particles to newly stored frame buffer
            this.rescale()
            this.retargetParticles(forceVectorPush)
        }
    }

    /**
     * Updates targets of data inside resize buffer to new location
     * @param forceVectorPush 
     * @returns 
     */
    retargetParticles(forceVectorPush: boolean = false){
        if (this.frameData.length === 0){
            return
        }

        let valid_points: [number, number][] = [];
        for (let y = 0; y < this.frameData.length; y++) {
            for (let x = 0; x < this.frameData[0].length; x++) {
                if (this.frameData[y][x] == 0) {
                    valid_points.push(this.convertCoords(x, y));
                }
            }
        }

        // Fail out if no valid points are given
        if(valid_points.length < 2){
            return
        }

        // @todo refactor this to not directly mutate the PH particles
        for (let i = 0; i < this.ph.entities.length; i++) {
            //console.log(Math.ceil(((valid_points.length / this.particles.length) * i) - 1));
            let selectedPixel = valid_points[Math.floor(((valid_points.length / this.ph.entities.length) * i))];

            this.ph.entities[i].setBehaviour(new HoverAroundPointBehaviour(this.ph.entities[i], selectedPixel[0], selectedPixel[1]))
            if(forceVectorPush){
                this.ph.entities[i].setForce(
                    (selectedPixel[0]-this.ph.entities[i].x)/30,
                    (selectedPixel[1]-this.ph.entities[i].y)/30
                )
            }
        }
    }

    convertCoords(x: number, y:number): [number, number] {
        // Calculate bounds for top corner
        let leftBound = (this.ph.getWidth()/2) - (this.width/2)
        let topBound = (this.ph.getHeight()/2) - (this.height/2)

        // Rescale image against measurement (offset by edge bound)
        return  [
            leftBound + Math.round((x / this.imageWidth) * this.width),
            topBound + Math.round((y / this.imageHeight) * this.height)
        ]
    }

    rescale(){
        // Normalize scale units
        let relativeWidth = this.getScaledWidth(this.ph.getHeight()) 
        let relativeHeight = this.getScaledHeight(this.ph.getWidth())
        
        this.width = relativeWidth > this.ph.getWidth() ?  
            this.ph.getWidth() :
            relativeWidth
        
        this.height = relativeHeight > this.ph.getHeight() ? 
            this.ph.getHeight() : 
            relativeHeight
    }

    /**
     * Handles the currently selected image
     * @returns The currently selected image
     */
    public getCurrentlySelectedImage(): string {
        return this.selectedImage
    }

    /**
     * Scales relative width based on a given height (computed from original image aspect ratio)
     * @param height 
     */
    protected getScaledWidth(height: number) : number{
        return height * (this.imageWidth / this.imageHeight)
    }

    /**
     * Scales relative width based on a given height (computed from original image aspect ratio)
     * @param height 
     */
     protected getScaledHeight(width: number) : number{
        return width * (this.imageHeight / this.imageWidth)
    }
}

export default ParticleImage;