import React, { useEffect, useRef, useState } from "react"
import debounce from "debounce"
import * as PIXI from "pixi.js"
import { Box } from "@material-ui/core"
import HeaderControl from "./HeaderControl"
import { makeStyles } from '@material-ui/core/styles'
import EntityHandler from "../sketch/title/handler/EntityHandler"
import EntityBinding from "../sketch/title/bindings/EntityBinding"

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
	let eh = useRef<EntityHandler>(null);
	let app = useRef<PIXI.Application>(null)
	let container = useRef<HTMLDivElement>(null)

	let entityBinding = new EntityBinding(
		container,
		app,
		eh
	)
	
	//Cleanup on unmount
	useEffect(() => {
		return () => {
			entityBinding.teardown()
			app.current.stop()
        	app.current.destroy(true, true)
			app.current = null
		}
	})

	useEffect(() => {
		if (container.current === null) {
			return
		}
		
		//particleBinding.init()
		//particleBinding.enable()

		entityBinding.init()
		entityBinding.enable()
	});

	let classes = useStyles()

	return (
		<Box className={classes.container}>
			<div ref={container} style={{ width: "100vw", height: "calc(100vh - 20px)", overflow: "hidden" }} />
			<HeaderControl eh={eh} slides={slides} />
		</Box>
	)
}

