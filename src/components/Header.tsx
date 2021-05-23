import React, { useState } from "react";
import Sketch from "react-p5";
import p5Types from "p5";
import ParticleHandler from "./sketch/title/ParticleHandler"
import config from "./sketch/title/config"

interface CircuitBackgroundProps{
    
}



export default () => {
	let ph : ParticleHandler|null = null

    const setup = (p5: p5Types, canvasParentRef: Element) => {
		let cnv = p5.createCanvas(1280, 720).parent(canvasParentRef);
		p5.strokeWeight(config.particle_size)
		p5.frameRate(config.frame_rate)

		ph = new ParticleHandler(p5, 1280, 720)
		ph.generateRandomParticles(config.max_particles)
		ph.loadTargetImage('./sketches/title/header.bmp', true)
	};

	setInterval(() => {
		ph.update()
	}, 1000/60)

	const draw = (p5: p5Types) => {
		p5.clear()
		ph.draw()
	}

	return (<Sketch setup={setup} draw={draw} />)
}

