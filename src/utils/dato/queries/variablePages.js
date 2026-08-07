import { MODULAR_CONTENT_QUERY } from "../../../components/dato/ModularContent/ModularContent.query.js";

export const VARIABLE_PAGES_QUERY = `
  {
    allVariablePages {
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
      content {
        ${MODULAR_CONTENT_QUERY}
      }
    }
  }
`;
