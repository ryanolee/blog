import React, { useEffect, useRef } from "react"
import debounce from "debounce"
import * as PIXI from "pixi.js"
import ParticleHandler from "./sketch/title/ParticleHandler"
import config from "./sketch/title/config"
import { Container } from "@material-ui/core";

export default () => {
	let ph : ParticleHandler|null = null
	let app : PIXI.Application|null = null
	let handleResize = () => {}

	//Cleanup on unmount
	useEffect(() => {
		return () => {
			console.log("Remove")
			// Remove app view
			ph.destroy()
			app.stop()
			app.destroy(true, true)
			window.removeEventListener('resize', handleResize)
			app = null
			ph = null
		}
	})

	

    const setup = (container: Element) => {
		if(container === null){
			return
		}

		// Force 16:9 aspect ratio
		let w = Math.round(container.clientWidth)
		let h = Math.round(container.clientWidth * 0.5625)

		app = new PIXI.Application({
			backgroundColor: 0xffffff,
			width: w,
			height: h
		});
		
		container.appendChild(app.view)

		ph = new ParticleHandler(w, h)
		ph.generateRandomParticles(config.max_particles)
		ph.registerParticles(app)
		ph.loadTargetImage('./sketches/title/header1.bmp', true)

		app.view.addEventListener("mousemove", (evt) => {
			// Push
			ph.getParticlesInRange(evt.offsetX, evt.offsetY, 50).forEach((particle) => {
				particle.xv -= (evt.offsetX - particle.x) * 0.01
				particle.yv -= (evt.offsetY - particle.y) * 0.01
			})
		})

		app.view.addEventListener("mousedown", (evt) => {
			ph.getParticlesInRange(evt.offsetX, evt.offsetY, 300).forEach((particle) => {
				particle.xv = (particle.x - evt.offsetX) * 0.1
				particle.yv = (particle.y - evt.offsetY) * 0.1
			})
		})

		app.ticker.add(() => {
			ph.update()
			ph.draw()
		})

		handleResize = debounce(() => {
			// Force 16:9 aspect ratio
			let w = Math.round(container.clientWidth)
			let h = Math.round(container.clientWidth * 0.5625)
			
			if(w === app.view.width){
				return
			}

			app.view.width = w
			app.view.height = h

			ph.resize(w, h)
		}, 20, false)

		window.addEventListener('resize', handleResize)
	};

	

	return (<div ref={setup} style={{width: "100%"}}/>)
}

