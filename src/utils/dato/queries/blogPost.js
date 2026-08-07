import { BLOG_POST_CONTENT } from "./blogPostContent.js";

export const BLOG_POST_QUERY = `
  query BlogPostBySlug($slug: String!) {
    blogPost(filter: {slug: {eq: $slug}}) {
      ${BLOG_POST_CONTENT}
    }
  }
`;
