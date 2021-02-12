import React from "react";
import { Link, graphql } from "gatsby";
import { Layout } from "../components/layout";

export default function Home({ data }: any) {
    const { edges: posts } = data.allMdx;

    return (
        <Layout>
            {posts.map(({ node: post }) => (
                <article>
                    <Link to={post.fields.slug}>
                        <h1 itemProp="headline">{post.frontmatter.title}</h1>
                    </Link>
                    <time itemProp="datePublished" dateTime={post.frontmatter.date}>
                        {post.frontmatter.formattedDate}
                    </time>
                    <p>{post.frontmatter.excerpt || post.excerpt}</p>
                </article>
            ))}
        </Layout>
    );
}

export const pageQuery = graphql`
    query {
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
                    }
                }
            }
        }
    }
`;
