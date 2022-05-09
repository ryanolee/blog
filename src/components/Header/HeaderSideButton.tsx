import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';

import {Slide} from './../../interfaces/Header'
import React, { MutableRefObject } from 'react'
import { makeStyles } from '@material-ui/core/styles';
import { IconButton } from '@material-ui/core';
import ParticleImageBehaviour from '../sketch/title/behaviours/ParticleImageBehaviour';
import EntityHandler from '../sketch/title/handler/EntityHandler';

interface HeaderSideButtonProps {
    eh: MutableRefObject<EntityHandler>,
    slides: Slide[],
    setSlide: any
    slide: number
    variant: 'next' | 'last'
}

const HEIGHT = 20

const useStyles = makeStyles({
    centeredArrow: {
        position: "absolute",
        top: `calc(50vh - (${HEIGHT}px / 2))`,
        height: `${HEIGHT}px` 
    },

    centeredArrowLeft: {
        left: "10px"
    },

    centeredArrowRight: {
        right: "10px"
    },

    glassArrow: {
        color: "rgba(255, 255, 255, .65)"
    }
  });

export default ({eh, variant, slide, setSlide, slides} : HeaderSideButtonProps) => {
    
    const {
        centeredArrow,
        centeredArrowLeft,
        centeredArrowRight,
        glassArrow
    } = useStyles()

    const onClick = () => {
        let nextIndex = slide + (variant === 'next' ? 1 : -1)
        if(nextIndex >= slides.length){
            nextIndex = 0
        }

        if(nextIndex < 0){
            nextIndex = slides.length - 1
        }

        setSlide(nextIndex)
        eh.current.setBehaviour(new ParticleImageBehaviour(eh.current, slides[slide]))
    }

    const targetIcon = variant === 'next' ? 
        (<ArrowForwardIosIcon
            className={`${glassArrow} `}
        />) :
        (<ArrowBackIosIcon
            className={`${glassArrow}`}
        />)

    const alignmentClass = variant === 'next' ? centeredArrowRight : centeredArrowLeft
    return (
        <IconButton onClick={onClick} className={`${centeredArrow} ${alignmentClass}`}>
            {targetIcon}
        </IconButton>
    )
} 