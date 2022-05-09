
import React, {MutableRefObject} from "react"
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';
import {IconButton} from "@material-ui/core"
import {Slide} from './../../interfaces/Header'
import EntityHandler from "../sketch/title/handler/EntityHandler";
import ParticleImageBehaviour from "../sketch/title/behaviours/ParticleImageBehaviour";

interface HeaderButtonProps{
    eh: MutableRefObject<EntityHandler>,
    targetSlide: Slide,
    index: number
    selected?: boolean,
    setSelected: any
}

export default ({eh, targetSlide, index, setSelected, selected = false}: HeaderButtonProps) => {
    const handleOnClick = () => {
        eh.current.setBehaviour(new ParticleImageBehaviour(eh.current, targetSlide))
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