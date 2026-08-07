const isPreview = import.meta.env.LIVE_PREVIEW === true;

export async function fetchDatoCMS(
  query: string,
  variables?: Record<string, any>
) {
  const endpoint = isPreview
    ? `https://graphql.datocms.com/preview`
    : `https://graphql.datocms.com/`;
  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${import.meta.env.DATOCMS_API_KEY}`,
    },
    body: JSON.stringify({
      query,
      variables,
    }),
  });

  const json = await response.json();
  if (json.errors) {
    throw new Error(JSON.stringify(json.errors));
  }
  return json.data;
}
