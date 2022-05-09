import {MutableRefObject} from "react"
import * as PIXI from "pixi.js"
import EntityHandler from "../handler/EntityHandler"
import ParticleImageBehaviour from "../behaviours/ParticleImageBehaviour"
import { slides } from "../../../Header/Header"
import { debounce } from "@material-ui/core"

/**
 * Mechanism for binding a handler to a given entity
 */
export default class EntityBinding {
    protected container: MutableRefObject<HTMLDivElement>
    protected app: MutableRefObject<PIXI.Application>
    protected handler: MutableRefObject<EntityHandler>
    protected enabled: boolean = false
    protected resize = () => {};

    constructor(
        container: MutableRefObject<HTMLDivElement>,
        app: MutableRefObject<PIXI.Application>,
        handler: MutableRefObject<EntityHandler>
    ){
        this.container = container
        this.app = app
        this.handler = handler
    }

    disable(){
        this.enabled = false
    }

    enable(){
        this.enabled = true
    }

    isEnabled(): boolean {
        return this.enabled
    }

    getListener(fn: CallableFunction){
        return (...args) => {
            if(!this.enabled){
                return
            }

            return fn(...args)
        }
    }

    init(){
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
		
		this.handler.current = new EntityHandler(w, h, this.app.current)
		this.handler.current.generateRandom()
        this.handler.current.removeEntities(400, false)

		this.handler.current.setBehaviour(new ParticleImageBehaviour(
            this.handler.current,
            slides[0]
        ))

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
				particle.setForce(
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
		}), 200)

        this.app.current.stage.interactive = true
		this.app.current.stage.on('pointermove', (e) => {
			const evtData = e.data.global
			this.handler.current.setMousePos(evtData.x, evtData.y)
		})

		window.addEventListener('resize', this.resize)
    }

    teardown(){
        // Remove app view
        if(this.handler.current !== null){
            this.handler.current.destroy()
            this.handler.current = null
        }
        
        window.removeEventListener('resize', this.resize)
    }
}