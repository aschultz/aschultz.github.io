import React from "react";
import { Link, graphql } from "gatsby";
import { MDXProvider } from "@mdx-js/react";
import { MDXRenderer } from "gatsby-plugin-mdx";
import { Layout } from "./layout";

// MDXProvider is used to configure what components are available to the MDX code.
// By default, only standard React HTML tags are available.
const mdxComponents = {};

export default function Post({ data }: any) {
    return (
        <Layout>
            <article>
                <MDXProvider components={mdxComponents}>
                    <MDXRenderer>{data.mdx.body}</MDXRenderer>
                </MDXProvider>
            </article>
        </Layout>
    );
}

export const pageQuery = graphql`
    query($id: String) {
        mdx(id: { eq: $id }) {
            body
            frontmatter {
                date(formatString: "MMMM DD, YYYY")
                title
                subtitle
            }
        }
    }
`;
