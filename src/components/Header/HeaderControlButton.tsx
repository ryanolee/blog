
import React, {MutableRefObject} from "react"
import ParticleHandler from "../sketch/title/ParticleHandler"
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';
import {IconButton} from "@material-ui/core"
import {Slide} from './../../Interfaces/Header'

interface HeaderButtonProps{
    ph: MutableRefObject<ParticleHandler>,
    targetSlide: Slide,
    selected?: boolean,
    setSelected: any
}

export default ({ph, targetSlide, setSelected, selected = false}: HeaderButtonProps) => {
    const handleOnClick = () => {
        ph.current.setSlide(targetSlide)
        setSelected(targetSlide)
    }

    return <IconButton 
        color={selected ? "primary" : "secondary"}
        onClick={handleOnClick}
        size="small"
    >
        <FiberManualRecordIcon style={{width: "10px", height: "10px"}} />
    </IconButton>
}