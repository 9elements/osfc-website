import { LINK_QUERY } from "@/utils/dato/queries/link";

export const HIGHLIGHT_BOX_QUERY = `
  id
  _modelApiKey
  __typename
  text {
    value
    blocks
    links
  }
  cta {
    ${LINK_QUERY}
  }
`;
