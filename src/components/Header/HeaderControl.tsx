import React, {MutableRefObject, useEffect, useState} from "react"
import {Slide} from './../../Interfaces/Header'
import ParticleHandler from "../sketch/title/ParticleHandler"
import { Box  } from "@material-ui/core"
import HeaderControlButton from "./HeaderControlButton"



interface HeaderControlProps{
    ph: MutableRefObject<ParticleHandler>,
    slides: Slide[],
    selectedSlide: number
}

export default ({ph, slides, selectedSlide = 0}: HeaderControlProps) => {
    let [selected, setSelected] = useState<Slide>()

    // On initial mount select the first slide
    useEffect(() => {
        setSelected(slides[selectedSlide])
    }, [])

    return (
        <Box display="flex" justifyContent="center">
            {slides.map(slide => (<HeaderControlButton 
                ph={ph} 
                setSelected={setSelected}
                targetSlide={slide}
                selected={selected?.path === slide?.path}
            />))}
        </Box >
    )
}