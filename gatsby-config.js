"use strict";

module.exports = {
    siteMetadata: {
        siteUrl: `https://aschultz.github.io/`,
        title: `a.schultz`,
        description: `Pratical solutions to everyday problems`,
    },
    plugins: [
        {
            resolve: `gatsby-plugin-sitemap`,
            options: {
                // Sort sitemap entries to ensure consistency across builds.
                // This is convoluted because there aren't good hooks for customizing serialize.
                serialize: (args) => {
                    const defaults = require(`gatsby-plugin-sitemap/internals`).defaultOptions;
                    const data = defaults.serialize(args);
                    data.sort((left, right) => (left.url < right.url ? -1 : left.url > right.url ? 1 : 0));
                    return data;
                },
            },
        },
        {
            resolve: `gatsby-plugin-robots-txt`,
            options: {},
        },
        {
            resolve: "gatsby-plugin-html-attributes",
            options: {
                lang: "en",
            },
        },
        `gatsby-plugin-react-helmet`,
        {
            resolve: `gatsby-plugin-sharp`,
            options: {
                defaultQuality: 90,
                useMozJpeg: false,
                stripMetadata: true,
            },
        },
        `gatsby-remark-images`,
        {
            resolve: `gatsby-plugin-mdx`,
            options: {
                extensions: [`.md`, `.mdx`],
                gatsbyRemarkPlugins: [
                    {
                        resolve: `gatsby-remark-images`,
                        options: {
                            maxWidth: 800,
                            quality: 90,
                            srcSetBreakpoints: [200, 400, 800],
                        },
                    },
                    {
                        resolve: `gatsby-remark-prismjs`,
                        options: {
                            classPrefix: "language-",
                            noInlineHighlight: true,
                        },
                    },
                ],
                remarkPlugins: [require(`remark-math`)],
                rehypePlugins: [require(`rehype-katex`)],
            },
        },
        {
            resolve: "gatsby-plugin-react-svg",
            options: {
                rule: {
                    include: /\.inline\.svg$/,
                },
            },
        },
        {
            resolve: `gatsby-plugin-typescript`,
            options: {
                isTSX: true, // defaults to false
                jsxPragma: `jsx`, // defaults to "React"
                allExtensions: true, // defaults to false
                onlyRemoveTypeImports: true, //defaults to false
            },
        },
        // {
        //     resolve: `gatsby-source-filesystem`,
        //     options: {
        //         path: `${__dirname}/src/pages`,
        //         name: `pages`,
        //     },
        // },
        {
            resolve: `gatsby-source-filesystem`,
            options: {
                path: `${__dirname}/src/posts`,
                name: `posts`,
            },
        },
    ],
};
