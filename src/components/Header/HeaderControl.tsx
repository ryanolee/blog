import React, {MutableRefObject, useEffect, useState} from "react"
import { Slide } from './../../interfaces/Header'
import ParticleHandler from "../sketch/title/handler/ParticleHandler"
import { Box  } from "@material-ui/core"
import HeaderControlButton from "./HeaderControlButton"
import HeaderSideButton from "./HeaderSideButton"



interface HeaderControlProps{
    ph: MutableRefObject<ParticleHandler>,
    slides: Slide[],
    selectedSlide?: number
}

export default ({ph, slides, selectedSlide = 0}: HeaderControlProps) => {
    let [selected, setSelected] = useState<number>(selectedSlide)

    return (
        <>
            <HeaderSideButton ph={ph} slides={slides} slide={selected} setSlide={setSelected} variant='next'/>
            <HeaderSideButton ph={ph} slides={slides} slide={selected} setSlide={setSelected} variant='last'/>
            <Box display="flex" justifyContent="center">

                {slides.map((slide, index) => (<HeaderControlButton 
                    ph={ph} 
                    index={index}
                    setSelected={setSelected}
                    targetSlide={slide}
                    selected={slides[selected]?.path === slide?.path}
                />))}
            </Box >
        </>
    )
}