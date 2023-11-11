import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";

// https://astro.build/config
export default defineConfig({
    site: "https://aschultz.github.io",
    integrations: [mdx(), sitemap()],
    output: "static",
    outDir: "./docs",
    build: {
        assets: "astro",
    },
    markdown: {
        shikiConfig: {
            theme: "github-dark",
        },
        remarkPlugins: [remarkMath],
        rehypePlugins: [rehypeKatex],
    },
});
