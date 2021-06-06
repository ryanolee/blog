import React, { useEffect, useRef, useState } from "react"
import debounce from "debounce"
import * as PIXI from "pixi.js"
import ParticleHandler from "../sketch/title/ParticleHandler"
import config from "../sketch/title/config"
import { Box } from "@material-ui/core"
import HeaderControl from "./HeaderControl"
import { makeStyles } from '@material-ui/core/styles';

const slides = [

]

interface HeaderProps {
	
};


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
			console.log('destroy')
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

		// Force 16:9 aspect ratio
		let w = Math.round(container.current.clientWidth)
		let h = Math.round(container.current.clientHeight)

		app.current = new PIXI.Application({
			backgroundColor: 0xffffff,
			width: w,
			height: h
		});

		container.current.appendChild(app.current.view)

		ph.current = new ParticleHandler(w, h)
		ph.current.generateRandomParticles(config.max_particles)
		ph.current.registerParticles(app.current)
		ph.current.loadTargetImage('./sketches/title/header1.bmp', true)


		app.current.view.addEventListener("mousemove", (evt) => {
			// Push
			ph.current.getParticlesInRange(evt.offsetX, evt.offsetY, 50).forEach((particle) => {
				particle.applyForce(
					-(evt.offsetX - particle.x) * 0.01,
					-(evt.offsetY - particle.y) * 0.01
				)
			})
		})

		app.current.view.addEventListener("mousedown", (evt) => {
			ph.current.getParticlesInRange(evt.offsetX, evt.offsetY, 100).forEach((particle) => {
				particle.overrideForce(
					(particle.x - evt.offsetX) * 0.1,
					(particle.y - evt.offsetY) * 0.1
				)
			})
		})

		app.current.ticker.add(() => {
			ph.current.update()
			ph.current.draw()
		})

		handleResize = debounce(() => {
			// Force 16:9 aspect ratio
			let w = Math.round(container.current.clientWidth)
			let h = Math.round(container.current.clientHeight)

			if (w === app.current.view.width) {
				return
			}

			console.log([w, h])
			app.current.view.width = w
			app.current.view.height = h

			ph.current.resize(w, h)
		}, 20, false)

		window.addEventListener('resize', handleResize)
	});

	let styles = useStyles()

	return (
		<Box className={styles.container}>
			<div ref={container} style={{ width: "100vw", height: "calc(100vh - 20px)", overflow: "hidden" }} />
			<HeaderControl ph={ph} slides={[
				'./sketches/title/header1.bmp',
				'./sketches/title/header.bmp'
			]} />
		</Box>
	)
}

