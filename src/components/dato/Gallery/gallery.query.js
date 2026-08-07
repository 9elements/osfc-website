import { IMAGE_CONTENT_QUERY } from "@/utils/dato/queries/imageContent";

export const GALLERY_QUERY = `
id
_modelApiKey
__typename
images {
  ${IMAGE_CONTENT_QUERY}
}
`;
