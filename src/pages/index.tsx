import React from "react";
import { Link, graphql } from "gatsby";
import { Helmet } from "react-helmet";
import { Layout } from "../components/layout";

export default function Home({ data }: any) {
    const { siteMetadata } = data.site;
    const { edges: posts } = data.allMdx;

    return (
        <>
            <Helmet defer={false}>
                <title>{siteMetadata.title}</title>
                <meta name="description" content={siteMetadata.description} />
                <meta name="msvalidate.01" content="E4CFADA6D27D25819472B16E008624A8" />
            </Helmet>
            <Layout>
                {posts.map(({ node: post }) => (
                    <article className="ccontent">
                        <Link to={post.fields.slug}>
                            <h1 itemProp="name headline">{post.frontmatter.title}</h1>
                        </Link>
                        <time itemProp="datePublished" dateTime={post.frontmatter.date}>
                            {post.frontmatter.formattedDate}
                        </time>
                        <p>{post.frontmatter.excerpt || post.excerpt}</p>
                    </article>
                ))}
            </Layout>
        </>
    );
}

export const pageQuery = graphql`
    query {
        site {
            siteMetadata {
                title
                description
            }
        }
        allMdx(sort: { fields: frontmatter___date, order: DESC }, filter: { fields: { collection: { eq: "posts" } } }) {
            edges {
                node {
                    id
                    excerpt(pruneLength: 280)
                    fields {
                        slug
                    }
                    frontmatter {
                        date
                        formattedDate: date(formatString: "MMMM DD, YYYY")
                        title
                        subtitle
                        excerpt
                        summary
                    }
                }
            }
        }
    }
`;
