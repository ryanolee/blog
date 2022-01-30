import React, { useEffect, useRef, useState } from "react"
import debounce from "debounce"
import * as PIXI from "pixi.js"
import ParticleHandler from "../sketch/title/ParticleHandler"
import { Box } from "@material-ui/core"
import HeaderControl from "./HeaderControl"
import { makeStyles } from '@material-ui/core/styles'

interface HeaderProps {}

const slides = [
	{
		"path": '/sketches/title/hi.bmp',
		"breakpoints": {
			"600": "s",
			"1000": "m",
			"1280": "l"
		}
	},
	{
		"path": '/sketches/title/dev.bmp',
		"breakpoints": {
			"600": "s",
			"1000": "m",
			"1280": "l"
		}
	}
]

const useStyles = makeStyles({
    container: {
		width: "100%",
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
		flexDirection: "column"
    },
    
})

export default ({children} :  React.PropsWithChildren<HeaderProps>) => {
	// @todo Migrate to react oritented approach
	let ph = useRef<ParticleHandler>(null);
	let app = useRef<PIXI.Application>(null)
	let container = useRef<HTMLDivElement>(null)

	let handleResize = () => { }
	

	//Cleanup on unmount
	useEffect(() => {
		return () => {
			// Remove app view
			if(ph.current !== null){
				ph.current.destroy()
				ph.current = null
			}
			
			app.current.stop()
			app.current.destroy(true, true)
			window.removeEventListener('resize', handleResize)
			app.current = null
		}
	})

	useEffect(() => {
		if (container.current === null) {
			return
		}

		let w = Math.round(container.current.clientWidth)
		let h = Math.round(container.current.clientHeight)

		app.current = new PIXI.Application({
			backgroundColor: 0x000000,
			antialias: true,
			autoDensity: true,
			width: w,
			height: h,
			resizeTo: container.current
		});

		container.current.appendChild(app.current.view)

		ph.current = new ParticleHandler(w, h)
		ph.current.generateRandomBoids()
		ph.current.registerParticles(app.current)
		ph.current.setSlide(slides[0])

		//Desktop binding
		//app.current.view.addEventListener("mousemove", (evt) => {
		//	// Push
		//	ph.current.getParticlesInRange(evt.offsetX, evt.offsetY, 50).forEach((particle) => {
		//		particle.applyForce(
		//			-(evt.offsetX - particle.x) * 0.01,
		//			-(evt.offsetY - particle.y) * 0.01
		//		)
		//	})
		//})
//
		//app.current.view.addEventListener("mousedown", (evt) => {
		//	ph.current.getParticlesInRange(evt.offsetX, evt.offsetY, 100).forEach((particle) => {
		//		particle.overrideForce(
		//			(particle.x - evt.offsetX) * 0.1,
		//			(particle.y - evt.offsetY) * 0.1
		//		)
		//	})
		//})
//
		//// Mobile bindings
		//app.current.view.addEventListener("touchmove", (evt) => {
		//	let touch = evt?.targetTouches[0]
		//	if(touch === null){
		//		return
		//	}
//
		//	ph.current.getParticlesInRange(touch.clientX, touch.clientY, 50).forEach((particle) => {
		//		particle.applyForce(
		//			-(touch.clientX - particle.x) * 0.01,
		//			-(touch.clientY - particle.y) * 0.01
		//		)
		//	})
		//})

		app.current.ticker.add(() => {
			ph.current.update()
			ph.current.draw()
		})

		handleResize = debounce(() => {
			console.log("Resize")
			// Force 16:9 aspect ratio
			let w = Math.round(container.current.clientWidth)
			let h = Math.round(container.current.clientHeight)

			app.current.view.width = w
			app.current.view.height = h

			ph.current.resize(w, h)
		}, 200, false)

		window.addEventListener('resize', handleResize)
	});

	let styles = useStyles()

	return (
		<Box className={styles.container}>
			<div ref={container} style={{ width: "100vw", height: "calc(100vh - 20px)", overflow: "hidden" }} />
			<HeaderControl ph={ph} slides={slides} />
		</Box>
	)
}

