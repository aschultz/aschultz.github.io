import React from "react";
import { Link, graphql } from "gatsby";
import { Helmet } from "react-helmet";
import { Layout } from "../components/layout";

export default function Home({ data }: any) {
    const { siteMetadata } = data.site;
    const { edges: posts } = data.allBlogPost;

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
                        <Link to={post.slug}>
                            <h1 itemProp="name headline">{post.title}</h1>
                        </Link>
                        <time itemProp="datePublished" dateTime={post.date}>
                            {post.formattedDate}
                        </time>
                        <p>{post.parent.excerpt}</p>
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
        allBlogPost(sort: { fields: date, order: DESC }) {
            edges {
                node {
                    slug
                    date
                    formattedDate: date(formatString: "MMMM DD, YYYY")
                    title
                    subtitle
                    summary
                    parent {
                        ... on Mdx {
                            excerpt
                        }
                    }
                }
            }
        }
    }
`;
