import { Box, Link as ExternalLink } from '@material-ui/core';
import LinkedInIcon from '@material-ui/icons/LinkedIn';
import GitHubIcon from '@material-ui/icons/GitHub';
import { useStaticQuery, graphql } from "gatsby"
import * as React from "react";
import { makeStyles } from '@material-ui/core/styles';

interface SocialProps {
    className: string
}

const useStyles = makeStyles({
    root: {
        display: 'flex',
        flexDirection: 'row-reverse',
        alignSelf: 'flex-end'
    },
    link: {
        marginLeft: 10,
        marginTop: 10,
        "&:first-of-type": {
            marginRight: 20
        }
    }
})

export default function Social({ className = ""}: SocialProps) {
    let classes = useStyles()
    const data = useStaticQuery(graphql`
    query SocialQuery {
        site {
          siteMetadata {
            social {
              linkedin
              github
            }
          }
        }
      }
      
    `)

    return (
        <Box className={`${classes.root} ${className}`}>
            <ExternalLink className={classes.link} href={data.site.siteMetadata.social.linkedin}>
                <LinkedInIcon />
            </ExternalLink>
            <ExternalLink className={classes.link} href={data.site.siteMetadata.social.github}>
                <GitHubIcon />
            </ExternalLink>
        </Box>
    )
}