import React from "react";
import { Link, graphql } from "gatsby";
import { Layout } from "../components/layout";

export default function Home({ data }: any) {
    const { edges: posts } = data.allMdx;

    return (
        <Layout>
            <h1>TEST</h1>
            {posts.map(({ node: post }) => (
                <article>
                    <Link to={post.fields.slug}>
                        <h2>{post.frontmatter.title}</h2>
                    </Link>
                    <h4>{post.frontmatter.date}</h4>
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
                        date(formatString: "YYYY-MM-DD")
                        title
                        subtitle
                        excerpt
                    }
                }
            }
        }
    }
`;
