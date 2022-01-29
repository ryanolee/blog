import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';

import {Slide} from './../../interfaces/Header'
import { MutableRefObject } from 'react'
import ParticleHandler from '../sketch/title/ParticleHandler'
import { makeStyles } from '@material-ui/core/styles';
import { IconButton } from '@material-ui/core';

interface HeaderSideButtonProps {
    ph: MutableRefObject<ParticleHandler>,
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
        backgroundColor: "rgba(255, 255, 255, .15)",
        backdropFilter: "blur(5px)"
    }
  });

export default ({ph, variant, slide, setSlide, slides} : HeaderSideButtonProps) => {
    
    const {
        centeredArrow,
        centeredArrowLeft,
        centeredArrowRight,
        glassArrow
    } = useStyles()

    const onClick = () => {
        let nextIndex = slide + (variant === 'next' ? 1 : -1)
        if(nextIndex > slides.length){
            nextIndex = 0
        }

        if(nextIndex < 0){
            nextIndex = slides.length
        }

        setSlide(nextIndex)
        ph.current.setSlide(slides[slide])
    }

    const targetIcon = variant === 'next' ? 
        (<ArrowForwardIosIcon/>) :
        (<ArrowBackIosIcon/>)

    return (
        <IconButton onClick={onClick} =()>
            {targetIcon}
        </IconButton>
    )
} 