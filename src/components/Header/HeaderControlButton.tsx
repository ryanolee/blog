
import React, {MutableRefObject} from "react"
import ParticleHandler from "../sketch/title/handler/ParticleHandler"
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';
import {IconButton} from "@material-ui/core"
import {Slide} from './../../interfaces/Header'

interface HeaderButtonProps{
    ph: MutableRefObject<ParticleHandler>,
    targetSlide: Slide,
    index: number
    selected?: boolean,
    setSelected: any
}

export default ({ph, targetSlide, index, setSelected, selected = false}: HeaderButtonProps) => {
    const handleOnClick = () => {
        ph.current.setSlide(targetSlide)
        setSelected(index)
    }

    return <IconButton 
        color={selected ? "primary" : "secondary"}
        onClick={handleOnClick}
        key={index}
        size="small"
    >
        <FiberManualRecordIcon style={{width: "10px", height: "10px"}} />
    </IconButton>
}