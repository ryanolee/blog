import React, {MutableRefObject, useEffect, useState} from "react"
import ParticleHandler from "../sketch/title/ParticleHandler"
import { Box  } from "@material-ui/core"
import HeaderControlButton from "./HeaderControlButton"

interface HeaderControlProps{
    ph: MutableRefObject<ParticleHandler>,
    slides: string[]
}

export default ({ph, slides}: HeaderControlProps) => {
    let [selected, setSelected] = useState<string>("")

    return (
        <Box display="flex" justifyContent="center">
            {slides.map(slide => (<HeaderControlButton 
                ph={ph} 
                setSelected={setSelected}
                targetSlide={slide}
                selected={selected === slide}
            />))}
        </Box >
    )
}