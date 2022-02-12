import ParticleHandler from "../handler/ParticleHandler";
import EntityBinding from "./EntityBinding";
import debounce from "debounce"
import * as PIXI from "pixi.js"
import { slides } from "../../../Header/Header";

export default class ParticleBinding extends EntityBinding<ParticleHandler>{
    protected resize = () => {};

    init() {
        if (this.container.current === null) {
			return
		}

		let w = Math.round(this.container.current.clientWidth)
		let h = Math.round(this.container.current.clientHeight)

		this.app.current = new PIXI.Application({
			backgroundColor: 0x000000,
			antialias: true,
			autoDensity: true,
			width: w,
			height: h,
			resizeTo: this.container.current
		});

		this.container.current.appendChild(this.app.current.view)
		
		this.handler.current = new ParticleHandler(w, h)
		this.handler.current.generateRandom()
		this.handler.current.registerEntities(this.app.current)
		this.handler.current.setSlide(slides[0])

		//Desktop binding
		this.app.current.view.addEventListener("mousemove", this.getListener((evt) => {
			// Push
			this.handler.current.getEntitiesInRange(evt.offsetX, evt.offsetY, 50).forEach((particle) => {
				particle.applyForce(
					-(evt.offsetX - particle.x) * 0.01,
					-(evt.offsetY - particle.y) * 0.01
				)
			})
		}))

		this.app.current.view.addEventListener("mousedown", this.getListener((evt) => {
			this.handler.current.getEntitiesInRange(evt.offsetX, evt.offsetY, 400).forEach((particle) => {
				particle.overrideForce(
					(particle.x - evt.offsetX) * 0.1,
					(particle.y - evt.offsetY) * 0.1
				)
			})
		}))

		//// Mobile bindings
		this.app.current.view.addEventListener("touchmove", this.getListener((evt) => {
			let touch = evt?.targetTouches[0]
			if(touch === null){
				return
			}

			this.handler.current.getEntitiesInRange(touch.clientX, touch.clientY, 50).forEach((particle) => {
				particle.applyForce(
					-(touch.clientX - particle.x) * 0.01,
					-(touch.clientY - particle.y) * 0.01
				)
			})
		}))

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
        
        window.removeEventListener('resize', this.resize)
    }
}
