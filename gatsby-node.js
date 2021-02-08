"use strict";
const path = require("path");
const fs = require("fs");
const { createFilePath } = require("gatsby-source-filesystem");

exports.onCreateWebpackConfig = ({ stage, actions }) => {
    if (stage === `build-javascript`) {
        // Disable source maps
        actions.setWebpackConfig({
            devtool: false,
        });
    }
};

exports.createSchemaCustomization = ({ actions }) => {
    const { createTypes } = actions;

    // Explicitly declare schema for our Mdx nodes.
    // This ensures the build breaks if pages don't supply valid data.
    createTypes(`
        type ArticleFrontmatter @noinfer {
            title: String!
            subtitle: String
            excerpt: String
            date: Date @dateformat
            tags: [String]
        }

        type MdxFields @noinfer {
            collection: String!
            slug: String!
        }

        type Mdx implements Node {
            frontmatter: ArticleFrontmatter
            fields: MdxFields
        }
    `);
};

exports.onCreateNode = ({ node, actions, getNode }) => {
    const { createNodeField } = actions;

    // Add fields to MDX pages
    if (node.internal.type === "Mdx") {
        const parent = getNode(node.parent);
        const collection = parent.sourceInstanceName;
        const filePath = createFilePath({ node, getNode, trailingSlash: false });

        createNodeField({
            node,
            name: "collection",
            value: `${collection}`,
        });
        createNodeField({
            node,
            name: "slug",
            value: `/${collection}${filePath}`,
        });
    }
};

exports.createPages = async ({ actions, graphql, reporter }) => {
    const { createPage } = actions;

    const result = await graphql(`
        {
            allMdx {
                edges {
                    node {
                        id
                        fields {
                            slug
                        }
                    }
                }
            }
        }
    `);
    if (result.errors) {
        console.error(result.errors);
        reporter.panicOnBuild('🚨  ERROR: Loading "createPages" query');
    }

    // Output a page for each MDX file
    result.data.allMdx.edges.forEach(({ node }) => {
        createPage({
            // Output path
            path: node.fields.slug,

            // Template used to render MDX content
            component: path.resolve(`src/components/post.tsx`),

            // Data passed to template as `this.props.pageContext` and to page query
            context: { id: node.id },
        });
    });
};

// Gatsby doesn't support configuring the output folder. Rename the output to align with GitHub pages expectations.
exports.onPreInit = () => {
    if (process.argv[2] === "build") {
        fs.rmdirSync(path.join(__dirname, "docs"), { recursive: true });
    }
};

exports.onPostBuild = () => {
    if (process.argv[2] === "build") {
        fs.rmdirSync(path.join(__dirname, "docs"), { recursive: true });
        fs.renameSync(path.join(__dirname, "public"), path.join(__dirname, "docs"));
    }
};
