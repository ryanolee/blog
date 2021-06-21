import * as React from "react"
import { graphql } from "gatsby"
import Seo from "../components/Seo"
import Navigation from "../components/Navigation.tsx"
import Header from "../components/Header/Header"
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles'

const SiteIndex = ({ data, location }) => {
  const siteTitle = data.site.siteMetadata?.title 
  /*const siteTitle = data.site.siteMetadata?.title || `Title`
  const posts = data.allMarkdownRemark.nodes */

  /*if (posts.length === 0) {
    return (
      <Layout location={location} title={siteTitle}>
        <Seo title="All posts" />
        <Bio />
        <p>
          No blog posts found. Add markdown posts to "content/blog" (or the
          directory you specified for the "gatsby-source-filesystem" plugin in
          gatsby-config.js).
        </p>
      </Layout>
    )
  }*/

  return (
    <>
      <Seo title={siteTitle}/>
      <Navigation currentPage={location} variant={'spaceless'}/>
      <Header/>
    </>
  )
}

export default SiteIndex

export const pageQuery = graphql`
query {
  site {
    siteMetadata {
      title
    }
  }
}`
/*    allMarkdownRemark(sort: { fields: [frontmatter___date], order: DESC }) {
      nodes {
        excerpt
        fields {
          slug
        }
        frontmatter {
          date(formatString: "MMMM DD, YYYY")
          title
          description
        }
      }
    }
  }
`*/
