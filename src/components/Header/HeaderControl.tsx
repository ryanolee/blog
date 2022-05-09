import React, {MutableRefObject, useEffect, useState} from "react"
import { Slide } from './../../interfaces/Header'
import { Box  } from "@material-ui/core"
import HeaderControlButton from "./HeaderControlButton"
import HeaderSideButton from "./HeaderSideButton"
import EntityHandler from "../sketch/title/handler/EntityHandler"



interface HeaderControlProps{
    eh: MutableRefObject<EntityHandler>,
    slides: Slide[],
    selectedSlide?: number
}

export default ({eh, slides, selectedSlide = 0}: HeaderControlProps) => {
    let [selected, setSelected] = useState<number>(selectedSlide)

    return (
        <>
            <HeaderSideButton eh={eh} slides={slides} slide={selected} setSlide={setSelected} variant='next'/>
            <HeaderSideButton eh={eh} slides={slides} slide={selected} setSlide={setSelected} variant='last'/>
            <Box display="flex" justifyContent="center">

                {slides.map((slide, index) => (<HeaderControlButton 
                    eh={eh} 
                    index={index}
                    setSelected={setSelected}
                    targetSlide={slide}
                    selected={slides[selected]?.path === slide?.path}
                />))}
            </Box >
        </>
    )
}