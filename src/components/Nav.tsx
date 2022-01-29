import { List, ListItem, ListItemText } from '@material-ui/core';
import { Link } from 'gatsby';
import * as React from "react";
import Social from './Social'
import { makeStyles } from '@material-ui/core/styles';

interface NavLink {
    path: string
    name: string
}

interface NavigationProps {
    currentPage: string
    variant: 'spaceless' | 'default'
}

const navigationLinks : NavLink[] = [
    {
        name: "Home",
        path: "/"
    },
    {
        name: "Posts",
        path: "/posts"
    }
]

const useStyles = makeStyles({
    root: {},
    rootSpaceless: {
        width: "100%",
        position: 'absolute',
    },
    list: {
        listStyle: "none",
        display: "flex",
        flexDirection: "row",
        justifyContent: "flex-start",
        margin: "0 20px"
    },
    listLink: {
        marginRight: "20px",
        width: "initial",
        display: "block",
        "&::after": {
            content: '""',
            marginTop: "-5px",
            width: "0px",
            height: "2px",
            display: "block",
            backgroundColor: "white",
            margin: "auto",
            transition: "100ms"
        },
        "&:hover::after": {
            width: "100%"
        }
    },
    link: {
        textDecoration: "none",
        color: "white"
    }
})

const Nav = ({currentPage, variant = 'default'} : NavigationProps) => {
    let classes = useStyles()
    return (
        <nav className={variant === 'default' ? classes.root : classes.rootSpaceless}>
            <List className={classes.list}>
                {navigationLinks.map((navLink, i) => {
                    return (
                    <ListItem 
                        className={classes.listLink} 
                        disableGutters={true}
                        selected={currentPage === navLink.path}
                        key={`${i}`}
                    >
                        <Link className={classes.link} to={navLink.path}>
                            <ListItemText>{navLink.name}</ListItemText>
                        </Link>
                    </ListItem>)
                })}
                <Social/>
            </List>
        </nav>
    )
}

export default Nav