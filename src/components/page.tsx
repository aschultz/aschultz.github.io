import React from "react";
import { Link, graphql } from "gatsby";
import { Helmet } from "react-helmet";
import { MDXProvider } from "@mdx-js/react";
import { MDXRenderer } from "gatsby-plugin-mdx";
import { Layout } from "./layout";

// MDXProvider is used to configure what components are available to the MDX code.
// By default, only standard React HTML tags are available.
const mdxComponents = {};

export default function Page({ data }: any) {
    const { frontmatter, body } = data.mdx;
    return (
        <>
            <Helmet defer={false}>
                <title>{frontmatter.title}</title>
                <meta name="description" content={frontmatter.description} />
            </Helmet>
            <Layout>
                <article className="cbox">
                    <h1>{frontmatter.title}</h1>
                    <div className="ccontent">
                        <MDXProvider components={mdxComponents}>
                            <MDXRenderer>{body}</MDXRenderer>
                        </MDXProvider>
                    </div>
                </article>
            </Layout>
        </>
    );
}

export const pageQuery = graphql`
    query($id: String) {
        mdx(id: { eq: $id }) {
            body
            frontmatter {
                ... on PageFrontmatter {
                    title
                    description
                }
            }
        }
    }
`;
