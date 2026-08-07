import { IMAGE_CONTENT_QUERY } from "./imageContent";

export const HOMEPAGE_QUERY = `
{
  homepage {
    id
    _modelApiKey
    _seoMetaTags {
      attributes
      content
      tag
    }
    title
    gallery {
      id
      _modelApiKey
      __typename
      images {
        ${IMAGE_CONTENT_QUERY}
      }
    }
  }
}
`;
