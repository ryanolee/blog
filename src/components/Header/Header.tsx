import React, { useEffect, useRef, useState } from "react"
import debounce from "debounce"
import * as PIXI from "pixi.js"
import ParticleHandler from "../sketch/title/handler/ParticleHandler"
import { Box } from "@material-ui/core"
import HeaderControl from "./HeaderControl"
import { makeStyles } from '@material-ui/core/styles'
import Particle from "../sketch/title/entity/Particle"
import ParticleBinding from "../sketch/title/bindings/ParticleBinding"
import BoidHandler from "../sketch/title/handler/BoidHandler"
import BoidBinding from "../sketch/title/bindings/BoidBinding"

interface HeaderProps {}

export const slides = [
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
	let bh = useRef<BoidHandler>(null);
	let app = useRef<PIXI.Application>(null)
	let container = useRef<HTMLDivElement>(null)

	let particleBinding = new ParticleBinding(
		container,
		app,
		ph
	)

	let boidBinding = new BoidBinding(
		container,
		app,
		bh
	)
	
	//Cleanup on unmount
	useEffect(() => {
		return () => {
			particleBinding.teardown()
			boidBinding.teardown()
			app.current.stop()
        	app.current.destroy(true, true)
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

		//particleBinding.init()
		//particleBinding.enable()

		boidBinding.init()
		boidBinding.enable()
	});

	let classes = useStyles()

	return (
		<Box className={classes.container}>
			<div ref={container} style={{ width: "100vw", height: "calc(100vh - 20px)", overflow: "hidden" }} />
			<HeaderControl ph={ph} slides={slides} />
		</Box>
	)
}

