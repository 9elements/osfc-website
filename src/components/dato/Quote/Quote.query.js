import { IMAGE_CONTENT_QUERY } from "@/utils/dato/queries/imageContent";

export const QUOTE_QUERY = `
  id
  _modelApiKey
  __typename
  quote {
    blocks
    links
    value
  }
  author
  portrait {
    ${IMAGE_CONTENT_QUERY}
  }
`;
