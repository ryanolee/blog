import React, {MutableRefObject, useEffect, useState} from "react"
import { Slide } from './../../interfaces/Header'
import ParticleHandler from "../sketch/title/ParticleHandler"
import { Box  } from "@material-ui/core"
import HeaderControlButton from "./HeaderControlButton"



interface HeaderControlProps{
    ph: MutableRefObject<ParticleHandler>,
    slides: Slide[],
    selectedSlide?: number
}

export default ({ph, slides, selectedSlide = 0}: HeaderControlProps) => {
    let [selected, setSelected] = useState<number>(selectedSlide)

    return (
        <Box display="flex" justifyContent="center">
            {slides.map((slide, index) => (<HeaderControlButton 
                ph={ph} 
                index={index}
                setSelected={setSelected}
                targetSlide={slide}
                selected={slides[selected]?.path === slide?.path}
            />))}
        </Box >
    )
}