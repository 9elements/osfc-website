import { BLOG_POST_CONTENT } from "./blogPostContent.js";

export const BLOG_POSTS_QUERY = `
  {
    allBlogPosts(orderBy: date_DESC) {
      ${BLOG_POST_CONTENT}
    }
  }
`;
