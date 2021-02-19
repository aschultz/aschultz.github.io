"use strict";
const path = require("path");
const fs = require("fs");
const { createFilePath } = require("gatsby-source-filesystem");

exports.onCreateWebpackConfig = ({ stage, getConfig, actions }) => {
    if (stage === `build-javascript`) {
        const newWebpackConfig = {
            ...getConfig(),
            // Disable source maps
            devtool: false,
            // Disable hash in filename. This should reduce churn in git.
            // GitHub pages has a fixed Cache-Control header of "max-age=600", so
            // it can't really make use of long-term immutable hashes anyway.
            output: {
                filename: `[name].js`,
                chunkFilename: `[name].js`,
                path: getConfig().output.path,
                publicPath: getConfig().output.publicPath,
            },
            // optimization: {
            //     ...getConfig().optimization,
            //     minimize: false,
            // },
        };
        console.log(newWebpackConfig);

        actions.replaceWebpackConfig(newWebpackConfig);
    }
};

exports.createSchemaCustomization = ({ actions, schema }) => {
    const { createTypes } = actions;

    // Explicitly declare schema for our Mdx nodes.
    // This ensures the release build breaks if pages don't supply valid data.
    createTypes([
        `
        type CustomMdxFields @dontInfer {
            collection: String!
            slug: String!
        }
        type PageFrontmatter @dontInfer {
            title: String!
            description: String!
        }
        type ArticleFrontmatter @dontInfer {
            title: String!
            summary: String!
            subtitle: String
            date: Date @dateformat
            tags: [String]
            excerpt: String
        }`,
        schema.buildUnionType({
            name: "CustomMdxFrontmatter",
            types: ["PageFrontmatter", "ArticleFrontmatter"],
            resolveType: (node) => {
                if ("summary" in node) return "ArticleFrontmatter";
                return "PageFrontmatter";
            },
        }),
        `
        type Mdx implements Node  @dontInfer {
            fields: CustomMdxFields!
            frontmatter: CustomMdxFrontmatter!
        }
        
        type BlogPost implements Node @dontInfer {
            slug: String!
            body: String
            title: String!
            summary: String!
            subtitle: String
            date: Date @dateformat
            tags: [String]
            excerpt: String
        }

        `,
    ]);
};

exports.onCreateNode = ({ node, actions, getNode, createNodeId, createContentDigest }) => {
    const { createNode, createNodeField } = actions;

    if (node.internal.type === "Mdx") {
        const parent = getNode(node.parent);
        const collection = parent.sourceInstanceName;
        const filePath = createFilePath({ node, getNode, trailingSlash: false });

        // Hoist "pages" to top-level
        const slugRoot = collection === "pages" ? "" : "/" + collection;

        // Add fields to MDX nodes
        createNodeField({
            node,
            name: "collection",
            value: `${collection}`,
        });
        createNodeField({
            node,
            name: "slug",
            value: `${slugRoot}${filePath}/`,
        });

        // Pull posts into their own custom node so they're easier to query for
        if (collection === "posts") {
            const postNode = {
                ...node.frontmatter,

                slug: node.fields.slug,
                body: node.body,

                id: createNodeId(`${node.id} >>> BlogPost`),
                parent: node.id,
                children: [],
                internal: {
                    type: "BlogPost",
                },
            };
            postNode.internal.contentDigest = createContentDigest(postNode);
            createNode(postNode);
        }
    }
};

exports.createPages = async ({ actions, graphql, reporter }) => {
    const { createPage } = actions;

    // Query for our MDX files
    const result = await graphql(`
        {
            allMdx {
                edges {
                    node {
                        id
                        fields {
                            slug
                            collection
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

    function getTemplateForPage(node) {
        switch (node.fields.collection) {
            case "pages":
                return path.resolve(`src/components/page.tsx`);
            case "posts":
                return path.resolve(`src/components/post.tsx`);
        }
        reporter.panicOnBuild(`🚨  ERROR: Unknown collection type ${node.fields.collection}`);
        return undefined;
    }

    // Output a page for each MDX file
    result.data.allMdx.edges.forEach(({ node }) => {
        createPage({
            // Output path
            path: node.fields.slug,

            // Template used to render MDX content
            component: getTemplateForPage(node),

            // Data passed to template as `this.props.pageContext` and to page query
            context: { id: node.id },
        });
    });
};

// Gatsby doesn't support configuring the output folder. We set up a script in
// package.json to rename the output to align with GitHub pages expectations.
// The following makes sure that output directory gets cleaned when public does.
exports.onPreInit = () => {
    if (process.argv[2] === "clean" || process.argv[2] === "build") {
        fs.rmdirSync(path.join(__dirname, "docs"), { recursive: true });
    }
};
