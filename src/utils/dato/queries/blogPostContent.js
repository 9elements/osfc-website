import { IMAGE_CONTENT_QUERY } from "./imageContent.js";
import { STRUCTURED_TEXT_BLOCK_QUERY } from "../../../components/dato/StructuredTextBlock/StructuredTextBlock.query.js";

export const BLOG_POST_CONTENT = `
  __typename
  _modelApiKey
  id
  _seoMetaTags {
    tag
    content
    attributes
  }
  title
  slug
  date
  heroImage {
    ${IMAGE_CONTENT_QUERY}
  }
  content {
    ${STRUCTURED_TEXT_BLOCK_QUERY}
  }
`;
