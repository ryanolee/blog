import { List, ListItem, ListItemText } from '@material-ui/core';
import { Link } from 'gatsby';
import * as React from "react";
import { makeStyles } from '@material-ui/core/styles';

interface NavLink {
    path: string
    name: string
}

interface NavigationProps {
    currentPage: string
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
    list: {
        listStyle: "none",
        display: "flex",
        flexDirection: "row",
        justifyContent: "flex-start"
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
            backgroundColor: "black",
            margin: "auto",
            transition: "100ms"
        },
        "&:hover::after": {
            width: "100%"
        }
    },
    link: {
        textDecoration: "none"
    }
})

export default ({currentPage} : NavigationProps) => {
    let classes = useStyles()
    return (
        <nav>
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
            </List>
        </nav>
    )
}