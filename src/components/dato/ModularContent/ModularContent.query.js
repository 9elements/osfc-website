import { GALLERY_QUERY } from "../Gallery/gallery.query.js";
import { STRUCTURED_TEXT_BLOCK_QUERY } from "../StructuredTextBlock/StructuredTextBlock.query.js";

export const MODULAR_CONTENT_QUERY = `
  content {
    ... on GalleryRecord {
      ${GALLERY_QUERY}
    }
    ... on StructuredTextBlockRecord {
      ${STRUCTURED_TEXT_BLOCK_QUERY}
    }
  }
`;
