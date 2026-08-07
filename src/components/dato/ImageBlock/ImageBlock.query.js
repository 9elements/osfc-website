import { IMAGE_CONTENT_QUERY } from "@/utils/dato/queries/imageContent";

export const IMAGE_BLOCK_QUERY = `
  id
  _modelApiKey
  __typename
  image {
    ${IMAGE_CONTENT_QUERY}
  }
  showCaption
  size
`;
