import { IMAGE_BLOCK_QUERY } from "../ImageBlock/ImageBlock.query.js";
import { QUOTE_QUERY } from "../Quote/Quote.query.js";
import { HIGHLIGHT_BOX_QUERY } from "../HighlightBox/HighlightBox.query.js";

export const STRUCTURED_TEXT_BLOCK_QUERY = `
id
_modelApiKey
__typename
text {
  blocks {
    ... on QuoteRecord {
      ${QUOTE_QUERY}
    }
    ... on HighlightBoxRecord {
      ${HIGHLIGHT_BOX_QUERY}
    }
    ... on ImageRecord {
      ${IMAGE_BLOCK_QUERY}
    }
  }
  inlineBlocks
  links
  value
}
`;
