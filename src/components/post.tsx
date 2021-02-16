import React from "react";
import { Link, graphql } from "gatsby";
import { Helmet } from "react-helmet";
import { MDXProvider } from "@mdx-js/react";
import { MDXRenderer } from "gatsby-plugin-mdx";
import { Layout } from "./layout";

// MDXProvider is used to configure what components are available to the MDX code.
// By default, only standard React HTML tags are available.
const mdxComponents = {};

export default function Post({ data }: any) {
    const { frontmatter, body } = data.mdx;
    return (
        <>
            <Helmet defer={false}>
                <title>{frontmatter.title}</title>
                <meta name="description" content={frontmatter.summary} />
            </Helmet>
            <Layout>
                <article className="cbox" itemScope itemType="http://schema.org/Article">
                    <header className="ccontent">
                        <h1 itemProp="name headline">{frontmatter.title}</h1>
                        <time itemProp="datePublished" dateTime={frontmatter.date}>
                            {frontmatter.formattedDate}
                        </time>
                    </header>
                    <div className="ccontent" itemProp="articleBody">
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
                date
                formattedDate: date(formatString: "MMMM DD, YYYY")
                title
                subtitle
                excerpt
                summary
            }
        }
    }
`;
