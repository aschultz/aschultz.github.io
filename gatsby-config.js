"use strict";

module.exports = {
    siteMetadata: {
        title: ``,
        siteUrl: `https://aschultz.github.io/`,
        description: ``,
    },
    plugins: [
        `gatsby-plugin-sharp`,
        `gatsby-remark-images`,
        {
            resolve: `gatsby-plugin-mdx`,
            options: {
                extensions: [`.md`, `.mdx`],
                gatsbyRemarkPlugins: [
                    {
                        resolve: `gatsby-remark-images`,
                        options: {
                            maxWidth: 1200,
                        },
                    },
                ],
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
