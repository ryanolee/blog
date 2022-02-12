import EntityBinding from "./EntityBinding";
import debounce from "debounce"
import * as PIXI from "pixi.js"
import BoidHandler from "../handler/BoidHandler";

export default class BoidBinding extends EntityBinding<BoidHandler>{
    protected resize = () => {};

    init() {
        if (this.container.current === null) {
			return
		}

		let w = Math.round(this.container.current.clientWidth)
		let h = Math.round(this.container.current.clientHeight)

		this.container.current.appendChild(this.app.current.view)
		
		this.handler.current = new BoidHandler(w, h)
		this.handler.current.generateRandom()
		this.handler.current.registerEntities(this.app.current)

		this.app.current.ticker.add(this.getListener(() => {
			this.handler.current.update()
			this.handler.current.draw()
		}))

		this.resize = debounce(this.getListener(() => {
			// Force 16:9 aspect ratio
			let w = Math.round(this.container.current.clientWidth)
			let h = Math.round(this.container.current.clientHeight)

			this.app.current.view.width = w
			this.app.current.view.height = h

			this.handler.current.resize(w, h)
		}), 200, false)

		window.addEventListener('resize', this.resize)
    }

    teardown() {
        // Remove app view
        if(this.handler.current !== null){
            this.handler.current.destroy()
            this.handler.current = null
        }
        
        this.app.current.stop()
        this.app.current.destroy(true, true)
        window.removeEventListener('resize', this.resize)
        this.app.current = null
    }
}
