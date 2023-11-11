import { defineCollection, getCollection, z, type CollectionEntry } from "astro:content";

const posts = defineCollection({
    type: "content",
    // Type-check frontmatter using a schema
    schema: z.object({
        title: z.string(),
        date: z.coerce.date(),
        summary: z.string().optional(),
    }),
});

export const collections = { posts };

export type Post = CollectionEntry<"posts"> & { url: string };

export async function getPosts(): Promise<Post[]> {
    const posts = await getCollection("posts");
    return posts.map((post) => ({
        ...post,
        url: `/posts/${post.slug}`,
    }));
}
